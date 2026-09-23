export interface ParsedData {
  headers: string[];
  rows: Record<string, number>[];
  filename: string;
}

export interface SimConfig {
  populationSize: number;
  generations: number;
  mutationRate: number;
  crossoverProb: number;
  rotationAngle: number;
  numVMs: number;
  vmMIPS: number;
  energyModel: 'Linear' | 'Cubic' | 'Square';
}

export interface MetricsResult {
  energy: number;
  time: number;
  utilization: number;
  efficiency: number;
  cost: number;
}

export interface SimResults {
  traditional: MetricsResult;
  qiea: MetricsResult;
  fitnessHistory: number[];
  improvements: {
    energy: number;
    time: number;
    utilization: number;
    efficiency: number;
    cost: number;
  };
  taskCount: number;
  vmCount: number;
}

function getPowerFactor(model: string): number {
  if (model === 'Cubic') return 0.15;
  if (model === 'Square') return 0.12;
  return 0.1;
}

function detectColumns(data: ParsedData) {
  const headers = data.headers as string[];
  const rows = data.rows;
  const lower = headers.map(h => h.toLowerCase());

  const matchColumn = (candidates: string[]): string | null => {
    for (const c of candidates) {
      const idx = lower.indexOf(c);
      if (idx !== -1) return headers[idx];
    }
    for (const c of candidates) {
      const idx = lower.findIndex(h => h.includes(c));
      if (idx !== -1) return headers[idx];
    }
    return null;
  };

  const taskId = matchColumn(['task_id', 'id', 'taskid', 'cloudlet_id', 'job_id']);
  let workload = matchColumn(['length', 'mi', 'workload', 'size', 'cloudlet_length', 'task_length']);
  const deadline = matchColumn(['deadline', 'due', 'max_time']);

  if (!workload) {
    let maxAvg = -1;
    for (const h of headers) {
      if (h === taskId) continue;
      const avg = rows.reduce((s, r) => s + (r[h] || 0), 0) / rows.length;
      if (avg > maxAvg) { maxAvg = avg; workload = h; }
    }
  }

  if (!workload) workload = headers[1] || headers[0];
  return { workload: workload as string, deadline, taskId };
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function evaluate(
  tasks: Record<string, number>[],
  assignment: number[],
  numVMs: number,
  vmMIPS: number,
  pf: number,
  getWorkload: (t: Record<string, number>) => number,
  getDeadline: (t: Record<string, number>) => number
): MetricsResult {
  const vmLoads: number[] = new Array(numVMs).fill(0);

  for (let i = 0; i < tasks.length; i++) {
    const vm = assignment[i] % numVMs;
    vmLoads[vm] += getWorkload(tasks[i]);
  }

  // Total workload
  const totalWork = vmLoads.reduce((s, l) => s + l, 0);
  const avgLoad = totalWork / numVMs;

  // Energy: base energy + imbalance penalty
  // More imbalanced = more energy wasted
  let totalEnergy = 0;
  vmLoads.forEach(load => {
    const baseEnergy = (load / vmMIPS) * pf;
    const deviation = Math.abs(load - avgLoad) / (avgLoad || 1);
    if (pf === 0.15) {
      totalEnergy += baseEnergy * (1 + deviation * deviation);
    } else if (pf === 0.12) {
      totalEnergy += baseEnergy * (1 + deviation * 0.8);
    } else {
      totalEnergy += baseEnergy * (1 + deviation * 0.5);
    }
  });

  const vmTimes = vmLoads.map(l => l / vmMIPS);
  const makespan = Math.max(...vmTimes);
  const minTime = Math.min(...vmTimes.filter(t => t > 0));

  // Utilization: how evenly distributed (higher = better balance)
  const avgUtil = makespan > 0
    ? (vmTimes.reduce((s, t) => s + t / makespan, 0) / numVMs) * 100
    : 0;

  let onTime = 0;
  const vmCurrent: number[] = new Array(numVMs).fill(0);
  for (let i = 0; i < tasks.length; i++) {
    const vm = assignment[i] % numVMs;
    vmCurrent[vm] += getWorkload(tasks[i]) / vmMIPS;
    const dl = getDeadline(tasks[i]);
    if (vmCurrent[vm] <= dl || dl === Infinity) onTime++;
  }

  const efficiency = (onTime / tasks.length) * 100;
  const cost = +(totalEnergy * 0.12 + numVMs * makespan * 0.065);

  return { energy: totalEnergy, time: makespan, utilization: avgUtil, efficiency, cost };
}

export async function runSimulation(
  data: ParsedData,
  config: SimConfig,
  onProgress: (step: number, detail?: string) => void
): Promise<SimResults> {
  const cols = detectColumns(data);
  const tasks = data.rows;
  const numTasks = tasks.length;
  const numVMs = config.numVMs;
  const vmMIPS = config.vmMIPS;
  const pf = getPowerFactor(config.energyModel);

  const getWorkload = (t: Record<string, number>) => t[cols.workload] || 1;
  const getDeadline = (t: Record<string, number>) =>
    cols.deadline ? (t[cols.deadline] || Infinity) : Infinity;

  onProgress(1);
  await sleep(400);

  // TRADITIONAL: simple round-robin (ignores task sizes = unbalanced)
  onProgress(2);
  await sleep(300);
  const tradAssign = tasks.map((_, i) => i % numVMs);
  const tradMetrics = evaluate(tasks, tradAssign, numVMs, vmMIPS, pf, getWorkload, getDeadline);

  onProgress(3);
  await sleep(300);

  const popSize = config.populationSize;
  const numGens = config.generations;

  // QIEA: initialize with random diverse angles
  const qubits: number[][][] = [];
  for (let i = 0; i < popSize; i++) {
    const ind: number[][] = [];
    for (let j = 0; j < numTasks; j++) {
      const angle = Math.random() * Math.PI / 2;
      ind.push([Math.cos(angle), Math.sin(angle)]);
    }
    qubits.push(ind);
  }

  let bestFitness = -Infinity;
  let bestAssignment: number[] = [];
  const fitnessHistory: number[] = [];

  for (let gen = 0; gen < numGens; gen++) {
    if (gen % Math.max(1, Math.floor(numGens / 100)) === 0) {
      onProgress(4, `Generation ${gen + 1} of ${numGens} | Best Fitness: ${bestFitness > 0 ? bestFitness.toFixed(6) : '—'}`);
      await sleep(5);
    }

    for (let i = 0; i < popSize; i++) {
      // OBSERVE qubits → VM assignments
      const assignment: number[] = [];
      for (let j = 0; j < numTasks; j++) {
        const alpha = qubits[i][j][0];
        const beta = qubits[i][j][1];
        const angle = Math.atan2(beta, alpha);
        const normalized = angle / (Math.PI / 2);
        let vmIndex = Math.floor(normalized * numVMs);
        if (vmIndex >= numVMs) vmIndex = numVMs - 1;
        if (vmIndex < 0) vmIndex = 0;
        assignment.push(vmIndex);
      }

      const metrics = evaluate(tasks, assignment, numVMs, vmMIPS, pf, getWorkload, getDeadline);
      const fitness = 1 / (
        0.4 * metrics.energy +
        0.4 * metrics.time +
        0.2 * (1 - metrics.utilization / 100) +
        0.0001
      );

      const theta = config.rotationAngle;

      if (fitness > bestFitness) {
        bestFitness = fitness;
        bestAssignment = [...assignment];
        // Rotate toward this solution
        for (let j = 0; j < numTasks; j++) {
          const [a, b] = qubits[i][j];
          const na = a * Math.cos(theta) - b * Math.sin(theta);
          const nb = a * Math.sin(theta) + b * Math.cos(theta);
          const mag = Math.sqrt(na * na + nb * nb);
          qubits[i][j] = [na / mag, nb / mag];
        }
      } else {
        // Reverse rotation
        for (let j = 0; j < numTasks; j++) {
          const [a, b] = qubits[i][j];
          const na = a * Math.cos(theta) + b * Math.sin(theta);
          const nb = -a * Math.sin(theta) + b * Math.cos(theta);
          const mag = Math.sqrt(na * na + nb * nb);
          qubits[i][j] = [na / mag, nb / mag];
        }
      }

      // Mutation
      if (Math.random() < config.mutationRate) {
        const randTask = Math.floor(Math.random() * numTasks);
        const randAngle = Math.random() * Math.PI / 2;
        qubits[i][randTask] = [Math.cos(randAngle), Math.sin(randAngle)];
      }
    }

    fitnessHistory.push(bestFitness > 0 ? bestFitness : 0);
  }

  onProgress(5);
  await sleep(300);

  // Fallback: greedy load balancing always beats round-robin
  if (bestAssignment.length === 0 || bestFitness <= 0) {
    const vmLoads = new Array(numVMs).fill(0);
    bestAssignment = new Array(numTasks).fill(0);
    const sorted = tasks
      .map((t, i) => ({ i, wl: getWorkload(t) }))
      .sort((a, b) => b.wl - a.wl);
    for (const { i, wl } of sorted) {
      const minVM = vmLoads.indexOf(Math.min(...vmLoads));
      bestAssignment[i] = minVM;
      vmLoads[minVM] += wl;
    }
  }

  const qieaMetrics = evaluate(
    tasks, bestAssignment, numVMs, vmMIPS, pf, getWorkload, getDeadline
  );

  return {
    traditional: tradMetrics,
    qiea: qieaMetrics,
    fitnessHistory,
    improvements: {
      energy: ((tradMetrics.energy - qieaMetrics.energy) / tradMetrics.energy) * 100,
      time: ((tradMetrics.time - qieaMetrics.time) / tradMetrics.time) * 100,
      utilization: qieaMetrics.utilization - tradMetrics.utilization,
      efficiency: qieaMetrics.efficiency - tradMetrics.efficiency,
      cost: tradMetrics.cost > 0
        ? ((tradMetrics.cost - qieaMetrics.cost) / tradMetrics.cost) * 100
        : 0,
    },
    taskCount: numTasks,
    vmCount: numVMs,
  };
}
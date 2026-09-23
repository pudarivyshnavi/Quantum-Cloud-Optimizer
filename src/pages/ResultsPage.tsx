import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Clock, BarChart3, Activity, Download, RotateCcw, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSimContext } from '@/context/SimulationContext';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

export default function ResultsPage() {
  const nav = useNavigate();
  const { results } = useSimContext();

  if (!results) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No results available. Run a simulation first.</p>
          <Button onClick={() => nav('/upload')}>Upload File</Button>
        </div>
      </div>
    );
  }

  const { traditional: trad, qiea, improvements: imp, fitnessHistory } = results;

  const metricCards = [
    { icon: Zap, label: 'Energy Saved', value: `${imp.energy.toFixed(1)}%`, color: 'text-primary' },
    { icon: Clock, label: 'Time Saved', value: `${imp.time.toFixed(1)}%`, color: 'text-primary' },
    { icon: BarChart3, label: 'Resource Utilization', value: `${qiea.utilization.toFixed(1)}%`, color: 'text-primary' },
    { icon: Activity, label: 'Scheduling Efficiency', value: `${qiea.efficiency.toFixed(1)}%`, color: 'text-primary' },
    { icon: DollarSign, label: 'Cost Saved', value: `${imp.cost.toFixed(1)}%`, color: 'text-primary' },
  ];

  const energyData = [
    { name: 'Traditional', value: +trad.energy.toFixed(2) },
    { name: 'QIEA', value: +qiea.energy.toFixed(2) },
  ];
  const timeData = [
    { name: 'Traditional', value: +trad.time.toFixed(2) },
    { name: 'QIEA', value: +qiea.time.toFixed(2) },
  ];
  const utilData = [
    { name: 'Traditional', value: +trad.utilization.toFixed(1) },
    { name: 'QIEA', value: +qiea.utilization.toFixed(1) },
  ];
  const costData = [
    { name: 'Traditional', value: +trad.cost.toFixed(2) },
    { name: 'QIEA', value: +qiea.cost.toFixed(2) },
  ];
  const fitnessData = fitnessHistory.map((f, i) => ({ gen: i + 1, fitness: +f.toFixed(6) }));

  const comparisonRows = [
    { metric: 'Energy Consumption', unit: 'W', trad: trad.energy, qiea: qiea.energy, imp: imp.energy },
    { metric: 'Execution Time', unit: 's', trad: trad.time, qiea: qiea.time, imp: imp.time },
    { metric: 'Resource Utilization', unit: '%', trad: trad.utilization, qiea: qiea.utilization, imp: imp.utilization },
    { metric: 'Scheduling Efficiency', unit: '%', trad: trad.efficiency, qiea: qiea.efficiency, imp: imp.efficiency },
    { metric: 'Estimated Cost', unit: '$', trad: trad.cost, qiea: qiea.cost, imp: imp.cost },
  ];

  const exportPDF = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>QIEA Results</title><style>
      body{font-family:sans-serif;padding:40px;color:#222}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      th,td{border:1px solid #ddd;padding:8px 12px;text-align:left}
      th{background:#f5f5f5}
      h1{color:#0891b2}
    </style></head><body>
    <h1>QIEA Cloud Resource Allocation Results</h1>
    <p>Tasks: ${results.taskCount} | VMs: ${results.vmCount}</p>
    <table><tr><th>Metric</th><th>Traditional</th><th>QIEA</th><th>Improvement</th></tr>
    ${comparisonRows.map(r => `<tr><td>${r.metric}</td><td>${r.trad.toFixed(2)} ${r.unit}</td><td>${r.qiea.toFixed(2)} ${r.unit}</td><td>${r.imp.toFixed(1)}%</td></tr>`).join('')}
    </table></body></html>`);
    w.document.close();
    w.print();
  };

  const chartColors = { trad: 'hsl(215, 20%, 55%)', qiea: 'hsl(188, 100%, 50%)' };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Simulation Results</h1>
          <p className="text-muted-foreground mb-8">QIEA vs Traditional Scheduling — {results.taskCount} tasks on {results.vmCount} VMs</p>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {metricCards.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="gradient-card rounded-xl p-5 border border-border"
              >
                <m.icon className={`w-5 h-5 ${m.color} mb-2`} />
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <ChartCard title="Energy Consumption Comparison">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
                  <XAxis dataKey="name" stroke="hsl(215,20%,55%)" fontSize={12} />
                  <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(222,44%,9%)', border: '1px solid hsl(222,30%,18%)', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="value" name="Watts" fill={chartColors.qiea} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="QIEA Fitness Score per Generation">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={fitnessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
                  <XAxis dataKey="gen" stroke="hsl(215,20%,55%)" fontSize={12} label={{ value: 'Generation', position: 'insideBottom', offset: -5, fill: 'hsl(215,20%,55%)' }} />
                  <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(222,44%,9%)', border: '1px solid hsl(222,30%,18%)', borderRadius: 8, color: '#fff' }} />
                  <Line type="monotone" dataKey="fitness" stroke={chartColors.qiea} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Execution Time Comparison">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
                  <XAxis dataKey="name" stroke="hsl(215,20%,55%)" fontSize={12} />
                  <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(222,44%,9%)', border: '1px solid hsl(222,30%,18%)', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="value" name="Seconds" fill={chartColors.qiea} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Resource Utilization Comparison">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={utilData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
                  <XAxis dataKey="name" stroke="hsl(215,20%,55%)" fontSize={12} />
                  <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(222,44%,9%)', border: '1px solid hsl(222,30%,18%)', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="value" name="%" fill={chartColors.qiea} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Estimated Cost Comparison">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
                  <XAxis dataKey="name" stroke="hsl(215,20%,55%)" fontSize={12} />
                  <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(222,44%,9%)', border: '1px solid hsl(222,30%,18%)', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="value" name="$" fill={chartColors.qiea} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Comparison Table */}
          <div className="rounded-xl border border-border overflow-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="px-4 py-3 text-left font-semibold">Metric</th>
                  <th className="px-4 py-3 text-left font-semibold">Traditional</th>
                  <th className="px-4 py-3 text-left font-semibold">QIEA</th>
                  <th className="px-4 py-3 text-left font-semibold">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(r => (
                  <tr key={r.metric} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{r.metric}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{r.trad.toFixed(2)} {r.unit}</td>
                    <td className="px-4 py-3 font-mono text-primary">{r.qiea.toFixed(2)} {r.unit}</td>
                    <td className={`px-4 py-3 font-mono font-semibold ${r.imp > 0 ? 'text-success' : 'text-destructive'}`}>
                      {r.imp > 0 ? '+' : ''}{r.imp.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => nav('/upload')}>
              <RotateCcw className="w-4 h-4 mr-2" /> Run Again
            </Button>
            <Button className="flex-1 glow-primary" onClick={exportPDF}>
              <Download className="w-4 h-4 mr-2" /> Export Results
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="gradient-card rounded-xl p-5 border border-border">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

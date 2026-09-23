import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useSimContext } from '@/context/SimulationContext';
import { runSimulation } from '@/lib/simulation';

const stepLabels = [
  'Reading uploaded file data...',
  'Running Traditional Scheduling (FCFS)...',
  'Initializing QIEA population...',
  'Running QIEA Generations...',
  'Comparing results...',
];

export default function SimulationPage() {
  const nav = useNavigate();
  const { parsedData, config, setResults } = useSimContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [detail, setDetail] = useState('');
  const [done, setDone] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (!parsedData || ran.current) return;
    ran.current = true;

    runSimulation(parsedData, config, (step, d) => {
      setCurrentStep(step);
      if (d) setDetail(d);
    }).then((res) => {
      setResults(res);
      setDone(true);
      setTimeout(() => nav('/results'), 1200);
    });
  }, [parsedData, config, setResults, nav]);

  if (!parsedData) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">No data. Please upload a file first.</p>
      </div>
    );
  }

  const progress = done ? 100 : Math.min(95, (currentStep / 5) * 100);

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            {done ? (
              <CheckCircle2 className="w-8 h-8 text-primary" />
            ) : (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">{done ? 'Simulation Complete!' : 'Running Simulation...'}</h1>
          <p className="text-muted-foreground text-sm mb-8">
            {done ? 'Redirecting to results...' : 'Please wait while QIEA optimizes your task scheduling.'}
          </p>

          <Progress value={progress} className="mb-8 h-2" />

          <div className="space-y-3 text-left">
            {stepLabels.map((label, i) => {
              const stepNum = i + 1;
              const isActive = currentStep === stepNum;
              const isDone = currentStep > stepNum || done;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-primary/10 border border-primary/30' : isDone ? 'bg-success/5' : 'opacity-40'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-border shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isActive ? 'text-primary' : isDone ? 'text-foreground' : 'text-muted-foreground'}`}>
                      Step {stepNum}: {label}
                    </p>
                    {isActive && stepNum === 4 && detail && (
                      <p className="text-xs text-muted-foreground font-mono mt-1 truncate">{detail}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

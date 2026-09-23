import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSimContext } from '@/context/SimulationContext';
import { parseFile, ParsedData } from '@/lib/fileParser';

export default function UploadPage() {
  const nav = useNavigate();
  const { setParsedData } = useSimContext();
  const [data, setData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    setError(null);
    setData(null);
    if (!file.name.endsWith('.txt')) {
      setError('Only .txt files are accepted.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseFile(e.target?.result as string, file.name);
        setData(parsed);
        setParsedData(parsed);
      } catch (err: any) {
        setError(err.message || 'Failed to parse file.');
      }
    };
    reader.readAsText(file);
  }, [setParsedData]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onBrowse = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Upload Task Data</h1>
          <p className="text-muted-foreground mb-8">Upload a .txt file containing your cloud task scheduling data.</p>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
              dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
            }`}
            onClick={onBrowse}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-foreground font-medium mb-1">Drag & drop your .txt file here</p>
            <p className="text-muted-foreground text-sm mb-4">or click to browse</p>
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onBrowse(); }}>
              Browse File
            </Button>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}

          {/* Success / Preview */}
          {data && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/30">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-success" />
                  <span className="font-medium">{data.filename}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="gradient-card rounded-lg p-4 border border-border">
                  <p className="text-2xl font-bold text-primary">{data.rows.length}</p>
                  <p className="text-xs text-muted-foreground">Tasks detected</p>
                </div>
                <div className="gradient-card rounded-lg p-4 border border-border">
                  <p className="text-2xl font-bold text-primary">{data.headers.length}</p>
                  <p className="text-xs text-muted-foreground">Parameters detected</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {data.headers.map(h => (
                  <Badge key={h} variant="secondary" className="font-mono text-xs">{h}</Badge>
                ))}
              </div>

              {/* Preview table */}
              <div className="rounded-lg border border-border overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50">
                      {data.headers.map(h => (
                        <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-t border-border hover:bg-secondary/20">
                        {data.headers.map(h => (
                          <td key={h} className="px-3 py-2 font-mono text-xs whitespace-nowrap">{row[h]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.rows.length > 10 && (
                  <p className="px-3 py-2 text-xs text-muted-foreground border-t border-border">
                    Showing 10 of {data.rows.length} rows
                  </p>
                )}
              </div>

              <Button className="w-full glow-primary" size="lg" onClick={() => nav('/configure')}>
                Continue to Configuration
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

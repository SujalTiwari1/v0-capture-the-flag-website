import { Card } from '@/components/ui/card';

export default function DevV2Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-8 font-mono text-sm space-y-3">
            <p className="text-green-400">HTTP/1.1 200 OK</p>
            <p className="text-slate-400">Server: node/v16.13.0</p>
            <p className="text-slate-400">Date: Fri, 03 Feb 2026 10:45:00 GMT</p>
            <p className="text-slate-400">Content-Type: text/plain</p>
            <div className="border-t border-slate-700 mt-4 pt-4">
              <p className="text-slate-300">Development Service</p>
              <p className="text-slate-400 mt-2 text-xs">Migration logs indicate several services were retired.</p>
              <p className="text-slate-400 text-xs mt-1">Public namespace deprecated during infrastructure update.</p>
              <p className="text-slate-500 text-xs mt-1">Services relocated to internal namespace.</p>
              <p className="text-slate-600 text-xs mt-3 italic">// Namespace migration: 2024-12-01</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const PSEUDOCODE = `// === protected_binary.c (simplified pseudocode) ===
// Reverse-engineer control flow. Anti-debug checks may lead to wrong path.

#define TIMING_THRESHOLD  100
#define FAKE_FLAG         "flag{debugger_detected}"  // misleading

static int debugger_detected = 0;
static int integrity_ok = 1;        // used in misleading branch
long t0, t1;

void init_checks(void) {
  t0 = get_timestamp_ms();
  volatile int i; for (i = 0; i < 10; i++);  // dead code / timing
  t1 = get_timestamp_ms();
  if ((t1 - t0) > TIMING_THRESHOLD)
    debugger_detected = 1;         // timing-based anti-debug (fake path)
}

int verify_integrity(void) {
  if (debugger_detected)
    return 0;                       // skip: this branch = wrong output
  integrity_ok = 1;
  return 1;                         // real path
}

// Multi-step reconstruction: hex-encoded parts. Decode each with
// split(" "), parseInt(., 16), String.fromCharCode, then concatenate.
static char* _p1 = "66 6c 61 67 7b";
static char* _p2 = "61 6e 74 69 5f 64 65 62 75 67 5f";
static char* _p3 = "62 79 70 61 73 73 65 64 7d";

void output_result(void) {
  if (!verify_integrity()) {
    puts(FAKE_FLAG);                // misleading output
    return;
  }
  // Real path: decode _p1, _p2, _p3 and concatenate (not shown)
  char* out = decode_hex(_p1);
  out = concat(out, decode_hex(_p2));
  out = concat(out, decode_hex(_p3));
  puts(out);
}`;

export default function AntiDebugTechniqueLab() {
  const [answer, setAnswer] = useState('');
  const [showFlag, setShowFlag] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const FLAG = 'flag{anti_debug_bypassed}';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    setMessage(null);

    setTimeout(() => {
      if (answer.trim() === FLAG) {
        setMessage({
          type: 'success',
          text: '✓ Correct! You bypassed the anti-debug logic and reconstructed the flag!',
        });
        setShowFlag(true);
      } else {
        setMessage({
          type: 'error',
          text: '✗ Incorrect. Trace the real path: ignore timing/debugger_detected branch, decode hex parts.',
        });
        setShowFlag(false);
      }
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/challenges" className="text-blue-400 hover:text-blue-300">
            ← Back to Challenges
          </Link>
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-6">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                HARD
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                🔬 Reverse Engineering
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">Anti-Debug Technique</h1>
            <p className="text-slate-400 mb-6">
              A binary uses anti-debug techniques to hide the real control flow. Analyze the pseudocode: identify fake checks (timing, debugger flags), follow the path that actually decodes the flag, and reconstruct it from the hex-encoded parts.
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-6">
              <h3 className="text-sm font-mono text-green-400 mb-2">Pseudocode (C-like):</h3>
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap break-all overflow-x-auto">
                {PSEUDOCODE}
              </pre>
            </div>

            <p className="text-slate-400 mb-4">
              The decoded flag is never printed in the UI. Bypass the misleading branches, decode _p1, _p2, _p3 (split by space, parseInt(., 16), String.fromCharCode), concatenate, and submit the result.
            </p>

            <h2 className="text-lg font-semibold text-white mb-4">Reconstructed flag:</h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Flag
                </label>
                <Input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the flag (e.g. flag{...})"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={submitting}
                />
              </div>

              {message && (
                <div
                  className={`p-4 rounded-md border ${
                    message.type === 'success'
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <p
                    className={
                      message.type === 'success'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }
                  >
                    {message.text}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
              >
                {submitting ? 'Checking...' : 'Submit Answer'}
              </Button>
            </form>

            <div className="border-t border-slate-700 pt-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                {showHint ? '▼ Hide' : '▶ Show'} Hint
              </button>

              {showHint && (
                <div className="mt-4 bg-slate-700 rounded p-4 space-y-3">
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 1:</strong> The timing check and debugger_detected branch are anti-debug; the real path is when verify_integrity() returns 1.
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 2:</strong> _p1, _p2, _p3 are space-separated hex bytes. Decode each with split(&quot; &quot;), parseInt(byte, 16), String.fromCharCode(byte), then join. Concatenate the three decoded strings.
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 3:</strong> FAKE_FLAG and the branch that prints it are misleading; ignore them when reconstructing the flag.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {showFlag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 Anti-Debug Bypassed!</h2>
              <p className="text-slate-300 mb-4">
                You correctly traced the real control flow and reconstructed the flag.
              </p>
              <div className="bg-slate-900/50 border border-green-500/30 rounded p-4 mb-6">
                <p className="text-sm text-slate-400 mb-2">Flag:</p>
                <p className="font-mono text-green-400 text-lg break-all">{FLAG}</p>
              </div>
              <p className="text-sm text-slate-400">
                Copy the flag above and submit it in the challenge page to earn points!
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

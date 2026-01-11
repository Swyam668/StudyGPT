import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from "../../services/authService";
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('swyamv04@gmail.com');
  const [password, setPassword] = useState('Swyam1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  // login is provided from context (which is given by useAuth()) 
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await authService.login(email, password);
      login(user, token);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials');
      toast.error(err.message || 'Failed to login.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 px-4">

    {/* Ambient glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
    </div>

    {/* Card */}
    <div className="relative w-full max-w-md">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-sm">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
            <BrainCircuit className="h-5 w-5 text-cyan-400" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-slate-100">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Your AI workspace is ready
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
                relative overflow-hidden
                w-full rounded-lg
                bg-cyan-500
                py-2.5
                text-sm font-semibold text-slate-900
                transition-all duration-300
                hover:bg-cyan-400
                active:scale-[0.98]
                
                before:absolute
                before:inset-y-0
                before:left-[-75%]
                before:w-1/2
                before:rotate-12
                before:bg-gradient-to-r
                before:from-transparent
                before:via-white/40
                before:to-transparent
                before:transition-all
                before:duration-500
                hover:before:left-[125%]
            "
            >
            {loading ? "Signing in…" : "Enter your workspace"}
        </button>

        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          New here?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Create an account
          </Link>
        </div>
      </div>

      {/* Bottom line */}
      <p className="mt-4 text-center text-[11px] text-slate-500">
        Designed for deep learning and focused thinking
      </p>
    </div>
  </div>
);

};

export default LoginPage;

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";

const AuthShell = ({ mode, onSubmit, busy, error, successHint }) => {
  const [email, setEmail] = useState("");
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      {/* Left — brand & pitch */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[#0a1f3a] text-white relative overflow-hidden">
        <div className="relative z-10">
          <img src="/capactix-logo.webp" alt="CapActix" className="h-12 w-auto" />
        </div>
        <div className="relative z-10 max-w-md">
          <div className="text-xs uppercase tracking-[0.2em] text-white/60 mb-3">Practice Management Suite</div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Effortless practice<br />management for CPAs.
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Manage clients, engagements, time, and tax deadlines in one place — purpose-built for US accounting firms.
          </p>
        </div>
        <div className="relative z-10 text-xs text-white/40">
          © 2026 CapActix — Solutions Beyond Client&apos;s Expectations
        </div>
        {/* subtle decoration */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-red-500/10 blur-3xl" />
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm" data-testid={`auth-${mode}-page`}>
          <div className="lg:hidden mb-6 flex justify-center">
            <img src="/capactix-logo.webp" alt="CapActix" className="h-10 w-auto" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            {isLogin
              ? "Enter your email to sign in to CapActix-PMS."
              : "Enter your email to get started — it's that simple."}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(email.trim().toLowerCase());
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1.5">
                Work Email
              </label>
              <input
                id="email"
                data-testid={`auth-${mode}-email-input`}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@firm.com"
                className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                disabled={busy}
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> We use your email only to identify you. No password required.
              </p>
            </div>

            {error && (
              <div data-testid={`auth-${mode}-error`} className="text-xs text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-md px-3 py-2">
                {error}
              </div>
            )}
            {successHint && (
              <div className="text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-md px-3 py-2">
                {successHint}
              </div>
            )}

            <button
              type="submit"
              data-testid={`auth-${mode}-submit`}
              disabled={busy || !email.trim()}
              className="w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>
                {isLogin ? "Sign in" : "Create account"} <ArrowRight className="h-4 w-4" />
              </>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>New to CapActix? <Link to="/signup" className="text-primary font-medium hover:underline" data-testid="auth-link-signup">Create an account</Link></>
            ) : (
              <>Already have an account? <Link to="/login" className="text-primary font-medium hover:underline" data-testid="auth-link-login">Sign in</Link></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handle = async (email) => {
    setBusy(true);
    setError("");
    const result = await login(email);
    setBusy(false);
    if (result.ok) {
      const dest = location.state?.from || "/";
      navigate(dest, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return <AuthShell mode="login" onSubmit={handle} busy={busy} error={error} />;
};

export const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handle = async (email) => {
    setBusy(true);
    setError("");
    const result = await register(email);
    setBusy(false);
    if (result.ok) {
      navigate("/", { replace: true });
    } else {
      setError(result.error);
    }
  };

  return <AuthShell mode="signup" onSubmit={handle} busy={busy} error={error} />;
};

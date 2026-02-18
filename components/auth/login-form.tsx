"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Brain, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Check the demo accounts below.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const DEMO_ACCOUNTS = [
    { role: "Student", email: "student@brainbuddies.com", color: "#60a5fa" },
    {
      role: "Volunteer",
      email: "volunteer@brainbuddies.com",
      color: "#7ee840",
    },
    { role: "Teacher", email: "teacher@brainbuddies.com", color: "#c084fc" },
    { role: "Admin", email: "admin@brainbuddies.com", color: "#fb923c" },
  ];

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@200;400;500&display=swap");

        .login-root {
          min-height: 100vh;
          background: #0e1117;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        /* Ambient glow blobs */
        .login-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.18;
        }
        .login-blob-1 {
          width: 500px; height: 500px;
          background: #00d4aa;
          top: -160px; left: -140px;
        }
        .login-blob-2 {
          width: 380px; height: 380px;
          background: #38bdf8;
          bottom: -100px; right: -80px;
          opacity: 0.12;
        }

        /* Noise overlay */
        .login-noise {
          position: absolute;
          inset: 0;
          opacity: 0.022;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* Card */
        .login-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 440px;
          background: #161d27;
          border: 1px solid #232f3e;
          border-radius: 20px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .login-card.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        /* Top accent bar */
        .login-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00d4aa, #38bdf8, transparent);
          opacity: 0.7;
        }

        /* Header */
        .login-header {
          padding: 40px 40px 28px;
          text-align: center;
        }
        .login-logo-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px; height: 52px;
          border-radius: 13px;
          background: rgba(0,212,170,0.08);
          border: 1px solid rgba(0,212,170,0.22);
          margin-bottom: 20px;
          position: relative;
        }
        .login-logo-wrap::after {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 13px;
          background: rgba(0,212,170,0.06);
          animation: logo-pulse 2.8s ease-in-out infinite;
        }
        @keyframes logo-pulse {
          0%,100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .login-logo-wrap svg {
          color: #00d4aa;
          width: 22px; height: 22px;
          position: relative; z-index: 1;
        }
        .login-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #00d4aa;
          margin-bottom: 10px;
        }
        .login-title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.8px;
          color: #e2eaf4;
          margin-bottom: 6px;
        }
        .login-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #627e92;
          line-height: 1.7;
        }

        /* Body */
        .login-body {
          padding: 0 40px 32px;
        }

        /* Field */
        .login-field {
          margin-bottom: 16px;
        }
        .login-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #627e92;
          display: block;
          margin-bottom: 8px;
          transition: color 0.2s;
        }
        .login-field.is-focused .login-label {
          color: #00d4aa;
        }
        .login-input-wrap {
          position: relative;
        }
        .login-input {
          width: 100%;
          background: rgba(0,0,0,0.28);
          border: 1px solid #232f3e;
          border-radius: 8px;
          padding: 12px 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: #e2eaf4;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .login-input::placeholder {
          color: #3a5168;
        }
        .login-input:focus {
          border-color: rgba(0,212,170,0.45);
          box-shadow: 0 0 0 3px rgba(0,212,170,0.06), inset 0 0 0 1px rgba(0,212,170,0.1);
        }
        .login-input.has-toggle {
          padding-right: 44px;
        }
        .login-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #4e6577;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .login-eye-btn:hover { color: #00d4aa; }

        /* Error */
        .login-error {
          background: rgba(248,113,113,0.07);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 7px;
          padding: 10px 14px;
          margin-bottom: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #f87171;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .login-error::before {
          content: '✕';
          font-size: 10px;
          flex-shrink: 0;
        }

        /* Submit button */
        .login-submit {
          width: 100%;
          background: #00d4aa;
          color: #081410;
          border: none;
          border-radius: 8px;
          padding: 13px 20px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 0 18px rgba(0,212,170,0.2);
          margin-top: 4px;
        }
        .login-submit:hover:not(:disabled) {
          background: #1de0b5;
          box-shadow: 0 0 28px rgba(0,212,170,0.38), 0 0 56px rgba(0,212,170,0.12);
          transform: translateY(-1px);
        }
        .login-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Forgot link */
        .login-forgot {
          display: block;
          text-align: right;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #4e6577;
          text-decoration: none;
          margin-bottom: 18px;
          transition: color 0.2s;
        }
        .login-forgot:hover { color: #00d4aa; }

        /* Divider */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 20px;
        }
        .login-divider-line {
          flex: 1;
          height: 1px;
          background: #232f3e;
        }
        .login-divider-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #3a5168;
        }

        /* Demo section */
        .login-demo-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #3a5168;
          margin-bottom: 10px;
        }
        .login-demo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-bottom: 4px;
        }
        .login-demo-chip {
          background: rgba(0,0,0,0.22);
          border: 1px solid #232f3e;
          border-radius: 7px;
          padding: 9px 12px;
          cursor: pointer;
          transition: all 0.18s;
          text-align: left;
        }
        .login-demo-chip:hover {
          border-color: #2d3f52;
          background: rgba(0,0,0,0.36);
          transform: translateY(-1px);
        }
        .login-demo-role {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .login-demo-email {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #4e6577;
          word-break: break-all;
        }
        .login-demo-pw {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #3a5168;
          margin-top: 8px;
          text-align: center;
        }
        .login-demo-pw span { color: #627e92; }

        /* Footer */
        .login-footer {
          padding: 20px 40px 32px;
          text-align: center;
          border-top: 1px solid #1a2330;
        }
        .login-footer-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #4e6577;
        }
        .login-footer-text a {
          color: #00d4aa;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .login-footer-text a:hover { color: #1de0b5; }
      `}</style>

      <div className="login-root">
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
        <div className="login-noise" />

        <div className={`login-card ${mounted ? "mounted" : ""}`}>
          {/* Header */}
          <div className="login-header">
            <div className="login-logo-wrap">
              <Brain />
            </div>
            <div className="login-eyebrow">Brainbuddies</div>
            <div className="login-title">Welcome back.</div>
            <div className="login-sub">
              Sign in to continue your CS journey.
            </div>
          </div>

          {/* Form */}
          <div className="login-body">
            <form onSubmit={handleSubmit}>
              <div
                className={`login-field ${focused === "email" ? "is-focused" : ""}`}
              >
                <label className="login-label" htmlFor="email">
                  Email address
                </label>
                <div className="login-input-wrap">
                  <input
                    id="email"
                    type="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    required
                  />
                </div>
              </div>

              <div
                className={`login-field ${focused === "password" ? "is-focused" : ""}`}
              >
                <label className="login-label" htmlFor="password">
                  Password
                </label>
                <div className="login-input-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="login-input has-toggle"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    required
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <Link href="/auth/forgot-password" className="login-forgot">
                Forgot password?
              </Link>

              {error && <div className="login-error">{error}</div>}

              <button
                type="submit"
                className="login-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={14}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="login-divider">
              <div className="login-divider-line" />
              <div className="login-divider-text">Demo accounts</div>
              <div className="login-divider-line" />
            </div>

            <div className="login-demo-grid">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  className="login-demo-chip"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword("password123");
                  }}
                >
                  <div className="login-demo-role" style={{ color: acc.color }}>
                    {acc.role}
                  </div>
                  <div className="login-demo-email">{acc.email}</div>
                </button>
              ))}
            </div>
            <div className="login-demo-pw">
              Password for all: <span>password123</span>
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <div className="login-footer-text">
              No account yet?{" "}
              <Link href="/auth/register">Create one free →</Link>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
}

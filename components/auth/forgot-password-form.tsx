"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Brain, ArrowRight, ArrowLeft, Mail } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { forgotPassword } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const ok = await forgotPassword(email);
      if (ok) {
        setSuccess(true);
      } else {
        setError("No account found with this email address.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@200;400;500&display=swap");

        .fp-root {
          min-height: 100vh;
          background: #0e1117;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          position: relative; overflow: hidden; padding: 24px;
        }
        .fp-blob {
          position: absolute; border-radius: 50%;
          filter: blur(100px); pointer-events: none;
        }
        .fp-blob-1 {
          width: 420px; height: 420px; background: #38bdf8;
          top: -140px; left: -100px; opacity: 0.1;
        }
        .fp-blob-2 {
          width: 320px; height: 320px; background: #00d4aa;
          bottom: -80px; right: -60px; opacity: 0.09;
        }
        .fp-noise {
          position: absolute; inset: 0; opacity: 0.022; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* Card */
        .fp-card {
          position: relative; z-index: 2;
          width: 100%; max-width: 420px;
          background: #161d27;
          border: 1px solid #232f3e;
          border-radius: 20px; overflow: hidden;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fp-card.mounted { opacity: 1; transform: translateY(0); }
        .fp-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #38bdf8, #00d4aa, transparent);
          opacity: 0.6;
        }

        /* Header */
        .fp-header { padding: 40px 40px 28px; text-align: center; }
        .fp-logo-wrap {
          display: inline-flex; align-items: center; justify-content: center;
          width: 52px; height: 52px; border-radius: 13px;
          background: rgba(0,212,170,0.08);
          border: 1px solid rgba(0,212,170,0.22);
          margin-bottom: 20px; position: relative;
        }
        .fp-logo-wrap::after {
          content: ''; position: absolute; inset: -1px; border-radius: 13px;
          background: rgba(0,212,170,0.06);
          animation: logo-pulse 2.8s ease-in-out infinite;
        }
        @keyframes logo-pulse { 0%,100%{opacity:0;} 50%{opacity:1;} }
        .fp-logo-wrap svg { color: #00d4aa; width: 22px; height: 22px; position: relative; z-index: 1; }
        .fp-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
          color: #00d4aa; margin-bottom: 10px;
        }
        .fp-title {
          font-size: 26px; font-weight: 800; letter-spacing: -0.8px;
          color: #e2eaf4; margin-bottom: 8px;
        }
        .fp-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; color: #627e92; line-height: 1.8; max-width: 300px; margin: 0 auto;
        }

        /* Body */
        .fp-body { padding: 0 40px 32px; }

        /* Field */
        .fp-field { margin-bottom: 16px; }
        .fp-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: #627e92; display: block; margin-bottom: 8px; transition: color 0.2s;
        }
        .fp-field.is-focused .fp-label { color: #00d4aa; }
        .fp-input {
          width: 100%; background: rgba(0,0,0,0.28);
          border: 1px solid #232f3e; border-radius: 8px;
          padding: 12px 14px; box-sizing: border-box;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px; color: #e2eaf4; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .fp-input::placeholder { color: #3a5168; }
        .fp-input:focus {
          border-color: rgba(0,212,170,0.45);
          box-shadow: 0 0 0 3px rgba(0,212,170,0.06), inset 0 0 0 1px rgba(0,212,170,0.1);
        }

        /* Error */
        .fp-error {
          background: rgba(248,113,113,0.07);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 7px; padding: 10px 14px; margin-bottom: 14px;
          font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f87171;
          display: flex; align-items: center; gap: 8px;
        }
        .fp-error::before { content: '✕'; font-size: 10px; flex-shrink: 0; }

        /* Submit */
        .fp-submit {
          width: 100%; background: #00d4aa; color: #081410;
          border: none; border-radius: 8px; padding: 13px 20px;
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 8px; transition: all 0.2s;
          box-shadow: 0 0 18px rgba(0,212,170,0.2);
        }
        .fp-submit:hover:not(:disabled) {
          background: #1de0b5;
          box-shadow: 0 0 28px rgba(0,212,170,0.38), 0 0 56px rgba(0,212,170,0.12);
          transform: translateY(-1px);
        }
        .fp-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* Footer */
        .fp-footer {
          padding: 18px 40px 28px;
          border-top: 1px solid #1a2330; text-align: center;
        }
        .fp-back {
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          color: #4e6577; text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          transition: color 0.2s;
        }
        .fp-back:hover { color: #00d4aa; }

        /* ── Success state ── */
        .fp-success-body { padding: 0 40px 40px; text-align: center; }

        .fp-mail-ring {
          width: 80px; height: 80px; border-radius: 50%;
          border: 1px solid rgba(0,212,170,0.15);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px; position: relative;
          animation: ring-breathe 3s ease-in-out infinite;
        }
        @keyframes ring-breathe {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,212,170,0.15); }
          50% { box-shadow: 0 0 0 12px rgba(0,212,170,0.04); }
        }
        .fp-mail-inner {
          width: 56px; height: 56px; border-radius: 50%;
          background: rgba(0,212,170,0.08);
          border: 1px solid rgba(0,212,170,0.25);
          display: flex; align-items: center; justify-content: center;
        }
        .fp-mail-inner svg { color: #00d4aa; }

        .fp-success-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
          color: #00d4aa; margin-bottom: 10px;
        }
        .fp-success-title {
          font-size: 24px; font-weight: 800; letter-spacing: -0.6px;
          color: #e2eaf4; margin-bottom: 12px;
        }
        .fp-success-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; color: #627e92; line-height: 1.85;
          margin-bottom: 28px;
        }
        .fp-success-email {
          color: #00d4aa; font-weight: 600;
        }
        .fp-success-note {
          background: rgba(0,212,170,0.04);
          border: 1px solid rgba(0,212,170,0.1);
          border-radius: 8px; padding: 12px 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #4e6577; line-height: 1.7; margin-bottom: 24px;
        }
        .fp-success-note strong { color: #627e92; }
        .fp-back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          color: #4e6577; text-decoration: none; transition: color 0.2s;
        }
        .fp-back-btn:hover { color: #00d4aa; }

        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
      `}</style>

      <div className="fp-root">
        <div className="fp-blob fp-blob-1" />
        <div className="fp-blob fp-blob-2" />
        <div className="fp-noise" />

        <div className={`fp-card ${mounted ? "mounted" : ""}`}>
          {success ? (
            /* ── Success view ── */
            <>
              <div className="fp-header">
                <div className="fp-eyebrow">Brainbuddies</div>
              </div>
              <div className="fp-success-body">
                <div className="fp-mail-ring">
                  <div className="fp-mail-inner">
                    <Mail size={22} />
                  </div>
                </div>
                <div className="fp-success-tag">Email sent</div>
                <div className="fp-success-title">Check your inbox.</div>
                <div className="fp-success-sub">
                  We sent a reset link to{" "}
                  <span className="fp-success-email">{email}</span>.<br />
                  Click the link to choose a new password.
                </div>
                <div className="fp-success-note">
                  <strong>Didn't get it?</strong> Check your spam folder or wait
                  a minute and try again. The link expires in 30 minutes.
                </div>
                <Link href="/auth/login" className="fp-back-btn">
                  <ArrowLeft size={12} /> Back to sign in
                </Link>
              </div>
            </>
          ) : (
            /* ── Form view ── */
            <>
              <div className="fp-header">
                <div className="fp-logo-wrap">
                  <Brain />
                </div>
                <div className="fp-eyebrow">Brainbuddies</div>
                <div className="fp-title">Forgot password?</div>
                <div className="fp-sub">
                  Enter your email and we'll send you a link to reset your
                  password.
                </div>
              </div>

              <div className="fp-body">
                <form onSubmit={handleSubmit}>
                  <div className={`fp-field ${focused ? "is-focused" : ""}`}>
                    <label className="fp-label" htmlFor="email">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="fp-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      required
                    />
                  </div>

                  {error && <div className="fp-error">{error}</div>}

                  <button
                    type="submit"
                    className="fp-submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2
                          size={14}
                          style={{ animation: "spin 1s linear infinite" }}
                        />{" "}
                        Sending link...
                      </>
                    ) : (
                      <>
                        Send reset link <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="fp-footer">
                <Link href="/auth/login" className="fp-back">
                  <ArrowLeft size={11} /> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

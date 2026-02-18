"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Brain, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { useAuthStore, type UserRole } from "@/lib/auth-store";

const ROLES: { value: UserRole; label: string; color: string; desc: string }[] =
  [
    {
      value: "student",
      label: "Student",
      color: "#60a5fa",
      desc: "Learn & grow",
    },
    {
      value: "volunteer",
      label: "Volunteer",
      color: "#7ee840",
      desc: "Mentor others",
    },
    {
      value: "teacher",
      label: "Teacher",
      color: "#c084fc",
      desc: "Manage classes",
    },
  ];

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const { register } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const pwMatch = confirmPassword.length > 0 && password === confirmPassword;
  const pwStrong = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!pwStrong) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const success = await register(email, password, name, role);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("An account with this email already exists.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRole = ROLES.find((r) => r.value === role)!;

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@200;400;500&display=swap");

        .reg-root {
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
        .reg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .reg-blob-1 {
          width: 460px; height: 460px;
          background: #00d4aa;
          top: -160px; right: -120px;
          opacity: 0.13;
        }
        .reg-blob-2 {
          width: 340px; height: 340px;
          background: #7ee840;
          bottom: -80px; left: -80px;
          opacity: 0.08;
        }
        .reg-noise {
          position: absolute; inset: 0;
          opacity: 0.022; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* Card */
        .reg-card {
          position: relative; z-index: 2;
          width: 100%; max-width: 480px;
          background: #161d27;
          border: 1px solid #232f3e;
          border-radius: 20px;
          overflow: hidden;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reg-card.mounted { opacity: 1; transform: translateY(0); }
        .reg-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00d4aa, #7ee840, transparent);
          opacity: 0.65;
        }

        /* Header */
        .reg-header {
          padding: 36px 40px 24px;
          text-align: center;
        }
        .reg-logo-wrap {
          display: inline-flex; align-items: center; justify-content: center;
          width: 52px; height: 52px;
          border-radius: 13px;
          background: rgba(0,212,170,0.08);
          border: 1px solid rgba(0,212,170,0.22);
          margin-bottom: 18px; position: relative;
        }
        .reg-logo-wrap::after {
          content: ''; position: absolute; inset: -1px;
          border-radius: 13px; background: rgba(0,212,170,0.06);
          animation: logo-pulse 2.8s ease-in-out infinite;
        }
        @keyframes logo-pulse { 0%,100%{opacity:0;} 50%{opacity:1;} }
        .reg-logo-wrap svg { color: #00d4aa; width: 22px; height: 22px; position: relative; z-index: 1; }
        .reg-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
          color: #00d4aa; margin-bottom: 10px;
        }
        .reg-title {
          font-size: 26px; font-weight: 800; letter-spacing: -0.8px;
          color: #e2eaf4; margin-bottom: 6px;
        }
        .reg-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; color: #627e92; line-height: 1.7;
        }

        /* Body */
        .reg-body { padding: 0 40px 32px; }

        /* Role picker */
        .reg-role-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: #627e92; display: block; margin-bottom: 10px;
        }
        .reg-roles {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 6px; margin-bottom: 20px;
        }
        .reg-role-btn {
          background: rgba(0,0,0,0.25);
          border: 1px solid #232f3e;
          border-radius: 8px; padding: 10px 8px;
          cursor: pointer; transition: all 0.18s;
          text-align: center;
        }
        .reg-role-btn:hover { border-color: #2d3f52; transform: translateY(-1px); }
        .reg-role-btn.active {
          background: rgba(0,0,0,0.4);
        }
        .reg-role-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; font-weight: 600; letter-spacing: 0.5px;
          text-transform: uppercase; margin-bottom: 2px;
        }
        .reg-role-desc-sm {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; color: #3a5168;
        }

        /* Fields */
        .reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .reg-field { margin-bottom: 14px; }
        .reg-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: #627e92; display: block; margin-bottom: 7px;
          transition: color 0.2s;
        }
        .reg-field.is-focused .reg-label { color: #00d4aa; }
        .reg-input-wrap { position: relative; }
        .reg-input {
          width: 100%; background: rgba(0,0,0,0.28);
          border: 1px solid #232f3e; border-radius: 8px;
          padding: 11px 14px; box-sizing: border-box;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px; color: #e2eaf4; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .reg-input::placeholder { color: #3a5168; }
        .reg-input:focus {
          border-color: rgba(0,212,170,0.45);
          box-shadow: 0 0 0 3px rgba(0,212,170,0.06), inset 0 0 0 1px rgba(0,212,170,0.1);
        }
        .reg-input.has-icon { padding-right: 42px; }
        .reg-input-icon {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #4e6577; padding: 2px;
          display: flex; align-items: center; transition: color 0.2s;
        }
        .reg-input-icon:hover { color: #00d4aa; }
        .reg-input-check {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          display: flex; align-items: center; pointer-events: none;
        }

        /* PW strength dots */
        .reg-pw-hint {
          display: flex; align-items: center; gap: 6px; margin-top: 6px;
        }
        .reg-pw-dot {
          width: 20px; height: 3px; border-radius: 2px;
          background: #232f3e; transition: background 0.3s;
        }
        .reg-pw-dot.lit { background: #00d4aa; }
        .reg-pw-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: #3a5168; margin-left: 2px;
        }

        /* Error */
        .reg-error {
          background: rgba(248,113,113,0.07);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 7px; padding: 10px 14px; margin-bottom: 14px;
          font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f87171;
          display: flex; align-items: center; gap: 8px;
        }
        .reg-error::before { content: '✕'; font-size: 10px; flex-shrink: 0; }

        /* Submit */
        .reg-submit {
          width: 100%; background: #00d4aa; color: #081410;
          border: none; border-radius: 8px; padding: 13px 20px;
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 8px; transition: all 0.2s;
          box-shadow: 0 0 18px rgba(0,212,170,0.2); margin-top: 6px;
        }
        .reg-submit:hover:not(:disabled) {
          background: #1de0b5;
          box-shadow: 0 0 28px rgba(0,212,170,0.38), 0 0 56px rgba(0,212,170,0.12);
          transform: translateY(-1px);
        }
        .reg-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* Footer */
        .reg-footer {
          padding: 18px 40px 28px;
          border-top: 1px solid #1a2330; text-align: center;
        }
        .reg-footer-text {
          font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #4e6577;
        }
        .reg-footer-text a {
          color: #00d4aa; text-decoration: none; font-weight: 600; transition: color 0.2s;
        }
        .reg-footer-text a:hover { color: #1de0b5; }

        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
      `}</style>

      <div className="reg-root">
        <div className="reg-blob reg-blob-1" />
        <div className="reg-blob reg-blob-2" />
        <div className="reg-noise" />

        <div className={`reg-card ${mounted ? "mounted" : ""}`}>
          {/* Header */}
          <div className="reg-header">
            <div className="reg-logo-wrap">
              <Brain />
            </div>
            <div className="reg-eyebrow">Brainbuddies</div>
            <div className="reg-title">Create your account.</div>
            <div className="reg-sub">
              Join 12,000+ students mastering CS together.
            </div>
          </div>

          <div className="reg-body">
            <form onSubmit={handleSubmit}>
              {/* Role picker */}
              <span className="reg-role-label">I am a...</span>
              <div className="reg-roles">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    className={`reg-role-btn ${role === r.value ? "active" : ""}`}
                    style={
                      role === r.value
                        ? {
                            borderColor: r.color + "55",
                            boxShadow: `0 0 12px ${r.color}18`,
                          }
                        : {}
                    }
                    onClick={() => setRole(r.value)}
                  >
                    <div
                      className="reg-role-name"
                      style={{ color: role === r.value ? r.color : "#4e6577" }}
                    >
                      {r.label}
                    </div>
                    <div className="reg-role-desc-sm">{r.desc}</div>
                  </button>
                ))}
              </div>

              {/* Name + Email row */}
              <div className="reg-row">
                <div
                  className={`reg-field ${focused === "name" ? "is-focused" : ""}`}
                >
                  <label className="reg-label" htmlFor="name">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="reg-input"
                    placeholder="Alex Kim"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    required
                  />
                </div>
                <div
                  className={`reg-field ${focused === "email" ? "is-focused" : ""}`}
                >
                  <label className="reg-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="reg-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div
                className={`reg-field ${focused === "password" ? "is-focused" : ""}`}
              >
                <label className="reg-label" htmlFor="password">
                  Password
                </label>
                <div className="reg-input-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="reg-input has-icon"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    required
                  />
                  <button
                    type="button"
                    className="reg-input-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="reg-pw-hint">
                    {[2, 4, 6, 8].map((n) => (
                      <div
                        key={n}
                        className={`reg-pw-dot ${password.length >= n ? "lit" : ""}`}
                      />
                    ))}
                    <span className="reg-pw-text">
                      {password.length < 4
                        ? "weak"
                        : password.length < 6
                          ? "almost"
                          : "good"}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div
                className={`reg-field ${focused === "confirm" ? "is-focused" : ""}`}
              >
                <label className="reg-label" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <div className="reg-input-wrap">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    className="reg-input has-icon"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => setFocused(null)}
                    required
                  />
                  {confirmPassword.length > 0 ? (
                    <span className="reg-input-check">
                      <Check
                        size={13}
                        color={pwMatch ? "#00d4aa" : "#f87171"}
                      />
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="reg-input-icon"
                      onClick={() => setShowConfirm(!showConfirm)}
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>

              {error && <div className="reg-error">{error}</div>}

              <button type="submit" className="reg-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2
                      size={14}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="reg-footer">
            <div className="reg-footer-text">
              Already a member? <Link href="/auth/login">Sign in →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

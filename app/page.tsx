"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import {
  Brain,
  BookOpen,
  Users,
  Trophy,
  MessageCircle,
  ArrowRight,
  Zap,
  Code2,
  Star,
} from "lucide-react";
import Link from "next/link";

const PARTICLES = [
  "O(log n)",
  "binary_search()",
  "for i in range(n)",
  "dp[i][j]",
  "BFS / DFS",
  "graph.adj[]",
  "quick_sort",
  "O(n²)",
  "stack.pop()",
  "return mid",
  "merge(left,right)",
  "hash_map{}",
  "while lo<=hi",
  "pivot = arr[mid]",
  "visited.add(node)",
  "O(1) space",
  "heapq.push()",
  "memo = {}",
  "trie.insert()",
  "union_find()",
];

const TICKER_ITEMS = [
  "<strong>12,000+</strong> learners",
  "840+ algorithm challenges",
  "Live pair programming",
  "Daily coding contests",
  "<strong>4 roles:</strong> Student · Volunteer · Teacher · Admin",
  "Voice &amp; video sessions",
  "CS Q&amp;A forum",
  "Real-time leaderboards",
];

const ROLES = [
  {
    cls: "r-student",
    idx: "01",
    title: "Student",
    color: "c-blue",
    desc: "Learn algorithms, join live coding sessions, solve daily challenges, and watch your skills compound every week.",
  },
  {
    cls: "r-volunteer",
    idx: "02",
    title: "Volunteer",
    color: "c-green2",
    desc: "Mentor students, answer questions, and share hard-earned programming wisdom with the next generation.",
  },
  {
    cls: "r-teacher",
    idx: "03",
    title: "Teacher",
    color: "c-purple",
    desc: "Create assignments, manage your CS class, and get granular data on exactly where students are struggling.",
  },
  
];

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);

  const [glitch, setGlitch] = useState(false);
  const [count, setCount] = useState({
    students: 0,
    challenges: 0,
    sessions: 0,
  });

  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      text: string;
      alpha: number;
      size: number;
      color: string;
    }>
  >([]);

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  // Periodic glitch effect
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 400);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Count-up animation
  useEffect(() => {
    const targets = { students: 12000, challenges: 840, sessions: 98 };
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 2000, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setCount({
        students: Math.floor(e * targets.students),
        challenges: Math.floor(e * targets.challenges),
        sessions: Math.floor(e * targets.sessions),
      });
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  // Canvas: particles + mouse spotlight
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const COLORS = ["#00d4aa", "#7ee840", "#38bdf8", "#fbbf24", "#a78bfa"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = Array.from({ length: 22 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3 - 0.08,
      text: PARTICLES[Math.floor(Math.random() * PARTICLES.length)],
      alpha: 0.07 + Math.random() * 0.1,
      size: 12 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;

      if (mx > 0) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 320);
        g.addColorStop(0, "rgba(0,212,170,0.04)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      for (const p of particlesRef.current) {
        const dx = p.x - mx,
          dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.vx += (dx / dist) * 0.28;
          p.vy += (dy / dist) * 0.28;
        }
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -100) p.x = canvas.width + 80;
        if (p.x > canvas.width + 100) p.x = -80;
        if (p.y < -30) p.y = canvas.height + 20;
        if (p.y > canvas.height + 30) p.y = -20;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px 'JetBrains Mono', monospace`;
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="bb-page-active">
      <CursorDot />
      <canvas ref={canvasRef} className="bb-canvas" />
      <div className="bb-noise" />

      <div className="bb-page">
        <div className="bb-content">
          {/* ── Nav ─────────────────────────────────────────── */}
          <nav className="bb-nav">
            <div className="bb-logo">
              <div className="bb-logo-mark">
                <Brain />
              </div>
              Brainbuddies
            </div>
            <div className="bb-nav-right">
              <Link href="/auth/login" className="bb-btn bb-btn-ghost">
                Sign in
              </Link>
              <Link href="/auth/register" className="bb-btn bb-btn-primary">
                Get started <ArrowRight size={12} />
              </Link>
            </div>
          </nav>

          {/* ── Hero ────────────────────────────────────────── */}
          <section className="bb-hero">
            <div className="bb-hero-tag">
              <span /> Collaborative CS Learning <span />
            </div>

            <div
              className={`bb-glitch bb-title ${glitch ? "active" : ""}`}
              data-text="Master Computer"
            >
              Master Computer
            </div>
            <div className="bb-title-line2">Science Together.</div>

            <p className="bb-hero-sub">
              The platform where students crack algorithms, debug code
              side-by-side, and level up faster than they ever could alone.
            </p>

            <div className="bb-hero-actions">
              <Link
                href="/auth/register"
                className="bb-btn bb-btn-primary bb-btn-lg"
              >
                Start for free <ArrowRight size={14} />
              </Link>
              <Link href="/auth/login" className="bb-btn-outline bb-btn-lg">
                Sign in
              </Link>
            </div>

            <div className="bb-scroll-hint">
              <div className="bb-scroll-line" />
              scroll
            </div>
          </section>

          {/* ── Ticker ──────────────────────────────────────── */}
          <div className="bb-ticker">
            {[0, 1].map((i) => (
              <div className="bb-ticker-inner" key={i}>
                {TICKER_ITEMS.map((item, j) => (
                  <div key={j} className="bb-ticker-item">
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                    <div className="bb-ticker-sep" />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ── Stats ───────────────────────────────────────── */}
          <div className="bb-stats-row">
            <div className="bb-stat-cell">
              <div className="bb-stat-number">
                {count.students.toLocaleString()}
                <span className="bb-stat-suffix">+</span>
              </div>
              <div className="bb-stat-label">Active learners</div>
            </div>
            <div className="bb-stat-cell">
              <div className="bb-stat-number">
                {count.challenges}
                <span className="bb-stat-suffix">+</span>
              </div>
              <div className="bb-stat-label">Algorithm challenges</div>
            </div>
            <div className="bb-stat-cell">
              <div className="bb-stat-number">
                {count.sessions}
                <span className="bb-stat-suffix">%</span>
              </div>
              <div className="bb-stat-label">Say it helped them grow</div>
            </div>
          </div>

          {/* ── Features bento ──────────────────────────────── */}
          <div className="bb-section">
            <div className="bb-section-label">Platform features</div>
            <h2 className="bb-section-title">
              Four tools.
              <br />
              One mission.
            </h2>

            <div className="bb-bento">
              <div className="bb-bento-card bc-1">
                <div className="bb-bento-num">01</div>
                <div className="bb-bento-icon">
                  <BookOpen />
                </div>
                <div className="bb-bento-t">CS Resource Library</div>
                <div className="bb-bento-d">
                  Every textbook, algorithm guide, and interactive reference —
                  searchable, organized, always available.
                </div>
                <div className="bb-terminal">
                  <div className="bb-term-bar">
                    <div
                      className="bb-dot2"
                      style={{ background: "#ff5f57" }}
                    />
                    <div
                      className="bb-dot2"
                      style={{ background: "#febc2e" }}
                    />
                    <div
                      className="bb-dot2"
                      style={{ background: "#28c840" }}
                    />
                    <span className="bb-term-filename">
                      brainbuddies_library
                    </span>
                  </div>
                  <div className="bb-term-body">
                    <div>
                      <span className="t-prompt">❯ </span>
                      <span className="t-cmd">search "binary trees"</span>
                    </div>
                    <div>
                      <span className="t-out">
                        {" "}
                        → 23 results found in library
                      </span>
                    </div>
                    <div>
                      <span className="t-ok">
                        {" "}
                        ✓ CLRS Chapter 12 — Binary Search Trees
                      </span>
                    </div>
                    <div>
                      <span className="t-ok">
                        {" "}
                        ✓ Interactive AVL Visualizer
                      </span>
                    </div>
                    <div>
                      <span className="t-out"> → Showing top 2 of 23...</span>
                    </div>
                    <div>
                      <span className="t-prompt">❯ </span>
                      <span className="t-cursor" />
                    </div>
                  </div>
                </div>
                <div className="bb-bento-pill">
                  <Star size={9} /> 400+ resources
                </div>
              </div>

              <div className="bb-bento-card bc-2">
                <div className="bb-bento-num">02</div>
                <div className="bb-bento-icon">
                  <Users />
                </div>
                <div className="bb-bento-t">Live Coding Sessions</div>
                <div className="bb-bento-d">
                  Voice, video, and text rooms for real-time pair programming
                  and algorithm walkthroughs. Up to 20 people per room.
                </div>
                <div className="bb-bento-pill">
                  <Zap size={9} /> Real-time
                </div>
              </div>

              <div className="bb-bento-card bc-3">
                <div className="bb-bento-num">03</div>
                <div className="bb-bento-icon">
                  <Trophy />
                </div>
                <div className="bb-bento-t">Coding Challenges</div>
                <div className="bb-bento-d">
                  Curated problems, weekly contests, global leaderboards. Train
                  your algorithmic instincts daily.
                </div>
                <div className="bb-bento-pill">
                  <Code2 size={9} /> Weekly contests
                </div>
              </div>

              <div className="bb-bento-card bc-4">
                <div className="bb-bento-num">04</div>
                <div className="bb-bento-icon">
                  <MessageCircle />
                </div>
                <div className="bb-bento-t">CS Q&amp;A Forum</div>
                <div className="bb-bento-d">
                  Stuck on a problem? Get answers fast from developers
                  who&apos;ve solved it before.
                </div>
                <div className="bb-bento-pill">
                  <Star size={9} /> Community
                </div>
              </div>

              <div
                className="bb-bento-card bc-5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,212,170,0.07) 0%, var(--bb-card) 55%)",
                }}
              >
                <div className="bb-bento-num">✦</div>
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 800,
                    letterSpacing: -1,
                    lineHeight: 1.1,
                    marginBottom: 12,
                    color: "var(--bb-text)",
                  }}
                >
                  Track
                  <br />
                  <span style={{ color: "var(--bb-green)" }}>everything.</span>
                </div>
                <div className="bb-bento-d">
                  Dashboards, progress charts, and achievements keep you sharp
                  and accountable.
                </div>
              </div>
            </div>
          </div>

          {/* ── Roles ───────────────────────────────────────── */}
          <div className="bb-section">
            <div className="bb-section-label">Who it&apos;s for</div>
            <h2 className="bb-section-title">Choose your role.</h2>
            <div className="bb-roles-grid">
              {ROLES.map((r) => (
                <div key={r.idx} className={`bb-role-card ${r.cls}`}>
                  <div className="bb-role-idx">{r.idx}</div>
                  <div className={`bb-role-title ${r.color}`}>{r.title}</div>
                  <p className="bb-role-desc">{r.desc}</p>
                  <Link href="/auth/register" className="bb-role-cta">
                    Join as {r.title} <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA ─────────────────────────────────────────── */}
          <div className="bb-section">
            <div className="bb-cta-card">
              <div className="bb-cta-glow" />
              <div className="bb-cta-ring" />
              <div className="bb-cta-ring2" />
              <h2 className="bb-cta-title">
                Ready to go from
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, var(--bb-green), var(--bb-cyan))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  stuck to hired?
                </span>
              </h2>
              <p className="bb-cta-sub">
                Free to join. No credit card. Just open your editor and start.
              </p>
              <div className="bb-cta-actions">
                <Link
                  href="/auth/register"
                  className="bb-btn bb-btn-primary bb-btn-lg"
                >
                  Create free account <ArrowRight size={14} />
                </Link>
                <Link href="/auth/login" className="bb-btn-outline bb-btn-lg">
                  Already a member
                </Link>
              </div>
            </div>
          </div>

          {/* ── Footer ──────────────────────────────────────── */}
          <div className="bb-footer-bar">
            <div className="bb-footer">
              <div className="bb-logo">
                <div className="bb-logo-mark" style={{ width: 26, height: 26 }}>
                  <Brain style={{ width: 13, height: 13 }} />
                </div>
                Brainbuddies
              </div>
              <span className="bb-footer-copy">
                © 2026 Brainbuddies — Master CS Together.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Custom cursor with physics lag ─────────────────────────── */
function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + "px";
        ringRef.current.style.top = ring.current.y + "px";
      }
      requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    requestAnimationFrame(tick);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={dotRef} className="bb-cursor" />
      <div ref={ringRef} className="bb-cursor-ring" />
    </>
  );
}

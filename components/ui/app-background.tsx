"use client"

export function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.6] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--foreground)/0.03) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)/0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Gradient accents */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" aria-hidden />
      <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-purple-500/20 dark:bg-purple-400/15 blur-[120px]" aria-hidden />
      <div className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-blue-500/20 dark:bg-blue-400/15 blur-[120px]" aria-hidden />
    </div>
  )
}



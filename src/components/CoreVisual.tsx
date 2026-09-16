export default function CoreVisual() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2">
      <div className="relative h-[560px] w-[560px] md:h-[760px] md:w-[760px]">
        {/* vertical light beam */}
        <div className="animate-beam absolute left-1/2 top-[-260px] h-[1100px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
        <div className="animate-beam absolute left-1/2 top-[-200px] h-[900px] w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-indigo-200/20 to-transparent blur-sm" />

        {/* orbital rings */}
        <div className="animate-spin-slow absolute inset-0 rounded-full border border-white/10" />
        <div className="animate-spin-rev absolute inset-[7%] rounded-full border border-white/[0.06]" />
        <div className="animate-spin-slow absolute inset-[16%] rounded-full border border-white/10" />
        <div className="animate-spin-rev absolute inset-[27%] rounded-full border border-white/[0.05]" />
        <div className="animate-spin-slow absolute inset-[38%] rounded-full border border-indigo-300/10" />

        {/* dashed technical ring */}
        <div
          className="animate-spin-rev absolute inset-[12%] rounded-full"
          style={{
            border: "1px dashed rgba(150,180,255,0.14)",
          }}
        />

        {/* orbiting node */}
        <div className="animate-spin-slow absolute inset-[16%]">
          <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-indigo-200 shadow-[0_0_10px_4px_rgba(150,180,255,0.6)]" />
        </div>

        {/* core glow */}
        <div className="animate-pulse-core absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(150,180,255,0.85),rgba(40,60,150,0.28)_45%,transparent_70%)] blur-lg" />
        <div className="animate-pulse-core absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_60px_28px_rgba(180,200,255,0.7)]" />
      </div>
    </div>
  );
}

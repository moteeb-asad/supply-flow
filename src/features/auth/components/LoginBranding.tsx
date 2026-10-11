export default function LoginBranding() {
  return (
    <div className="hidden lg:flex w-1/2 bg-background-dark relative overflow-hidden flex-col justify-center items-center p-12">
      {/* Background Effects */}
      <div className="absolute inset-0 watermark-pattern opacity-40" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[12rem] font-black text-white/[0.02] rotate-[-15deg] whitespace-nowrap">
          SECURE ACCESS
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">
        {/* Logo */}
        <div className="mb-6 inline-flex items-center justify-center rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-primary shadow-2xl">
            <span
              className="material-symbols-outlined text-4xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              inventory_2
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">
          SupplyFlow
        </h2>
        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-primary" />

        {/* Description */}
        <p className="mb-8 text-base font-medium leading-relaxed text-gray-400">
          Integrated supply chain and warehouse management system for
          streamlined internal operations.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
            <span className="material-symbols-outlined text-primary mb-2">
              monitoring
            </span>
            <h4 className="text-white text-sm font-bold mb-1">
              Real-time Tracking
            </h4>
            <p className="text-gray-500 text-xs">
              Monitor every movement in your supply chain.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
            <span className="material-symbols-outlined text-primary mb-2">
              verified_user
            </span>
            <h4 className="text-white text-sm font-bold mb-1">
              Secure Internal
            </h4>
            <p className="text-gray-500 text-xs">
              Enterprise-grade security and audit trails.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Badge */}
      <div className="absolute bottom-8 flex items-center gap-2 text-white/40 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
        <span className="material-symbols-outlined text-sm">
          shield_with_heart
        </span>
        <span className="text-xs font-semibold tracking-wide uppercase">
          Secure Internal Access Only
        </span>
      </div>
    </div>
  );
}

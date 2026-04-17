import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-uploc-bg overflow-hidden font-sans text-white selection:bg-uploc-gold selection:text-uploc-bg px-6 py-20">
      
      {/* --- CAMADA DE TEXTURA (GRAIN) --- */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Aurora Dinâmica */}
      <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-uploc-gold/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-uploc-gold/10 rounded-full blur-[150px] pointer-events-none" />

      {/* --- CONTEÚDO --- */}
      <div className="z-10 text-center max-w-5xl w-full">
        
        {/* Badge Futurista */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-uploc-gold/30 bg-uploc-gold/5 backdrop-blur-xl mb-12 shadow-[0_0_15px_rgba(197,160,89,0.1)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-uploc-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-uploc-gold"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-uploc-gold">
            Equipamento de elite
          </span>
        </div>

        {/* Título - Ajustado para não ficar estranho/espaçado demais */}
        <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-8 leading-none select-none">
          UP<span className="font-black bg-gradient-to-b from-white via-uploc-gold to-uploc-gold bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]">LOC</span>
        </h1>
        
        {/* Descrição */}
        <p className="max-w-xl mx-auto text-gray-400 text-sm md:text-lg font-light leading-relaxed mb-16 px-4">
          A plataforma definitiva para locação de equipamentos multimídia de <span className="text-white border-b border-uploc-gold/50 pb-0.5 font-medium">alta fidelidade</span>. 
          Performance excepcional para profissionais que exigem o topo.
        </p>

        {/* --- BOTÕES --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="/home"
            className="group relative w-full sm:w-64 overflow-hidden rounded-full bg-uploc-gold px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-uploc-bg transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(197,160,89,0.4)] text-center"
          >
            <span className="relative z-10">Explorar Home</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-[1.5s] group-hover:translate-x-full" />
          </Link>

          <Link 
            href="/login"
            className="w-full sm:w-64 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white/[0.08] hover:border-uploc-gold/50 text-center"
          >
            Acessar Conta
          </Link>
        </div>

        {/* Rodapé */}
        <div className="mt-28">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-uploc-gold/40 to-transparent mx-auto mb-8"></div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500">
            © 2026 <span className="text-gray-300">UpLoc</span> Precision Systems
          </p>
        </div>
      </div>

      {/* --- ELEMENTOS DE UI (HUD) - Ajustados para não colarem na borda --- */}
      <div className="absolute top-12 left-12 flex flex-col gap-2 pointer-events-none opacity-40 hidden lg:flex">
        <div className="w-12 h-12 border-t border-l border-uploc-gold/40" />
        <span className="text-[8px] font-mono text-uploc-gold/60 uppercase">System_Active</span>
      </div>

      <div className="absolute bottom-12 right-12 flex flex-col items-end gap-2 pointer-events-none opacity-40 hidden lg:flex">
        <span className="text-[8px] font-mono text-uploc-gold/60 uppercase">40.7128° N, 74.0060° W</span>
        <div className="w-12 h-12 border-b border-r border-uploc-gold/40" />
      </div>

    </div>
  )
}
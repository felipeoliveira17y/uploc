import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-uploc-bg overflow-hidden font-sans text-white">
      
      {/* Efeito Aurora de Fundo - Mais espalhado para a Home */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-uploc-gold/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-uploc-gold/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Conteúdo Centralizado */}
      <div className="z-10 text-center px-4 animate-fade-up">
        
        {/* Badge Sutil */}
        <span className="inline-block px-4 py-1.5 rounded-full border border-uploc-gold/30 bg-uploc-gold/5 text-[10px] font-bold uppercase tracking-[0.3em] text-uploc-gold mb-8">
          Equipamento de elite para quem não aceita menos
        </span>

        {/* Título de Impacto */}
        <h1 className="text-5xl md:text-7xl font-light tracking-[0.2em] mb-6">
          UP<span className="font-bold text-uploc-gold">LOC</span>
        </h1>
        
        {/* Introdução Pequena */}
        <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base font-light leading-relaxed tracking-wide mb-12">
          A plataforma definitiva para locação de equipamentos multimídia de alta fidelidade. 
          Performance excepcional, curadoria de elite e gestão simplificada para profissionais exigentes.
        </p>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="/home"
            className="w-full sm:w-64 rounded-full bg-uploc-gold py-5 text-[11px] font-black uppercase tracking-[0.3em] text-uploc-bg transition-all hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(197,160,89,0.3)] text-center"
          >
            Começar Agora
          </Link>

          <Link 
            href="/login"
            className="w-full sm:w-64 rounded-full border border-white/10 bg-white/5 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-white/10 hover:border-white/20 text-center"
          >
            Acessar Conta
          </Link>
        </div>

        {/* Rodapé Sutil */}
        <div className="mt-20 opacity-30">
          <p className="text-[9px] uppercase tracking-[0.5em] text-gray-500">
            © 2026 UpLoc Multimídia Premium
          </p>
        </div>
      </div>
    </div>
  )
}
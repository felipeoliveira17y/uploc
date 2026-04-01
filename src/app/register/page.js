import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-uploc-bg overflow-hidden font-sans py-12">
      
      {/* Efeito Aurora (Consistência com o Login) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-uploc-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-uploc-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Card de Registro */}
      <div className="z-10 w-full max-w-[440px] animate-fade-up rounded-[45px] bg-uploc-card p-10 border border-white/5 shadow-2xl mx-4">
        
        {/* Header */}
        <div className="mb-8 text-center uppercase tracking-[0.4em]">
          <h1 className="text-2xl font-light text-white">
            REGISTER <span className="font-bold text-uploc-gold">UPLOC</span>
          </h1>
          <div className="h-[1px] w-12 bg-uploc-gold mx-auto mt-2 opacity-30"></div>
          <p className="mt-4 text-[9px] text-gray-500 font-bold tracking-[0.2em]">
            Crie sua credencial de acesso
          </p>
        </div>

        <form className="space-y-5">
          {/* Nome Completo */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-uploc-gold ml-4">
              Nome Completo
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-full bg-uploc-input border border-white/5 px-7 py-3.5 text-sm text-white focus:outline-none focus:border-uploc-gold/50 transition-all placeholder:text-gray-600"
              placeholder="Como prefere ser chamado?"
            />
          </div>

          {/* E-mail */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-uploc-gold ml-4">
              E-mail Profissional
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-full bg-uploc-input border border-white/5 px-7 py-3.5 text-sm text-white focus:outline-none focus:border-uploc-gold/50 transition-all placeholder:text-gray-600"
              placeholder="seu@email.com"
            />
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-uploc-gold ml-4">
              Criar Senha
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-full bg-uploc-input border border-white/5 px-7 py-3.5 text-sm text-white focus:outline-none focus:border-uploc-gold/50 transition-all placeholder:text-gray-600"
              placeholder="••••••••"
            />
          </div>

          {/* Botão de Registro */}
          <button 
            type="submit"
            className="mt-4 w-full rounded-full bg-uploc-gold py-5 text-[11px] font-black uppercase tracking-[0.3em] text-uploc-bg transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(197,160,89,0.2)] active:scale-[0.98]"
          >
            Finalizar Cadastro
          </button>
        </form>

        {/* Voltar para Login */}
        <div className="mt-8 text-center">
          <Link 
            href="/login" 
            className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-uploc-gold transition-colors"
          >
            Já possui acesso? <span className="text-uploc-gold font-bold ml-1">Entrar</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
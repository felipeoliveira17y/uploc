import Link from 'next/link'
// Se você já criou a action de login, importe-a aqui:
// import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-uploc-bg overflow-hidden font-sans">
      
      {/* Efeito Aurora (Luzes de fundo desfocadas) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-uploc-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-uploc-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Card Principal com animação de entrada suave */}
      <div className="z-10 w-full max-w-[420px] animate-fade-up rounded-[45px] bg-uploc-card p-12 border border-white/5 shadow-2xl mx-4">
        
        {/* Header Minimalista */}
        <div className="mb-12 text-center uppercase tracking-[0.4em]">
          <h1 className="text-2xl font-light text-white">
            UP<span className="font-bold text-uploc-gold">LOC</span>
          </h1>
          <div className="h-[1px] w-12 bg-uploc-gold mx-auto mt-2 opacity-30"></div>
          <p className="mt-4 text-[9px] text-gray-500 font-bold tracking-[0.2em]">
            Equipamentos Multimídia
          </p>
        </div>

        <form className="space-y-7">
          {/* Campo de E-mail */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-uploc-gold ml-4">
              E-mail
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-full bg-uploc-input border border-white/5 px-7 py-4 text-sm text-white focus:outline-none focus:border-uploc-gold/50 transition-all placeholder:text-gray-600"
              placeholder="usuario@uploc.com"
            />
          </div>

          {/* Campo de Senha */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-uploc-gold ml-4">
              Senha
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-full bg-uploc-input border border-white/5 px-7 py-4 text-sm text-white focus:outline-none focus:border-uploc-gold/50 transition-all placeholder:text-gray-600"
              placeholder="••••••••"
            />
          </div>

          {/* Botão de Entrar */}
          <button 
            type="submit"
            className="mt-6 w-full rounded-full bg-uploc-gold py-5 text-[11px] font-black uppercase tracking-[0.3em] text-uploc-bg transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(197,160,89,0.2)] active:scale-[0.98]"
          >
            Entrar
          </button>
        </form>

        {/* Link para Registro */}
        <div className="mt-12 text-center">
          <Link 
            href="/register" 
            className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-uploc-gold transition-colors"
          >
            Não tem uma conta? Registre-se <span className="text-uploc-gold font-bold ml-1">⮕</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
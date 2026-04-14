'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client' 

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg('Credenciais inválidas.')
      setLoading(false)
    } else {
      const { data: perfil } = await supabase
        .from('perfis')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (perfil?.role === 'admin') router.push('/dashboard/admin')
      else if (perfil?.role === 'funcionario') router.push('/dashboard/funcionario')
      else router.push('/dashboard/cliente')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-uploc-bg overflow-hidden font-sans">

      {/* Efeito Aurora (Luzes de fundo desfocadas) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-uploc-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-uploc-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Card Principal com animação de entrada suave */}
      <div className="z-10 w-full max-w-[420px] animate-fade-up rounded-[45px] bg-uploc-card p-12 border border-white/5 shadow-2xl mx-4 text-white">

        {/* Header Minimalista */}
        <div className="mb-12 text-center uppercase tracking-[0.4em]">
          <h1 className="text-2xl font-light text-white">
            LOGIN <span className="font-bold text-uploc-gold">UPLOC</span>
          </h1>
          <div className="h-[1px] w-12 bg-uploc-gold mx-auto mt-2 opacity-30"></div>
          <p className="mt-4 text-[9px] text-gray-500 font-bold tracking-[0.2em]">
            Equipamentos Multimídia
          </p>
        </div>

        {/* Mensagem de erro caso ocorra */}
        {errorMsg && <p className="text-red-500 text-[10px] mb-4 text-center font-bold uppercase tracking-widest">{errorMsg}</p>}

        <form onSubmit={handleLogin} className="space-y-7">
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
            disabled={loading}
            className="mt-6 w-full rounded-full bg-uploc-gold py-5 text-[11px] font-black uppercase tracking-[0.3em] text-uploc-bg transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(197,160,89,0.2)] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>

        {/* --- OR --- Divider */}
        <div className="relative my-10 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <span className="relative bg-uploc-card px-4 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-600">
            ou acessar com
          </span>
        </div>

        {/* Social Login Buttons */}
        <div className="flex justify-center gap-4">
          <div className="flex justify-center gap-4">
            {/* Google */}
            <button type="button" className="group flex h-12 w-12 items-center justify-center rounded-full bg-uploc-input border border-white/5 transition-all hover:border-uploc-gold/50 hover:scale-110">
              <svg className="h-5 w-5 fill-gray-500 group-hover:fill-uploc-gold transition-colors" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
              </svg>
            </button>

            {/* GitHub */}
            <button type="button" className="group flex h-12 w-12 items-center justify-center rounded-full bg-uploc-input border border-white/5 transition-all hover:border-uploc-gold/50 hover:scale-110">
              <svg className="h-5 w-5 fill-gray-500 group-hover:fill-uploc-gold transition-colors" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </button>

            {/* Facebook */}
            <button type="button" className="group flex h-12 w-12 items-center justify-center rounded-full bg-uploc-input border border-white/5 transition-all hover:border-uploc-gold/50 hover:scale-110">
              <svg className="h-5 w-5 fill-gray-500 group-hover:fill-uploc-gold transition-colors" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Link para Registro */}
        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-uploc-gold transition-colors"
          >
            Não tem uma conta? <span className="text-uploc-gold font-bold ml-1">Registre-se ⮕</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
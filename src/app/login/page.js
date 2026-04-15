'use client'

import { useState } from 'react'
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

    // LÓGICA DE APRESENTAÇÃO: Busca direta na tabela perfis
    // Comparamos o e-mail e a senha que você digitou com o que está no banco
    const { data: usuario, error } = await supabase
      .from('perfis')
      .select('role, nome_completo')
      .eq('email', email)
      .eq('senha', password) // Busca a senha em texto puro na sua tabela
      .single()

    if (error || !usuario) {
      setErrorMsg('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    // REDIRECIONAMENTO POR CARGO (ROLE)
    if (usuario.role === 'admin') {
      router.push('/dashboard/admin')
    } else if (usuario.role === 'professor') {
      router.push('/dashboard/professor')
    } else {
      router.push('/home')
    }

    router.refresh()
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-uploc-bg overflow-hidden font-sans">
      {/* Efeito Aurora */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-uploc-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-uploc-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-[420px] animate-fade-up rounded-[45px] bg-uploc-card p-12 border border-white/5 shadow-2xl mx-4 text-white">
        <div className="mb-12 text-center uppercase tracking-[0.4em]">
          <h1 className="text-2xl font-light text-white">
            LOGIN <span className="font-bold text-uploc-gold">UPLOC</span>
          </h1>
          <div className="h-[1px] w-12 bg-uploc-gold mx-auto mt-2 opacity-30"></div>
          <p className="mt-4 text-[9px] text-zinc-500 font-bold tracking-[0.2em]">
            Equipamentos Multimídia
          </p>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-[10px] mb-6 text-center font-bold uppercase tracking-widest bg-red-500/10 py-2 rounded-full border border-red-500/20">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-7">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-uploc-gold ml-4">
              E-mail
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-full bg-uploc-input border border-white/5 px-7 py-4 text-sm text-white focus:outline-none focus:border-uploc-gold/50 transition-all placeholder:text-zinc-700"
              placeholder="usuario@uploc.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-uploc-gold ml-4">
              Senha
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-full bg-uploc-input border border-white/5 px-7 py-4 text-sm text-white focus:outline-none focus:border-uploc-gold/50 transition-all placeholder:text-zinc-700"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-uploc-gold py-5 text-[11px] font-black uppercase tracking-[0.3em] text-uploc-bg transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(197,160,89,0.2)] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Validando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
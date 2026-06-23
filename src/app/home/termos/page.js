'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#C5A059] selection:text-black overflow-x-hidden">
      
      {/* --- CAMADAS DE FUNDO (Idênticas à Home) --- */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* --- NAVEGAÇÃO --- */}
      <nav className="relative z-50 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tighter"
        >
          <Link href="/">
            UP<span className="text-[#C5A059]">LOC</span>
          </Link>
        </motion.div>

        <div className="hidden lg:flex gap-10 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">
          <Link href="/catalogo" className="hover:text-white transition-colors">Catálogo Geral</Link>
          <a href="#" className="hover:text-white transition-colors">Como Funciona</a>
          <Link href="/termos" className="text-white transition-colors">Termos de Uso</Link>
        </div>

        <Link href="/login">
          <div className="group relative px-6 py-2 overflow-hidden border border-[#C5A059]/30 rounded-full cursor-pointer">
            <span className="relative z-10 text-[10px] uppercase tracking-widest text-[#C5A059] group-hover:text-black transition-colors duration-300">
              Área do Professor
            </span>
            <div className="absolute inset-0 bg-[#C5A059] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
          </div>
        </Link>
      </nav>

      {/* --- CONTEÚDO DOS TERMOS --- */}
      <main className="relative z-10 max-w-3xl mx-auto px-8 pt-12 pb-24">
        
        {/* Cabeçalho do Documento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left"
        >
          <span className="inline-block px-3 py-1 border border-[#C5A059]/20 bg-[#C5A059]/5 text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold rounded-md mb-4">
            Laboratório de Software — Fins Acadêmicos
          </span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">
            Termos de <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C5A059] to-[#8c713d]">Uso</span>
          </h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">Última atualização: Junho de 2026</p>
        </motion.div>

        {/* Corpo do Texto */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-10 text-gray-300 font-light leading-relaxed text-sm bg-[#121212]/40 border border-white/5 p-8 md:p-10 rounded-3xl backdrop-blur-md"
        >
          
          <section className="space-y-3">
            <h3 className="text-[#C5A059] font-bold uppercase tracking-wider text-xs">1. Objeto da Plataforma</h3>
            <p>
              A <b className="text-white">UPLOC</b> é uma ferramenta digital interna desenvolvida exclusivamente como projeto prático para a disciplina de <b>Laboratório de Software</b>. Seu propósito é simular a otimização e o gerenciamento do inventário de equipamentos audiovisuais, de informática e de estúdio da instituição de ensino.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[#C5A059] font-bold uppercase tracking-wider text-xs">2. Elegibilidade e Níveis de Acesso</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li><b className="text-white">Corpo Docente:</b> Possui acesso total ao ecossistema para consultar, agendar e validar a retirada física de itens para aulas e projetos.</li>
              <li><b className="text-white">Alunos e Público Geral:</b> Possuem acesso estrito ao <Link href="/catalogo" className="text-[#C5A059] underline">Modo Consulta</Link>, permitindo a verificação de especificações e status dos equipamentos, sem direito a reserva direta.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-[#C5A059] font-bold uppercase tracking-wider text-xs">3. Responsabilidade e Alocação</h3>
            <p>
              O usuário autenticado que realizar o agendamento assume total responsabilidade pela integridade física, transporte e zelo do equipamento retirado. Qualquer avaria técnica, dano estético ou atraso na devolução deve ser reportado imediatamente à coordenação do laboratório físico da escola.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[#C5A059] font-bold uppercase tracking-wider text-xs">4. Manutenção e Indisponibilidade</h3>
            <p>
              A administração reserva-se o direito de alterar o status de qualquer dispositivo do acervo para <span className="text-orange-400 font-medium">"Em Manutenção"</span> a qualquer momento no painel administrativo, cancelando ou bloqueando reservas futuras para garantir revisões técnicas preventivas.
            </p>
          </section>

          {/* Nota de rodapé acadêmica */}
          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs italic">
              Este documento possui caráter estritamente ilustrativo e fictício, estruturado para fins de avaliação e defesa de projeto acadêmico de software.
            </p>
          </div>

        </motion.div>

        {/* Botão de Retorno rápido */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Link href="/">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#C5A059] transition-colors cursor-pointer">
              ← Voltar para a Home
            </span>
          </Link>
        </motion.div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="px-8 py-8 border-t border-white/5 flex justify-between items-center relative z-10 bg-[#0A0A0A]">
        <div className="text-[9px] text-gray-600 tracking-[0.4em] uppercase font-medium mx-auto md:mx-0">
          © 2026 UPLOC — Disciplina de Laboratório de Software
        </div>
      </footer>
    </div>
  );
}
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#C5A059] selection:text-black overflow-x-hidden">
      
      {/* --- CAMADAS DE FUNDO (Idênticas ao resto do app) --- */}
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
          <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
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

      {/* --- CONTEÚDO DA PRIVACIDADE --- */}
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
            Política de <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C5A059] to-[#8c713d]">Privacidade</span>
          </h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">Escopo de Simulação de Dados</p>
        </motion.div>

        {/* Corpo do Texto */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-10 text-gray-300 font-light leading-relaxed text-sm bg-[#121212]/40 border border-white/5 p-8 md:p-10 rounded-3xl backdrop-blur-md"
        >
          
          <section className="space-y-3">
            <h3 className="text-[#C5A059] font-bold uppercase tracking-wider text-xs">1. Coleta Mínima de Dados</h3>
            <p>
              Para fins de simulação nesta disciplina de desenvolvimento, a plataforma <b className="text-white">UPLOC</b> processa apenas os dados estritamente necessários para autenticação e vinculação de reservas, limitando-se ao número de identificação funcional (<b className="text-white">RA / Matrícula</b>) e nome do docente.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[#C5A059] font-bold uppercase tracking-wider text-xs">2. Armazenamento e Segurança (Supabase)</h3>
            <p>
              As informações coletadas são armazenadas de forma segura em instâncias de teste do banco de dados <b>Supabase</b>. Os registros de transações de dados e uploads de imagens contam com criptografia nativa da infraestrutura de nuvem utilizada no projeto acadêmico.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[#C5A059] font-bold uppercase tracking-wider text-xs">3. Compartilhamento de Informações</h3>
            <p>
              Por se tratar de um ambiente experimental de software de gerenciamento interno, nenhum dado inserido na plataforma é compartilhado com parceiros comerciais, terceiros ou utilizado para fins de rastreamento de anúncios e marketing.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[#C5A059] font-bold uppercase tracking-wider text-xs">4. Retenção e Exclusão</h3>
            <p>
              Todos os dados fictícios e registros de testes gerados na plataforma durante o semestre letivo serão permanentemente deletados do banco de dados logo após a banca avaliadora e a conclusão da disciplina de Laboratório de Software.
            </p>
          </section>

          {/* Nota de rodapé acadêmica */}
          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs italic">
              Esta política foi criada puramente para simular conformidade com boas práticas de privacidade (LGPD) no escopo de um projeto acadêmico escolar.
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
          © 2026 UPLOC — Política Demonstrativa de Privacidade
        </div>
      </footer>
    </div>
  );
}
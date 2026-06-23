'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ComoFuncionaPage() {
  const passos = [
    {
      numero: "01",
      titulo: "Consulta Pública",
      descricao: "Alunos e professores navegam pelo catálogo digital para verificar em tempo real quais equipamentos estão disponíveis ou em manutenção preventiva."
    },
    {
      numero: "02",
      titulo: "Autenticação Docente",
      descricao: "O professor realiza o login na plataforma utilizando suas credenciais institucionais (RA/Matrícula) para liberar a camada de agendamentos."
    },
    {
      numero: "03",
      titulo: "Reserva Digital",
      descricao: "Dentro do painel, o docente seleciona o dia, horário e o equipamento desejado. O sistema bloqueia automaticamente o item para evitar conflitos."
    },
    {
      numero: "04",
      titulo: "Retirada Física",
      descricao: "Na data agendada, o professor comparece ao laboratório físico da escola. A equipe técnica valida o status no painel e entrega o equipamento pronto para uso."
    }
  ];

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
          <Link href="/home/catalogo" className="hover:text-white transition-colors">Catálogo Geral</Link>
          <Link href="/home/como-funciona" className="text-white transition-colors">Como Funciona</Link>
          <Link href="/home/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
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

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="relative z-10 max-w-5xl mx-auto px-8 pt-12 pb-24">
        
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <span className="inline-block px-3 py-1 border border-[#C5A059]/20 bg-[#C5A059]/5 text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold rounded-md mb-4">
            Fluxo de Operação do Ecossistema
          </span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
            Simples. Digital. <br />
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C5A059] to-[#8c713d]">
              Sem Burocracia.
            </span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto font-light leading-relaxed">
            Entenda como a UPLOC transforma o almoxarifado físico tradicional em uma vitrine digital de alta performance.
          </p>
        </motion.div>

        {/* Linha do Tempo / Grid de Passos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {passos.map((passo, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#121212]/40 border border-white/5 p-8 rounded-3xl backdrop-blur-md relative group hover:border-[#C5A059]/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl font-black text-[#C5A059]/20 group-hover:text-[#C5A059]/40 transition-colors duration-300 mb-4 font-mono">
                  {passo.numero}
                </div>
                <h3 className="text-white font-bold text-lg tracking-wide mb-2">
                  {passo.titulo}
                </h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">
                  {passo.descricao}
                </p>
              </div>
              
              <div className="w-full h-[1px] bg-gradient-to-r from-[#C5A059]/10 to-transparent mt-6" />
            </motion.div>
          ))}
        </div>

        {/* Botão de chamada para ação de volta para a home */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link href="/home/catalogo">
            <button className="bg-[#C5A059] text-black px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(197,160,89,0.1)] hover:scale-105 transition-transform">
              Explorar Catálogo Agora
            </button>
          </Link>
        </motion.div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="px-8 py-8 border-t border-white/5 flex justify-between items-center relative z-10 bg-[#0A0A0A]">
        <div className="text-[9px] text-gray-600 tracking-[0.4em] uppercase font-medium mx-auto md:mx-0">
          © 2026 UPLOC — Laboratório de Software
        </div>
      </footer>
    </div>
  );
}
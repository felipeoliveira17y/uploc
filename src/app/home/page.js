"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PresentationPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#C5A059] selection:text-black overflow-x-hidden">
      
      {/* --- CAMADAS DE FUNDO --- */}
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
          <a href="#" className="hover:text-white transition-colors">Catálogo Profissional</a>
          <a href="#" className="hover:text-white transition-colors">Como Funciona</a>
          <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
        </div>

        <Link href="/login">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative px-6 py-2 overflow-hidden border border-[#C5A059]/30 rounded-full cursor-pointer"
          >
            <span className="relative z-10 text-[10px] uppercase tracking-widest text-[#C5A059] group-hover:text-black transition-colors duration-300">
              Área do Professor
            </span>
            <div className="absolute inset-0 bg-[#C5A059] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
          </motion.div>
        </Link>
      </nav>

      {/* --- CONTEÚDO PRINCIPAL (HERO) --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-12 pb-24 grid lg:grid-cols-12 gap-16 items-center">
        
        <div className="lg:col-span-7 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-3 py-1 border border-[#C5A059]/20 bg-[#C5A059]/5 text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold rounded-md mb-6">
              Infraestrutura Acadêmica de Elite
            </span>
            <h1 className="text-5xl md:text-7xl font-light leading-[1.1] tracking-tight">
              Onde sua visão <br />
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C5A059] to-[#8c713d]">
                ganha forma.
              </span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg max-w-xl font-light leading-relaxed"
          >
            A <b>UP<span className="text-white">LOC</span></b> é o ecossistema digital que remove as barreiras entre o professor e o equipamento profissional. Cinema, áudio e estúdio a um clique de distância.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-6"
          >
            <button className="bg-[#C5A059] text-black px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(197,160,89,0.2)] hover:scale-105 transition-transform">
              Ver Catálogo
            </button>
            <button className="border border-white/10 bg-white/5 backdrop-blur-md text-white px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">
              Como Funciona
            </button>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.8 }}
             className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5"
          >
            <div>
              <div className="text-2xl font-bold">150+</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500">Itens Ativos</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24h</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500">Fluxo de Reserva</div>
            </div>
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500">Digitalizado</div>
            </div>
          </motion.div>
        </div>

        {/* --- CARD DE DESTAQUE COM IMAGEM --- */}
        <div className="lg:col-span-5 relative group">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 bg-gradient-to-br from-[#161616] to-[#0d0d0d] border border-white/10 p-2 rounded-[2rem] shadow-3xl transform rotate-3 hover:rotate-0 transition-transform duration-700 overflow-hidden"
          >
            <div className="overflow-hidden rounded-[1.8rem] aspect-[4/5] bg-neutral-900 flex flex-col items-center justify-end text-center relative">
               
               {/* Imagem de Fundo (public/som.jpeg) */}
               <img 
                 src="/som.jpg" 
                 alt="Equipamento de Som Profissional" 
                 className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000"
               />

               {/* Gradiente de Overlay para legibilidade */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />

               {/* Conteúdo do Card */}
               <div className="relative z-20 p-10">
                  <span className="inline-block mb-3 px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full text-[#C5A059] text-[9px] font-black uppercase tracking-[0.2em]">
                    Destaque da Semana
                  </span>
                  <h4 className="text-white text-2xl font-bold italic tracking-tight mb-2">
                    Caixa de som
                  </h4>
                  <p className="text-gray-400 text-xs mb-6 font-light">
                   Som de alta qualidade, caixa com acesso Bluetooth
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 text-green-500 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full border border-green-500/20">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Disponível agora
                  </div>
               </div>
            </div>
          </motion.div>
          
          {/* Elementos Decorativos */}
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 border-r border-t border-[#C5A059]/20 rounded-tr-3xl" />
          <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 border-l border-b border-[#C5A059]/20 rounded-bl-3xl" />
        </div>

      </main>

      <footer className="px-8 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 bg-[#0A0A0A]">
        <div className="text-[9px] text-gray-600 tracking-[0.4em] uppercase font-medium">
          © 2026 UPLOC — Tecnologia para o Futuro do Audiovisual
        </div>
        <div className="flex gap-6 text-[9px] uppercase tracking-widest text-gray-500">
          <span className="hover:text-white cursor-pointer">Privacidade</span>
          <span className="hover:text-white cursor-pointer">Suporte Técnico</span>
        </div>
      </footer>

      <AnimatePresence>
        <IntroNotification />
      </AnimatePresence>
    </div>
  );
}

function IntroNotification() {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="fixed bottom-10 right-10 z-[100] w-80 px-4 sm:px-0"
    >
      <div className="bg-white text-black p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-neutral-200">
        <div className="flex justify-between items-start mb-4">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-[10px] font-black">UP</div>
          <button onClick={() => setShow(false)} className="text-gray-300 hover:text-black transition-colors">✕</button>
        </div>
        <h5 className="font-bold text-sm mb-2 tracking-tight text-neutral-900">Pronto para começar?</h5>
        <p className="text-xs text-neutral-500 leading-relaxed mb-5">
          Utilize seu RA de estudante para acessar o inventário completo da escola e agendar seus equipamentos.
        </p>
        
        <Link href="/login">
          <button className="w-full bg-black text-white py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95 text-center block">
            Fazer Login Agora
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
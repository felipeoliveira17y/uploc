"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#0D0D0D] text-white">
      
      {/* NAV */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-white/5">
        <div className="text-xl font-bold tracking-tighter">
          UP<span className="text-[#C5A059]">LOC</span>
        </div>

        <div className="hidden md:flex gap-6 text-xs uppercase tracking-widest text-gray-400">
          <a href="#" className="hover:text-[#C5A059]">Câmeras</a>
          <a href="#" className="hover:text-[#C5A059]">Iluminação</a>
          <a href="#" className="hover:text-[#C5A059]">Áudio</a>
        </div>

        <button className="px-4 py-2 border border-[#C5A059] text-[#C5A059] text-[10px] uppercase tracking-widest hover:bg-[#C5A059] hover:text-black transition">
          Conta
        </button>
      </nav>

      {/* HERO */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">

          {/* TEXTO */}
          <div className="space-y-8">
            
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
              A TECNOLOGIA DA ESCOLA <br />
              <span className="text-[#C5A059]">AO SEU ALCANCE</span>
            </h1>

            <p className="text-gray-400 text-base max-w-md leading-relaxed">
              Reserve equipamentos multimídia com rapidez, organização e controle em tempo real.
            </p>

            <div className="flex gap-4">
              <button className="bg-[#C5A059] text-black px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition">
                Agendar
              </button>

              <button className="border border-white/20 px-8 py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-white/5 transition">
                Ver
              </button>
            </div>

            {/* 🔥 CATEGORIAS LARGAS */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <CategoryMini title="Cinema" />
              <CategoryMini title="Estúdio" />
              <CategoryMini title="Som" />
            </div>
          </div>

          {/* VISUAL */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="w-64 h-64 bg-[#161616] rounded-3xl flex items-center justify-center text-7xl shadow-2xl transition-transform duration-500 group-hover:scale-105">
                📽️
              </div>

              <div className="absolute inset-0 bg-[#C5A059] blur-3xl opacity-10 scale-110 -z-10" />
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-[10px] py-3 text-gray-600 border-t border-white/5">
        © 2026 UPLOC MULTIMÍDIA
      </footer>

      <FloatingIntroCard />
    </div>
  );
}

// --- CARD FLUTUANTE ---
function FloatingIntroCard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[90vw]"
        >
          <div className="bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-2xl">
            
            <h3 className="text-base uppercase tracking-widest text-[#C5A059] font-bold mb-3">
              Bem-vindo ao UPLOC
            </h3>

            <p className="text-gray-300 text-base leading-relaxed mb-6">
              Plataforma inteligente para reserva de equipamentos multimídia escolares, com controle em tempo real, organização e praticidade para seus projetos.
            </p>

            <button
              onClick={() => setVisible(false)}
              className="text-xs uppercase tracking-widest text-[#C5A059] hover:underline"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- CATEGORIA MINI (ATUALIZADA) ---
function CategoryMini({ title }) {
  return (
    <div className="w-full bg-[#161616] border border-white/5 rounded-xl py-3 text-center text-xs uppercase tracking-widest text-gray-300 hover:border-[#C5A059]/50 hover:bg-[#1a1a1a] transition cursor-pointer">
      {title}
    </div>
  );
}
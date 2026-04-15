// app/page.js
import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white selection:bg-[#C5A059] selection:text-black">
      
      {/* --- NAVEGAÇÃO --- */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-white/5">
        <div className="text-2xl font-bold tracking-tighter">
          UP<span className="text-[#C5A059]">LOC</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-gray-400">
          <a href="#" className="hover:text-[#C5A059] transition-colors">Câmeras</a>
          <a href="#" className="hover:text-[#C5A059] transition-colors">Iluminação</a>
          <a href="#" className="hover:text-[#C5A059] transition-colors">Áudio</a>
        </div>
        <button className="px-6 py-2 border border-[#C5A059] text-[#C5A059] text-xs uppercase tracking-[0.2em] hover:bg-[#C5A059] hover:text-black transition-all duration-300">
          Acessar Conta
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C5A059] opacity-[0.05] blur-[120px] rounded-full -mr-48 -mt-48" />

        <div className="max-w-7xl mx-auto px-8 py-20 md:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C5A059]/10 border border-[#C5A059]/20">
                <span className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.2em]">
                  Portal de Multimídia Escolar
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                A TECNOLOGIA DA ESCOLA <br />
                <span className="text-[#C5A059]">AO SEU ALCANCE.</span>
              </h1>

              <p className="text-gray-400 text-lg md:text-xl max-w-xl font-light">
                O equipamento que você precisa para o seu projeto, reservado em um clique. 
                Organize suas apresentações com a melhor infraestrutura da instituição.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <button className="w-full sm:w-auto bg-[#C5A059] text-black px-10 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all transform hover:scale-105 shadow-[0_10px_20px_-10px_rgba(197,160,89,0.5)]">
                  Fazer Agendamento
                </button>
                <button className="w-full sm:w-auto bg-transparent text-white border border-white/20 px-10 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-all">
                  Ver Disponibilidade
                </button>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="relative group">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-[#161616] rounded-3xl border border-white/10 flex items-center justify-center p-8 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-2xl">
                  <span className="text-8xl drop-shadow-lg opacity-80 group-hover:opacity-100 transition-opacity">📽️</span>
                  <div className="absolute -bottom-4 -right-4 bg-[#C5A059] text-black px-4 py-2 rounded-lg font-bold text-xs">
                    SISTEMA ATIVO
                  </div>
                </div>
                <div className="absolute inset-0 bg-[#C5A059] -z-10 blur-3xl opacity-10 scale-110" />
              </div>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Feature icon="🕒" title="Tempo Real" desc="Status da reserva agora" />
            <Feature icon="📅" title="Agendamento" desc="Escolha o melhor horário" />
            <Feature icon="🛡️" title="Segurança" desc="Equipamentos revisados" />
            <Feature icon="🎓" title="Acadêmico" desc="Uso exclusivo escolar" />
          </div>
        </div>
      </section>

      {/* --- CATEGORIAS EM DESTAQUE --- */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-10 tracking-tight text-[#C5A059]">Explorar por categoria</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <CategoryCard 
            title="Cinema" 
            subtitle="Câmeras & Lentes" 
            imageUrl="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800" 
          />
          <CategoryCard 
            title="Estúdio" 
            subtitle="Iluminação Profissional" 
            imageUrl="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800" 
          />
          <CategoryCard 
            title="Som" 
            subtitle="Áudio de Alta Fidelidade" 
            imageUrl="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800" 
          />

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-[10px] tracking-[0.4em] text-gray-600 uppercase">
          © 2026 UPLOC MULTIMÍDIA PREMIUM
        </p>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTES ---

function Feature({ icon, title, desc }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-2xl flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h4 className="text-white text-xs font-bold uppercase tracking-tighter">{title}</h4>
        <p className="text-gray-500 text-[10px]">{desc}</p>
      </div>
    </div>
  );
}

function CategoryCard({ title, subtitle, imageUrl }) {
  return (
    <div className="group relative overflow-hidden bg-[#161616] aspect-[4/5] flex flex-col justify-end p-8 border border-white/5 hover:border-[#C5A059]/50 transition-all cursor-pointer rounded-2xl">
      <div className="absolute inset-0 z-0">
        <img 
          src={imageUrl} 
          alt={subtitle} 
          className="w-full h-full object-cover opacity-50 group-hover:scale-110 group-hover:opacity-70 transition-all duration-700"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
      <div className="relative z-20">
        <span className="text-[#C5A059] text-xs tracking-widest uppercase mb-2 block font-bold">
          {title}
        </span>
        <h3 className="text-2xl font-semibold tracking-wide text-white">
          {subtitle}
        </h3>
        <div className="h-1 w-0 group-hover:w-12 bg-[#C5A059] transition-all duration-500 mt-2" />
        <p className="text-gray-400 text-sm mt-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">
          Ver disponibilidade →
        </p>
      </div>
    </div>
  );
}
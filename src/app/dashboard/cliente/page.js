'use client';
import React, { useState } from 'react';

const EQUIPAMENTOS = [
  // MULTIMÍDIA
  { id: 1, nome: "Projetor (Data Show)", marca: "Epson", categoria: "Multimídia", imagem: "https://images.unsplash.com/photo-1535016120720-40c646bebbbb?w=400", disponivel: true },
  { id: 2, nome: "Cabo HDMI (5 metros)", marca: "Generic", categoria: "Multimídia", imagem: "https://images.unsplash.com/photo-1620215175664-cb91605e769d?w=400", disponivel: true },
  { id: 3, nome: "Adaptador VGA para HDMI", marca: "MD9", categoria: "Multimídia", imagem: "https://images.unsplash.com/photo-1629739683367-9615629478f7?w=400", disponivel: true },
  { id: 4, nome: "Caixa de Som USB", marca: "Logitech", categoria: "Multimídia", imagem: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400", disponivel: true },
  { id: 5, nome: "Controle Ar Condicionado", marca: "Consul/Gree", categoria: "Multimídia", imagem: "https://images.unsplash.com/photo-1634148450143-6903264c76b1?w=400", disponivel: false },

  // INFORMÁTICA
  { id: 6, nome: "Notebook do Professor", marca: "Dell/Positivo", categoria: "Informática", imagem: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400", disponivel: true },
  { id: 7, nome: "Mouse Óptico USB", marca: "Multilaser", categoria: "Informática", imagem: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400", disponivel: true },
  { id: 8, nome: "Teclado ABNT2", marca: "Logitech", categoria: "Informática", imagem: "https://images.unsplash.com/photo-1587829741301-dc798b83aca1?w=400", disponivel: true },
  { id: 9, nome: "Pendrive 32GB", marca: "SanDisk", categoria: "Informática", imagem: "https://images.unsplash.com/photo-1622535260184-48610023024c?w=400", disponivel: true },
  { id: 10, nome: "Estabilizador", marca: "SMS", categoria: "Informática", imagem: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=400", disponivel: true },

  // LABORATÓRIO / APOIO
  { id: 11, nome: "Microscópio Escolar", marca: "Global", categoria: "Laboratório", imagem: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=400", disponivel: true },
  { id: 12, nome: "Lupa de Mão", marca: "Western", categoria: "Laboratório", imagem: "https://images.unsplash.com/photo-1453723490680-8902ff3d1915?w=400", disponivel: true },
  { id: 13, nome: "Globo Terrestre", marca: "Libreria", categoria: "Laboratório", imagem: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400", disponivel: true },
  { id: 14, nome: "Mapa do Ceará (Político)", marca: "Multimap", categoria: "Laboratório", imagem: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400", disponivel: true },
  { id: 15, nome: "Cronômetro Digital", marca: "Casio", categoria: "Laboratório", imagem: "https://images.unsplash.com/photo-1518153444641-f6746816999a?w=400", disponivel: true },

  // ÁUDIO / EVENTOS
  { id: 16, nome: "Microfone com Fio", marca: "Shure", categoria: "Áudio", imagem: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400", disponivel: true },
  { id: 17, nome: "Pedestal de Microfone", marca: "RMV", categoria: "Áudio", imagem: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400", disponivel: true },
  { id: 18, nome: "Megafone Portátil", marca: "Vonder", categoria: "Áudio", imagem: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=400", disponivel: true },
  { id: 19, nome: "Extensão Elétrica (10m)", marca: "Daneva", categoria: "Áudio", imagem: "https://images.unsplash.com/photo-1558537348-c0f8e733989d?w=400", disponivel: true },
  { id: 20, nome: "Caixa de Som Portátil", marca: "JBL", categoria: "Áudio", imagem: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400", disponivel: false }
];

const CATEGORIAS = ['Todos', 'Multimídia', 'Informática', 'Laboratório', 'Áudio'];

export default function TelaLocacaoEscolar() {
  const [abaAtiva, setAbaAtiva] = useState('Todos');

  const handleReservar = (nome) => {
    alert(`Pedido de reserva registrado: ${nome}. Retire na coordenação.`);
  };

  const itensFiltrados = abaAtiva === 'Todos' 
    ? EQUIPAMENTOS 
    : EQUIPAMENTOS.filter(item => item.categoria === abaAtiva);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* HEADER */}
      <header className="bg-[#222222] text-white sticky top-0 z-50 shadow-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold tracking-tight uppercase">
              UPLOC <span className="text-[#d1a661]">CEARÁ</span>
            </div>
            <div className="hidden sm:block text-[9px] text-gray-500 font-bold uppercase border-l border-white/10 pl-4 tracking-widest leading-tight">
              SISTEMA DE <br/> RESERVA ESCOLAR
            </div>
          </div>
          <div className="w-10 h-10 bg-[#d1a661] rounded-full flex items-center justify-center text-black font-bold">
            PR
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white uppercase tracking-[0.2em]">Material <span className="text-[#d1a661]">Pedagógico</span></h1>
          <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-widest font-medium">Equipamentos para uso exclusivo em sala de aula</p>
        </div>

        {/* NAVEGAÇÃO POR ABAS */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar border-b border-white/5">
          {CATEGORIAS.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setAbaAtiva(cat)}
              className={`whitespace-nowrap px-8 py-4 rounded-t-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                abaAtiva === cat 
                ? 'bg-[#d1a661] text-black' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID DE ITENS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {itensFiltrados.map((item) => (
            <div key={item.id} className="bg-[#222222] rounded-3xl border border-white/5 overflow-hidden hover:border-[#d1a661]/40 transition-all duration-500 flex flex-col group">
              <div className="relative h-40 overflow-hidden bg-[#1a1a1a]">
                <img 
                  src={item.imagem} 
                  alt={item.nome} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                {!item.disponivel && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-black text-[9px] px-3 py-1 bg-red-600 rounded-full uppercase tracking-tighter">Em Uso</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest opacity-70">{item.categoria}</span>
                  <h3 className="font-bold text-sm mt-1 text-white uppercase tracking-tight line-clamp-1 leading-snug">{item.nome}</h3>
                  <p className="text-[10px] text-gray-500 font-medium uppercase mt-2">{item.marca}</p>
                </div>
                
                <button 
                  onClick={() => handleReservar(item.nome)}
                  disabled={!item.disponivel}
                  className={`w-full mt-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                    item.disponivel 
                    ? 'bg-[#d1a661] text-black hover:bg-[#b88e4b]' 
                    : 'bg-white/5 text-gray-700 cursor-not-allowed'
                  }`}
                >
                  {item.disponivel ? 'Reservar' : 'Ocupado'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
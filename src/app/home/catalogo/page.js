'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function CatalogoPage() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [busca, setBusca] = useState('');
  const [categoriaFiltrada, setCategoriaFiltrada] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Buscar itens do banco de dados
  async function carregarCatalogo() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('equipamentos')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setEquipamentos(data || []);
    } catch (err) {
      console.error('Erro ao carregar catálogo:', err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCatalogo();
  }, []);

  const categorias = ['Todos', 'Laboratório', 'Multimídia', 'Informática', 'Fotografia', 'Áudio', 'Vídeo'];

  const itensFiltrados = equipamentos.filter(item => {
    const nome = item.nome || "";
    const marca = item.marca || "";
    const modelo = item.modelo || "";
    const termo = `${nome} ${marca} ${modelo}`.toLowerCase();
    
    const passaBusca = termo.includes(busca.toLowerCase());
    const passaCategoria = categoriaFiltrada === '' || categoriaFiltrada === 'Todos' || item.categoria === categoriaFiltrada;

    return passaBusca && passaCategoria;
  });

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
          <Link href="/catalogo" className="text-white transition-colors">Catálogo Geral</Link>
          <a href="#" className="hover:text-white transition-colors">Como Funciona</a>
          <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
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

      {/* --- CORPO PRINCIPAL --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-6 pb-24">
        
        {/* TÍTULO DA PÁGINA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <span className="inline-block px-3 py-1 border border-[#C5A059]/20 bg-[#C5A059]/5 text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold rounded-md mb-4">
            Consulta de Acervo Acadêmico
          </span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">
            Catálogo de <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C5A059] to-[#8c713d]">Equipamentos</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">Modo Consulta (Apenas Visualização)</p>
        </motion.div>

        {/* BARRA DE FILTROS */}
        <section className="mb-12 bg-[#121212]/60 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 backdrop-blur-md">
          <div className="w-full md:flex-1">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C5A059] mb-2 block ml-1">O que você procura?</label>
            <input 
              type="text" 
              placeholder="Ex: Câmera Sony, Microfone Lapela..." 
              value={busca} 
              onChange={(e) => setBusca(e.target.value)} 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C5A059]/50 placeholder:text-zinc-600 transition-colors h-[48px]" 
            />
          </div>

          <div className="w-full md:w-[280px]">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C5A059] mb-2 block ml-1">Filtrar Categoria</label>
            <select 
              value={categoriaFiltrada} 
              onChange={(e) => setCategoriaFiltrada(e.target.value)}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-[#C5A059]/50 transition-colors cursor-pointer h-[48px] appearance-none"
            >
              {categorias.map(cat => (
                <option key={cat} value={cat === 'Todos' ? '' : cat} className="bg-[#0A0A0A] text-white">{cat}</option>
              ))}
            </select>
          </div>
        </section>

        {/* GRID DE COMPONENTES */}
        {loading ? (
          <div className="p-20 text-center text-[#C5A059] font-bold uppercase text-xs tracking-[0.3em] animate-pulse">
            Carregando Acervo Digital...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {itensFiltrados.map((item) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-[#141414] to-[#0D0D0D] border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-[#C5A059]/30 transition-all flex flex-col group relative"
              >
                {/* CONTAINER DA IMAGEM */}
                <div className="w-full h-48 bg-neutral-900 relative overflow-hidden flex-shrink-0 border-b border-white/5">
                  <img 
                    src={item.imagem || 'https://via.placeholder.com/400x300?text=Sem+Foto'} 
                    alt={item.nome}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                  
                  {/* TAG DE STATUS */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-md ${
                      item.status === 'manutencao' 
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>
                      {item.status === 'manutencao' ? 'Em Manutenção' : 'Disponível'}
                    </span>
                  </div>
                </div>

                {/* DETALHES DO PRODUTO */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-black/20">
                  <div>
                    <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-[0.2em] block mb-1">
                      {item.categoria || 'Geral'}
                    </span>
                    <h3 className="text-white font-bold text-base leading-snug tracking-wide group-hover:text-[#C5A059] transition-colors">
                      {item.nome}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 font-light">
                      {item.marca} {item.modelo ? `• ${item.modelo}` : ''}
                    </p>
                  </div>

                  {/* ESTADO DE CONSERVAÇÃO */}
                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] uppercase font-bold text-gray-400 tracking-widest">
                    <span>Condição:</span>
                    <span className="text-gray-300 font-normal">{item.estado_conservacao || 'Excelente'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* FEEDBACK CASO VAZIO */}
        {!loading && itensFiltrados.length === 0 && (
          <div className="p-20 text-center bg-[#111] rounded-2xl border border-white/5 text-gray-500 font-bold uppercase text-xs tracking-widest">
            Nenhum equipamento foi encontrado para os termos filtrados.
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="px-8 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 bg-[#0A0A0A]">
        <div className="text-[9px] text-gray-600 tracking-[0.4em] uppercase font-medium">
          © 2026 UPLOC — Tecnologia para o Futuro do Audiovisual
        </div>
      </footer>
    </div>
  );
}
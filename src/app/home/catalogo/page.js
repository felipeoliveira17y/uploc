'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CATEGORIAS = ['Todos', 'Laboratório', 'Multimídia', 'Informática', 'Fotografia', 'Áudio'];

export default function TelaCatalogoDemonstrativo() {
  const supabase = createClient();
  const router = useRouter();

  const [equipamentos, setEquipamentos] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  // BUSCAR EQUIPAMENTOS DO BANCO
  async function fetchEquipamentos() {
    setLoading(true);
    const { data, error } = await supabase
      .from('equipamentos')
      .select('*')
      .order('nome', { ascending: true });

    if (!error) setEquipamentos(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  const itensFiltrados = abaAtiva === 'Todos'
    ? equipamentos
    : equipamentos.filter(item => item.categoria === abaAtiva);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#C5A059] selection:text-black overflow-x-hidden font-sans">
      
      {/* --- CAMADAS DE FUNDO INSTITUCIONAIS --- */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* HEADER PREMIUM */}
      <header className="relative z-40 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter">
            UP<span className="text-[#C5A059]">LOC</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Modo Simulação</p>
              <p className="text-xs text-zinc-500">Acesso de Consulta</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#C5A059]/20 to-[#8c713d]/20 rounded-full flex items-center justify-center text-[#C5A059] font-black text-xs border border-[#C5A059]/30">
              EA
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        
        {/* TÍTULO E BOTÃO VOLTAR */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => router.push('/home')} 
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#121212] border border-white/5 text-zinc-400 hover:text-[#C5A059] hover:border-[#C5A059]/30 transition-all text-sm backdrop-blur-md"
              title="Voltar para a Home"
            >
              ←
            </button>
            <div>
              <span className="block text-[9px] font-black uppercase text-[#C5A059] tracking-[0.3em] mb-1">Visualização do Acervo</span>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight">
                Catálogo de <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#C5A059]">Equipamentos</span>
              </h1>
            </div>
          </div>
        </motion.div>

        {/* ABAS DE CATEGORIAS */}
        <div className="flex gap-2 mb-10 overflow-x-auto border-b border-white/5 no-scrollbar">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setAbaAtiva(cat)}
              className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap relative ${
                abaAtiva === cat ? 'text-[#C5A059]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {cat}
              {abaAtiva === cat && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]" />
              )}
            </button>
          ))}
        </div>

        {/* GRID DE EQUIPAMENTOS */}
        {loading ? (
          <div className="text-center py-24 text-[#C5A059] animate-pulse font-black uppercase tracking-[0.2em] text-xs">
            Carregando inventário acadêmico...
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {itensFiltrados.map((item) => (
              <motion.div
                layout 
                key={item.id}
                whileHover={{ y: -6 }}
                onClick={() => setItemSelecionado(item)}
                className="bg-[#121212]/50 rounded-[2rem] border border-white/5 overflow-hidden group cursor-pointer hover:border-[#C5A059]/20 transition-all duration-300 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-neutral-900/50 flex items-center justify-center overflow-hidden border-b border-white/5">
                    {item.imagem ? (
                      <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" />
                    ) : (
                      <div className="text-zinc-600 font-bold text-[10px] uppercase tracking-widest italic">Sem Imagem</div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black uppercase border border-white/10 text-[#C5A059] tracking-wider">
                        {item.categoria}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 pb-0">
                    <h3 className="font-bold text-base text-white tracking-tight line-clamp-2 group-hover:text-[#C5A059] transition-colors duration-300 min-h-[3rem]">
                      {item.nome}
                    </h3>
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mt-2 truncate">
                      {item.marca && item.modelo ? `${item.marca} • ${item.modelo}` : 'Especificação Técnica'}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-[8px] font-mono font-bold text-zinc-500 tracking-wider">
                      {item.patrimonio ? `PAT: ${item.patrimonio}` : 'SIMULAÇÃO'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{item.estado_conservacao || 'Disponível'}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* MODAL EXCLUSIVO DE VISUALIZAÇÃO E ESPECIFICAÇÕES */}
      <AnimatePresence>
        {itemSelecionado && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-[#121212] w-full max-w-xl rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="h-48 bg-neutral-900 relative border-b border-white/5">
                {itemSelecionado.imagem && <img src={itemSelecionado.imagem} className="w-full h-full object-cover opacity-30" alt="" />}
                <button onClick={() => setItemSelecionado(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center border border-white/10 hover:bg-[#C5A059] hover:text-black transition-all z-20 text-xs">✕</button>
                <div className="absolute bottom-4 left-8 z-10">
                  <span className="px-3 py-1 bg-[#C5A059] rounded-md text-[8px] font-black uppercase text-black tracking-widest">{itemSelecionado.categoria}</span>
                </div>
              </div>

              <div className="p-8 md:p-10 pt-6 relative z-10">
                <span className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-1">Visualização do Dispositivo</span>
                <h2 className="text-white text-3xl font-light tracking-tight mb-6">
                  <span className="font-black text-[#C5A059]">{itemSelecionado.nome}</span>
                </h2>
                
                {/* BLOCo DE ESPECIFICAÇÕES DETALHADAS */}
                <div className="p-6 bg-black/40 rounded-2xl border border-white/5 grid grid-cols-2 gap-x-6 gap-y-4 text-xs font-light text-zinc-300">
                  <div>
                    <span className="text-zinc-500 font-bold uppercase block text-[8px] tracking-widest mb-1">Marca / Fabricante</span> 
                    <span className="font-medium text-white">{itemSelecionado.marca || 'Não informada'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-bold uppercase block text-[8px] tracking-widest mb-1">Modelo Comercial</span> 
                    <span className="font-medium text-white">{itemSelecionado.modelo || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-bold uppercase block text-[8px] tracking-widest mb-1">Código de Patrimônio</span> 
                    <span className="font-mono font-bold text-white">{itemSelecionado.patrimonio || 'Simulado'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-bold uppercase block text-[8px] tracking-widest mb-1">Nº de Série Técnico</span> 
                    <span className="font-mono text-zinc-400">{itemSelecionado.numero_serie || '—'}</span>
                  </div>
                  <div className="col-span-2 border-t border-white/5 pt-4">
                    <span className="text-zinc-500 font-bold uppercase block text-[8px] tracking-widest mb-1">Status Operacional</span> 
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      <span className="text-green-400 font-bold uppercase text-[10px] tracking-wider">Disponível para Alocação (Produção)</span>
                    </div>
                  </div>
                  
                  {itemSelecionado.observacoes && (
                    <div className="col-span-2 border-t border-white/5 pt-4">
                      <span className="text-zinc-500 font-bold uppercase block text-[8px] tracking-widest mb-1">Notas de Configuração</span>
                      <p className="text-zinc-400 italic text-[11px] leading-relaxed font-light">{itemSelecionado.observacoes}</p>
                    </div>
                  )}
                </div>

                {/* Nota informativa de rodapé do modal */}
                <p className="text-center text-zinc-600 text-[10px] mt-8 tracking-wide italic">
                  * Agendamentos reais exigem autenticação do corpo docente na Área do Professor.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
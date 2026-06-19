'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const CATEGORIAS = ['Todos', 'Laboratório', 'Multimídia', 'Informática', 'Fotografia', 'Áudio'];
const HORARIOS = ['07:30 - 08:20', '08:20 - 09:10', '09:20 - 10:10', '10:10 - 11:00', '13:30 - 14:20', '14:20 - 15:10'];

export default function TelaLocacaoEscolar() {
  const supabase = createClient();
  const router = useRouter();

  const [equipamentos, setEquipamentos] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('Todos');
  const [loading, setLoading] = useState(true);

  // Estados do Modal de Reserva
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [dataReserva, setDataReserva] = useState('');
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [motivo, setMotivo] = useState('');

  // 1. BUSCAR EQUIPAMENTOS DO BANCO
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

  // Lógica para selecionar múltiplos horários
  const toggleHorario = (h) => {
    if (horariosSelecionados.includes(h)) {
      setHorariosSelecionados(horariosSelecionados.filter(item => item !== h));
    } else {
      setHorariosSelecionados([...horariosSelecionados, h]);
    }
  };

  // 2. FUNÇÃO PARA CONFIRMAR RESERVA
  const confirmarReserva = async () => {
    if (!dataReserva || horariosSelecionados.length === 0) {
      alert("Selecione a data e pelo menos um horário.");
      return;
    }

    if (horariosSelecionados.length > 3 && !motivo.trim()) {
      alert("Por favor, descreva o motivo para a reserva de longa duração.");
      return;
    }

    const ID_PROFESSOR_SISTEMA = '7ca0a569-5c21-416c-af14-69b91b38c347';
    const EMAIL_PROFESSOR_SISTEMA = 'thiagosoares@gmail.com';

    const { error } = await supabase
      .from('reservas')
      .insert([{
        equipamento_id: itemSelecionado.id, 
        professor_id: ID_PROFESSOR_SISTEMA,
        professor_email: EMAIL_PROFESSOR_SISTEMA,
        horario_inicio: horariosSelecionados.join(', '), 
        data_reserva: dataReserva,
        observacoes: motivo 
      }]);

    if (error) {
      alert("Erro ao gravar reserva: " + error.message);
    } else {
      alert(`Agendamento de "${itemSelecionado.nome}" realizado com sucesso!`);
      fecharModal();
      fetchEquipamentos();
    }
  };

  const fecharModal = () => {
    setItemSelecionado(null);
    setHorariosSelecionados([]);
    setMotivo('');
    setDataReserva('');
  };

  const itensFiltrados = abaAtiva === 'Todos'
    ? equipamentos
    : equipamentos.filter(item => item.categoria === abaAtiva);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden font-sans">
      {/* HEADER */}
      <header className="bg-[#222222] sticky top-0 z-40 shadow-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold uppercase tracking-tighter">UPLOC <span className="text-[#d1a661]">CEARÁ</span></div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Professor: Thiago Soares</span>
            <div className="w-10 h-10 bg-[#d1a661] rounded-full flex items-center justify-center text-black font-bold">TS</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* TITULO E BOTAO VOLTAR */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <button 
              onClick={() => router.push('/home')} 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#222222] border border-white/5 text-zinc-400 hover:text-[#d1a661] hover:border-[#d1a661]/40 transition-all text-lg"
              title="Voltar para a Home"
            >
              ←
            </button>
            <h1 className="text-3xl font-black uppercase tracking-[0.2em]">
              Reserva de <span className="text-[#d1a661]">Materiais</span>
            </h1>
          </div>
          <div className="h-1 w-20 bg-[#d1a661] ml-14"></div>
        </motion.div>

        {/* ABAS DE CATEGORIAS */}
        <div className="flex gap-2 mb-10 overflow-x-auto border-b border-white/5 no-scrollbar">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setAbaAtiva(cat)}
              className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap relative ${
                abaAtiva === cat ? 'text-[#d1a661]' : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              {cat}
              {abaAtiva === cat && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d1a661]" />}
            </button>
          ))}
        </div>

        {/* GRID DE EQUIPAMENTOS */}
        {loading ? (
          <div className="text-center py-20 text-[#d1a661] animate-pulse font-black uppercase tracking-widest">Sincronizando banco de dados...</div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {itensFiltrados.map((item) => (
              <motion.div
                layout key={item.id}
                whileHover={{ y: -5 }}
                onClick={() => setItemSelecionado(item)}
                className="bg-[#222222] rounded-[32px] border border-white/5 overflow-hidden group cursor-pointer hover:border-[#d1a661]/40 transition-all"
              >
                <div className="relative h-48 bg-zinc-900 flex items-center justify-center overflow-hidden">
                  {item.imagem ? (
                    <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="text-zinc-700 font-black text-xs uppercase italic">Sem Foto</div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[9px] font-black uppercase border border-white/10 text-[#d1a661]">{item.categoria}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-white mb-1 h-12 line-clamp-2 group-hover:text-[#d1a661] transition-colors">{item.nome}</h3>
                  
                  {/* NOVOS CAMPOS EXIBIDOS DE FORMA COMPACTA NO CARD */}
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-4 truncate">
                    {item.marca && item.modelo ? `${item.marca} • ${item.modelo}` : 'Especificação não informada'}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">
                      {item.patrimonio ? `PAT: ${item.patrimonio}` : 'Disponível'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase">{item.estado_conservacao || 'Bom'}</span>
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* MODAL DE RESERVA ATUALIZADO */}
      <AnimatePresence>
        {itemSelecionado && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#222222] w-full max-w-lg rounded-[40px] border border-white/10 shadow-3xl overflow-hidden max-h-[95vh] overflow-y-auto"
            >
              <div className="h-40 bg-zinc-900 relative">
                {itemSelecionado.imagem && <img src={itemSelecionado.imagem} className="w-full h-full object-cover opacity-40" alt="" />}
                <button onClick={fecharModal} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-white/10 hover:bg-[#d1a661] hover:text-black transition-all z-20">✕</button>
                <div className="absolute bottom-4 left-10 z-10">
                  <span className="px-3 py-1 bg-[#d1a661] rounded-full text-[9px] font-black uppercase text-black">{itemSelecionado.categoria}</span>
                </div>
              </div>

              <div className="px-10 pb-10 pt-6 relative z-10">
                <h2 className="text-[#d1a661] text-2xl font-black uppercase italic leading-tight">{itemSelecionado.nome}</h2>
                
                {/* BLOCo ADICIONAL: ESPECIFICAÇÕES TÉCNICAS DO PRODUTO */}
                <div className="mt-4 p-4 bg-zinc-900/60 rounded-2xl border border-white/5 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                  <div><span className="text-zinc-500 font-bold uppercase block text-[8px] tracking-wider">Marca / Modelo:</span> <span className="text-zinc-200 font-medium">{itemSelecionado.marca || '—'} {itemSelecionado.modelo || '—'}</span></div>
                  <div><span className="text-zinc-500 font-bold uppercase block text-[8px] tracking-wider">Nº de Patrimônio:</span> <span className="text-zinc-200 font-mono font-bold">{itemSelecionado.patrimonio || '—'}</span></div>
                  <div><span className="text-zinc-500 font-bold uppercase block text-[8px] tracking-wider">Nº de Série:</span> <span className="text-zinc-400 font-mono">{itemSelecionado.numero_serie || '—'}</span></div>
                  <div><span className="text-zinc-500 font-bold uppercase block text-[8px] tracking-wider">Estado do Objeto:</span> <span className="text-green-400 font-bold uppercase text-[10px]">{itemSelecionado.estado_conservacao || 'Bom'}</span></div>
                  {itemSelecionado.observacoes && (
                    <div className="col-span-2 border-t border-white/5 pt-2 mt-1">
                      <span className="text-zinc-500 font-bold uppercase block text-[8px] tracking-wider">Observações de Uso:</span>
                      <p className="text-zinc-400 italic text-[10px] leading-relaxed">{itemSelecionado.observacoes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-2 block">Data da Reserva</label>
                    <input type="date" className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#d1a661] text-sm" value={dataReserva} onChange={(e) => setDataReserva(e.target.value)} />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest block mb-2">Selecione os Horários ({horariosSelecionados.length})</label>
                    <div className="grid grid-cols-2 gap-2">
                      {HORARIOS.map((h) => (
                        <button
                          key={h}
                          onClick={() => toggleHorario(h)}
                          className={`text-center p-3 rounded-xl text-[9px] font-bold uppercase transition-all border ${
                            horariosSelecionados.includes(h)
                              ? 'bg-[#d1a661] text-black border-[#d1a661]'
                              : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  {horariosSelecionados.length > 3 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                      <label className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-2 block">Justificativa de Longa Duração</label>
                      <textarea
                        placeholder="Descreva o motivo do uso prolongado..."
                        className="w-full bg-zinc-900/80 border border-red-400/30 rounded-2xl p-4 text-sm text-white outline-none focus:border-red-400 min-h-[70px] resize-none"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                      />
                    </motion.div>
                  )}

                  <button
                    onClick={confirmarReserva}
                    className="w-full py-5 bg-[#d1a661] text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-transform pt-4"
                  >
                    Finalizar Agendamento
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
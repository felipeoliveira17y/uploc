'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIAS = ['Todos', 'Laboratório', 'Multimídia', 'Informática', 'Fotografia', 'Áudio', 'Vídeo'];
const HORARIOS = ['07:30 - 08:20', '08:20 - 09:10', '09:20 - 10:10', '10:10 - 11:00', '13:30 - 14:20', '14:20 - 15:10'];

export default function TelaLocacaoEscolar() {
  const supabase = createClient();
  
  const [equipamentos, setEquipamentos] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('Todos');
  const [loading, setLoading] = useState(true);
  
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [dataReserva, setDataReserva] = useState('');
  
  // MUDANÇA: Agora é um array para múltiplos horários
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [motivo, setMotivo] = useState('');

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

  // Lógica para selecionar/deselecionar horários
  const toggleHorario = (h) => {
    if (horariosSelecionados.includes(h)) {
      setHorariosSelecionados(horariosSelecionados.filter(item => item !== h));
    } else {
      setHorariosSelecionados([...horariosSelecionados, h]);
    }
  };

  const confirmarReserva = async () => {
    if (!dataReserva || horariosSelecionados.length === 0) {
      alert("Selecione data e pelo menos um horário.");
      return;
    }

    if (horariosSelecionados.length > 3 && !motivo.trim()) {
      alert("Por favor, descreva o motivo para a reserva de longa duração.");
      return;
    }

    // Preparando os dados (Enviando como string separada por vírgula ou múltiplos inserts)
    // Aqui vamos enviar os horários formatados
    const { error } = await supabase
      .from('reservas')
      .insert([{
        equipamento_id: itemSelecionado.id,
        nome: itemSelecionado.nome,
        horario_inicio: horariosSelecionados.join(', '), // Salva todos os horários escolhidos
        data: dataReserva,
        professor_email: 'professor@escola.com',
        observacoes: motivo // Certifique-se de ter essa coluna no banco se quiser salvar o motivo
      }]);

    if (error) {
      alert("Erro: " + error.message);
    } else {
      alert(`Agendamento de ${itemSelecionado.nome} realizado para ${horariosSelecionados.length} horários!`);
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
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden">
      <header className="bg-[#222222] sticky top-0 z-40 shadow-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold uppercase tracking-tighter">UPLOC <span className="text-[#d1a661]">CEARÁ</span></div>
          <div className="w-10 h-10 bg-[#d1a661] rounded-full flex items-center justify-center text-black font-bold">PR</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-3xl font-black uppercase tracking-[0.2em] mb-2">
            {abaAtiva === 'Laboratório' ? 'Reserva de ' : 'Material '}
            <span className="text-[#d1a661]">{abaAtiva === 'Laboratório' ? 'Laboratórios' : 'Pedagógico'}</span>
          </h1>
          <div className="h-1 w-20 bg-[#d1a661]"></div>
        </motion.div>

        {/* ABAS */}
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

        {loading ? (
          <div className="text-center py-20 text-[#d1a661] animate-pulse font-black uppercase tracking-widest">Sincronizando recursos...</div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {itensFiltrados.map((item) => (
              <motion.div 
                layout key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                onClick={() => setItemSelecionado(item)}
                className="bg-[#222222] rounded-[32px] border border-white/5 overflow-hidden group cursor-pointer hover:border-[#d1a661]/40 transition-colors"
              >
                <div className="relative h-48 bg-zinc-900 flex items-center justify-center overflow-hidden">
                  {item.imagem ? (
                    <motion.img whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }} src={item.imagem} alt={item.nome} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="text-zinc-700 font-black text-xs uppercase italic">Sem Imagem</div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-zinc-900/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase border border-white/10 text-[#d1a661]">{item.categoria}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-white mb-4 h-12 line-clamp-2 group-hover:text-[#d1a661] transition-colors">{item.nome}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Disponível</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {itemSelecionado && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#222222] w-full max-w-lg rounded-[40px] border border-white/10 shadow-3xl overflow-hidden"
            >
              <div className="h-32 bg-zinc-900 relative">
                {itemSelecionado.imagem && <img src={itemSelecionado.imagem} className="w-full h-full object-cover opacity-30" alt="" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#222222] to-transparent" />
                <button onClick={fecharModal} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-white/10 hover:bg-[#d1a661] hover:text-black transition-all">✕</button>
              </div>

              <div className="px-10 pb-10 -mt-6 relative z-10">
                <h2 className="text-[#d1a661] text-2xl font-black uppercase italic leading-none">{itemSelecionado.nome}</h2>
                
                <div className="mt-8 space-y-6">
                  <div>
                    <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-3 block">Data da Reserva</label>
                    <input type="date" className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#d1a661]" onChange={(e) => setDataReserva(e.target.value)} />
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest block">Horários Selecionados ({horariosSelecionados.length})</label>
                      {horariosSelecionados.length > 0 && (
                        <button onClick={() => setHorariosSelecionados([])} className="text-[8px] text-zinc-500 uppercase font-bold hover:text-white">Limpar</button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {HORARIOS.map((h) => (
                        <button
                          key={h}
                          onClick={() => toggleHorario(h)}
                          className={`text-center p-3 rounded-xl text-[9px] font-bold uppercase transition-all border ${
                            horariosSelecionados.includes(h) 
                              ? 'bg-[#d1a661] text-black border-[#d1a661] shadow-lg shadow-[#d1a661]/10' 
                              : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CAIXA DE TEXTO AUTOMÁTICA (FRAMER MOTION) */}
                  <AnimatePresence>
                    {horariosSelecionados.length > 3 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <label className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-3 block">Justificativa necessária (Uso Prolongado)</label>
                        <textarea 
                          placeholder="Descreva o motivo da utilização por mais de 3 períodos..."
                          className="w-full bg-zinc-900/80 border border-red-400/30 rounded-2xl p-4 text-sm text-white outline-none focus:border-red-400 min-h-[100px] resize-none"
                          value={motivo}
                          onChange={(e) => setMotivo(e.target.value)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={confirmarReserva}
                    className="w-full py-5 bg-[#d1a661] text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#d1a661]/10"
                  >
                    Confirmar {horariosSelecionados.length} Horário(s)
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
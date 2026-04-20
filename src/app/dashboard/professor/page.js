'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIAS = ['Todos', 'Laboratório', 'Multimídia', 'Informática', 'Fotografia', 'Áudio', 'Vídeo'];

export default function TelaLocacaoEscolar() {
  const supabase = createClient();

  // --- ESTADOS ---
  const [equipamentos, setEquipamentos] = useState([]);
  const [horariosBD, setHorariosBD] = useState([]);
  const [reservasExistentes, setReservasExistentes] = useState([]); // Novo estado para verificar disponibilidade
  const [abaAtiva, setAbaAtiva] = useState('Todos');
  const [loading, setLoading] = useState(true);

  // Estados do Modal de Reserva
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [dataReserva, setDataReserva] = useState('');
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [motivo, setMotivo] = useState('');

  // --- 1. BUSCAR DADOS DO SUPABASE ---
  async function fetchDados() {
    setLoading(true);
    try {
      // Busca Equipamentos
      const { data: equipData } = await supabase
        .from('equipamentos')
        .select('*')
        .order('nome', { ascending: true });

      // Busca Configuração de Horários
      const { data: horData } = await supabase
        .from('horarios')
        .select('*')
        .order('hora_inicio', { ascending: true });

      // Busca todas as Reservas para validar disponibilidade
      const { data: resData } = await supabase
        .from('reservas')
        .select('equipamento_id, data_reserva, horario_inicio');

      if (equipData) setEquipamentos(equipData);
      if (horData) setHorariosBD(horData);
      if (resData) setReservasExistentes(resData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDados();
  }, []);

  // --- 2. LÓGICAS DE VALIDAÇÃO ---

  // Verifica se o horário já passou (Tempo Real)
  const isHorarioValido = (horarioString) => {
    if (!dataReserva) return true;
    const agora = new Date();
    const [ano, mes, dia] = dataReserva.split('-').map(Number);
    const dataAlvo = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataAlvo < hoje) return false;
    if (dataAlvo > hoje) return true;

    const [horaInicio] = horarioString.split(' - ');
    const [h, m] = horaInicio.split(':').map(Number);
    const dataComHora = new Date(ano, mes - 1, dia, h, m);
    return dataComHora > agora;
  };

  // Verifica se o horário já está ocupado no Banco de Dados
  const isHorarioOcupado = (horarioString) => {
    if (!itemSelecionado || !dataReserva) return false;
    
    return reservasExistentes.some(reserva => 
      reserva.equipamento_id === itemSelecionado.id &&
      reserva.data_reserva === dataReserva &&
      reserva.horario_inicio.includes(horarioString)
    );
  };

  const toggleHorario = (hLabel) => {
    if (horariosSelecionados.includes(hLabel)) {
      setHorariosSelecionados(horariosSelecionados.filter(item => item !== hLabel));
    } else {
      setHorariosSelecionados([...horariosSelecionados, hLabel]);
    }
  };

  // --- 3. CONFIRMAR RESERVA ---
  const confirmarReserva = async () => {
    if (!dataReserva || horariosSelecionados.length === 0) {
      alert("Selecione a data e pelo menos um horário.");
      return;
    }

    // Validação de segurança final (Tempo e Ocupação)
    const conflito = horariosSelecionados.some(h => !isHorarioValido(h) || isHorarioOcupado(h));
    if (conflito) {
      alert("Um dos horários selecionados não está mais disponível. Por favor, revise.");
      return;
    }

    if (horariosSelecionados.length > 3 && !motivo.trim()) {
      alert("Por favor, descreva o motivo para a reserva de longa duração.");
      return;
    }

    const ID_PROFESSOR_SISTEMA = '1ad1108d-da3b-41cb-898e-484c73b68fcf';
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
      alert(`Agendamento realizado com sucesso!`);
      fecharModal();
      fetchDados(); // Recarrega para atualizar ocupação na tela
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-3xl font-black uppercase tracking-[0.2em] mb-2">
            Reserva de <span className="text-[#d1a661]">Materiais</span>
          </h1>
          <div className="h-1 w-20 bg-[#d1a661]"></div>
        </motion.div>

        {/* CATEGORIAS */}
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
          <div className="text-center py-20 text-[#d1a661] animate-pulse font-black uppercase tracking-widest">Sincronizando portal...</div>
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
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-white mb-4 h-12 line-clamp-2 group-hover:text-[#d1a661] transition-colors">{item.nome}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">{item.categoria}</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* MODAL DE RESERVA */}
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
                <button onClick={fecharModal} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-white/10 hover:bg-[#d1a661] hover:text-black transition-all">✕</button>
              </div>

              <div className="px-10 pb-10 -mt-6 relative z-10">
                <h2 className="text-[#d1a661] text-2xl font-black uppercase italic">{itemSelecionado.nome}</h2>

                <div className="mt-8 space-y-6">
                  <div>
                    <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-3 block">Data da Reserva</label>
                    <input 
                      type="date" 
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#d1a661]" 
                      value={dataReserva} 
                      onChange={(e) => {
                        setDataReserva(e.target.value);
                        setHorariosSelecionados([]); // Limpa seleção ao mudar data
                      }} 
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest block mb-3">Horários Disponíveis ({horariosSelecionados.length})</label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                      {horariosBD.map((h) => {
                        const horarioTexto = `${h.hora_inicio.substring(0, 5)} - ${h.hora_fim.substring(0, 5)}`;
                        const passado = !isHorarioValido(horarioTexto);
                        const ocupado = isHorarioOcupado(horarioTexto);
                        const desabilitado = passado || ocupado;

                        return (
                          <button
                            key={h.id}
                            disabled={desabilitado || !dataReserva}
                            onClick={() => toggleHorario(horarioTexto)}
                            className={`text-left p-3 rounded-xl transition-all border ${
                              horariosSelecionados.includes(horarioTexto)
                                ? 'bg-[#d1a661] text-black border-[#d1a661]'
                                : desabilitado 
                                  ? 'bg-red-500/5 text-red-500/40 border-red-500/10 cursor-not-allowed opacity-50'
                                  : 'bg-zinc-900/50 text-zinc-400 border-white/5 hover:border-white/20'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <p className="text-[10px] font-black uppercase">{h.label || 'Horário'}</p>
                              {ocupado ? (
                                <span className="text-[7px] bg-red-600 text-white px-1 rounded font-bold">OCUPADO</span>
                              ) : passado ? (
                                <span className="text-[7px] bg-zinc-700 text-white px-1 rounded font-bold">OFF</span>
                              ) : null}
                            </div>
                            <p className="text-[9px] font-bold opacity-70">{horarioTexto}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {horariosSelecionados.length > 3 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                      <label className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-3 block">Justificativa de Longa Duração</label>
                      <textarea
                        placeholder="Descreva o motivo..."
                        className="w-full bg-zinc-900/80 border border-red-400/30 rounded-2xl p-4 text-sm text-white outline-none focus:border-red-400 min-h-[80px] resize-none"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                      />
                    </motion.div>
                  )}

                  <button
                    onClick={confirmarReserva}
                    disabled={!dataReserva || horariosSelecionados.length === 0}
                    className="w-full py-5 bg-[#d1a661] text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
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
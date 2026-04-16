'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

// Adicionado 'Laboratório' às categorias
const CATEGORIAS = ['Todos', 'Laboratório', 'Multimídia', 'Informática', 'Fotografia', 'Áudio', 'Vídeo'];
const HORARIOS = ['07:30 - 08:20', '08:20 - 09:10', '09:20 - 10:10', '10:10 - 11:00', '13:30 - 14:20', '14:20 - 15:10'];

export default function TelaLocacaoEscolar() {
  const supabase = createClient();
  
  const [equipamentos, setEquipamentos] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('Todos');
  const [loading, setLoading] = useState(true);
  
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [dataReserva, setDataReserva] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');

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

  const confirmarReserva = async () => {
    if (!dataReserva || !horarioSelecionado) {
      alert("Selecione data e horário.");
      return;
    }

    const horarioInicio = horarioSelecionado.split(' - ')[0];

    const { error } = await supabase
      .from('reservas')
      .insert([{
        equipamento_id: itemSelecionado.id,
        nome: itemSelecionado.nome,
        horario_inicio: horarioInicio,
        data: dataReserva,
        professor_email: 'professor@escola.com' 
      }]);

    if (error) {
      alert("Erro: " + error.message);
    } else {
      alert(`Agendamento de ${itemSelecionado.nome} realizado!`);
      setItemSelecionado(null);
      fetchEquipamentos();
    }
  };

  const itensFiltrados = abaAtiva === 'Todos' 
    ? equipamentos 
    : equipamentos.filter(item => item.categoria === abaAtiva);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <header className="bg-[#222222] sticky top-0 z-40 shadow-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold uppercase">UPLOC <span className="text-[#d1a661]">CEARÁ</span></div>
          <div className="w-10 h-10 bg-[#d1a661] rounded-full flex items-center justify-center text-black font-bold">PR</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-12">
          <h1 className="text-3xl font-black uppercase tracking-[0.2em] mb-2">
            {abaAtiva === 'Laboratório' ? 'Reserva de ' : 'Material '}
            <span className="text-[#d1a661]">{abaAtiva === 'Laboratório' ? 'Laboratórios' : 'Pedagógico'}</span>
          </h1>
          <div className="h-1 w-20 bg-[#d1a661]"></div>
        </div>

        {/* ABAS COM OPÇÃO LABORATÓRIO */}
        <div className="flex gap-2 mb-10 overflow-x-auto border-b border-white/5 no-scrollbar">
          {CATEGORIAS.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setAbaAtiva(cat)}
              className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                abaAtiva === cat ? 'text-[#d1a661] border-b-2 border-[#d1a661]' : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#d1a661] animate-pulse font-black uppercase">Sincronizando recursos...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {itensFiltrados.map((item) => (
              <div key={item.id} className="bg-[#222222] rounded-[32px] border border-white/5 overflow-hidden group hover:border-[#d1a661]/30 transition-all">
                <div className="relative h-48 bg-zinc-900">
                  {/* Busca imagem temática baseada na categoria ou nome */}
                  <img 
                    src={`https://source.unsplash.com/400x300/?${item.categoria === 'Laboratório' ? 'laboratory,science' : 'technology'},${item.nome}`} 
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-500" 
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-zinc-900/80 backdrop-blur-md rounded-full text-[9px] font-black uppercase border border-white/10">
                      {item.categoria}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg text-white mb-6 h-12 line-clamp-2">{item.nome}</h3>
                  <button 
                    onClick={() => setItemSelecionado(item)}
                    className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-[#d1a661] text-black hover:bg-white transition-all shadow-lg shadow-[#d1a661]/10"
                  >
                    Agendar Horário
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL DE RESERVA */}
      {itemSelecionado && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
          <div className="bg-[#222222] w-full max-w-md rounded-[40px] border border-white/10 shadow-3xl">
            <div className="p-10">
              <h2 className="text-[#d1a661] text-2xl font-black uppercase tracking-tighter italic">AGENDAR</h2>
              <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-8">{itemSelecionado.nome}</p>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-[#d1a661] uppercase tracking-[0.2em] mb-3 block">Data</label>
                  <input 
                    type="date" 
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-[#d1a661]"
                    onChange={(e) => setDataReserva(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#d1a661] uppercase tracking-[0.2em] mb-3 block">Horário disponível</label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {HORARIOS.map((h) => (
                      <button
                        key={h}
                        onClick={() => setHorarioSelecionado(h)}
                        className={`text-left p-4 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                          horarioSelecionado === h ? 'bg-[#d1a661] text-black border-[#d1a661]' : 'bg-zinc-900 text-zinc-500 border-white/5'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={confirmarReserva}
                  className="w-full py-5 bg-[#d1a661] text-black rounded-2xl font-black uppercase text-xs tracking-widest transition-all mt-4 hover:scale-[1.02]"
                >
                  Confirmar Agendamento
                </button>
                <button onClick={() => setItemSelecionado(null)} className="w-full text-zinc-600 text-[10px] font-bold uppercase">Voltar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
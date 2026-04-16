'use client';
import React, { useState } from 'react';

const EQUIPAMENTOS = [
  { id: 1, nome: "Projetor (Data Show)", marca: "Epson", categoria: "Multimídia", imagem: "https://images.unsplash.com/photo-1535016120720-40c646bebbbb?w=400", disponivel: true },
  { id: 2, nome: "Cabo HDMI (5 metros)", marca: "Generic", categoria: "Multimídia", imagem: "https://images.unsplash.com/photo-1620215175664-cb91605e769d?w=400", disponivel: true },
  { id: 3, nome: "Adaptador VGA para HDMI", marca: "MD9", categoria: "Multimídia", imagem: "https://images.unsplash.com/photo-1629739683367-9615629478f7?w=400", disponivel: true },
  { id: 4, nome: "Caixa de Som USB", marca: "Logitech", categoria: "Multimídia", imagem: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400", disponivel: true },
  { id: 5, nome: "Controle Ar Condicionado", marca: "Consul/Gree", categoria: "Multimídia", imagem: "https://images.unsplash.com/photo-1634148450143-6903264c76b1?w=400", disponivel: false },
  { id: 6, nome: "Notebook do Professor", marca: "Dell/Positivo", categoria: "Informática", imagem: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400", disponivel: true },
  { id: 16, nome: "Microfone com Fio", marca: "Shure", categoria: "Áudio", imagem: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400", disponivel: true },
];

const CATEGORIAS = ['Todos', 'Multimídia', 'Informática', 'Laboratório', 'Áudio'];
const HORARIOS = ['07:30 - 09:10', '09:20 - 11:00', '13:30 - 15:10', '15:20 - 17:00', '18:30 - 20:10'];

export default function TelaLocacaoEscolar() {
  const [abaAtiva, setAbaAtiva] = useState('Todos');
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [dataReserva, setDataReserva] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');

  const abrirModal = (item) => {
    setItemSelecionado(item);
    setDataReserva('');
    setHorarioSelecionado('');
  };

  const fecharModal = () => {
    setItemSelecionado(null);
  };

  const confirmarReserva = () => {
    if (!dataReserva || !horarioSelecionado) {
      alert("Por favor, selecione a data e o horário.");
      return;
    }
    alert(`Sucesso! ${itemSelecionado.nome} reservado para ${dataReserva} às ${horarioSelecionado}.`);
    fecharModal();
  };

  const itensFiltrados = abaAtiva === 'Todos' 
    ? EQUIPAMENTOS 
    : EQUIPAMENTOS.filter(item => item.categoria === abaAtiva);

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative">
      {/* HEADER */}
      <header className="bg-[#222222] text-white sticky top-0 z-40 shadow-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold tracking-tight uppercase">
              UPLOC <span className="text-[#d1a661]">CEARÁ</span>
            </div>
            <div className="hidden sm:block text-[9px] text-gray-500 font-bold uppercase border-l border-white/10 pl-4 tracking-widest">
              SISTEMA DE <br/> RESERVA ESCOLAR
            </div>
          </div>
          <div className="w-10 h-10 bg-[#d1a661] rounded-full flex items-center justify-center text-black font-bold">PR</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white uppercase tracking-[0.2em]">Material <span className="text-[#d1a661]">Pedagógico</span></h1>
          <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-widest font-medium">Equipamentos para uso exclusivo em sala de aula</p>
        </div>

        {/* ABAS */}
        <div className="flex gap-2 mb-10 overflow-x-auto border-b border-white/5">
          {CATEGORIAS.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setAbaAtiva(cat)}
              className={`px-8 py-4 rounded-t-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                abaAtiva === cat ? 'bg-[#d1a661] text-black' : 'text-gray-500 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {itensFiltrados.map((item) => (
            <div key={item.id} className="bg-[#222222] rounded-3xl border border-white/5 overflow-hidden hover:border-[#d1a661]/40 transition-all flex flex-col group">
              <div className="relative h-40 bg-[#1a1a1a]">
                <img src={item.imagem} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                {!item.disponivel && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <span className="text-white font-black text-[9px] px-3 py-1 bg-red-600 rounded-full uppercase">Em Uso</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest opacity-70">{item.categoria}</span>
                  <h3 className="font-bold text-sm text-white uppercase line-clamp-1">{item.nome}</h3>
                </div>
                <button 
                  onClick={() => abrirModal(item)}
                  disabled={!item.disponivel}
                  className={`w-full mt-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                    item.disponivel ? 'bg-[#d1a661] text-black hover:bg-[#b88e4b]' : 'bg-white/5 text-gray-700'
                  }`}
                >
                  {item.disponivel ? 'Reservar' : 'Ocupado'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DE RESERVA (HOSPEDAGEM) */}
      {itemSelecionado && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all">
          <div className="bg-[#222222] w-full max-w-md rounded-3xl border border-[#d1a661]/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-[#d1a661] text-xl font-black uppercase tracking-tighter">Agendar Reserva</h2>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{itemSelecionado.nome}</p>
                </div>
                <button onClick={fecharModal} className="text-gray-500 hover:text-white text-xl">✕</button>
              </div>

              {/* Seleção de Data */}
              <div className="mb-6">
                <label className="text-[10px] font-black text-[#d1a661] uppercase tracking-[0.2em] mb-2 block">Data da Reserva</label>
                <input 
                  type="date" 
                  value={dataReserva}
                  onChange={(e) => setDataReserva(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#d1a661] transition-all"
                />
              </div>

              {/* Seleção de Horário */}
              <div className="mb-8">
                <label className="text-[10px] font-black text-[#d1a661] uppercase tracking-[0.2em] mb-2 block">Horário da Aula</label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {HORARIOS.map((horario) => (
                    <button
                      key={horario}
                      onClick={() => setHorarioSelecionado(horario)}
                      className={`text-left p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        horarioSelecionado === horario 
                        ? 'bg-[#d1a661] text-black border-[#d1a661]' 
                        : 'bg-[#1a1a1a] text-gray-400 border-white/5 hover:border-[#d1a661]/50'
                      }`}
                    >
                      {horario}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmarReserva}
                  className="w-full py-4 bg-[#d1a661] text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#d1a661]/10"
                >
                  Confirmar Agendamento
                </button>
                <button 
                  onClick={fecharModal}
                  className="w-full py-2 text-gray-500 text-[9px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Voltar e Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
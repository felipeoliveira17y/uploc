'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; 

export default function AdminDashboard() {
  // --- ESTADOS ---
  const [abaAtiva, setAbaAtiva] = useState('equipamentos');
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agora, setAgora] = useState(new Date());

  // Estados dos Modais
  const [showModalProf, setShowModalProf] = useState(false);
  const [showModalEquip, setShowModalEquip] = useState(false);

  // Estados dos Formulários
  const [novoProf, setNovoProf] = useState({ nome: '', email: '', senha: '' });
  const [novoEquip, setNovoEquip] = useState({ nome: '', categoria: 'Multimídia', imagem: '' });

  const supabase = createClient();

  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function fetchData() {
    setLoading(true);
    const tabelas = {
      equipamentos: 'equipamentos',
      professores: 'perfis',
      reservas: 'reservas'
    };

    const tabelaAlvo = tabelas[abaAtiva] || abaAtiva;
    let query = supabase.from(tabelaAlvo).select('*');
    
    if (abaAtiva === 'professores') {
      query = query.eq('role', 'professor');
    }

    const { data, error } = await query;
    if (!error) setDados(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [abaAtiva]);

  function renderDetalhesReserva(item) {
    if (abaAtiva !== 'reservas') {
      return (
        <div className="flex flex-col gap-1">
          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">{item.categoria}</span>
          {item.imagem && <span className="text-uploc-gold text-[9px] uppercase font-black tracking-widest">[ Imagem Vinculada ]</span>}
        </div>
      );
    }

    const [h, m] = (item.horario_inicio || "07:20").split(':');
    const dataFim = new Date();
    dataFim.setHours(parseInt(h), parseInt(m) + 50, 0);
    
    const horaFimFormatada = `${dataFim.getHours().toString().padStart(2, '0')}:${dataFim.getMinutes().toString().padStart(2, '0')}`;

    const diff = dataFim - agora;
    if (diff <= 0) return <span className="text-red-500 font-bold uppercase text-[10px]">Aula Encerrada</span>;

    const mins = Math.floor((diff / 1000 / 60) % 60);
    const segs = Math.floor((diff / 1000) % 60);
    const tempoRestante = `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;

    return (
      <div className="flex items-center gap-3">
        <span className="text-zinc-400 font-medium">{item.horario_inicio} — {horaFimFormatada}</span>
        <span className="bg-uploc-gold text-black px-2 py-0.5 rounded text-[10px] font-black animate-pulse">
          {tempoRestante}
        </span>
      </div>
    );
  }

  async function handleAddProfessor(e) {
    e.preventDefault();
    const { error } = await supabase.from('perfis').insert([{ 
      nome_completo: novoProf.nome, email: novoProf.email, senha: novoProf.senha, role: 'professor' 
    }]);
    if (!error) { setShowModalProf(false); setNovoProf({ nome: '', email: '', senha: '' }); fetchData(); }
  }

  async function handleAddEquipamento(e) {
    e.preventDefault();
    const { error } = await supabase.from('equipamentos').insert([{ 
      nome: novoEquip.nome, 
      categoria: novoEquip.categoria,
      imagem: novoEquip.imagem 
    }]);
  
    if (!error) { 
      setShowModalEquip(false); 
      setNovoEquip({ nome: '', categoria: 'Multimídia', imagem: '' }); 
      fetchData(); 
    } else {
      alert("Erro ao salvar: " + error.message);
    }
  }
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNovoEquip({ ...novoEquip, imagem: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleExcluir(id) {
    if (!confirm("Deseja realmente excluir?")) return;
    const tabela = abaAtiva === 'professores' ? 'perfis' : abaAtiva;
    await supabase.from(tabela).delete().eq('id', id);
    fetchData();
  }

  return (
    <div className="flex min-h-screen bg-uploc-black">
      <aside className="w-64 bg-uploc-gray border-r border-white/5 p-6 flex flex-col h-screen sticky top-0 shadow-2xl">
        <div className="mb-10 text-center">
          <h2 className="text-uploc-gold text-2xl font-black tracking-tighter italic">UPLOC</h2>
          <p className="text-zinc-500 text-[10px] uppercase mt-1 font-bold tracking-[3px]">Admin</p>
        </div>

        <nav className="flex-1 space-y-2">
          {['equipamentos', 'professores', 'reservas'].map((id) => (
            <button
              key={id}
              onClick={() => setAbaAtiva(id)}
              className={`w-full text-left p-4 rounded-xl transition-all font-bold text-sm uppercase tracking-widest ${
                abaAtiva === id 
                ? 'bg-uploc-gold text-black shadow-lg shadow-uploc-gold/20' 
                : 'text-zinc-400 hover:text-uploc-gold hover:bg-white/5'
              }`}
            >
              {id}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white capitalize tracking-tight">{abaAtiva}</h1>
            <p className="text-zinc-400 text-sm">Painel administrativo / {abaAtiva}</p>
          </div>
          
          {(abaAtiva === 'professores' || abaAtiva === 'equipamentos') && (
            <button 
              onClick={() => abaAtiva === 'professores' ? setShowModalProf(true) : setShowModalEquip(true)}
              className="bg-uploc-gold hover:bg-uploc-goldHover text-black px-8 py-3 rounded-xl font-black text-xs uppercase transition-all shadow-lg shadow-uploc-gold/10"
            >
              + Adicionar {abaAtiva === 'professores' ? 'Professor' : 'Equipamento'}
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-uploc-gold animate-pulse text-center mt-20 font-bold uppercase tracking-[4px]">Carregando...</div>
        ) : (
          <div className="bg-uploc-gray rounded-[30px] border border-white/5 overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-900/50 border-b border-white/5">
                <tr>
                  <th className="p-6 text-uploc-gold text-[10px] uppercase font-black tracking-[2px]">Registro</th>
                  <th className="p-6 text-uploc-gold text-[10px] uppercase font-black tracking-[2px] text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dados.length > 0 ? (
                  dados.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition group">
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-lg">{item.nome || item.nome_completo}</span>
                          <span className="text-sm">{renderDetalhesReserva(item)}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <button onClick={() => handleExcluir(item.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all">
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="2" className="p-20 text-center text-zinc-600 italic">Nenhum dado encontrado em {abaAtiva}.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MODAL PROFESSOR */}
      {showModalProf && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-uploc-gray border border-white/10 p-10 rounded-[40px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-black mb-8 text-center italic text-white uppercase tracking-tighter">Novo <span className="text-uploc-gold">Professor</span></h2>
            <form onSubmit={handleAddProfessor} className="space-y-5">
              <input required placeholder="Nome Completo" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-uploc-gold/50 transition-all" value={novoProf.nome} onChange={(e) => setNovoProf({...novoProf, nome: e.target.value})} />
              <input type="email" required placeholder="Email de Acesso" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-uploc-gold/50 transition-all" value={novoProf.email} onChange={(e) => setNovoProf({...novoProf, email: e.target.value})} />
              <input type="password" required placeholder="Senha Inicial" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-uploc-gold/50 transition-all" value={novoProf.senha} onChange={(e) => setNovoProf({...novoProf, senha: e.target.value})} />
              <button type="submit" className="w-full bg-uploc-gold text-black font-black py-5 rounded-2xl uppercase text-xs shadow-lg shadow-uploc-gold/20 hover:scale-[1.02] transition-all">Cadastrar Professor</button>
              <button type="button" onClick={() => setShowModalProf(false)} className="w-full text-zinc-500 text-[10px] font-black uppercase tracking-widest pt-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EQUIPAMENTO */}
      {showModalEquip && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-uploc-gray border border-white/10 p-10 rounded-[40px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-black mb-8 text-center italic text-white uppercase tracking-tighter">Novo <span className="text-uploc-gold">Equipamento</span></h2>
            <form onSubmit={handleAddEquipamento} className="space-y-5">
              <input required placeholder="Nome do Equipamento" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-uploc-gold/50 transition-all" value={novoEquip.nome} onChange={(e) => setNovoEquip({...novoEquip, nome: e.target.value})} />
              
              <div className="flex flex-col gap-2">
                <label className="text-zinc-500 text-[10px] uppercase font-bold ml-2">Foto do Equipamento</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  required
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-3 text-sm text-zinc-400 outline-none focus:border-uploc-gold/50 file:bg-uploc-gold file:text-black file:border-0 file:rounded-full file:px-4 file:py-1 file:text-[10px] file:font-black file:uppercase file:cursor-pointer" 
                  onChange={handleFileChange} 
                />
              </div>

              <div className="relative">
                <select 
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-uploc-gold/50 transition-all appearance-none cursor-pointer"
                  value={novoEquip.categoria}
                  onChange={(e) => setNovoEquip({...novoEquip, categoria: e.target.value})}
                >
                  <option value="Laboratório">Laboratório</option>
                  <option value="Multimídia">Multimídia</option>
                  <option value="Informática">Informática</option>
                  <option value="Áudio">Áudio</option>
                  <option value="Fotografia">Fotografia</option>
                  <option value="Vídeo">Vídeo</option>
                  <option value="Iluminação">Iluminação</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
              </div>

              <button type="submit" className="w-full bg-uploc-gold text-black font-black py-5 rounded-2xl uppercase text-xs shadow-lg shadow-uploc-gold/20 hover:scale-[1.02] transition-all">Adicionar ao Sistema</button>
              <button type="button" onClick={() => setShowModalEquip(false)} className="w-full text-zinc-500 text-[10px] font-black uppercase tracking-widest pt-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
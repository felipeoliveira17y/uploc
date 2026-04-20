'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const [abaAtiva, setAbaAtiva] = useState('equipamentos');
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  // Filtros para Reservas
  const [filtroData, setFiltroData] = useState('');
  const [filtroHorario, setFiltroHorario] = useState('');

  // Modais
  const [showModalProf, setShowModalProf] = useState(false);
  const [showModalEquip, setShowModalEquip] = useState(false);
  const [showModalHorario, setShowModalHorario] = useState(false);
  const [verReserva, setVerReserva] = useState(null); 
  const [editandoId, setEditandoId] = useState(null);

  // Estados dos formulários
  const [novoProf, setNovoProf] = useState({ nome: '', email: '', senha: '', imagem: '' });
  const [novoEquip, setNovoEquip] = useState({ nome: '', categoria: 'Multimídia', imagem: '' });
  const [novoHorario, setNovoHorario] = useState({ hora_inicio: '', hora_fim: '', label: '' });
  const [uploading, setUploading] = useState(false);

  const supabase = createClient();

  // --- BUSCAR DADOS ---
  async function fetchData() {
    setLoading(true);
    try {
      const mapeamento = {
        equipamentos: 'equipamentos',
        professores: 'perfis',
        reservas: 'reservas',
        horarios: 'horarios'
      };
      const tabelaAlvo = mapeamento[abaAtiva];

      let query = abaAtiva === 'reservas' 
        ? supabase.from(tabelaAlvo).select('*, equipamentos(*)') 
        : supabase.from(tabelaAlvo).select('*');

      if (abaAtiva === 'professores') query = query.eq('role', 'professor');
      if (abaAtiva === 'horarios') query = query.order('hora_inicio', { ascending: true });
      if (abaAtiva === 'reservas') query = query.order('data_reserva', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setDados(data || []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    setBusca('');
    setFiltroData('');
    setFiltroHorario('');
  }, [abaAtiva]);

  // --- LÓGICA DE FILTRAGEM ---
  const dadosFiltrados = dados.filter(item => {
    const termoBusca = busca.toLowerCase();
    const nomeItem = (item.nome || item.nome_completo || item.label || item.professor_email || "").toLowerCase();
    const nomeEquip = (item.equipamentos?.nome || "").toLowerCase();
    
    const bateTexto = nomeItem.includes(termoBusca) || nomeEquip.includes(termoBusca);

    if (abaAtiva === 'reservas') {
      const bateData = filtroData ? item.data_reserva === filtroData : true;
      const bateHorario = filtroHorario ? (item.horario_inicio || "").includes(filtroHorario) : true;
      return bateTexto && bateData && bateHorario;
    }

    return bateTexto;
  });

  // --- UPLOAD DE IMAGEM ---
  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("Imagem muito pesada!");
        return;
      }
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (tipo === 'professores') setNovoProf(prev => ({ ...prev, imagem: reader.result }));
        else setNovoEquip(prev => ({ ...prev, imagem: reader.result }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- CRUD FUNCTIONS ---
  async function handleAddEquipamento(e) {
    e.preventDefault();
    const payload = { nome: novoEquip.nome, categoria: novoEquip.categoria, imagem: novoEquip.imagem };
    const res = editandoId ? await supabase.from('equipamentos').update(payload).eq('id', editandoId) : await supabase.from('equipamentos').insert([payload]);
    if (res.error) alert(res.error.message); else { fecharModais(); fetchData(); }
  }

  async function handleAddProfessor(e) {
    e.preventDefault();
    const payload = { nome_completo: novoProf.nome, email: novoProf.email, senha: novoProf.senha, avatar_url: novoProf.imagem, role: 'professor' };
    const res = editandoId ? await supabase.from('perfis').update(payload).eq('id', editandoId) : await supabase.from('perfis').insert([payload]);
    if (res.error) alert(res.error.message); else { fecharModais(); fetchData(); }
  }

  async function handleAddHorario(e) {
    e.preventDefault();
    const res = editandoId ? await supabase.from('horarios').update(novoHorario).eq('id', editandoId) : await supabase.from('horarios').insert([novoHorario]);
    if (res.error) alert(res.error.message); else { fecharModais(); fetchData(); }
  }

  async function handleExcluir(id) {
    if (confirm(`Excluir este registro permanentemente?`)) {
      const mapeamento = { equipamentos: 'equipamentos', professores: 'perfis', reservas: 'reservas', horarios: 'horarios' };
      const { error } = await supabase.from(mapeamento[abaAtiva]).delete().eq('id', id);
      if (error) alert(error.message); else fetchData();
    }
  }

  function fecharModais() {
    setShowModalEquip(false);
    setShowModalProf(false);
    setShowModalHorario(false);
    setVerReserva(null);
    setEditandoId(null);
    setNovoEquip({ nome: '', categoria: 'Multimídia', imagem: '' });
    setNovoProf({ nome: '', email: '', senha: '', imagem: '' });
    setNovoHorario({ hora_inicio: '', hora_fim: '', label: '' });
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111] border-r border-white/5 p-6 flex flex-col h-screen sticky top-0">
        <div className="mb-10 text-center">
          <h2 className="text-[#d1a661] text-2xl font-black italic">UPLOC</h2>
          <p className="text-zinc-500 text-[10px] uppercase mt-1 font-bold tracking-[3px]">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-2">
          {['equipamentos', 'professores', 'reservas', 'horarios'].map((id) => (
            <button key={id} onClick={() => setAbaAtiva(id)} className={`w-full text-left p-4 rounded-xl transition-all font-bold text-sm uppercase tracking-widest ${abaAtiva === id ? 'bg-[#d1a661] text-black' : 'text-zinc-400 hover:text-[#d1a661] hover:bg-white/5'}`}>
              {id}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex justify-between items-end">
            <h1 className="text-4xl font-bold capitalize">{abaAtiva}</h1>
            {abaAtiva !== 'reservas' && (
              <button onClick={() => {
                setEditandoId(null);
                if (abaAtiva === 'professores') setShowModalProf(true);
                else if (abaAtiva === 'equipamentos') setShowModalEquip(true);
                else setShowModalHorario(true);
              }} className="bg-[#d1a661] text-black px-8 py-4 rounded-xl font-black text-xs uppercase shadow-lg hover:scale-105 transition-transform">
                + Novo {abaAtiva.slice(0, -1)}
              </button>
            )}
          </div>

          {/* FILTROS */}
          <div className="flex flex-wrap gap-4 items-center bg-[#111] p-4 rounded-2xl border border-white/5 shadow-xl">
            <input 
              type="text" 
              placeholder={`Pesquisar...`} 
              value={busca} 
              onChange={(e) => setBusca(e.target.value)} 
              className="flex-1 min-w-[200px] bg-zinc-900 border border-white/5 rounded-xl px-5 py-3 text-sm outline-none focus:border-[#d1a661]/50" 
            />
            {abaAtiva === 'reservas' && (
              <>
                <input type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-400 outline-none" />
                <select value={filtroHorario} onChange={(e) => setFiltroHorario(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-400 outline-none">
                  <option value="">Todos os Horários</option>
                  <option value="07:30">07:30</option><option value="08:20">08:20</option><option value="09:10">09:10</option>
                </select>
              </>
            )}
          </div>
        </div>

        <div className="bg-[#111] rounded-[30px] border border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-zinc-900/50 border-b border-white/5">
              <tr>
                <th className="p-6 text-[#d1a661] text-[10px] uppercase font-black tracking-widest">Informações</th>
                {abaAtiva === 'reservas' && <th className="p-6 text-[#d1a661] text-[10px] uppercase font-black tracking-widest">Data / Horário</th>}
                <th className="p-6 text-[#d1a661] text-[10px] uppercase font-black tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="3" className="p-10 text-center text-zinc-500 animate-pulse font-bold uppercase text-xs">Carregando...</td></tr>
              ) : dadosFiltrados.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition group">
                  <td className="p-6">
                    <div className="flex items-center gap-5">
                      {abaAtiva === 'horarios' ? (
                        <div>
                          <p className="text-white font-bold text-lg">{item.label}</p>
                          {/* CORREÇÃO AQUI: Adicionado verificação antes do slice */}
                          <p className="text-[#d1a661] text-xs font-mono">
                            {item.hora_inicio?.slice(0, 5)} — {item.hora_fim?.slice(0, 5)}
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden flex items-center justify-center">
                            <img src={item.equipamentos?.imagem || item.imagem || item.avatar_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-white font-bold text-lg leading-tight">{item.equipamentos?.nome || item.nome || item.nome_completo || `Reserva #${String(item.id).substring(0, 5)}`}</p>
                            <p className="text-zinc-500 text-[10px] uppercase font-bold mt-1">{item.categoria || item.email || item.professor_email}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  {abaAtiva === 'reservas' && (
                    <td className="p-6">
                      <p className="text-white font-bold text-sm">{item.data_reserva ? new Date(item.data_reserva).toLocaleDateString('pt-BR') : '---'}</p>
                      <p className="text-[#d1a661] text-[10px] font-black uppercase">{item.horario_inicio}</p>
                    </td>
                  )}
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                      {abaAtiva === 'reservas' && (
                        <button onClick={() => setVerReserva(item)} className="bg-white/5 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase hover:bg-[#d1a661] transition-all">Informações</button>
                      )}
                      {abaAtiva !== 'reservas' && (
                        <button onClick={() => {
                          setEditandoId(item.id);
                          if (abaAtiva === 'equipamentos') { setNovoEquip({ nome: item.nome, categoria: item.categoria, imagem: item.imagem }); setShowModalEquip(true); }
                          else if (abaAtiva === 'professores') { setNovoProf({ nome: item.nome_completo, email: item.email, senha: item.senha, imagem: item.avatar_url }); setShowModalProf(true); }
                          else { setNovoHorario({ hora_inicio: item.hora_inicio, hora_fim: item.hora_fim, label: item.label }); setShowModalHorario(true); }
                        }} className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-[10px] font-black uppercase hover:bg-blue-500 hover:text-white transition-all">Editar</button>
                      )}
                      <button onClick={() => handleExcluir(item.id)} className="bg-red-500/10 text-red-400 px-4 py-2 rounded-full text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL INFORMAÇÕES (Ficha técnica) */}
      {verReserva && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-[#111] border border-white/10 p-10 rounded-[40px] w-full max-w-lg relative">
            <h2 className="text-2xl font-black text-[#d1a661] uppercase italic mb-8">Ficha da Reserva</h2>
            <div className="space-y-6">
              <div className="flex gap-4 p-5 bg-white/5 rounded-3xl border border-white/5">
                <img src={verReserva.equipamentos?.imagem} className="w-24 h-24 rounded-2xl object-cover" />
                <div><p className="text-[#d1a661] text-[10px] font-black uppercase">Equipamento</p><p className="text-xl font-bold">{verReserva.equipamentos?.nome}</p><p className="text-zinc-500 text-sm">{verReserva.equipamentos?.categoria}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl"><p className="text-[#d1a661] text-[10px] font-black uppercase">Professor</p><p className="text-sm font-bold truncate">{verReserva.professor_email}</p></div>
                <div className="p-4 bg-white/5 rounded-2xl"><p className="text-[#d1a661] text-[10px] font-black uppercase">Data e Horário</p><p className="text-sm font-bold">{verReserva.data_reserva} - {verReserva.horario_inicio}</p></div>
              </div>
              <div className="p-5 bg-zinc-900 border border-white/5 rounded-2xl">
                <p className="text-[#d1a661] text-[10px] font-black uppercase mb-2">Motivo / Observações</p>
                <p className="text-zinc-300 text-sm italic">{verReserva.observacoes || "Nenhuma observação informada."}</p>
              </div>
            </div>
            <button onClick={fecharModais} className="w-full mt-8 bg-zinc-800 text-white font-black py-4 rounded-xl uppercase text-xs">Fechar</button>
          </div>
        </div>
      )}

      {/* MODAL EQUIPAMENTO */}
      {showModalEquip && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 p-10 rounded-[40px] w-full max-w-md">
            <h2 className="text-2xl font-black mb-8 text-white uppercase text-center">{editandoId ? 'Editar' : 'Novo'} Equipamento</h2>
            <form onSubmit={handleAddEquipamento} className="space-y-4">
              <input required placeholder="Nome" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none" value={novoEquip.nome} onChange={(e) => setNovoEquip({ ...novoEquip, nome: e.target.value })} />
              <select className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none" value={novoEquip.categoria} onChange={(e) => setNovoEquip({ ...novoEquip, categoria: e.target.value })}>
                {['Laboratório', 'Multimídia', 'Informática'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="file" onChange={(e) => handleFileChange(e, 'equipamentos')} className="text-xs text-zinc-500" />
              <button type="submit" disabled={uploading} className="w-full bg-[#d1a661] text-black font-black py-4 rounded-xl uppercase text-xs">Confirmar</button>
              <button onClick={fecharModais} type="button" className="w-full text-zinc-500 text-[10px] uppercase">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PROFESSOR */}
      {showModalProf && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 p-10 rounded-[40px] w-full max-w-md">
            <h2 className="text-2xl font-black mb-8 text-white uppercase text-center">{editandoId ? 'Editar' : 'Novo'} Professor</h2>
            <form onSubmit={handleAddProfessor} className="space-y-4">
              <input required placeholder="Nome Completo" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none" value={novoProf.nome} onChange={(e) => setNovoProf({ ...novoProf, nome: e.target.value })} />
              <input type="email" required placeholder="Email" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none" value={novoProf.email} onChange={(e) => setNovoProf({ ...novoProf, email: e.target.value })} />
              {!editandoId && <input type="password" required placeholder="Senha" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none" value={novoProf.senha} onChange={(e) => setNovoProf({ ...novoProf, senha: e.target.value })} />}
              <input type="file" onChange={(e) => handleFileChange(e, 'professores')} className="text-xs text-zinc-500" />
              <button type="submit" disabled={uploading} className="w-full bg-[#d1a661] text-black font-black py-4 rounded-xl uppercase text-xs">Salvar</button>
              <button onClick={fecharModais} type="button" className="w-full text-zinc-500 text-[10px] uppercase">Fechar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HORÁRIO */}
      {showModalHorario && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 p-10 rounded-[40px] w-full max-w-md">
            <h2 className="text-2xl font-black mb-8 text-white uppercase text-center">{editandoId ? 'Editar' : 'Novo'} Horário</h2>
            <form onSubmit={handleAddHorario} className="space-y-4">
              <input required placeholder="Ex: 1º Tempo Manhã" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none" value={novoHorario.label} onChange={(e) => setNovoHorario({ ...novoHorario, label: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <input required type="time" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none" value={novoHorario.hora_inicio} onChange={(e) => setNovoHorario({ ...novoHorario, hora_inicio: e.target.value })} />
                <input required type="time" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none" value={novoHorario.hora_fim} onChange={(e) => setNovoHorario({ ...novoHorario, hora_fim: e.target.value })} />
              </div>
              <button type="submit" className="w-full bg-[#d1a661] text-black font-black py-4 rounded-xl uppercase text-xs">Salvar</button>
              <button onClick={fecharModais} type="button" className="w-full text-zinc-500 text-[10px] uppercase">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
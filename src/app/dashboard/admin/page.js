'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; 

export default function AdminDashboard() {
  const [abaAtiva, setAbaAtiva] = useState('equipamentos');
  const [dados, setDados] = useState([]);
  const [reservasAtuais, setReservasAtuais] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [agora, setAgora] = useState(new Date());

  // Estados de Modais e Edição
  const [showModalProf, setShowModalProf] = useState(false);
  const [showModalEquip, setShowModalEquip] = useState(false);
  const [editandoId, setEditandoId] = useState(null); 

  // Estados de Formulários
  const [novoProf, setNovoProf] = useState({ nome: '', email: '', senha: '' });
  const [novoEquip, setNovoEquip] = useState({ nome: '', categoria: 'Multimídia', imagem: '' });
  const [uploading, setUploading] = useState(false);

  const supabase = createClient();

  // Atualiza o relógio para o contador das reservas
  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      if (abaAtiva === 'equipamentos') {
        const { data: resData } = await supabase.from('reservas').select('*');
        setReservasAtuais(resData || []);
      }

      const tabelas = { equipamentos: 'equipamentos', professores: 'perfis', reservas: 'reservas' };
      const tabelaAlvo = tabelas[abaAtiva] || abaAtiva;
      
      let query = supabase.from(tabelaAlvo).select('*');
      if (abaAtiva === 'professores') query = query.eq('role', 'professor');

      const { data, error } = await query;
      if (!error) setDados(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    setBusca('');
  }, [abaAtiva]);

  // --- LÓGICA DE IMAGEM ---
  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `equipamentos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('imagens')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('imagens').getPublicUrl(filePath);
      setNovoEquip(prev => ({ ...prev, imagem: data.publicUrl }));
    } catch (error) {
      alert("Erro no upload: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  // --- LÓGICA DE EQUIPAMENTOS (SALVAR/EDITAR) ---
  function handleEditarEquip(item) {
    setEditandoId(item.id);
    setNovoEquip({
      nome: item.nome,
      categoria: item.categoria || 'Multimídia',
      imagem: item.imagem || ''
    });
    setShowModalEquip(true);
  }

  async function handleAddEquipamento(e) {
    e.preventDefault();
    const payload = { ...novoEquip };

    let res;
    if (editandoId) {
      res = await supabase.from('equipamentos').update(payload).eq('id', editandoId);
    } else {
      res = await supabase.from('equipamentos').insert([payload]);
    }

    if (res.error) alert(res.error.message);
    else {
      setShowModalEquip(false);
      setEditandoId(null);
      setNovoEquip({ nome: '', categoria: 'Multimídia', imagem: '' });
      fetchData();
    }
  }

  // --- LÓGICA DE EXCLUSÃO ---
  async function handleExcluir(id) {
    if (confirm(`Excluir este registro de ${abaAtiva}?`)) {
      const tabelas = { equipamentos: 'equipamentos', professores: 'perfis', reservas: 'reservas' };
      const { error } = await supabase.from(tabelas[abaAtiva]).delete().eq('id', id);
      if (error) alert(error.message);
      else fetchData();
    }
  }

  // --- CADASTRO PROFESSOR ---
  async function handleAddProfessor(e) {
    e.preventDefault();
    const { error } = await supabase.from('perfis').insert([
      { nome_completo: novoProf.nome, email: novoProf.email, role: 'professor' }
    ]);
    if (error) alert(error.message);
    else {
      setShowModalProf(false);
      setNovoProf({ nome: '', email: '', senha: '' });
      fetchData();
    }
  }

  // --- HELPERS DE RENDERIZAÇÃO ---
  function getStatusEquipamento(nomeEquipamento) {
    const reservaAtiva = reservasAtuais.find(r => {
      if (r.equipamento_nome !== nomeEquipamento) return false;
      const [h, m] = (r.horario_inicio || "00:00").split(':');
      const dataFim = new Date();
      dataFim.setHours(parseInt(h), parseInt(m) + 50, 0);
      return dataFim > agora;
    });
    return reservaAtiva ? 'ocupado' : 'disponivel';
  }

  const dadosFiltrados = dados.filter(item => {
    const nome = (item.nome || item.nome_completo || item.equipamento_nome || "").toLowerCase();
    return nome.includes(busca.toLowerCase());
  });

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111] border-r border-white/5 p-6 flex flex-col h-screen sticky top-0">
        <div className="mb-10 text-center">
          <h2 className="text-[#d1a661] text-2xl font-black tracking-tighter italic">UPLOC</h2>
          <p className="text-zinc-500 text-[10px] uppercase mt-1 font-bold tracking-[3px]">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-2">
          {['equipamentos', 'professores', 'reservas'].map((id) => (
            <button key={id} onClick={() => setAbaAtiva(id)} className={`w-full text-left p-4 rounded-xl transition-all font-bold text-sm uppercase tracking-widest ${abaAtiva === id ? 'bg-[#d1a661] text-black' : 'text-zinc-400 hover:text-[#d1a661] hover:bg-white/5'}`}>
              {id}
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-end mb-10 gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white capitalize tracking-tight mb-4">{abaAtiva}</h1>
            <input 
              type="text" 
              placeholder="Pesquisar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full max-w-md bg-[#111] border border-white/5 rounded-xl px-5 py-3 text-sm outline-none focus:border-[#d1a661]/50"
            />
          </div>
          
          {(abaAtiva === 'professores' || abaAtiva === 'equipamentos') && (
            <button onClick={() => { setEditandoId(null); setNovoEquip({nome:'', categoria:'Multimídia', imagem:''}); abaAtiva === 'professores' ? setShowModalProf(true) : setShowModalEquip(true) }} className="bg-[#d1a661] text-black px-8 py-4 rounded-xl font-black text-xs uppercase shadow-lg hover:scale-105 transition-transform">
              + Novo {abaAtiva === 'professores' ? 'Professor' : 'Equipamento'}
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-[#d1a661] animate-pulse text-center mt-20 font-black tracking-widest uppercase">Carregando dados...</div>
        ) : (
          <div className="bg-[#111] rounded-[30px] border border-white/5 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-zinc-900/50 border-b border-white/5">
                <tr>
                  <th className="p-6 text-[#d1a661] text-[10px] uppercase font-black tracking-widest">Informações</th>
                  <th className="p-6 text-[#d1a661] text-[10px] uppercase font-black tracking-widest text-center">Gestão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dadosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition group">
                    <td className="p-6">
                      <div className="flex items-center gap-5">
                        {abaAtiva === 'equipamentos' && (
                          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0">
                            {item.imagem ? <img src={item.imagem} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-700 font-bold">N/A</div>}
                          </div>
                        )}
                        <div>
                          <p className="text-white font-bold text-lg leading-tight">{item.nome || item.nome_completo || item.equipamento_nome}</p>
                          <p className="text-zinc-500 text-xs mt-1">{item.email || item.categoria || item.professor_nome}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center gap-2">
                        {abaAtiva === 'equipamentos' && (
                          <button onClick={() => handleEditarEquip(item)} className="bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all">Editar</button>
                        )}
                        <button onClick={() => handleExcluir(item.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all">Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MODAL EQUIPAMENTO (CADASTRO E EDIÇÃO) */}
      {showModalEquip && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 p-10 rounded-[40px] w-full max-w-md">
            <h2 className="text-2xl font-black mb-8 text-white uppercase text-center">
              {editandoId ? 'Editar' : 'Novo'} <span className="text-[#d1a661]">Equipamento</span>
            </h2>
            <form onSubmit={handleAddEquipamento} className="space-y-6">
              <input required placeholder="Nome do Equipamento" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#d1a661]/50" value={novoEquip.nome} onChange={(e) => setNovoEquip({...novoEquip, nome: e.target.value})} />
              
              <div className="space-y-3">
                <p className="text-[10px] text-zinc-500 uppercase font-black ml-1">Imagem do Produto</p>
                <div className="w-full h-32 bg-zinc-900 rounded-2xl border border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                  {novoEquip.imagem ? <img src={novoEquip.imagem} className="w-full h-full object-cover" /> : <span className="text-zinc-700 text-xs">Aguardando upload...</span>}
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-[#d1a661]/10 file:text-[#d1a661] cursor-pointer" />
              </div>

              <button type="submit" disabled={uploading} className="w-full bg-[#d1a661] text-black font-black py-4 rounded-xl uppercase text-xs tracking-widest disabled:opacity-50">
                {uploading ? 'Processando Imagem...' : 'Salvar Alterações'}
              </button>
              <button onClick={() => setShowModalEquip(false)} type="button" className="w-full text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PROFESSOR */}
      {showModalProf && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 p-10 rounded-[40px] w-full max-w-md">
            <h2 className="text-2xl font-black mb-8 text-white uppercase text-center">Novo <span className="text-[#d1a661]">Professor</span></h2>
            <form onSubmit={handleAddProfessor} className="space-y-4">
              <input required placeholder="Nome Completo" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none" value={novoProf.nome} onChange={(e) => setNovoProf({...novoProf, nome: e.target.value})} />
              <input type="email" required placeholder="Email Acadêmico" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none" value={novoProf.email} onChange={(e) => setNovoProf({...novoProf, email: e.target.value})} />
              <button type="submit" className="w-full bg-[#d1a661] text-black font-black py-4 rounded-xl uppercase text-xs tracking-widest">Cadastrar Docente</button>
              <button onClick={() => setShowModalProf(false)} type="button" className="w-full text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Voltar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
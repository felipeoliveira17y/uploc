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

  const [showModalProf, setShowModalProf] = useState(false);
  const [showModalEquip, setShowModalEquip] = useState(false);

  const [novoProf, setNovoProf] = useState({ nome: '', email: '', senha: '' });
  const [novoEquip, setNovoEquip] = useState({ nome: '', categoria: 'Multimídia', imagem: '' });
  const [uploading, setUploading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function fetchData() {
    setLoading(true);
    if (abaAtiva === 'equipamentos') {
      const { data: resData } = await supabase.from('reservas').select('*');
      setReservasAtuais(resData || []);
    }

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
    setBusca('');
  }, [abaAtiva]);

  const dadosFiltrados = dados.filter(item => {
    const nomeItem = (item.nome || item.nome_completo || item.equipamento_nome || "").toLowerCase();
    return nomeItem.includes(busca.toLowerCase());
  });

  // --- LOGICA DE EXCLUSÃO ---
  async function handleExcluir(id) {
    const confirmacao = confirm(`Tem certeza que deseja excluir este registro de ${abaAtiva}?`);
    
    if (confirmacao) {
      const tabelas = {
        equipamentos: 'equipamentos',
        professores: 'perfis',
        reservas: 'reservas'
      };

      const { error } = await supabase
        .from(tabelas[abaAtiva])
        .delete()
        .eq('id', id);

      if (error) {
        alert("Erro ao excluir: " + error.message);
      } else {
        fetchData(); // Atualiza a lista automaticamente
      }
    }
  }

  // --- HANDLERS DE CADASTRO ---
  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `equipamentos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('imagens') // Certifique-se que o bucket 'imagens' existe no Supabase
      .upload(filePath, file);

    if (uploadError) {
      alert("Erro no upload: " + uploadError.message);
    } else {
      const { data } = supabase.storage.from('imagens').getPublicUrl(filePath);
      setNovoEquip({ ...novoEquip, imagem: data.publicUrl });
    }
    setUploading(false);
  }

  async function handleAddEquipamento(e) {
    e.preventDefault();
    const { error } = await supabase.from('equipamentos').insert([novoEquip]);
    if (error) alert(error.message);
    else {
      setShowModalEquip(false);
      setNovoEquip({ nome: '', categoria: 'Multimídia', imagem: '' });
      fetchData();
    }
  }

  async function handleAddProfessor(e) {
    e.preventDefault();
    // Nota: Para criar usuários com senha, idealmente usa-se uma Edge Function ou a API de Admin do Auth.
    // Aqui estamos simulando a inserção no perfil.
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

  function renderDetalhesReserva(item) {
    if (abaAtiva === 'equipamentos') {
      const status = getStatusEquipamento(item.nome);
      return (
        <div className="flex flex-col gap-1">
          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">{item.categoria}</span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'disponivel' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
            <span className={`text-[9px] uppercase font-black tracking-widest ${status === 'disponivel' ? 'text-green-500' : 'text-red-500'}`}>
              {status === 'disponivel' ? 'Disponível' : 'Em Uso / Reservado'}
            </span>
          </div>
        </div>
      );
    }

    if (abaAtiva === 'professores') {
      return (
        <div className="flex flex-col gap-1">
          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Docente</span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${item.last_sign_in_at ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
            <span className="text-[9px] uppercase font-black tracking-widest text-zinc-400">
              {item.last_sign_in_at ? 'Ativo no Sistema' : 'Pendente'}
            </span>
          </div>
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
    return (
      <div className="flex items-center gap-3">
        <span className="text-zinc-400 font-medium">{item.horario_inicio} — {horaFimFormatada}</span>
        <span className="bg-uploc-gold text-black px-2 py-0.5 rounded text-[10px] font-black animate-pulse">
          {mins.toString().padStart(2, '0')}:{segs.toString().padStart(2, '0')}
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111] border-r border-white/5 p-6 flex flex-col h-screen sticky top-0 z-40">
        <div className="mb-10 text-center">
          <h2 className="text-[#d1a661] text-2xl font-black tracking-tighter italic">UPLOC</h2>
          <p className="text-zinc-500 text-[10px] uppercase mt-1 font-bold tracking-[3px]">Admin</p>
        </div>
        <nav className="flex-1 space-y-2">
          {['equipamentos', 'professores', 'reservas'].map((id) => (
            <button key={id} onClick={() => setAbaAtiva(id)} className={`w-full text-left p-4 rounded-xl transition-all font-bold text-sm uppercase tracking-widest ${abaAtiva === id ? 'bg-[#d1a661] text-black' : 'text-zinc-400 hover:text-[#d1a661] hover:bg-white/5'}`}>
              {id}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-end mb-10 gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white capitalize tracking-tight mb-2">{abaAtiva}</h1>
            <input 
              type="text" 
              placeholder="Buscar por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full max-w-md bg-[#111] border border-white/5 rounded-xl px-5 py-3 text-white text-sm outline-none focus:border-[#d1a661]/50"
            />
          </div>
          
          {(abaAtiva === 'professores' || abaAtiva === 'equipamentos') && (
            <button onClick={() => abaAtiva === 'professores' ? setShowModalProf(true) : setShowModalEquip(true)} className="bg-[#d1a661] text-black px-8 py-4 rounded-xl font-black text-xs uppercase shadow-lg">
              + Novo {abaAtiva === 'professores' ? 'Professor' : 'Equipamento'}
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-[#d1a661] animate-pulse text-center mt-20 font-bold uppercase">Sincronizando...</div>
        ) : (
          <div className="bg-[#111] rounded-[30px] border border-white/5 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-zinc-900/50 border-b border-white/5">
                <tr>
                  <th className="p-6 text-[#d1a661] text-[10px] uppercase font-black">Registro</th>
                  <th className="p-6 text-[#d1a661] text-[10px] uppercase font-black text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dadosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition group">
                    <td className="p-6">
                      <div className="flex items-center gap-5">
                        {abaAtiva === 'equipamentos' && (
                          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {item.imagem ? <img src={item.imagem} className="w-full h-full object-cover" /> : <span className="text-zinc-700 text-[8px] font-bold italic text-center">SEM FOTO</span>}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-lg leading-tight">{item.nome || item.nome_completo || item.equipamento_nome}</span>
                          <div className="text-sm">{renderDetalhesReserva(item)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <button onClick={() => handleExcluir(item.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MODAL PROFESSOR E EQUIPAMENTO (Similares ao seu original) */}
      {showModalProf && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-[#111] border border-white/10 p-10 rounded-[40px] w-full max-w-md">
             <h2 className="text-2xl font-black mb-8 text-white uppercase text-center">Novo <span className="text-[#d1a661]">Professor</span></h2>
             <form onSubmit={handleAddProfessor} className="space-y-4">
               <input required placeholder="Nome Completo" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none" value={novoProf.nome} onChange={(e) => setNovoProf({...novoProf, nome: e.target.value})} />
               <input type="email" required placeholder="Email" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none" value={novoProf.email} onChange={(e) => setNovoProf({...novoProf, email: e.target.value})} />
               <button type="submit" className="w-full bg-[#d1a661] text-black font-black py-4 rounded-xl uppercase text-xs">Cadastrar</button>
               <button onClick={() => setShowModalProf(false)} type="button" className="w-full text-zinc-500 text-[10px] uppercase font-bold">Cancelar</button>
             </form>
           </div>
        </div>
      )}

      {showModalEquip && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-[#111] border border-white/10 p-10 rounded-[40px] w-full max-w-md">
             <h2 className="text-2xl font-black mb-8 text-white uppercase text-center">Novo <span className="text-[#d1a661]">Equipamento</span></h2>
             <form onSubmit={handleAddEquipamento} className="space-y-4">
               <input required placeholder="Nome" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none" value={novoEquip.nome} onChange={(e) => setNovoEquip({...novoEquip, nome: e.target.value})} />
               <input type="file" onChange={handleFileChange} className="text-xs text-zinc-400" />
               <button type="submit" disabled={uploading} className="w-full bg-[#d1a661] text-black font-black py-4 rounded-xl uppercase text-xs">
                 {uploading ? 'Enviando Foto...' : 'Salvar Equipamento'}
               </button>
               <button onClick={() => setShowModalEquip(false)} type="button" className="w-full text-zinc-500 text-[10px] uppercase font-bold">Cancelar</button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}
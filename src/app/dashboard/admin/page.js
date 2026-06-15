'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const [abaAtiva, setAbaAtiva] = useState('equipamentos');
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  const [showModalProf, setShowModalProf] = useState(false);
  const [showModalEquip, setShowModalEquip] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [novoProf, setNovoProf] = useState({ nome: '', email: '', senha: '', imagem: '' });
  
  const [novoEquip, setNovoEquip] = useState({ 
    nome: '', 
    categoria: 'Multimídia', 
    imagem: '',
    patrimonio: '',           
    marca: '',               
    modelo: '',              
    numero_serie: '',        
    estado_conservacao: 'Bom', 
    observacoes: ''          
  });
  const [uploading, setUploading] = useState(false);

  const supabase = createClient();

  async function fetchData() {
    setLoading(true);
    setDados([]); // Limpa os dados da aba anterior imediatamente
    try {
      const tabelas = { equipamentos: 'equipamentos', professores: 'perfis', reservas: 'reservas' };
      const tabelaAlvo = tabelas[abaAtiva] || abaAtiva;

      let query = supabase.from(tabelaAlvo).select('*');
      
      if (abaAtiva === 'professores') {
        query = query.eq('role', 'professor');
      }
      
      // ORDENAÇÃO ESPECÍFICA PARA CADA TABELA:
      if (abaAtiva === 'equipamentos') {
        query = query.order('nome', { ascending: true }); // Ordena equipamentos por nome
      } else if (abaAtiva === 'professores') {
        query = query.order('nome_completo', { ascending: true }); // Ordena professores por nome completo
      } else if (abaAtiva === 'reservas') {
        query = query.order('created_at', { ascending: false }); // Reservas geralmente usam criacao (ou mude para 'id')
      }

      const { data, error } = await query;
      if (error) {
        console.error("Erro Supabase:", error.message);
      } else {
        setDados(data || []);
      }
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

  // --- LÓGICA DE DEVOLUÇÃO ---
  async function handleDevolucao(reserva) {
    if (!confirm("Confirmar a devolução deste equipamento?")) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('reservas')
        .update({ 
          status_reserva: 'finalizada',
          data_devolucao_real: new Date().toISOString() 
        })
        .eq('id', reserva.id);

      if (error) throw error;

      alert("Devolução registrada com sucesso!");
      fetchData();
    } catch (error) {
      alert("Erro ao processar devolução: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  // --- LÓGICA DE UPLOAD ---
  async function handleFileChange(e, tipo) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `${tipo}-${Math.random()}.${file.name.split('.').pop()}`;
      const filePath = `${tipo}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('imagens').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('imagens').getPublicUrl(filePath);
      
      if (tipo === 'professores') setNovoProf(prev => ({ ...prev, imagem: data.publicUrl }));
      else setNovoEquip(prev => ({ ...prev, imagem: data.publicUrl }));
    } catch (error) {
      alert("Erro no upload: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleAddEquipamento(e) {
    e.preventDefault();
    const payload = { ...novoEquip };
    const res = editandoId 
      ? await supabase.from('equipamentos').update(payload).eq('id', editandoId)
      : await supabase.from('equipamentos').insert([payload]);

    if (res.error) alert(res.error.message);
    else {
      setShowModalEquip(false);
      setEditandoId(null);
      setNovoEquip({ 
        nome: '', 
        categoria: 'Multimídia', 
        imagem: '', 
        patrimonio: '', 
        marca: '', 
        modelo: '', 
        numero_serie: '', 
        estado_conservacao: 'Bom', 
        observacoes: '' 
      });
      fetchData();
    }
  }

  async function handleAddProfessor(e) {
    e.preventDefault();
    const payload = { 
      nome_completo: novoProf.nome, 
      email: novoProf.email, 
      senha: novoProf.senha, 
      avatar_url: novoProf.imagem, 
      role: 'professor' 
    };
    const res = editandoId 
      ? await supabase.from('perfis').update(payload).eq('id', editandoId)
      : await supabase.from('perfis').insert([payload]);

    if (res.error) alert(res.error.message);
    else {
      setShowModalProf(false);
      setEditandoId(null);
      setNovoProf({ nome: '', email: '', senha: '', imagem: '' });
      fetchData();
    }
  }

  async function handleExcluir(id) {
    if (confirm(`Excluir este registro permanentemente?`)) {
      const tabelas = { equipamentos: 'equipamentos', professores: 'perfis', reservas: 'reservas' };
      const { error } = await supabase.from(tabelas[abaAtiva]).delete().eq('id', id);
      if (error) alert(error.message); else fetchData();
    }
  }

  // Tratamento preventivo para strings nulas no filtro de busca
  const dadosFiltrados = dados.filter(item => {
    const nome = item.nome || "";
    const nomeCompleto = item.nome_completo || "";
    const emailProf = item.professor_email || "";
    const patrimonio = item.patrimonio || "";

    const termo = `${nome} ${nomeCompleto} ${emailProf} ${patrimonio}`.toLowerCase();
    return termo.includes(busca.toLowerCase());
  });

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111] border-r border-white/5 p-6 flex flex-col h-screen sticky top-0">
        <div className="mb-10 text-center">
          <h2 className="text-[#d1a661] text-2xl font-black italic">UPLOC</h2>
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

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-end mb-10 gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold capitalize mb-4">{abaAtiva}</h1>
            <input type="text" placeholder={`Pesquisar em ${abaAtiva}...`} value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full max-w-md bg-[#111] border border-white/5 rounded-xl px-5 py-3 text-sm outline-none focus:border-[#d1a661]/50" />
          </div>
          {abaAtiva !== 'reservas' && (
            <button onClick={() => { setEditandoId(null); abaAtiva === 'professores' ? setShowModalProf(true) : setShowModalEquip(true) }} className="bg-[#d1a661] text-black px-8 py-4 rounded-xl font-black text-xs uppercase shadow-lg hover:scale-105 transition-transform">
              + Novo {abaAtiva === 'professores' ? 'Professor' : 'Equipamento'}
            </button>
          )}
        </div>

        <div className="bg-[#111] rounded-[30px] border border-white/5 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-20 text-center text-[#d1a661] font-bold uppercase text-xs tracking-widest animate-pulse">Buscando informações...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-zinc-900/50 border-b border-white/5">
                <tr>
                  <th className="p-6 text-[#d1a661] text-[10px] uppercase font-black tracking-widest">
                    {abaAtiva === 'reservas' ? 'Detalhes da Reserva' : 'Informações'}
                  </th>
                  <th className="p-6 text-[#d1a661] text-[10px] uppercase font-black tracking-widest text-center">Ações / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dadosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition group">
                    <td className="p-6">
                      <div className="flex items-center gap-5">
                        {abaAtiva !== 'reservas' && (
                          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0">
                            <img src={item.imagem || item.avatar_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-bold text-lg leading-tight">
                            {item.nome || item.nome_completo || `Reserva #${item.id}`}
                          </p>
                          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-1">
                            {abaAtiva === 'reservas' 
                              ? `${item.professor_email} • ${item.data_reserva} • ${item.horario_inicio}` 
                              : (item.patrimonio 
                                  ? `Patrimônio: ${item.patrimonio} • ${item.marca || ''} (${item.estado_conservacao || 'Bom'})` 
                                  : `Categoria: ${item.categoria || 'Não informada'} ${item.email || ''}`)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center gap-2">
                        {abaAtiva === 'reservas' ? (
                          <>
                            {item.status_reserva !== 'finalizada' ? (
                              <button onClick={() => handleDevolucao(item)} className="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all">
                                Dar Baixa
                              </button>
                            ) : (
                              <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Finalizada</span>
                            )}
                            <button onClick={() => handleExcluir(item.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all">Excluir</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => {
                              setEditandoId(item.id);
                              if(abaAtiva === 'equipamentos') {
                                setNovoEquip({ 
                                  nome: item.nome || '', 
                                  categoria: item.categoria || 'Multimídia', 
                                  imagem: item.imagem || '',
                                  patrimonio: item.patrimonio || '',
                                  marca: item.marca || '',
                                  modelo: item.modelo || '',
                                  numero_serie: item.numero_serie || '',
                                  estado_conservacao: item.estado_conservacao || 'Bom',
                                  observacoes: item.observacoes || ''
                                });
                                setShowModalEquip(true);
                              } else {
                                setNovoProf({ nome: item.nome_completo || '', email: item.email || '', senha: item.senha || '', imagem: item.avatar_url || '' });
                                setShowModalProf(true);
                              }
                            }} className="bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all">Editar</button>
                            <button onClick={() => handleExcluir(item.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all">Excluir</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && dadosFiltrados.length === 0 && <div className="p-20 text-center text-zinc-700 font-bold uppercase text-xs tracking-widest">Nenhum registro encontrado</div>}
        </div>
      </main>

      {/* MODAL PROFESSOR */}
      {showModalProf && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 p-10 rounded-[40px] w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black mb-8 text-white uppercase text-center">{editandoId ? 'Editar' : 'Novo'} <span className="text-[#d1a661]">Professor</span></h2>
            <form onSubmit={handleAddProfessor} className="space-y-4">
              <input required placeholder="Nome Completo" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#d1a661]/50 text-sm" value={novoProf.nome} onChange={(e) => setNovoProf({...novoProf, nome: e.target.value})} />
              <input type="email" required placeholder="Email" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#d1a661]/50 text-sm" value={novoProf.email} onChange={(e) => setNovoProf({...novoProf, email: e.target.value})} />
              <input type="password" required placeholder="Senha" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#d1a661]/50 text-sm" value={novoProf.senha} onChange={(e) => setNovoProf({...novoProf, senha: e.target.value})} />
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'professores')} className="block w-full text-xs text-zinc-500" />
              <button type="submit" disabled={uploading} className="w-full bg-[#d1a661] text-black font-black py-4 rounded-xl uppercase text-xs tracking-widest">{uploading ? 'Aguarde...' : 'Salvar'}</button>
              <button onClick={() => setShowModalProf(false)} type="button" className="w-full text-zinc-500 text-[10px] uppercase font-bold tracking-widest pt-2">Fechar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EQUIPAMENTO */}
      {showModalEquip && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 p-10 rounded-[40px] w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-black mb-6 text-white uppercase text-center">{editandoId ? 'Editar' : 'Novo'} <span className="text-[#d1a661]">Equipamento</span></h2>
            
            <form onSubmit={handleAddEquipamento} className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Nome</label>
                <input required placeholder="Ex: Câmera Mirrorless" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#d1a661]/50 text-sm" value={novoEquip.nome} onChange={(e) => setNovoEquip({...novoEquip, nome: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Categoria</label>
                  <select className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none text-sm h-[46px]" value={novoEquip.categoria} onChange={(e) => setNovoEquip({...novoEquip, categoria: e.target.value})}>
                    {['Laboratório', 'Multimídia', 'Informática', 'Fotografia', 'Áudio', 'Vídeo'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Nº de Patrimônio</label>
                  <input required placeholder="Ex: PAT-2026-88" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#d1a661]/50 toughness text-sm" value={novoEquip.patrimonio} onChange={(e) => setNovoEquip({...novoEquip, patrimonio: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Marca</label>
                  <input required placeholder="Ex: Sony" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#d1a661]/50 text-sm" value={novoEquip.marca} onChange={(e) => setNovoEquip({...novoEquip, marca: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Modelo</label>
                  <input required placeholder="Ex: Alpha a7 III" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#d1a661]/50 text-sm" value={novoEquip.modelo} onChange={(e) => setNovoEquip({...novoEquip, modelo: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Número de Série</label>
                  <input required placeholder="Ex: SN-8839210" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#d1a661]/50 text-sm" value={novoEquip.numero_serie} onChange={(e) => setNovoEquip({...novoEquip, numero_serie: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Estado de Conservação</label>
                  <select className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none text-sm h-[46px]" value={novoEquip.estado_conservacao} onChange={(e) => setNovoEquip({...novoEquip, estado_conservacao: e.target.value})}>
                    {['Excelente', 'Bom', 'Regular', 'Ruim'].map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Observações Gerais</label>
                <textarea placeholder="Ex: Riscos leves na carcaça lateral, lente sem poeira." className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#d1a661]/50 text-sm min-h-[60px] resize-none" value={novoEquip.observacoes} onChange={(e) => setNovoEquip({...novoEquip, observacoes: e.target.value})} />
              </div>

              <div>
                <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Foto do Equipamento</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'equipamentos')} className="block w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer" />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={uploading} className="w-full bg-[#d1a661] text-black font-black py-4 rounded-xl uppercase text-xs tracking-widest shadow-lg hover:scale-[1.02] transition-transform">
                  {uploading ? 'Processando Upload...' : 'Confirmar Registro'}
                </button>
                <button onClick={() => setShowModalEquip(false)} type="button" className="w-full text-zinc-500 text-[10px] uppercase font-bold tracking-widest pt-4">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
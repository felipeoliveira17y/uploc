'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const [abaAtiva, setAbaAtiva] = useState('equipamentos');
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  // --- CONTROLE DE EXPANSÃO DOS FILTROS ---
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);

  // --- ESTADOS PARA FILTROS AVANÇADOS ---
  const [filtroProf, setFiltroProf] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [listaProfessores, setListaProfessores] = useState([]); 

  const [showModalProf, setShowModalProf] = useState(false);
  const [showModalEquip, setShowModalEquip] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [novoProf, setNovoProf] = useState({ nome: '', email: '', senha: '', imagem: '' });
  
  const [novoEquip, setNovoEquip] = useState({ 
    nome: '', 
    categoria: 'Multimídia', 
    marca: '',
    modelo: '',
    estado_conservacao: 'Bom',
    imagem: '', 
    status: 'disponivel'
  });
  const [uploading, setUploading] = useState(false);

  const supabase = createClient();

  async function carregarProfessoresParaFiltro() {
    try {
      const { data } = await supabase.from('perfis').select('id, nome_completo, email').eq('role', 'professor').order('nome_completo', { ascending: true });
      if (data) setListaProfessores(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchData() {
    setLoading(true);
    setDados([]); 
    try {
      const tabelas = { equipamentos: 'equipamentos', professores: 'perfis', reservas: 'reservas' };
      const tabelaAlvo = tabelas[abaAtiva] || abaAtiva;

      let query = supabase.from(tabelaAlvo).select('*');
      
      if (abaAtiva === 'professores') {
        query = query.eq('role', 'professor');
      }
      
      if (abaAtiva === 'equipamentos') {
        query = query.order('nome', { ascending: true });
      } else if (abaAtiva === 'professores') {
        query = query.order('nome_completo', { ascending: true });
      } else if (abaAtiva === 'reservas') {
        query = query.order('created_at', { ascending: false });
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
    carregarProfessoresParaFiltro();
  }, []);

  useEffect(() => {
    fetchData();
    setBusca('');
    setFiltroProf('');
    setFiltroStatus('');
  }, [abaAtiva]);

  async function handleAlternarManutencao(equipamento) {
    const novoStatus = equipamento.status === 'manutencao' ? 'disponivel' : 'manutencao';
    try {
      setLoading(true);
      const { error } = await supabase
        .from('equipamentos')
        .update({ status: novoStatus })
        .eq('id', equipamento.id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      alert("Erro ao alterar manutenção: " + error.message);
    } finally {
      setLoading(false);
    }
  }

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
    
    // Filtramos o payload para enviar ao banco APENAS as colunas válidas existentes
    const payload = {
      nome: novoEquip.nome,
      categoria: novoEquip.categoria,
      marca: novoEquip.marca,
      modelo: novoEquip.modelo,
      estado_conservacao: novoEquip.estado_conservacao,
      imagem: novoEquip.imagem,
      status: novoEquip.status
    };

    const res = editandoId 
      ? await supabase.from('equipamentos').update(payload).eq('id', editandoId)
      : await supabase.from('equipamentos').insert([payload]);

    if (res.error) {
      alert(res.error.message);
    } else {
      setShowModalEquip(false);
      setEditandoId(null);
      setNovoEquip({ 
        nome: '', 
        categoria: 'Multimídia', 
        marca: '', 
        modelo: '', 
        estado_conservacao: 'Bom', 
        imagem: '', 
        status: 'disponivel'
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

  function handleGerarRelatorioProfessor(professor) {
    alert(`Gerando arquivo consolidado de auditoria UPLOC (PDF/CSV) para o docente:\n\n` +
          `Nome: ${professor.nome_completo}\n` +
          `E-mail: ${professor.email}\n\n` +
          `Apenas as reservas deste professor serão consolidadas.`);
  }

  const dadosFiltrados = dados.filter(item => {
    const nome = item.nome || "";
    const nomeCompleto = item.nome_completo || "";
    const emailProf = item.professor_email || item.email || "";
    const termo = `${nome} ${nomeCompleto} ${emailProf}`.toLowerCase();
    const passaBusca = termo.includes(busca.toLowerCase());

    let passaProf = true;
    if (filtroProf) {
      if (abaAtiva === 'reservas') {
        passaProf = item.professor_email === filtroProf;
      } else if (abaAtiva === 'professores') {
        passaProf = item.email === filtroProf;
      }
    }

    let passaStatus = true;
    if (filtroStatus && abaAtiva === 'reservas') {
      passaStatus = item.status_reserva === filtroStatus;
    }

    return passaBusca && passaProf && passaStatus;
  });

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111] border-r border-white/5 p-6 flex flex-col h-screen sticky top-0">
        <div className="mb-10 text-center">
          <h2 className="text-[#d1a661] text-2xl font-black italic tracking-[2px]">UPLOC</h2>
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
        
        {/* TOP BAR / HEADER LIMPO */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-10 gap-6 pb-6 border-b border-white/[0.03]">
          <div>
            <h1 className="text-4xl font-bold capitalize mb-1 tracking-wide">{abaAtiva}</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Supervisão e Auditoria</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setFiltrosExpandidos(!filtrosExpandidos)}
              className={`px-5 py-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 select-none text-xs ${filtrosExpandidos ? 'border-[#d1a661] bg-[#d1a661]/5 text-[#d1a661]' : 'border-white/5 bg-[#111]/60 text-zinc-400 hover:border-white/20'}`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
              <span className="font-medium uppercase tracking-widest">Filtros</span>
            </div>

            {abaAtiva !== 'reservas' && (
              <button onClick={() => { setEditandoId(null); abaAtiva === 'professores' ? setShowModalProf(true) : setShowModalEquip(true) }} className="bg-[#d1a661] text-black px-6 py-3 rounded-xl font-bold text-xs uppercase hover:bg-[#c49852] transition-colors tracking-wider whitespace-nowrap">
                + Novo {abaAtiva === 'professores' ? 'Professor' : 'Equipamento'}
              </button>
            )}
          </div>
        </div>

        {/* FILTROS RETRÁTEIS */}
        <div className={`rounded-2xl bg-[#111]/80 border border-white/5 shadow-xl p-6 flex flex-wrap items-center gap-4 transition-all duration-300 mb-8 ${filtrosExpandidos ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 !p-0 !border-none overflow-hidden !mb-0'}`}>
          <div className="flex-1 min-w-[250px]">
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#d1a661] mb-1.5 block ml-1">Pesquisa Direta</label>
            <input type="text" placeholder={`Procurar termo em ${abaAtiva}...`} value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#d1a661]/50 placeholder:text-zinc-600 h-[40px]" />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#d1a661] mb-1.5 block ml-1">Professor</label>
            <select 
              value={filtroProf} 
              onChange={(e) => setFiltroProf(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-white/5 px-4 py-2.5 text-xs text-zinc-400 focus:outline-none focus:border-[#d1a661]/50 transition-all cursor-pointer h-[40px]"
            >
              <option value="">Todos os Professores</option>
              {listaProfessores.map(prof => (
                <option key={prof.id} value={prof.email}>{prof.nome_completo}</option>
              ))}
            </select>
          </div>

          {abaAtiva === 'reservas' && (
            <div className="flex-1 min-w-[200px]">
              <label className="text-[9px] font-bold uppercase tracking-wider text-[#d1a661] mb-1.5 block ml-1">Status Reserva</label>
              <select 
                value={filtroStatus} 
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-white/5 px-4 py-2.5 text-xs text-zinc-400 focus:outline-none focus:border-[#d1a661]/50 transition-all cursor-pointer h-[40px]"
              >
                <option value="">Todos os Status</option>
                <option value="solicitada">Solicitada / Pendente</option>
                <option value="ativa">Ativa (Em uso)</option>
                <option value="finalizada">Finalizada / Devolvida</option>
              </select>
            </div>
          )}

          {(filtroProf || filtroStatus || busca) && (
            <button 
              onClick={() => { setFiltroProf(''); setFiltroStatus(''); setBusca(''); }}
              className="mt-5 text-zinc-500 hover:text-[#d1a661] text-[10px] uppercase font-bold tracking-widest transition-colors px-2"
            >
              Limpar
            </button>
          )}
        </div>

        {/* TABELA DE REGISTROS */}
        <div className="bg-[#111] rounded-[24px] border border-white/5 overflow-hidden shadow-2xl">
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
                          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0 relative">
                            <img src={item.imagem || item.avatar_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                            {item.status === 'manutencao' && (
                              <div className="absolute inset-0 bg-orange-600/80 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="text-[7px] font-black text-white uppercase tracking-tighter">MNT</span>
                              </div>
                            )}
                          </div>
                        )}
                        <div>
                          <p className="text-white font-bold text-lg leading-tight">
                            {item.nome || item.nome_completo || `Reserva #${item.id}`}
                          </p>
                          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-1">
                            {abaAtiva === 'reservas' 
                              ? `${item.professor_email} • ${item.data_reserva} • ${item.horario_inicio} (${item.status_reserva || 'solicitada'})` 
                              : (item.marca 
                                  ? `${item.marca} (${item.modelo || ''}) • Conservação: ${item.estado_conservacao || 'Bom'} • Status: ${item.status || 'disponivel'}` 
                                  : `Categoria: ${item.categoria || 'Não informada'} ${item.email || ''}`)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center items-center gap-2">
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
                            {abaAtiva === 'equipamentos' && (
                              <button 
                                onClick={() => handleAlternarManutencao(item)}
                                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all ${item.status === 'manutencao' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'}`}
                              >
                                {item.status === 'manutencao' ? 'Em Manutenção' : 'Manutenção'}
                              </button>
                            )}

                            {abaAtiva === 'professores' && (
                              <button 
                                onClick={() => handleGerarRelatorioProfessor(item)}
                                className="bg-[#d1a661]/10 text-[#d1a661] border border-[#d1a661]/20 hover:bg-[#d1a661] hover:text-black px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all"
                              >
                                Relatório
                              </button>
                            )}
                            
                            <button onClick={() => {
                              setEditandoId(item.id);
                              if(abaAtiva === 'equipamentos') {
                                setNovoEquip({ 
                                  nome: item.nome || '', 
                                  categoria: item.categoria || 'Multimídia', 
                                  imagem: item.imagem || '',
                                  marca: item.marca || '',
                                  modelo: item.modelo || '',
                                  estado_conservacao: item.estado_conservacao || 'Bom',
                                  status: item.status || 'disponivel'
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
              {/* LINHA 1: NOME E CATEGORIA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Nome</label>
                  <input required placeholder="Ex: Câmera Mirrorless" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#d1a661]/50 text-sm" value={novoEquip.nome} onChange={(e) => setNovoEquip({...novoEquip, nome: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Categoria</label>
                  <select className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none text-sm h-[46px] cursor-pointer" value={novoEquip.categoria} onChange={(e) => setNovoEquip({...novoEquip, categoria: e.target.value})}>
                    {['Laboratório', 'Multimídia', 'Informática', 'Fotografia', 'Áudio'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* LINHA 2: MARCA E MODELO */}
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

              {/* LINHA 3: ESTADO DE CONSERVAÇÃO E SELEÇÃO DE ARQUIVO LOCAL */}
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Estado de Conservação</label>
                  <select className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none text-sm h-[46px] cursor-pointer" value={novoEquip.estado_conservacao} onChange={(e) => setNovoEquip({...novoEquip, estado_conservacao: e.target.value})}>
                    {['Excelente', 'Bom', 'Regular', 'Ruim'].map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Upload de Foto (Local)</label>
                  <div className="h-[46px] flex items-center bg-zinc-900 border border-white/5 rounded-xl px-3">
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'equipamentos')} className="w-full text-xs text-zinc-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* LINHA 4: ADICIONAR IMAGEM POR LINK (LARGURA TOTAL) */}
              <div>
                <label className="text-[9px] font-black text-[#d1a661] uppercase tracking-widest mb-1 block">Ou link da imagem externa</label>
                <input placeholder="Ex: https://site.com/imagem-do-equipamento.jpg" className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#d1a661]/50 text-sm" value={novoEquip.imagem} onChange={(e) => setNovoEquip({...novoEquip, imagem: e.target.value})} />
              </div>

              {/* LINHA 5: BOTÕES DE AÇÃO */}
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
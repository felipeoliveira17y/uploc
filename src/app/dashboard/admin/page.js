'use client';
import { useState, useEffect } from 'react';
// 1. Tente este import (ajuste os ../ se necessário)
import AdminSidebar from '@/app/components/AdminSidebar'; 
// 2. Use o cliente padrão para evitar erros de Build
import { createClient } from '@/utils/supabase/client'; 

export default function AdminDashboard() {
  const [abaAtiva, setAbaAtiva] = useState('equipamentos');
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Inicialize o cliente aqui
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // 'professores' não é uma tabela, é um filtro da tabela 'perfis'
      const tabela = abaAtiva === 'professores' ? 'perfis' : abaAtiva;
      
      let query = supabase.from(tabela).select('*');
      
      if (abaAtiva === 'professores') {
        query = query.eq('role', 'professor');
      }

      const { data, error } = await query;
      if (!error) setDados(data || []);
      setLoading(false);
    }
    fetchData();
  }, [abaAtiva]);

  return (
    <div className="flex min-h-screen bg-uploc-black">
      <AdminSidebar abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />

      <main className="flex-1 p-10 overflow-y-auto">
        {/* Header da Seção */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white capitalize">{abaAtiva}</h1>
            <p className="text-zinc-400">Gerencie todos os dados da UpLoc nesta secção.</p>
          </div>
          
          <button className="bg-uploc-gold hover:bg-uploc-goldHover text-black px-6 py-2 rounded-lg font-bold transition">
            + Adicionar {abaAtiva.slice(0, -1)}
          </button>
        </div>

        {/* Tabela de Dados */}
        {loading ? (
          <div className="text-uploc-gold animate-pulse text-center mt-20">Carregando dados...</div>
        ) : (
          <div className="bg-uploc-gray rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="p-4 text-uploc-gold text-xs uppercase font-bold tracking-widest">Identificador / Nome</th>
                  <th className="p-4 text-uploc-gold text-xs uppercase font-bold tracking-widest text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {dados.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/30 transition group">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{item.nome || item.nome_completo}</span>
                        <span className="text-zinc-500 text-xs">{item.categoria || item.email || item.id}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-4">
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition">Editar</button>
                        <button className="text-red-500 hover:text-red-400 text-sm font-semibold transition">Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
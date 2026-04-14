export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-uploc-black">
      {/* Sidebar Fixa */}
      <aside className="w-64 border-r border-uploc-gold/10 bg-uploc-gray p-6 flex flex-col">
        <h2 className="text-uploc-gold font-bold text-2xl mb-10">UpLoc Panel</h2>
        
        <nav className="flex-1 space-y-2">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-4">Gestão</p>
          <a href="#" className="block p-3 rounded-lg bg-uploc-gold text-black font-bold">Equipamentos</a>
          <a href="#" className="block p-3 rounded-lg text-zinc-400 hover:text-uploc-gold transition">Professores</a>
          <a href="#" className="block p-3 rounded-lg text-zinc-400 hover:text-uploc-gold transition">Horários</a>
          <a href="#" className="block p-3 rounded-lg text-zinc-400 hover:text-uploc-gold transition">Reservas do Dia</a>
        </nav>

        <button className="mt-auto text-red-500 text-sm hover:underline text-left">Sair do Sistema</button>
      </aside>

      {/* Área de Conteúdo */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
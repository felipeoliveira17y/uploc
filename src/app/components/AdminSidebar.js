export default function AdminSidebar({ abaAtiva, setAbaAtiva }) {
  const menus = [
    { id: 'equipamentos', label: 'Equipamentos', icon: '📷' },
    { id: 'professores', label: 'Professores', icon: '👨‍🏫' },
    { id: 'reservas', label: 'Reservas do Dia', icon: '📅' },
    { id: 'horarios', label: 'Horários', icon: '⏰' },
  ];

  return (
    <aside className="w-64 bg-uploc-gray border-r border-uploc-gold/10 p-6 flex flex-col h-screen sticky top-0">
      <div className="mb-10 text-center">
        <h2 className="text-uploc-gold text-2xl font-black tracking-tighter">UPLOC ADMIN</h2>
        <p className="text-zinc-500 text-[10px] uppercase mt-1">Painel do Diretor</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menus.map((item) => (
          <button
            key={item.id}
            onClick={() => setAbaAtiva(item.id)}
            className={`w-full text-left p-3 rounded-lg transition-all font-medium flex items-center gap-3 ${
              abaAtiva === item.id 
              ? 'bg-uploc-gold text-black shadow-lg shadow-uploc-gold/20' 
              : 'text-zinc-400 hover:text-uploc-gold hover:bg-zinc-900'
            }`}
          >
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
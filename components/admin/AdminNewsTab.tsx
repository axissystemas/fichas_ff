import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, Check, X, Newspaper } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useSheetStore } from '@/store/useSheetStore';

export function AdminNewsTab() {
  const { theme } = useSheetStore();
  const { newsList, addNewsItem, updateNewsItem, deleteNewsItem } = useAdminStore();
  const isPapyrus = theme === 'papyrus';

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState('Livros Jogos');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setCategory(item.category);
    setTitle(item.title);
    setDescription(item.description);
    setDate(item.date);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (editingId) {
      await updateNewsItem(editingId, { category, title, description, date });
    } else {
      await addNewsItem({ category, title, description, date });
    }

    handleCancel();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${isPapyrus ? 'text-[#2D1D16]' : 'text-white'} flex items-center gap-2`}>
            <Newspaper size={20} className="text-cyan-400" />
            Mural de Novidades
          </h2>
          <p className={`text-xs ${isPapyrus ? 'text-[#8B4513]' : 'text-slate-400'}`}>
            Gerencie comunicados e atualizações exibidas aos aventureiros.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shadow transition"
          >
            <PlusCircle size={16} />
            Nova Notícia
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`p-6 rounded-xl border ${isPapyrus ? 'bg-[#F3E5AB] border-[#C5A059]' : 'bg-slate-900 border-slate-700'} space-y-4`}>
          <h3 className="font-bold text-sm uppercase tracking-wider">
            {editingId ? 'Editar Notícia' : 'Nova Notícia'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Categoria</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs border rounded-lg hover:bg-black/10 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition"
            >
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {newsList.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border ${isPapyrus ? 'bg-[#EAD8B8]/50 border-[#C5A059]' : 'bg-slate-900/60 border-slate-800'} flex items-start justify-between gap-4`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-cyan-500/20 text-cyan-400">
                  {item.category}
                </span>
                <span className="text-[10px] opacity-60">{item.date}</span>
              </div>
              <h4 className="font-bold text-sm mb-1">{item.title}</h4>
              <p className="text-xs opacity-80 leading-relaxed">{item.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
                title="Editar"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => deleteNewsItem(item.id)}
                className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                title="Excluir"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

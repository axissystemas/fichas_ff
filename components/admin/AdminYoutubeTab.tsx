import React, { useState, useEffect } from 'react';
import { Youtube, Radio, Check, Save } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useSheetStore } from '@/store/useSheetStore';

export function AdminYoutubeTab() {
  const { theme } = useSheetStore();
  const { youtubeSettings, loadYoutubeSettings, saveYoutubeSettings } = useAdminStore();
  const isPapyrus = theme === 'papyrus';

  const [channelId, setChannelId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadYoutubeSettings().then(() => {
      const current = useAdminStore.getState().youtubeSettings;
      if (current) {
        setChannelId(current.channelId || '');
        setVideoUrl(current.videoUrl || '');
        setIsLive(current.isLive || false);
        setYoutubeUrl(current.youtubeUrl || '');
      }
    });
  }, [loadYoutubeSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await saveYoutubeSettings({ channelId, videoUrl, isLive, youtubeUrl });
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className={`text-xl font-bold ${isPapyrus ? 'text-[#2D1D16]' : 'text-white'} flex items-center gap-2`}>
          <Youtube size={20} className="text-red-500" />
          Transmissão ao Vivo (YouTube)
        </h2>
        <p className={`text-xs ${isPapyrus ? 'text-[#8B4513]' : 'text-slate-400'}`}>
          Configure o link e status da transmissão ao vivo exibida no applet.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={`p-6 rounded-xl border ${isPapyrus ? 'bg-[#F3E5AB] border-[#C5A059]' : 'bg-slate-900 border-slate-700'} space-y-5`}>
        <div className="flex items-center justify-between p-3 rounded-lg border bg-black/10">
          <div className="flex items-center gap-2">
            <Radio className={isLive ? 'text-red-500 animate-pulse' : 'text-slate-400'} size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Status da Live</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">ID do Canal do YouTube (Opcional)</label>
          <input
            type="text"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="Ex: UC_x5XG1OV2P6uZZ5FSM9Ttw"
            className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">URL do Vídeo / Live</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Link Direto do Canal (para botão Visitar Canal)</label>
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Ex: https://youtube.com/@AventurasFantasticas"
            className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-green-500 font-bold flex items-center gap-1">
              <Check size={16} /> Configurações salvas!
            </span>
          ) : (
            <span></span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow transition disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}

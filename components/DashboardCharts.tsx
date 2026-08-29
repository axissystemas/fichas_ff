'use client';

import { useSheetStore } from '@/store/useSheetStore';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

// Color Palettes for themes
const COLORS = {
  papyrus: {
    primary: '#5C4033',
    secondary: '#C5A059',
    accent: '#8B4513',
    background: '#FDF6E3',
    text: '#2D1D16',
    grid: 'rgba(92, 64, 51, 0.15)',
    chartColors: ['#8B4513', '#C5A059', '#A0522D', '#D2B48C', '#CD853F', '#DEB887']
  },
  night: {
    primary: '#22d3ee',
    secondary: '#38bdf8',
    accent: '#a855f7',
    background: '#0f172a',
    text: '#cbd5e0',
    grid: 'rgba(148, 163, 184, 0.1)',
    chartColors: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
  }
};

// ─── 1. Attribute History Line Chart ──────────────────────────────────────────
interface AttributePoint {
  name: string;
  skill: number;
  energy: number;
  luck: number;
}

export const AttributeHistoryLineChart = ({ data }: { data: AttributePoint[] }) => {
  const { theme } = useSheetStore();
  const colors = theme === 'papyrus' ? COLORS.papyrus : COLORS.night;

  const chartData = data.length > 0 ? data : [
    { name: 'Início', skill: 10, energy: 15, luck: 9 },
    { name: 'Sec 12', skill: 10, energy: 14, luck: 9 },
    { name: 'Combate 1', skill: 10, energy: 11, luck: 8 },
    { name: 'Consumo', skill: 10, energy: 15, luck: 8 },
    { name: 'Sec 89', skill: 9, energy: 13, luck: 7 },
  ];

  const lineColors = theme === 'papyrus' ? {
    skill: '#000000',  // Preto
    energy: '#DC2626', // Vermelho
    luck: '#1E3A8A'    // Azul Escuro
  } : {
    skill: '#CBD5E1',  // Contraste para Preto (Slate-300)
    energy: '#EF4444', // Contraste para Vermelho
    luck: '#3B82F6'    // Contraste para Azul Escuro (Azul Claro)
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="name" stroke={colors.text} fontSize={10} tickLine={false} />
          <YAxis stroke={colors.text} fontSize={10} tickLine={false} domain={[0, 'auto']} />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.background,
              borderColor: colors.primary,
              color: colors.text,
              fontSize: '12px',
              fontFamily: 'serif'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="skill" name="Habilidade" stroke={lineColors.skill} strokeWidth={2} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="energy" name="Energia" stroke={lineColors.energy} strokeWidth={2} />
          <Line type="monotone" dataKey="luck" name="Sorte" stroke={lineColors.luck} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── 2. Monster Defeated Pie Chart ────────────────────────────────────────────
interface MonsterPieData {
  name: string;
  value: number;
}

export const MonsterPieChart = ({ data }: { data: MonsterPieData[] }) => {
  const { theme } = useSheetStore();
  const colors = theme === 'papyrus' ? COLORS.papyrus : COLORS.night;

  const chartData = data.length > 0 ? data : [
    { name: 'Goblin', value: 4 },
    { name: 'Orc', value: 3 },
    { name: 'Zumbi', value: 2 },
    { name: 'Dragão', value: 1 },
    { name: 'Outros', value: 5 }
  ];

  return (
    <div className="w-full h-72 flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors.chartColors[index % colors.chartColors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: colors.background,
              borderColor: colors.primary,
              color: colors.text,
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── 3. Adventures Completed Bar Chart ────────────────────────────────────────
interface UserCompletionData {
  name: string;
  iniciadas: number;
  concluidas: number;
}

export const CompletionBarChart = ({ data }: { data: UserCompletionData[] }) => {
  const { theme } = useSheetStore();
  const colors = theme === 'papyrus' ? COLORS.papyrus : COLORS.night;

  const chartData = data.length > 0 ? data : [
    { name: 'Escriba Sábio', iniciadas: 5, concluidas: 2 },
    { name: 'Guerreiro Solo', iniciadas: 3, concluidas: 1 },
    { name: 'Mago Errante', iniciadas: 8, concluidas: 4 },
    { name: 'Ladino Veloz', iniciadas: 2, concluidas: 0 },
    { name: 'Paladino Luz', iniciadas: 6, concluidas: 3 }
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="name" stroke={colors.text} fontSize={10} tickLine={false} />
          <YAxis stroke={colors.text} fontSize={10} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.background,
              borderColor: colors.primary,
              color: colors.text,
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Bar dataKey="iniciadas" name="Iniciadas" fill={colors.chartColors[1]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="concluidas" name="Concluídas" fill={colors.chartColors[5]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── 4. Activity Heatmap (Grid layout of last 28 days) ───────────────────────
export interface HeatmapPoint {
  date: string;
  dateIso?: string;
  fullDateLabel?: string;
  rawDate?: Date;
  count: number;
}

export interface ActivityHeatmapProps {
  data: HeatmapPoint[];
  onSelectDate?: (point: HeatmapPoint) => void;
  selectedDate?: string | null;
}

export const ActivityHeatmap = ({ data, onSelectDate, selectedDate }: ActivityHeatmapProps) => {
  const { theme } = useSheetStore();

  // Generate last 28 days if data is empty
  const generateMockDays = () => {
    const arr: HeatmapPoint[] = [];
    const now = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const fullDateLabel = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const dateIso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      // Deterministic activity count (0 to 4) instead of Math.random to satisfy react-hooks/purity
      const count = (d.getDate() + i) % 5;
      arr.push({ date: dateStr, dateIso, fullDateLabel, rawDate: d, count });
    }
    return arr;
  };

  const heatmapData = data && data.length > 0 ? data : generateMockDays();

  // Helper to determine cell color based on count
  const getCellColor = (count: number) => {
    if (theme === 'papyrus') {
      if (count === 0) return 'bg-[#EAD8B8]/20 border-[#5C4033]/15 text-[#5C4033]/70';
      if (count === 1) return 'bg-[#CD853F]/30 border-[#5C4033]/30 text-[#2D1D16]';
      if (count === 2) return 'bg-[#C5A059]/60 border-[#5C4033]/50 text-[#2D1D16]';
      if (count === 3) return 'bg-[#8B4513]/70 border-[#5C4033]/70 text-white';
      return 'bg-[#5C4033] border-[#5C4033] text-white';
    } else {
      if (count === 0) return 'bg-slate-800/40 border-slate-700/20 text-slate-400';
      if (count === 1) return 'bg-cyan-950/40 border-cyan-800/30 text-cyan-200';
      if (count === 2) return 'bg-cyan-900/60 border-cyan-600/40 text-cyan-100';
      if (count === 3) return 'bg-cyan-600/80 border-cyan-400/60 text-white';
      return 'bg-cyan-400 border-cyan-300 text-slate-950';
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-7 gap-2.5 max-w-md w-full">
        {heatmapData.map((item, idx) => {
          const isSelected = selectedDate === item.date || selectedDate === item.dateIso;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDate?.(item)}
              className={`aspect-square flex flex-col items-center justify-center border text-xs font-bold transition-all rounded cursor-pointer relative group ${getCellColor(item.count)} ${
                isSelected
                  ? theme === 'papyrus'
                    ? 'ring-2 ring-[#8B4513] scale-110 shadow-md z-10'
                    : 'ring-2 ring-cyan-400 scale-110 shadow-md z-10 shadow-cyan-500/20'
                  : 'hover:scale-105 hover:z-10 hover:shadow-sm'
              }`}
              title={`${item.fullDateLabel || item.date}: ${item.count} ação(ões) — Clique para ver acessos`}
            >
              <span>{item.date}</span>
              <span className="opacity-80 font-mono text-[10px]">{item.count}</span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-center items-center gap-4 mt-4 text-xs uppercase font-bold tracking-wider opacity-80">
        <span>Menos ativo</span>
        <div className="flex gap-1">
          <div className={`w-3.5 h-3.5 border rounded ${getCellColor(0)}`}></div>
          <div className={`w-3.5 h-3.5 border rounded ${getCellColor(1)}`}></div>
          <div className={`w-3.5 h-3.5 border rounded ${getCellColor(2)}`}></div>
          <div className={`w-3.5 h-3.5 border rounded ${getCellColor(3)}`}></div>
          <div className={`w-3.5 h-3.5 border rounded ${getCellColor(4)}`}></div>
        </div>
        <span>Mais ativo</span>
      </div>
      <p className="text-[10px] mt-2 opacity-60 font-sans italic flex items-center gap-1">
        💡 Clique em uma data para verificar quais contas acessaram a ficha.
      </p>
    </div>
  );
};


'use client'

import { MaterialIcon, MaterialType, getAllMaterials, getMaterialInfo } from './material-icon'

interface MaterialTabsProps {
  selected: MaterialType | 'all'
  onSelect: (material: MaterialType | 'all') => void
  counts?: Record<MaterialType | 'all', number>
}

export function MaterialTabs({ selected, onSelect, counts }: MaterialTabsProps) {
  const materials = getAllMaterials()
  const allCount = counts?.all || 0

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 pb-2 min-w-min px-4 sm:px-0 sm:flex-wrap sm:justify-start">
        {/* All Materials Tab - Embossed */}
        <button
          onClick={() => onSelect('all')}
          className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all duration-200 font-semibold text-sm whitespace-nowrap relative overflow-hidden group ${
            selected === 'all'
              ? 'border-slate-400 bg-gradient-to-b from-slate-200 to-slate-300 text-slate-900 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.4)]'
              : 'border-foreground/20 bg-gradient-to-b from-foreground/10 to-foreground/5 text-foreground/70 hover:border-foreground/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
          }`}
        >
          <div className="w-5 h-5 rounded bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-xs font-bold text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
            ◆
          </div>
          <span>All Materials</span>
          {allCount > 0 && <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
            selected === 'all'
              ? 'bg-slate-400/40 text-slate-900'
              : 'bg-foreground/20 text-foreground'
          }`}>{allCount}</span>}
        </button>

        {/* Material-Specific Tabs - Embossed */}
        {materials.map((material) => (
          <button
            key={material.id}
            onClick={() => onSelect(material.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all duration-200 font-semibold text-sm whitespace-nowrap relative overflow-hidden ${
              selected === material.id
                ? `border-white/60 bg-gradient-to-b ${material.color} text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.3),0_6px_16px_rgba(0,0,0,0.5)]`
                : 'border-foreground/20 bg-gradient-to-b from-foreground/10 to-foreground/5 text-foreground/70 hover:border-foreground/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
            }`}
          >
            <div className={`w-5 h-5 rounded flex items-center justify-center bg-gradient-to-br ${material.color} text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_2px_4px_rgba(0,0,0,0.3)]`}>
              {material.icon}
            </div>
            <span>{material.label}</span>
            {counts?.[material.id] !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                selected === material.id
                  ? 'bg-white/30 text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]'
                  : 'bg-foreground/20 text-foreground'
              }`}>
                {counts[material.id]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

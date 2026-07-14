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
        {/* All Materials Tab */}
        <button
          onClick={() => onSelect('all')}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200 font-semibold text-sm whitespace-nowrap ${
            selected === 'all'
              ? 'border-primary bg-primary/20 text-primary'
              : 'border-foreground/10 bg-foreground/5 text-foreground/70 hover:border-foreground/20 hover:bg-foreground/10'
          }`}
        >
          <div className="w-5 h-5 rounded bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-xs font-bold text-white">
            ◆
          </div>
          <span>All Materials</span>
          {allCount > 0 && <span className="text-xs bg-foreground/20 px-2 py-0.5 rounded-full">{allCount}</span>}
        </button>

        {/* Material-Specific Tabs */}
        {materials.map((material) => (
          <button
            key={material.id}
            onClick={() => onSelect(material.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200 font-semibold text-sm whitespace-nowrap ${
              selected === material.id
                ? `border-white/50 bg-gradient-to-br ${material.color} text-white shadow-lg`
                : 'border-foreground/10 bg-foreground/5 text-foreground/70 hover:border-foreground/20 hover:bg-foreground/10'
            }`}
          >
            <div className={`w-5 h-5 rounded flex items-center justify-center bg-gradient-to-br ${material.color} text-white`}>
              {material.icon}
            </div>
            <span>{material.label}</span>
            {counts?.[material.id] !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selected === material.id
                  ? 'bg-white/30 text-white'
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

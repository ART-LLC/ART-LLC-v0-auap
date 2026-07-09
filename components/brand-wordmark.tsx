"use client"

type BrandSize = "nav" | "hero" | "banner" | "footer" | "about"

interface SizeCfg {
  wordmarkSize: string
  subSize: string
  tagSize: string
  showSub: boolean
  showTag: boolean
  align: string
}

const SIZES: Record<BrandSize, SizeCfg> = {
  nav:    { wordmarkSize: "text-[clamp(1.1rem,3.5vw,1.85rem)]",   subSize: "text-[0.5rem]",                            tagSize: "text-[0.38rem]",                          showSub: true,  showTag: false, align: "items-start" },
  hero:   { wordmarkSize: "text-[clamp(2rem,6vw,5rem)]",         subSize: "text-[clamp(0.55rem,1.2vw,0.75rem)]",      tagSize: "text-[clamp(0.42rem,1vw,0.58rem)]",       showSub: true,  showTag: true,  align: "items-start" },
  banner: { wordmarkSize: "text-[clamp(2rem,5.5vw,4.5rem)]",     subSize: "text-[clamp(0.6rem,1.3vw,0.8rem)]",        tagSize: "text-[clamp(0.44rem,1vw,0.58rem)]",       showSub: true,  showTag: true,  align: "items-center" },
  footer: { wordmarkSize: "text-[clamp(1.4rem,3vw,2rem)]",       subSize: "text-[0.54rem]",                           tagSize: "text-[0.42rem]",                          showSub: true,  showTag: false, align: "items-start" },
  about:  { wordmarkSize: "text-[clamp(2rem,6vw,5.5rem)]",       subSize: "text-[clamp(0.55rem,1.2vw,0.78rem)]",      tagSize: "text-[clamp(0.44rem,1vw,0.62rem)]",       showSub: true,  showTag: true,  align: "items-center" },
}

interface BrandWordmarkProps {
  size: BrandSize
  subtitle?: string
  className?: string
  showTagline?: boolean
  showSubline?: boolean
}

export function BrandWordmark({
  size,
  subtitle,
  className = "",
  showTagline,
  showSubline,
}: BrandWordmarkProps) {
  const cfg = SIZES[size]
  const doSub = showSubline ?? cfg.showSub
  const doTag = showTagline ?? cfg.showTag
  const taglineText = subtitle ?? '"Trusted Partner for Automotive Services and Solutions"'

  return (
    <div className={`flex flex-col gap-0 ${cfg.align} ${className}`}>

      {/* AUAPW.ORG — 3D Block Extrusion + Diamond LED + Ghost Scan */}
      <div className="wordmark-3d-wrap pt-[0.08em]">
        <span className={`wordmark-3d ${cfg.wordmarkSize}`}>
          𝐀𝐔𝐀𝐏𝐖.𝑶𝑹𝑮
        </span>
        <span className="ghost-scan-bar" aria-hidden="true" />
      </div>

      {/* Divider rule + sub — only when sub is visible */}
      {doSub && (
        <>
          <div className="wordmark-rule" aria-hidden="true" />
          <div className="wordmark-sub-wrap">
            <span className={`wordmark-sub ${cfg.subSize} tracking-[0.28em] uppercase`}>
              All Used Auto Parts Warehouse
            </span>
            <span className="ghost-scan-bar ghost-scan-bar--delay" aria-hidden="true" />
          </div>
        </>
      )}

      {/* Tagline — italic silver shimmer */}
      {doTag && (
        <div className="wordmark-tag-wrap">
          <span className={`wordmark-tag ${cfg.tagSize}`}>
            {taglineText}
          </span>
          <span className="ghost-scan-bar ghost-scan-bar--delay2" aria-hidden="true" />
        </div>
      )}

    </div>
  )
}

'use client'

import { useMemo, useEffect, useRef, useState } from 'react'
import { projects, sectors, getProjectById, getSectorForProject } from '@/app/data/projects'
import type { Project } from '@/app/data/projects'
import { useSystem } from '@/app/system/SystemProvider'
import { sfx } from '@/app/utils/sound'
import SectionShell from '@/app/components/system/SectionShell'

interface Node extends Project {
  sectorColor: string
  sectorName: string
  linkX: number
  linkY: number
}

function buildNodes(): Node[] {
  return projects.map((p) => {
    const sector = getSectorForProject(p.id)
    return {
      ...p,
      sectorColor: sector?.color || '#3ee6ff',
      sectorName: sector?.name || 'UNKNOWN',
      linkX: p.node.x,
      linkY: p.node.y,
    }
  })
}

function useNodePositions(viewW: number, viewH: number) {
  return useMemo(() => {
    const margin = 60
    const usableW = viewW - margin * 2
    const usableH = viewH - margin * 2
    return buildNodes().map((n) => ({
      node: n,
      px: margin + (n.linkX / 100) * usableW,
      py: margin + (n.linkY / 100) * usableH,
    }))
  }, [viewW, viewH])
}

function NodeGlyph({
  node,
  px,
  py,
  selected,
  onHover,
  onSelect,
  hovered,
}: {
  node: Node
  px: number
  py: number
  selected: boolean
  hovered: boolean
  onHover: (n: Node | null) => void
  onSelect: (n: Node) => void
}) {
  const { soundOn } = useSystem()
  const r = hovered || selected ? 9 : 6

  return (
    <g
      className="cursor-pointer"
      onMouseEnter={() => {
        if (soundOn) sfx.hover()
        onHover(node)
      }}
      onMouseLeave={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation()
        if (soundOn) sfx.select()
        onSelect(node)
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open project ${node.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (soundOn) sfx.select()
          onSelect(node)
        }
      }}
      style={{ outline: 'none' }}
    >
      {/* halo */}
      <circle cx={px} cy={py} r={selected ? 22 : hovered ? 16 : 0} fill="none" stroke={node.sectorColor} strokeWidth="1" opacity={selected ? 0.5 : hovered ? 0.35 : 0} />
      <circle cx={px} cy={py} r={r} fill={node.sectorColor} opacity={hovered || selected ? 1 : 0.8} />
      <circle cx={px} cy={py} r={r - 3} fill="#030509" opacity={hovered || selected ? 1 : 0.6} />
      {hovered || selected ? (
        <circle cx={px} cy={py} r={r - 1.5} fill="none" stroke="#fff" strokeWidth="0.8" opacity={0.8} />
      ) : null}
      {/* project id */}
      <text
        x={px}
        y={py + r + 14}
        textAnchor="middle"
        fontSize={7}
        fill={hovered || selected ? node.sectorColor : 'rgba(183,198,217,0.5)'}
        letterSpacing="0.15em"
        fontFamily="JetBrains Mono, monospace"
      >
        {node.category}_P{projects.findIndex((p) => p.id === node.id) + 1}
      </text>
    </g>
  )
}

function MapConnections({
  positioned,
  hovered,
}: {
  positioned: ReturnType<typeof useNodePositions>
  hovered: Node | null
}) {
  const { activeProject } = useSystem()

  const linkCache = useMemo(() => {
    const lines: { from: Node; to: Node }[] = []
    sectors.forEach((s) => {
      for (let i = 0; i < s.projects.length - 1; i++) {
        const a = getProjectById(s.projects[i])
        const b = getProjectById(s.projects[i + 1])
        if (a && b) lines.push({ from: a as Node & Project, to: b as Node & Project })
      }
    })
    return lines
  }, [])

  const getPos = (id: string) => positioned.find((p) => p.node.id === id)

  const emphasize = (n: Node) =>
    hovered?.id === n.id || activeProject?.id === n.id

  return (
    <>
      {/* faint background links */}
      {linkCache.map(({ from, to }, i) => {
        const a = getPos(from.id)
        const b = getPos(to.id)
        if (!a || !b) return null
        const active = emphasize(from) || emphasize(to)
        return (
          <line
            key={i}
            x1={a.px}
            y1={a.py}
            x2={b.px}
            y2={b.py}
            stroke={active ? from.sectorColor : 'rgba(108,193,230,0.25)'}
            strokeWidth={active ? 1.5 : 1}
            strokeDasharray={active ? 'none' : '2 4'}
            opacity={active ? 0.9 : 0.5}
          />
        )
      })}
    </>
  )
}

function ProjectMap() {
  const { openProject, pushLog } = useSystem()
  const [hovered, setHovered] = useState<Node | null>(null)
  const [viewW, setViewW] = useState(900)
  const [viewH, setViewH] = useState(600)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) return
      setViewW(Math.max(320, rect.width))
      setViewH(Math.max(360, Math.round((rect.width * 600) / 900)))
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()
    return () => ro.disconnect()
  }, [])

  const positioned = useNodePositions(viewW, viewH)

  const select = (n: Node) => {
    pushLog(`PROJECT_${n.id.toUpperCase()} selected`)
    pushLog(`Loading ${n.category.toLowerCase()} module...`)
    openProject(n)
  }

  return (
    <SectionShell id="module-projects" title="Project Map" code="MODULE_01">
      <div className="hud-frame hud-corners relative overflow-hidden">
        {/* corner ticks */}
        <span className="corner-tick tl" />
        <span className="corner-tick tr" />
        <span className="corner-tick bl" />
        <span className="corner-tick br" />

        {/* header bar */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 md:px-6">
          <div className="mono text-[10px] tracking-[0.25em] text-ink-3">
            VIRTUAL MAP // {positioned.length} NODES
          </div>
          <div className="mono hidden text-[10px] tracking-[0.25em] text-ink-4 sm:block">
            HOVER TO INSPECT · CLICK TO ENTER
          </div>
        </div>

        <div ref={containerRef} className="relative">
          <svg
            viewBox={`0 0 ${viewW} ${viewH}`}
            className="block h-auto w-full"
            role="img"
            aria-label="Interactive map of WISTFY projects"
            onMouseLeave={() => setHovered(null)}
          >
            <defs>
              <pattern id="mapgrid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(108,193,230,0.06)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect x="0" y="0" width={viewW} height={viewH} fill="url(#mapgrid)" />
            <rect x="0" y="0" width={viewW} height={viewH} fill="rgba(5,7,10,0.4)" />

            <MapConnections positioned={positioned} hovered={hovered} />

            {/* sector labels */}
            {sectors.map((s, i) => (
              <text
                key={s.id}
                x={24}
                y={30 + i * 20}
                fontSize={9}
                fill={s.color}
                opacity={0.55}
                letterSpacing="0.2em"
                fontFamily="JetBrains Mono, monospace"
              >
                {s.code} / {s.name}
              </text>
            ))}

            {positioned.map(({ node, px, py }) => (
              <NodeGlyph
                key={node.id}
                node={node}
                px={px}
                py={py}
                selected={false}
                hovered={hovered?.id === node.id}
                onHover={setHovered}
                onSelect={select}
              />
            ))}
          </svg>

          {/* hovered project readout */}
          <div
            className="mono pointer-events-none absolute left-4 top-4 z-10 hidden max-w-[300px] border border-line bg-abyss-0/90 p-3 text-[10px] leading-relaxed md:block"
            style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.2s ease' }}
            aria-live="polite"
          >
            {hovered ? (
              <>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span style={{ color: hovered.sectorColor }}>{hovered.title}</span>
                  <span className="text-ink-4">{hovered.status}</span>
                </div>
                <div className="text-ink-3">
                  SECTOR: {hovered.sectorName} · {hovered.language}
                </div>
                <div className="mt-1 truncate text-ink-4">{hovered.technologies.join(' / ')}</div>
              </>
            ) : (
              <span className="text-ink-4">AWAITING NODE SELECTION...</span>
            )}
          </div>

          {/* coordinates of hovered node */}
          <div className="mono pointer-events-none absolute bottom-3 right-4 text-[9px] tracking-[0.2em] text-ink-4">
            {hovered ? `COORD X:${hovered.linkX.toString().padStart(2, '0')} Y:${hovered.linkY.toString().padStart(2, '0')}` : 'COORD --:--'}
          </div>
        </div>

        {/* sector legend */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line px-4 py-3 md:px-6">
          {sectors.map((s) => (
            <span key={s.id} className="mono flex items-center gap-2 text-[9px] tracking-[0.2em] text-ink-3">
              <span className="inline-block size-2 rounded-full" style={{ background: s.color }} />
              {s.code} {s.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <span className="mono text-[10px] tracking-[0.2em] text-ink-4">
          SELECT A NODE TO OPEN ITS PROJECT INTERFACE
        </span>
      </div>
    </SectionShell>
  )
}

export default function ProjectMapSection() {
  return <ProjectMap />
}
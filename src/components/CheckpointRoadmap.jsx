import { useState } from 'react'
import { LuCheck, LuLock, LuPlay, LuTrophy, LuFlag, LuSparkles } from 'react-icons/lu'
import CharacterAvatar from './CharacterAvatar'
import { playSoundCue } from './AccessibilityToolbar'
import './CheckpointRoadmap.css'

const LANE_X = {
  left: 88,
  center: 160,
  right: 232,
}

function TrailConnector({ fromLane, toLane, status }) {
  const x1 = LANE_X[fromLane] ?? LANE_X.center
  const x2 = LANE_X[toLane] ?? LANE_X.center
  const d = `M ${x1} 0 C ${x1} 21, ${x2} 21, ${x2} 42`

  return (
    <div className={`cr-connector cr-conn-${status}`} aria-hidden="true">
      <svg className="cr-bezier-svg" viewBox="0 0 320 42" preserveAspectRatio="none">
        <path className="cr-bezier-bg" d={d} />
        <path className="cr-bezier-fg" d={d} />
      </svg>
    </div>
  )
}

export default function CheckpointRoadmap({
  unit,
  unitIdx,
  completedModules = [],
  onOpenModule,
  getModuleIcon,
  moduleTypeLabel,
}) {
  const [previewLockedId, setPreviewLockedId] = useState(null)

  const midInsertAfterIdx =
    unit.modules.length >= 4 ? Math.floor(unit.modules.length / 2) - 1 : -1

  // Build ordered trail sequence (modules + optional 50% milestone relay pod)
  const trailItems = []
  let altCounter = 0

  unit.modules.forEach((mod, modIdx) => {
    const isLast = modIdx === unit.modules.length - 1
    const isModCompleted = completedModules.includes(mod.id)
    const isModActive =
      !isModCompleted && (modIdx === 0 || completedModules.includes(unit.modules[modIdx - 1]?.id))

    const lane =
      isModActive || isLast
        ? 'center'
        : altCounter++ % 2 === 0
        ? 'left'
        : 'right'

    const status = isModCompleted ? 'done' : isModActive ? 'active' : 'locked'

    trailItems.push({
      kind: 'module',
      key: mod.id,
      mod,
      modIdx,
      isLast,
      isModCompleted,
      isModActive,
      lane,
      status,
    })

    if (modIdx === midInsertAfterIdx) {
      const relayUnlocked = isModCompleted
      trailItems.push({
        kind: 'milestone',
        key: `${unit.id}-milestone-mid`,
        lane: 'center',
        status: relayUnlocked ? 'done' : 'locked',
        unlocked: relayUnlocked,
      })
    }
  })

  return (
    <div className="checkpoint-roadmap">
      {trailItems.map((item, idx) => {
        const prevItem = idx > 0 ? trailItems[idx - 1] : null
        const connStatus =
          prevItem?.status === 'done'
            ? item.status === 'active'
              ? 'active'
              : 'done'
            : 'locked'

        if (item.kind === 'milestone') {
          return (
            <div key={item.key} className="cr-step-group">
              {prevItem && (
                <TrailConnector
                  fromLane={prevItem.lane}
                  toLane={item.lane}
                  status={connStatus}
                />
              )}
              <div className={`cr-milestone-relay lane-center ${item.unlocked ? 'is-done' : ''}`}>
                <span className="cr-relay-gem">
                  {item.unlocked ? <LuCheck size={13} strokeWidth={3} /> : <LuFlag size={13} />}
                </span>
                <span>Milestone 50% Unit {unitIdx + 1}</span>
              </div>
            </div>
          )
        }

        const { mod, modIdx, isLast, isModCompleted, isModActive, lane } = item
        const cpLabel = `CP ${String(modIdx + 1).padStart(2, '0')}`
        const isLockedPreviewOpen = previewLockedId === mod.id
        const prevCpLabel = `CP ${String(modIdx).padStart(2, '0')}`

        return (
          <div key={item.key} className="cr-step-group">
            {prevItem && (
              <TrailConnector
                fromLane={prevItem.lane}
                toLane={lane}
                status={connStatus}
              />
            )}

            {/* ARCHETYPE 4: BOSS CHECKPOINT CITADEL */}
            {isLast && (
              <div
                className={`cr-boss-citadel lane-center ${
                  isModCompleted ? 'is-done' : isModActive ? 'is-active' : 'is-locked'
                }`}
              >
                <div className="cr-boss-crest">
                  {isModCompleted ? (
                    <LuCheck size={20} strokeWidth={3} />
                  ) : isModActive ? (
                    <LuTrophy size={20} />
                  ) : (
                    <LuLock size={18} />
                  )}
                </div>

                <div className="cr-boss-body">
                  <div className="cr-boss-meta">
                    <span className="cr-boss-badge">BOSS CHECKPOINT • {cpLabel}</span>
                    <span className="cr-xp-chip">{isModCompleted ? 'SELESAI' : `+${mod.xpReward} XP`}</span>
                  </div>
                  <h4>{mod.title}</h4>
                  <p>{mod.desc}</p>

                  {isModActive ? (
                    <button
                      type="button"
                      className="cr-btn-boss-play"
                      onClick={() => onOpenModule(unit, mod)}
                    >
                      <LuSparkles size={15} /> Tantang Boss Gate
                    </button>
                  ) : isModCompleted ? (
                    <button
                      type="button"
                      className="cr-btn-repeat"
                      onClick={() => onOpenModule(unit, mod)}
                    >
                      <LuPlay size={13} /> Ulangi Tantangan
                    </button>
                  ) : (
                    <div className="cr-boss-locked-hint">
                      <LuLock size={13} /> Selesaikan {prevCpLabel} untuk membuka gerbang Boss
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ARCHETYPE 1: ACTIVE MISSION SPOTLIGHT STATION */}
            {!isLast && isModActive && (
              <div className="cr-active-station lane-center">
                <div className="cr-active-top">
                  <div className="cr-active-tags">
                    <span className="cr-live-pill">
                      <span className="cr-live-dot" /> AKTIF • {cpLabel}
                    </span>
                    <span className="cr-type-pill">{moduleTypeLabel(mod.type)}</span>
                  </div>
                  <span className="cr-xp-chip cr-xp-indigo">+{mod.xpReward} XP</span>
                </div>

                <div className="cr-active-main">
                  <div className="cr-active-copy">
                    <h4>{mod.title}</h4>
                    <p>{mod.desc}</p>
                    <button
                      type="button"
                      className="cr-btn-start"
                      onClick={() => onOpenModule(unit, mod)}
                    >
                      <LuSparkles size={15} /> Mulai Checkpoint
                    </button>
                  </div>

                  <div className="cr-active-mascot">
                    <CharacterAvatar size={62} emotion="excited" animated={true} interactive={true} />
                  </div>
                </div>
              </div>
            )}

            {/* ARCHETYPE 2: COMPLETED CIRCULAR EMERALD MEDALLION */}
            {!isLast && isModCompleted && (
              <div className={`cr-waypoint-row lane-${lane}`}>
                <button
                  type="button"
                  className="cr-medallion-btn"
                  onClick={() => onOpenModule(unit, mod)}
                  title={`Ulangi ${mod.title}`}
                >
                  <span className="cr-medallion-core">
                    <LuCheck size={20} strokeWidth={3} />
                  </span>
                </button>

                <div className="cr-waypoint-meta">
                  <div className="cr-waypoint-tags">
                    <span className="cr-cp-label done">{cpLabel} • TUNTAS</span>
                    <button
                      type="button"
                      className="cr-btn-repeat-mini"
                      onClick={() => onOpenModule(unit, mod)}
                    >
                      <LuPlay size={11} /> Ulangi
                    </button>
                  </div>
                  <h4 className="cr-waypoint-title">{mod.title}</h4>
                </div>
              </div>
            )}

            {/* ARCHETYPE 3: LOCKED GEOMETRIC WAYPOINT (HEXAGON / DIAMOND / OCTAGON) */}
            {!isLast && !isModCompleted && !isModActive && (
              <div className={`cr-waypoint-row lane-${lane} is-locked`}>
                <button
                  type="button"
                  className={`cr-geo-node shape-${mod.type}`}
                  onClick={() => {
                    playSoundCue('locked')
                    setPreviewLockedId((prev) => (prev === mod.id ? null : mod.id))
                  }}
                  aria-expanded={isLockedPreviewOpen}
                  title={`Checkpoint terkunci — ketuk untuk info buka`}
                >
                  <span className="cr-geo-inner">{getModuleIcon(mod.type)}</span>
                </button>

                <div
                  className="cr-waypoint-meta cr-waypoint-clickable"
                  onClick={() => {
                    playSoundCue('locked')
                    setPreviewLockedId((prev) => (prev === mod.id ? null : mod.id))
                  }}
                >
                  <div className="cr-waypoint-tags">
                    <span className={`cr-cp-label type-${mod.type}`}>
                      {cpLabel} • {moduleTypeLabel(mod.type)}
                    </span>
                    <span className="cr-locked-xp">
                      <LuLock size={11} /> +{mod.xpReward} XP
                    </span>
                  </div>
                  <h4 className="cr-waypoint-title">{mod.title}</h4>
                  {isLockedPreviewOpen && (
                    <div className="cr-unlock-inline-hint">
                      Selesaikan {prevCpLabel} terlebih dahulu untuk membuka (+{mod.xpReward} XP).
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {unit.isCompleted && (
        <div className="unit-complete-badge">
          <LuTrophy size={22} className="trophy-icon" />
          <div>
            <strong>Unit {unitIdx + 1} Tuntas!</strong>
            <p>Seluruh checkpoint pada unit ini berhasil dilewati.</p>
          </div>
        </div>
      )}
    </div>
  )
}

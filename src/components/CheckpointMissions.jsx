import { useState } from 'react'
import {
  LuZap,
  LuPlay,
  LuTerminal,
  LuSparkles,
  LuCheck,
  LuGem,
  LuArrowRight,
  LuFlag,
  LuTrophy,
  LuGift,
} from 'react-icons/lu'
import { playSoundCue } from './AccessibilityToolbar'
import XPRewardsShop from './XPRewardsShop'
import './CheckpointMissions.css'

export default function CheckpointMissions({
  xp = 0,
  visualizerRuns = 0,
  playgroundRuns = 0,
  lessonsCompletedToday = 0,
  completedModulesCount = 0,
  claimedMap = {},
  onClaimReward,
  onNavigateTab,
  initialSubTab = 'misi',
  userName = 'Koder',
  langName = 'Python',
  onRewardsUpdated,
}) {
  const [subTab, setSubTab] = useState(initialSubTab)
  const missions = [
    {
      id: 'cp-xp',
      code: 'CP-01',
      title: 'Raih 30 XP Hari Ini',
      desc: 'Kumpulkan XP dari kelas interaktif atau klaim hadiah.',
      progress: Math.min(xp, 30),
      target: 30,
      unit: 'XP',
      color: '#8b5cf6',
      icon: <LuZap size={20} />,
      rewardXP: 0,
      rewardGems: 15,
      rewardLabel: '+15 Gems',
      targetTab: 'belajar',
    },
    {
      id: 'cp-vis',
      code: 'CP-02',
      title: 'Jalankan Simulasi Visualizer',
      desc: 'Putar atau melangkah maju pada animasi algoritma 60 FPS.',
      progress: Math.min(visualizerRuns, 1),
      target: 1,
      unit: 'Sesi',
      color: '#06b6d4',
      icon: <LuPlay size={20} />,
      rewardXP: 25,
      rewardGems: 0,
      rewardLabel: '+25 XP',
      targetTab: 'visualizer',
    },
    {
      id: 'cp-code',
      code: 'CP-03',
      title: 'Jalankan Kode di Playground',
      desc: 'Tulis dan eksekusi program nyata langsung di Code Playground.',
      progress: Math.min(playgroundRuns, 1),
      target: 1,
      unit: 'Run',
      color: '#10b981',
      icon: <LuTerminal size={20} />,
      rewardXP: 0,
      rewardGems: 30,
      rewardLabel: '+30 Gems',
      targetTab: 'playground',
    },
    {
      id: 'cp-class',
      code: 'BOSS CP',
      title: 'Selesaikan 1 Kelas Interaktif',
      desc: 'Tuntaskan seluruh checkpoint tantangan di kelas interaktif.',
      progress: lessonsCompletedToday > 0 || completedModulesCount > 0 ? 1 : 0,
      target: 1,
      unit: 'Kelas',
      color: '#f59e0b',
      icon: <LuTrophy size={20} />,
      rewardXP: 60,
      rewardGems: 25,
      rewardLabel: '+60 XP & +25 Gems',
      targetTab: 'belajar',
    },
  ]

  const completedCount = missions.filter((m) => m.progress >= m.target).length
  const trackPercent = (completedCount / missions.length) * 100

  const handleClaim = (mission) => {
    if (mission.progress < mission.target || claimedMap[mission.id]) return
    playSoundCue('success')
    onClaimReward?.(mission.id, mission.rewardXP, mission.rewardGems)
  }

  return (
    <div className="duo-subview-wrap missions-hub">
      <div className="subview-header">
        <h2>
          <LuFlag size={22} className="icon-inline" /> Misi &amp; Toko Tukar XP
        </h2>
        <p>Kumpulkan XP dari misi harian, lalu tukarkan menjadi Power-Up Kuis, Gelar Profil, &amp; Sertifikat Digital Kredibel untuk LinkedIn!</p>
      </div>

      <div className="missions-subtabs" role="tablist" aria-label="Pilih Misi atau Toko XP">
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'misi'}
          className={`missions-subtab-btn ${subTab === 'misi' ? 'active' : ''}`}
          onClick={() => { setSubTab('misi'); playSoundCue('toggle') }}
        >
          <LuFlag size={15} /> Misi Harian
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'toko'}
          className={`missions-subtab-btn ${subTab === 'toko' ? 'active' : ''}`}
          onClick={() => { setSubTab('toko'); playSoundCue('toggle') }}
        >
          <LuGift size={15} /> Tukar XP &amp; Hadiah
        </button>
      </div>

      {subTab === 'toko' ? (
        <XPRewardsShop
          totalXP={xp}
          userName={userName}
          langName={langName}
          onRewardsUpdated={onRewardsUpdated}
        />
      ) : (
        <>
      {/* Visual Checkpoint Milestone Track */}
      <div className="cp-track-card">
        <div className="cp-track-top">
          <strong>Progres Checkpoint Harian</strong>
          <span className="cp-track-count">
            {completedCount} / {missions.length} Tercapai
          </span>
        </div>

        <div className="cp-milestone-rail">
          <div className="cp-rail-bg">
            <div className="cp-rail-fill" style={{ width: `${trackPercent}%` }} />
          </div>
          <div className="cp-nodes-row">
            {missions.map((m, idx) => {
              const isReached = m.progress >= m.target
              const isClaimed = Boolean(claimedMap[m.id])
              return (
                <div key={m.id} className="cp-milestone-item">
                  <button
                    type="button"
                    className={`cp-milestone-dot ${
                      isClaimed ? 'claimed' : isReached ? 'reached' : 'locked'
                    }`}
                    style={{ '--cp-color': m.color }}
                    onClick={() => isReached && !isClaimed && handleClaim(m)}
                    title={
                      isClaimed
                        ? `${m.code} sudah diklaim`
                        : isReached
                        ? `Klik untuk klaim ${m.rewardLabel}`
                        : `${m.code}: ${m.title}`
                    }
                  >
                    {isClaimed ? <LuCheck size={14} strokeWidth={3} /> : idx + 1}
                  </button>
                  <span className="cp-node-code">{m.code}</span>
                  <span className="cp-node-reward">{m.rewardLabel}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 4 Checkpoint Mission Cards */}
      <div className="cp-missions-list">
        {missions.map((m) => {
          const isReached = m.progress >= m.target
          const isClaimed = Boolean(claimedMap[m.id])
          const pct = Math.min(100, Math.round((m.progress / m.target) * 100))

          return (
            <div
              key={m.id}
              className={`cp-mission-card ${isReached ? 'is-ready' : ''} ${
                isClaimed ? 'is-claimed' : ''
              }`}
              style={{ '--cp-color': m.color }}
            >
              <div className="cp-mission-left">
                <div className="cp-mission-node">
                  {isClaimed ? <LuCheck size={20} strokeWidth={3} /> : m.icon}
                </div>
              </div>

              <div className="cp-mission-body">
                <div className="cp-mission-top">
                  <span className="cp-code-badge">{m.code}</span>
                  <span className="cp-reward-pill">
                    <LuGem size={12} /> {m.rewardLabel}
                  </span>
                </div>

                <h3>{m.title}</h3>
                <p>{m.desc}</p>

                <div className="cp-progress-wrap">
                  <div className="cp-progress-track">
                    <div className="cp-progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <small>
                    {m.progress} / {m.target} {m.unit}
                  </small>
                </div>

                <div className="cp-card-footer">
                  {isClaimed ? (
                    <span className="cp-claimed-label">
                      <LuCheck size={14} /> Hadiah Telah Diklaim
                    </span>
                  ) : isReached ? (
                    <button
                      type="button"
                      className="btn-cp-claim"
                      onClick={() => handleClaim(m)}
                    >
                      <LuSparkles size={14} /> Klaim {m.rewardLabel}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-cp-go"
                      onClick={() => {
                        playSoundCue('click')
                        onNavigateTab?.(m.targetTab)
                      }}
                    >
                      Kerjakan Sekarang <LuArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
        </>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Mail, GitBranch, Link2 } from 'lucide-react'
import { LuCode } from 'react-icons/lu'
import KinetixLogo from './KinetixLogo'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0,40 C320,100 560,0 720,50 C880,100 1120,20 1440,60 L1440,120 L0,120 Z"
            fill="var(--primary-900)"
          />
        </svg>
      </div>
      <div className="footer-body">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <KinetixLogo size={36} showText={true} />
              </div>
              <p className="footer-desc">
                Platform pembelajaran programming dan visualisasi algoritma interaktif generasi baru. Menggabungkan gamifikasi Duolingo dan visual komputasi real-time untuk seluruh bahasa pemrograman.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Github">
                  <GitBranch size={20} />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <Link2 size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Email">
                  <Mail size={20} />
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Navigasi</h4>
              <Link to="/">Beranda</Link>
              <Link to="/learn">Alur Belajar Duolingo</Link>
              <Link to="/materi">Katalog Bahasa</Link>
              <Link to="/simulasi">Visualizer Algoritma</Link>
              <Link to="/tentang">Tentang Lomba</Link>
            </div>

            <div className="footer-col">
              <h4>Kategori Bahasa</h4>
              <span>Low-Level & Sistem (C, Assembly)</span>
              <span>High-Level (Python, JS, Go)</span>
              <span>Tersulit & Esoterik (Brainfuck, Haskell)</span>
              <span>Simulasi Pointer & Heap Memori</span>
            </div>

            <div className="footer-col">
              <h4>Kompetisi & Info</h4>
              <span>Horizon 2026 - Crack The Egg</span>
              <span>SDG 4 - Quality Education</span>
              <span>Subtema 2 - Simulasi & Visualisasi</span>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              © 2026 Kinetix Code. Dirancang dengan presisi untuk masa depan edukasi pemrograman interaktif.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

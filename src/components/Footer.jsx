import { Link } from 'react-router-dom'
import KinetixLogo from './KinetixLogo'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-body">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <KinetixLogo size={32} showText={true} />
              </div>
              <p className="footer-desc">
                Platform pembelajaran programming dan visualisasi algoritma interaktif 60 FPS dari tingkat dasar hingga sistem.
              </p>
            </div>

            <div className="footer-col">
              <h4>Navigasi</h4>
              <Link to="/">Beranda</Link>
              <Link to="/learn">Alur Belajar</Link>
              <Link to="/materi">Katalog Bahasa</Link>
              <Link to="/simulasi">Visualizer</Link>
              <Link to="/tentang">Tentang Platform</Link>
            </div>

            <div className="footer-col">
              <h4>Fokus Materi</h4>
              <span>Low-Level (C, Assembly)</span>
              <span>Modern (Python, JS, Go)</span>
              <span>Esoterik (Brainfuck, Haskell)</span>
              <span>Pointer &amp; Memori RAM</span>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Kinetix Code. Edukasi pemrograman visual &amp; interaktif.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

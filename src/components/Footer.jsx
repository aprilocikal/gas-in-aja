import { Link } from 'react-router-dom'
import { FaLinkedin } from 'react-icons/fa'
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
              <div className="footer-social">
                <a
                  href="https://www.linkedin.com/company/144186335/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  title="Halaman Perusahaan Resmi LinkedIn: Kinetix code"
                >
                  <FaLinkedin size={18} />
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Navigasi</h4>
              <Link to="/">Beranda</Link>
              <Link to="/learn">Alur Belajar</Link>
              <Link to="/materi">Katalog Bahasa</Link>
              <Link to="/simulasi">Visualizer</Link>
              <Link to="/verify">Verifikasi Sertifikat</Link>
              <Link to="/tentang">Tentang Platform</Link>
            </div>

            <div className="footer-col">
              <h4>Kredibilitas &amp; Komunitas</h4>
              <a
                href="https://www.linkedin.com/company/144186335/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn: Kinetix code
              </a>
              <Link to="/verify">Cek Barcode Sertifikat</Link>
              <span>Passing Grade ≥ 55%</span>
              <span>Kompilasi Kode Riil</span>
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

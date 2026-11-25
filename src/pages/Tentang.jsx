import { motion } from 'framer-motion'
import { Target, Heart, Lightbulb, Globe } from 'lucide-react'
import {
  LuAtom,
  LuZap,
  LuSparkles,
  LuPalette,
  LuCompass,
  LuCode,
  LuCheck,
} from 'react-icons/lu'
import './Tentang.css'

function Tentang() {
  const techStack = [
    { name: 'React 19', icon: <LuAtom size={32} className="icon-orange" />, desc: 'Arsitektur komponen reaktif' },
    { name: 'Vite', icon: <LuZap size={32} className="icon-orange" />, desc: 'Engine build berkecepatan tinggi' },
    { name: 'Framer Motion', icon: <LuSparkles size={32} className="icon-orange" />, desc: 'Animasi mikro & interaksi halus' },
    { name: 'HTML5 Canvas API', icon: <LuPalette size={32} className="icon-orange" />, desc: 'Render simulasi visual 60 FPS' },
    { name: 'React Router', icon: <LuCompass size={32} className="icon-orange" />, desc: 'SPA Routing tanpa refresh' },
    { name: 'Modern CSS3', icon: <LuCode size={32} className="icon-orange" />, desc: 'Custom dark obsidian design system' },
  ]

  const pilarKualitas = [
    {
      kriteria: 'Visualisasi & Simulasi Nyata',
      bobot: 'Pilar 01',
      targetLevel: '60 FPS Real-Time',
      deskripsi:
        'Mengimplementasikan visualisasi eksekusi kode secara akurat dan konsisten di seluruh alur pembelajaran.',
      buktiImplementasi:
        'Kinetix Code menghadirkan visualisasi algoritma pengurutan & pencarian 60 FPS dengan sinkronisasi baris kode Python/C/JS, serta simulasi dereferensi pointer memori RAM fisik C & Assembly.',
    },
    {
      kriteria: 'Tujuan dan Dampak Positif',
      bobot: 'Pilar 02',
      targetLevel: 'Edukasi Inklusif',
      deskripsi:
        'Menyelesaikan masalah pelajar dan mahasiswa dalam memahami konsep abstrak pemrograman melalui interaksi langsung.',
      buktiImplementasi:
        'Menghadirkan pendekatan gamifikasi belajar interaktif berbasis checkpoint & antarmuka visual modern agar belajar coding menjadi menyenangkan dan mudah dipahami.',
    },
    {
      kriteria: 'Fungsi dan Konten Lengkap',
      bobot: 'Pilar 03',
      targetLevel: '12+ Bahasa & Sandbox',
      deskripsi:
        'Seluruh fungsi belajar utama berjalan langsung di browser dengan materi terstruktur dan latihan acak.',
      buktiImplementasi:
        'Katalog 12+ bahasa pemrograman (Assembly x86, C, Python hingga Brainfuck), Playground eksekusi kode langsung, Peta Checkpoint (+XP, streak, misi harian), serta Catatan Benchmark Big-O.',
    },
    {
      kriteria: 'Desain dan Aksesibilitas',
      bobot: 'Pilar 04',
      targetLevel: 'WCAG 2.1 AA Ready',
      deskripsi:
        'Desain konsisten, mudah dinavigasi di desktop maupun mobile, dan ramah beragam kebutuhan pengguna.',
      buktiImplementasi:
        'Desain dark-glass modern dengan aksen kontras tinggi (Cyan, Violet, Emerald, Orange), responsif di seluruh viewport, serta penyesuaian aksesibilitas dan efek audio sintetis.',
    },
    {
      kriteria: 'Kualitas Teknis dan Pengujian',
      bobot: 'Pilar 05',
      targetLevel: 'Modern SPA Build',
      deskripsi:
        'Struktur kode terorganisir rapi dan teruji di berbagai perangkat serta ukuran layar.',
      buktiImplementasi:
        'Arsitektur React 19 + Vite zero build error, penanganan React ErrorBoundary anti blank screen, serta teruji responsif di perangkat Desktop, Tablet, dan Mobile.',
    },
  ]

  const values = [
    {
      icon: <Target size={24} />,
      title: 'Misi Nyata',
      desc: 'Membongkar mitos bahwa programming dan algoritma itu menakutkan, melalui visualisasi eksekusi kode interaktif dan gamifikasi yang seru.',
    },
    {
      icon: <Heart size={24} />,
      title: 'Spektrum Bahasa Lengkap',
      desc: 'Menghubungkan pemula dengan seluruh hierarki bahasa komputer: dari arsitektur CPU Assembly, alokasi memori C, kecerdasan Python, hingga logika esoterik Brainfuck.',
    },
    {
      icon: <Lightbulb size={24} />,
      title: 'Standar Baru Edukasi Digital',
      desc: 'Menggabungkan pendekatan gamifikasi belajar interaktif dengan visualisasi komputasional modern untuk mencetak talenta digital unggul Indonesia.',
    },
  ]

  return (
    <div className="tentang-page">
      <section className="tentang-hero">
        <div className="container">
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Membangun Standar Baru <br />
            <span className="gradient-text">Visualisasi & Gamifikasi Koding</span>
          </motion.h1>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Menggabungkan pendekatan gamifikasi belajar interaktif dengan keanggunan visualisasi komputasional modern untuk belajar programming.
          </motion.p>
        </div>
      </section>

      {/* Latar Belakang */}
      <section className="section">
        <div className="container">
          <div className="about-intro glass-card">
            <div className="about-intro-content">
              <h2>Mengapa Kinetix Code Diciptakan?</h2>
              <p>
                Banyak pelajar dan mahasiswa mengalami kesulitan besar dalam memahami konsep abstrak programming dan algoritma (seperti Bubble Sort, pointer RAM, rekursi, dan asimtotik Big-O). Akibatnya, angka kegagalan dan kebosanan dalam mempelajari ilmu komputer cukup tinggi.
              </p>
              <p>
                <strong>Kinetix Code</strong> hadir sebagai platform edukasi digital interaktif di mana siswa dapat melihat eksekusi baris kode secara nyata, mengamati penukaran elemen visual 60 FPS, memanipulasi pointer memori fisik C, serta menjelajahi spektrum bahasa mulai dari Assembly x86 hingga bahasa tersulit Brainfuck dan Malbolge!
              </p>
              <p>
                Platform ini berkomitmen mendukung agenda <strong>SDG 4 (Quality Education)</strong> dengan membuka akses terbuka dan setara bagi siapa saja untuk menguasai keterampilan digital masa depan.
              </p>
            </div>
            <div className="about-intro-visual">
              <div className="intro-visual-card">
                <Globe size={48} className="globe-icon" />
                <h3>SDG 4</h3>
                <p>Quality Education 2030</p>
                <div className="card-ambient-light" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misi, Nilai, Visi */}
      <section className="section values-section">
        <div className="container">
          <h2 className="section-title">
            Prinsip & <span className="gradient-text">Tujuan Platform</span>
          </h2>
          <div className="values-grid">
            {values.map((val, i) => (
              <motion.div
                key={i}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="value-icon">{val.icon}</div>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section tech-section">
        <div className="container">
          <h2 className="section-title">
            Modern <span className="gradient-text">Tech Stack</span>
          </h2>
          <p className="section-subtitle">
            Kombinasi teknologi mutakhir untuk memastikan simulasi berjalan mulus 60 FPS pada perangkat apa pun.
          </p>
          <div className="tech-grid">
            {techStack.map((tech, i) => (
              <motion.div
                key={i}
                className="tech-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.03 }}
              >
                <span className="tech-icon">{tech.icon}</span>
                <strong>{tech.name}</strong>
                <small>{tech.desc}</small>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Standar Kualitas Platform */}
      <section className="section rubrik-section">
        <div className="container">
          <h2 className="section-title">
            Pilar Kualitas <span className="gradient-text">Platform</span>
          </h2>
          <p className="section-subtitle">
            Arsitektur Kinetix Code dirancang untuk menghadirkan pengalaman belajar coding yang visual, interaktif, dan mudah diakses.
          </p>

          <div className="rubrik-grid">
            {pilarKualitas.map((item, idx) => (
              <motion.div
                key={idx}
                className="rubrik-card glass-card"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
              >
                <div className="rubrik-card-top">
                  <div className="rubrik-badge-row">
                    <span className="rubrik-bobot">{item.bobot}</span>
                    <span className="rubrik-level">
                      <LuCheck size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                      {item.targetLevel}
                    </span>
                  </div>
                  <h3>{item.kriteria}</h3>
                </div>

                <div className="rubrik-desc-box">
                  <strong>Fokus Utama:</strong>
                  <p>{item.deskripsi}</p>
                </div>

                <div className="rubrik-impl-box">
                  <strong>Implementasi pada Kinetix Code:</strong>
                  <p>{item.buktiImplementasi}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Tentang

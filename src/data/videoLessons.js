// Kurasi video YouTube dasar-dasar pemrograman.
// Seluruh ID video sudah diverifikasi ada (YouTube oEmbed) saat dikurasi.

export const VIDEO_CATEGORIES = [
  { id: 'all', label: 'Semua' },
  { id: 'algoritma', label: 'Algoritma Dasar' },
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'htmlcss', label: 'HTML & CSS' },
  { id: 'sql', label: 'SQL' },
  { id: 'php', label: 'PHP' },
  { id: 'csharp', label: 'C#' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'c', label: 'C' },
  { id: 'cpp', label: 'C++' },
  { id: 'java', label: 'Java' },
  { id: 'golang', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'assembly', label: 'Assembly' },
  { id: 'haskell', label: 'Haskell' },
  { id: 'brainfuck', label: 'Brainfuck' },
  { id: 'prolog', label: 'Prolog' },
  { id: 'malbolge', label: 'Malbolge' },
]

const v = (langId, youtubeId, title, channel, language, level, summary) => ({
  id: `${langId}-${youtubeId}`,
  langId,
  youtubeId,
  title,
  channel,
  language,
  level,
  summary,
})

export const VIDEO_LESSONS = [
  // Python
  v('python', 'iA8lLwmtKQM', 'Belajar Python [Dasar] - 01 - Apa Itu Python', 'Kelas Terbuka', 'ID', 'Pengantar', 'Kenalan dengan Python: apa itu, kegunaannya, dan kenapa cocok untuk pemula.'),
  v('python', 'AcyUE59S53U', 'Belajar Python [Dasar] - 48 - Latihan Fungsi', 'Kelas Terbuka', 'ID', 'Dasar', 'Latihan membuat dan memanggil fungsi di Python.'),
  v('python', 'x7X9w_GIm1s', 'Python in 100 Seconds', 'Fireship', 'EN', 'Ringkas', 'Rangkuman cepat Python dalam 100 detik.'),

  // JavaScript
  v('javascript', 'RUTV_5m4VeI', 'Dasar Pemrograman dengan Javascript : INTRO', 'WPU', 'ID', 'Pengantar', 'Pengantar konsep dasar pemrograman memakai JavaScript.'),
  v('javascript', 'SDROba_M42g', 'Tutorial JavaScript Dasar Bahasa Indonesia', 'Programmer Zaman Now', 'ID', 'Dasar', 'Tutorial JavaScript dasar dari variabel sampai fungsi.'),
  v('javascript', 'DHjqpvDnNGE', 'JavaScript in 100 Seconds', 'Fireship', 'EN', 'Ringkas', 'Rangkuman cepat JavaScript dalam 100 detik.'),

  // C
  v('c', 'kijDGmEpcTM', 'Tutorial Bahasa C #1: Perkenalan dan Sejarah Bahasa C', 'Koding Aja Dulu', 'ID', 'Pengantar', 'Sejarah dan perkenalan awal bahasa C.'),
  v('c', '2d19KgToiRo', 'Belajar Bahasa C dalam 1 Jam untuk Pemula', 'Gus Nando', 'ID', 'Dasar', 'Crash course bahasa C dari instalasi sampai konsep esensial.'),
  v('c', '0FWcnQdWMKQ', 'Bahasa C secara SIMPEL', 'Arwildo', 'ID', 'Ringkas', 'Tipe data, print, if, dan for loop di C secara ringkas.'),
  v('c', 'U3aXWizDbQ4', 'C in 100 Seconds', 'Fireship', 'EN', 'Ringkas', 'Rangkuman cepat bahasa C dalam 100 detik.'),

  // C++
  v('cpp', 'WtBF_-pLrjE', 'Belajar C++ [Dasar] - 01 - Apa itu C++', 'Kelas Terbuka', 'ID', 'Pengantar', 'Apa itu C++ dan untuk apa dipakai.'),
  v('cpp', 'kxarfCiubWc', 'Belajar C++ [Dasar] - 02 - Cara Kerja C++', 'Kelas Terbuka', 'ID', 'Dasar', 'Bagaimana kode C++ diproses menjadi program.'),
  v('cpp', 'Wzxknjyd3hE', 'Belajar C++ [Dasar] - 03 - Memahami Program dan Compiler', 'Kelas Terbuka', 'ID', 'Dasar', 'Memahami program dan peran compiler.'),
  v('cpp', 'MNeX4EGtR5Y', 'C++ in 100 Seconds', 'Fireship', 'EN', 'Ringkas', 'Rangkuman cepat C++ dalam 100 detik.'),

  // Java
  v('java', 'uHyfQV0kbgo', 'Belajar Java [Dasar] - 01 - Apa itu Java?', 'Kelas Terbuka', 'ID', 'Pengantar', 'Pengenalan Java dan JVM untuk pemula.'),
  v('java', 'ddK6hExKhmM', 'Belajar Java [Dasar] - 08 - Variabel, Assignment dan Deklarasi', 'Kelas Terbuka', 'ID', 'Dasar', 'Variabel, assignment, dan deklarasi di Java.'),
  v('java', 'jiUxHm9l1KY', 'Tutorial Java Dasar Bahasa Indonesia', 'Programmer Zaman Now', 'ID', 'Dasar', 'Tutorial Java dasar dalam satu video panjang.'),
  v('java', 'l9AzO1FMgM8', 'Java in 100 Seconds', 'Fireship', 'EN', 'Ringkas', 'Rangkuman cepat Java dalam 100 detik.'),

  // Go
  v('golang', 'IO_vkyJnMas', 'Tutorial Golang Dasar (Bahasa Indonesia)', 'Programmer Zaman Now', 'ID', 'Dasar', 'Belajar Go dari nol dalam bahasa Indonesia.'),
  v('golang', '446E-r0rXHI', 'Go in 100 Seconds', 'Fireship', 'EN', 'Ringkas', 'Rangkuman cepat Go dalam 100 detik.'),

  // Rust
  v('rust', 'FkASrE05VY4', 'Tutorial Rust Dasar (Bahasa Indonesia)', 'Programmer Zaman Now', 'ID', 'Dasar', 'Belajar Rust dari nol dalam bahasa Indonesia.'),
  v('rust', '5C_HPTJg5ek', 'Rust in 100 Seconds', 'Fireship', 'EN', 'Ringkas', 'Rangkuman cepat Rust dalam 100 detik.'),

  // Assembly
  v('assembly', '4gwYkEK0gOk', 'Assembly Language in 100 Seconds', 'Fireship', 'EN', 'Ringkas', 'Gambaran cepat bahasa Assembly dan register CPU.'),
  v('assembly', 'rtUwTcpV-yE', 'Start coding in ASSEMBLY (tutorial for beginners)', 'screeck', 'EN', 'Dasar', 'Tutorial Assembly untuk pemula.'),

  // Haskell
  v('haskell', 'Qa8IfEeBJqk', 'Haskell in 100 Seconds', 'Fireship', 'EN', 'Ringkas', 'Rangkuman cepat Haskell dalam 100 detik.'),
  v('haskell', '2f2kCt32RCU', 'Haskell Tutorial For Beginners | Introduction To Haskell', 'ObaTech', 'EN', 'Pengantar', 'Pengenalan Haskell untuk pemula.'),
  v('haskell', '9lD3pquf0CQ', 'Haskell Tutorial for Beginners - Part One - Basic Operators', 'DiogoTheCoder', 'EN', 'Dasar', 'Operator dasar di Haskell.'),

  // Brainfuck
  v('brainfuck', 'G-tuXeMyb58', 'BrainF*ck Programming Tutorial - Can You Code in BrainF*ck?', 'Tech With Tim', 'EN', 'Dasar', 'Belajar menulis program Brainfuck dari awal.'),
  v('brainfuck', '7C4KOv3mLHc', 'Complete Brain Fuck Tutorial', "Steve's teacher", 'EN', 'Dasar', 'Tutorial lengkap bahasa Brainfuck.'),

  // Prolog
  v('prolog', 'Umv92EmBlxA', 'Prolog Tutorial 1: Basics and Fundamentals, York University', 'Monadonna', 'EN', 'Pengantar', 'Dasar-dasar Prolog: fakta, aturan, dan query.'),
  v('prolog', 'SykxWpFwMGs', 'Prolog Tutorial', 'Derek Banas', 'EN', 'Dasar', 'Tutorial Prolog dalam satu video.'),

  // Malbolge
  v('malbolge', '5aFq8hXYefg', 'Malbolge!: Programming from Hell', 'Truttle1', 'EN', 'Pengantar', 'Pengenalan Malbolge, bahasa esoterik tersulit.'),
  v('malbolge', 'VA_EJ0wSuL4', 'Malbolge!: Taming the Beast', 'Truttle1', 'EN', 'Dasar', 'Membedah cara kerja Malbolge.'),

  // Algoritma
  v('algoritma', 'PnkLJ_50rZ0', 'Algoritma Binary Search dan Bubble Sort', 'Nizwarr', 'ID', 'Dasar', 'Penjelasan Binary Search dan Bubble Sort dalam bahasa Indonesia.'),
  v('algoritma', 'Dv4qLJcxus8', 'Learn Bubble Sort in 7 minutes', 'Bro Code', 'EN', 'Ringkas', 'Bubble Sort dijelaskan dalam 7 menit.'),
  v('algoritma', 'xrMppTpoqdw', 'Learn Binary Search in 10 minutes', 'Bro Code', 'EN', 'Ringkas', 'Binary Search dijelaskan dalam 10 menit.'),

  // HTML & CSS (Wajib Maba)
  v('htmlcss', 'NBZ9Ro6UKV8', 'HTML Dasar : Pendahuluan HTML (1/13)', 'WPU', 'ID', 'Pengantar', 'Pengenalan struktur halaman web HTML untuk mahasiswa baru.'),
  v('htmlcss', 'hMDJyb7VkYw', 'Tutorial HTML Dasar (Bahasa Indonesia)', 'Programmer Zaman Now', 'ID', 'Dasar', 'Panduan lengkap HTML dasar untuk pemula web.'),
  v('htmlcss', 'ok-plXXHlWw', 'HTML in 100 Seconds', 'Fireship', 'EN', 'Ringkas', 'Gambaran cepat HTML dalam 100 detik.'),

  // SQL (Wajib Maba)
  v('sql', 'xYBclb-sYQ4', 'Tutorial MySQL Database (Bahasa Indonesia)', 'Programmer Zaman Now', 'ID', 'Dasar', 'Belajar database relasional, tabel, dan query SQL dari nol.'),
  v('sql', 'zsjvFFKOm3c', 'SQL Explained in 100 Seconds', 'Fireship', 'EN', 'Ringkas', 'Penjelasan singkat konsep SQL dan tabel relasional.'),

  // PHP (Wajib Maba)
  v('php', 'l1W2OwV5rgY', 'Belajar PHP untuk PEMULA | 1. Intro', 'WPU', 'ID', 'Pengantar', 'Pengantar belajar PHP untuk membangun web dinamis.'),
  v('php', 'a7_WFUlFS94', 'PHP in 100 Seconds', 'Fireship', 'EN', 'Ringkas', 'Rangkuman cepat cara kerja PHP di sisi server.'),

  // C# (Wajib Maba)
  v('csharp', 'ravLFzIguCM', 'C# in 100 Seconds', 'Fireship', 'EN', 'Ringkas', 'Rangkuman cepat C# untuk .NET, OOP, dan game Unity.'),

  // Kotlin (Wajib Maba)
  v('kotlin', '6dSNbskzlz4', 'Belajar Kotlin Dasar - 1 Pengenalan Kotlin', 'Programmer Zaman Now', 'ID', 'Pengantar', 'Pengenalan awal Kotlin untuk pengembangan aplikasi Android.'),
]

# Kinetix Code

Platform pembelajaran pemrograman, video interaktif, dan visualisasi algoritma 60 FPS berbasis web.

**Kinetix Code** dirancang untuk membantu mahasiswa baru, pelajar, maupun pembelajar mandiri memahami logika pemrograman dari dasar hingga tingkat sistem secara visual dan praktik langsung, tanpa perlu menginstal *compiler* atau berpindah aplikasi.

Seluruh proses belajar disatukan dalam satu tempat: Peta Checkpoint interaktif, Video Belajar YouTube terintegrasi, Visualizer Algoritma 60 FPS lengkap dengan *mini games*, Code Playground bergaya IDE, serta 3D Flip Flashcards untuk 17 bahasa pemrograman.

## Latar Belakang & Pendekatan Belajar

Banyak mahasiswa baru kesulitan di semester awal karena materi pemrograman sering disampaikan hanya lewat teks statis yang terasa abstrak. Kinetix Code menjawab masalah tersebut melalui empat pendekatan utama:

1. **Belajar Secara Visual.** Melihat langsung cara algoritma bekerja (komparasi, pertukaran posisi, pembelahan ruang *Binary Search*, alamat RAM pointer, hingga pita memori Mesin Turing) yang tersinkronisasi dengan baris kode.
2. **Belajar Lewat Video di Dalam Web.** Menonton video tutorial dasar pilihan maupun mencari video YouTube apa saja langsung di dalam halaman belajar tanpa distraksi pindah tab.
3. **Praktik Langsung di Browser.** Menulis dan mengeksekusi kode nyata lengkap dengan indentasi otomatis, penutup kurung otomatis, serta saran *snippet* tombol `Tab` seperti di IDE.
4. **Evaluasi Terukur dengan Gamifikasi.** Menggunakan batas kelulusan 55%, sistem 3 nyawa, token bantuan strategis, 3D *flashcards*, misi harian, serta Papan Skor Top 10 secara *real time*.

## Fitur Utama

### 1. Katalog 17 Bahasa Pemrograman & 3D Flip Flashcards (`/materi`)

Mencakup bahasa yang langsung relevan bagi mahasiswa baru hingga eksplorasi tingkat mesin:

* **Wajib Mahasiswa Baru Kuliah:** HTML & CSS, SQL (MySQL / PostgreSQL), PHP, C# (.NET & Unity), dan Kotlin.
* **Tingkat Tinggi & Modern:** Python, JavaScript / TypeScript, Go (Golang), dan Java.
* **Tingkat Rendah & Sistem:** Assembly (x86 64), C Language, C++, dan Rust.
* **Fungsional & Esoterik:** Haskell, Brainfuck, Prolog, dan Malbolge.
* **Mode 3D Flip Flashcards & Study Deck:** Ketuk kartu untuk membalik dan melihat ringkasan, alasan dipelajari, cuplikan kode *Hello World* siap salin, serta penanda status **Paham** yang tersimpan otomatis. Tersedia mode **Grid Flip** dan **Flashcard Deck** dengan navigasi keyboard (`←`, `→`, dan `Spasi`).

### 2. Section Video Belajar YouTube Terintegrasi (`/learn` → Tab *Video Belajar*)

* **Pemutar YouTube di Dalam Web:** Video diputar langsung pada *player* 16:9 responsif (`youtube nocookie`) lengkap dengan tombol *Sebelumnya*, *Berikutnya*, dan pelacakan **Sudah Ditonton**.
* **Kurasi Video Dasar:** Tersedia puluhan video pengantar dan materi dasar (Bahasa Indonesia & Inggris) untuk seluruh 17 bahasa pemrograman serta algoritma dasar (*Bubble Sort* dan *Binary Search*).
* **Pencarian Langsung YouTube & Tautan Instan:** Ketik kata kunci apa saja (misalnya `belajar laravel`, `belajar react dasar`, atau `lofi coding`) untuk mencari langsung ke YouTube dan memutar hasilnya di dalam web. Pengguna juga dapat menempel tautan YouTube secara langsung untuk segera ditonton.

### 3. Visualizer Algoritma 60 FPS & Mini Games (`/simulasi` & `/learn`)

* **Algoritma Sorting & Searching:** Bubble Sort, Selection Sort, Insertion Sort, dan Binary Search dengan tinggi batang proporsional, penandaan target ditemukan (**hijau `KETEMU`**), serta sinkronisasi baris kode (Python, C, dan JavaScript).
* **Dua Mode Diagram:** Pengguna dapat berpindah antara tampilan **Grafik Batang** dan **Blok Memori**.
* **Simulator Tingkat Rendah:** Visualisasi **Pointer & Memori C** (`Stack` dan dereferensi `*ptr`) serta **Pita Turing Brainfuck** 8 sel interaktif dengan tombol `+ Tambah` (hijau), `Kurang` (merah), dan tata letak grid 4×2 yang rapi di layar ponsel.
* **Dua Mini Game Algoritma:** *Game: Tebak Binary* dan *Game: Sort Rush* untuk melatih intuisi algoritma secara interaktif.

### 4. Code Playground Bergaya IDE (`/learn` → Tab *Playground*)

* **Eksekusi Nyata & Validasi Sintaks Per Bahasa:** Mendukung JavaScript, Python, C, C++, Java, Go, Rust, dan Brainfuck. Editor memvalidasi sintaks sesuai bahasa yang aktif serta menjalankan percabangan `if/elif/else` dan perulangan secara akurat.
* **Tab Autocomplete Snippet:** Ketik `if`, `ifelse`, `for`, `while`, `def`, `printf`, `cout`, `sout`, `bubble`, atau `binary` lalu tekan **`Tab`** untuk melengkapi blok kode secara otomatis.
* **Smart Auto Indent & Auto Close:** Menekan `Enter` setelah `:` atau `{` otomatis menambah indentasi ke dalam, memekarkan blok `{|}`, mendukung `Shift + Tab` untuk *unindent*, serta menutup otomatis pasangan `()`, `[]`, `{}`, `""`, dan `''`.

### 5. Peta Checkpoint Gamifikasi, Evaluasi & Audio Fokus (`/learn`)

* **Peta Belajar & Bank Soal Per Topik:** Setiap unit berisi rangkaian *checkpoint* (materi, kuis, dan simulator) dengan soal acak yang disesuaikan dengan topik modul (susun sintaks, tebak output, dan analisis logika).
* **Batas Lulus 55% & Sistem 3 Nyawa:** Penyelesaian kuis membutuhkan akurasi minimal **55%** dengan nyawa tersisa. Jika 3 nyawa habis, tampil layar *Nyawa Praktikum Habis* (`+0 XP`) untuk mengulang dengan soal acak baru.
* **Sistem Hint Strategis (3/3):** Tiga token bantuan dapat digunakan kapan saja tanpa jeda. Waktu tunggu isi ulang 60 detik hanya aktif setelah seluruh 3 token habis terpakai.
* **Audio Antarmuka, Pembaca Soal & Backsound Fokus:** Dilengkapi efek suara lembut berbasis Web Audio API, tombol **Audio** yang membacakan teks soal via *Web Speech Synthesis*, serta musik pengantar ambient lo fi lembut yang otomatis mengecil saat soal dibacakan (dilengkapi tombol **BGM / Mute**).
* **Papan Skor Real Time (Top 10) & Misi Harian:** Peringkat 10 besar tersusun otomatis berdasarkan XP aktual melalui Firebase Firestore dan dilengkapi misi harian.

## Arsitektur & Teknologi

| Layer | Teknologi | Peran |
| :--- | :--- | :--- |
| **Frontend** | React 19 | Antarmuka komponen reaktif dan responsif untuk desktop maupun ponsel |
| **Build & Dev** | Vite 8 | Bundling cepat, HMR, dan middleware lokal `/api/yt-search` |
| **Serverless API** | Vercel Functions | Endpoint `/api/yt-search` untuk pencarian YouTube secara langsung di produksi |
| **Routing** | React Router DOM 7 | Navigasi SPA multi halaman dengan *auth guard* |
| **Animasi** | Framer Motion | Transisi halus, efek 3D *tilt* maskot, dan animasi algoritma |
| **Database & Auth** | Firebase Auth & Firestore | Login akun, Mode Tamu, serta sinkronisasi XP, streak, dan papan skor |
| **Audio** | Web Audio API & Speech Synthesis | Efek suara halus, musik pengantar fokus, dan pembaca soal suara |
| **Styling** | Custom CSS3 | Tema Dark Obsidian yang nyaman dilihat serta ergonomis untuk mouse dan layar sentuh |

## Menjalankan di Lokal

```bash
# 1. Clone repositori
git clone https://github.com/aprilocikal/gas-in-aja.git
cd gas-in-aja

# 2. Pasang dependensi
npm install

# 3. Jalankan server pengembangan
npm run dev
```

Buka alamat lokal yang muncul di terminal melalui browser.

### Build Produksi

```bash
npm run build
npm run preview
```

Proyek ini sudah dikonfigurasi untuk **Vercel** melalui [vercel.json](vercel.json) agar navigasi SPA dan fungsi serverless `/api/yt-search` berjalan bersamaan di produksi.

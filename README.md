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
* **Benefit EXP Menjadi Sertifikat Digital Kredibel & Integrasi LinkedIn:** Seluruh perolehan EXP dari keberhasilan menuntaskan checkpoint dapat ditukarkan di tab Misi/Toko Hadiah menjadi **Sertifikat Kompetensi Digital Resmi** (PNG resolusi tinggi 1200×820 px). Sertifikat ini dirancang dengan standar kredibilitas akademik: memuat nama penerima, bahasa pemrograman yang dikuasai, nomor seri ID Kredensial unik anti-duplikasi, stempel emas resmi Kinetix Code, tanda tangan dewan kurikulum, **Barcode QR Code Verifikasi Riil**, serta tombol **1-Klik Tambah ke Profil LinkedIn** yang langsung mengisi form lisensi LinkedIn secara otomatis terhubung ke halaman perusahaan resmi **Kinetix code** (ID: 144186335).

## Kredibilitas Sertifikat Digital & Integrasi LinkedIn

Sertifikat yang diterbitkan oleh Kinetix Code bukan sekadar sertifikat kehadiran pasif (*completion certificate* biasa), melainkan **bukti kompetensi teknis terverifikasi** yang memiliki bobot kredibilitas tinggi untuk portofolio digital, CV mahasiswa/pelamar kerja, serta profil **LinkedIn**.

### 1. Empat Pilar Kredibilitas Sertifikat

| Pilar Kredibilitas | Penjelasan Standar Mutu |
| :--- | :--- |
| **1. Ambang Batas Kelulusan Riil (≥ 55%)** | Pembelajar tidak bisa mendapatkan sertifikat hanya dengan mengeklik atau menonton video. Pembelajar wajib menyelesaikan checkpoint bertingkat, bank soal logika acak (*randomized problem bank*), dan mempertahankan nyawa praktikum. |
| **2. Pengujian Sintaksis & Logika Nyata** | Materi dievaluasi melalui eksekusi kode nyata di browser pada Code Playground dan Visualizer 60 FPS, memastikan pemahaman algoritmik yang konkret. |
| **3. ID Kredensial Unik & Terverifikasi** | Setiap sertifikat dilengkapi nomor seri permanen dengan skema resmi `KC-2026-[LANG]-[HASH]` (misal: `KC-2026-JAV-8B1593`). Nomor seri ini unik per pengguna dan per bahasa pemrograman untuk mencegah pemalsuan. |
| **4. Barcode QR Code Riil & Halaman Verifikasi Publik** | Sertifikat dilengkapi QR Code yang dapat langsung dipindai dengan kamera ponsel. Hasil pemindaian mengarah ke halaman verifikasi resmi (`/verify?id=...`) yang menampilkan status keabsahan, data penerima, dan stempel digital. |
| **5. Terhubung ke Halaman Perusahaan Resmi LinkedIn** | Kinetix Code memiliki Halaman Organisasi Resmi di LinkedIn: [Kinetix code](https://www.linkedin.com/company/144186335/) (ID: `144186335`). Saat sertifikat ditambahkan, logo resmi Kinetix Code langsung tampil pada profil pengguna. |

### 2. Cara Menambahkan Sertifikat ke Profil LinkedIn

Kinetix Code menyediakan dua cara mudah untuk mencantumkan sertifikat ke bagian **Lisensi & Sertifikasi (*Licenses & Certifications*)** di LinkedIn:

#### A. Metode 1-Klik Otomatis (Direkomendasikan)
1. Kumpulkan minimal **150 XP** melalui checkpoint dan misi harian.
2. Buka tab **Misi & Toko Tukar XP** di halaman belajar (`/learn`).
3. Buka atau unduh sertifikat bahasa pemrograman yang diinginkan.
4. Klik tombol **"Tambah ke Profil LinkedIn"** berikon LinkedIn.
5. Halaman LinkedIn akan terbuka secara otomatis dengan formulir lisensi terisi lengkap (*pre-filled*): nama sertifikasi, organisasi penerbit terhubung ke Kinetix code, tanggal terbit, ID kredensial, dan URL verifikasi langsung. Cukup klik **Simpan (*Save*)**.
6. Saat siapa pun mengeklik tombol **"Show credential"** pada profil LinkedIn Anda, browser langsung membuka halaman verifikasi resmi sertifikat Anda di web Kinetix Code.

#### B. Metode Manual (Via Aplikasi LinkedIn atau Web)
Jika ingin memasukkan sertifikat secara manual ke profil LinkedIn:
1. Buka profil LinkedIn Anda, gulir ke bagian **Licenses & certifications** (Lisensi & sertifikasi), lalu klik tombol **+ (Tambah)**.
2. Isi kolom formulir dengan data berikut:
   * **Nama (*Name*)**: `Sertifikat Kompetensi Pemrograman: [Nama Bahasa]` *(Contoh: Sertifikat Kompetensi Pemrograman: Java)*
   * **Organisasi Penerbit (*Issuing organization*)**: `Kinetix code` *(Pilih organisasi resmi Kinetix code ID: `144186335`)*
   * **Tanggal Penerbitan (*Issue date*)**: Masukkan bulan & tahun saat sertifikat dibuka
   * **ID Kredensial (*Credential ID*)**: Salin kode unik dari kartu sertifikat Anda *(Contoh: `KC-2026-JAV-8B1593`)*
   * **URL Kredensial (*Credential URL*)**: `https://kinetixcode.vercel.app/verify?id=[ID_KREDENSIAL]`
3. Unggah file gambar PNG beresolusi tinggi sertifikat sebagai lampiran media (*Media attachment*) pada profil atau postingan LinkedIn Anda.

### 3. Nilai Tambah bagi Mahasiswa & Job Seeker
* **Tervalidasi Langsung:** Tombol *Show credential* pada LinkedIn membuka halaman verifikasi resmi, membuktikan keaslian sertifikat tanpa perantara.
* **Logo Organisasi Resmi di Profil:** Menghilangkan logo gedung abu-abu LinkedIn dan menggantikannya dengan logo resmi Kinetix code.
* **Portofolio LinkedIn Terpercaya:** Membedakan pencapaian Anda dari sertifikat menonton video pasif karena disertai passing grade dan uji kode riil.

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

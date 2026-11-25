export const languageCategories = [
  { id: 'all', label: 'Semua Bahasa' },
  { id: 'campus', label: 'Wajib Maba Kuliah' },
  { id: 'low', label: 'Low-Level & Sistem' },
  { id: 'high', label: 'High-Level & Modern' },
  { id: 'esoteric', label: 'Tersulit & Esoterik' },
]

export const programmingLanguages = [
  // ===== TIER 1: LOW-LEVEL & SYSTEM =====
  {
    id: 'assembly',
    name: 'Assembly (x86-64)',
    tier: 'low',
    tierLabel: 'Tingkat Rendah (Bare Metal)',
    difficulty: 5,
    difficultyLabel: 'Sangat Menantang',
    color: '#ef4444',
    badge: 'CPU Direct',
    paradigm: 'Imperatif / Machine Instructions',
    description: 'Instruksi langsung ke prosesor tanpa abstraksi. Mengontrol register CPU (RAX, RBX) dan stack pointer secara manual.',
    whyLearn: 'Memahami cara komputer dan sistem operasi benar-benar bekerja hingga ke level byte dan memori fisik.',
    iconName: 'LuCpu',
    helloWorld: `; x86-64 Linux NASM
section .data
    msg db 'Halo Dunia!', 0xA
    len equ $ - msg

section .text
    global _start
_start:
    mov rax, 1        ; sys_write
    mov rdi, 1        ; stdout
    mov rsi, msg      ; address
    mov rdx, len      ; length
    syscall
    mov rax, 60       ; sys_exit
    xor rdi, rdi
    syscall`,
    visualTopics: ['Pointeur Register RAX/RBX', 'CPU Stack Frame', 'Syscall Flow'],
    sampleAlgorithm: 'Reverse String via Stack Pointers',
  },
  {
    id: 'c',
    name: 'C Language',
    tier: 'low',
    tierLabel: 'Sistem & Fondasi Dunia',
    difficulty: 4,
    difficultyLabel: 'Menantang (Manual Memory)',
    color: '#06b6d4',
    badge: 'Ibu Segala Bahasa',
    paradigm: 'Prosedural / Manual Memory Management',
    description: 'Bahasa legendaris pencipta OS modern (Linux, Windows, macOS). Anda memegang kontrol mutlak atas alokasi pointer dan byte memori.',
    whyLearn: 'Fondasi utama ilmu komputer, efisiensi absolut, dan manajemen memori dengan malloc & free.',
    iconName: 'LuBinary',
    helloWorld: `#include <stdio.h>
#include <stdlib.h>

int main() {
    char *pesan = (char*)malloc(20 * sizeof(char));
    snprintf(pesan, 20, "Halo Dunia!\\n");
    printf("%s", pesan);
    free(pesan); // Bersihkan memori manual
    return 0;
}`,
    visualTopics: ['Alokasi Heap vs Stack', 'Visual Pointer & Dereference', 'Buffer Array'],
    sampleAlgorithm: 'Bubble Sort Pointer Arithmetic',
  },
  {
    id: 'cpp',
    name: 'C++',
    tier: 'low',
    tierLabel: 'High-Performance & Game Engine',
    difficulty: 4,
    difficultyLabel: 'Menantang & Kompleks',
    color: '#3b82f6',
    badge: 'Industry Powerhouse',
    paradigm: 'Multi-paradigma (OOP, Generic, Procedural)',
    description: 'Kombinasi kecepatan C dengan abstraksi modern OOP, template metaprogramming, dan standard library (STL).',
    whyLearn: 'Standar utama industri pembuatan game AAA (Unreal Engine), sistem perbankan berkecepatan mikrodetik, dan browser engine.',
    iconName: 'LuZap',
    helloWorld: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> nums = {5, 2, 8, 1};
    std::cout << "Halo C++ Modern!" << std::endl;
    return 0;
}`,
    visualTopics: ['RAII Memory Lifecycles', 'Vector Dynamic Resizing', 'Class Object Layout'],
    sampleAlgorithm: 'Quick Sort Partitioning',
  },
  {
    id: 'rust',
    name: 'Rust',
    tier: 'low',
    tierLabel: 'Sistem Modern & Teraman',
    difficulty: 4,
    difficultyLabel: 'Kurva Belajar Curam (Borrow Checker)',
    color: '#f97316',
    badge: 'Zero-Cost Abstractions',
    paradigm: 'Multi-paradigma (Functional, Systems, Concurrency)',
    description: 'Bahasa sistem dengan kecepatan setara C/C++ namun mustahil mengalami null-pointer atau memory leak berkat sistem Borrow Checker.',
    whyLearn: 'Masa depan sistem operasi, WebAssembly, dan komputasi infrastruktur modern berkeamanan tinggi.',
    iconName: 'LuShieldCheck',
    helloWorld: `fn main() {
    let mut data = String::from("Halo Rust!");
    // Ownership dipinjam secara aman
    inspect_borrow(&data);
    println!("Selesai: {}", data);
}

fn inspect_borrow(s: &str) {
    println!("Meminjam data: {}", s);
}`,
    visualTopics: ['Visualisasi Ownership & Borrowing', 'Lifetimes Analysis', 'Immutable vs Mutable'],
    sampleAlgorithm: 'Safe In-Place Sorting',
  },

  // ===== TIER 2: HIGH-LEVEL, APPLICATION & WEB =====
  {
    id: 'python',
    name: 'Python',
    tier: 'high',
    tierLabel: 'Tingkat Tinggi & AI/Data',
    difficulty: 1,
    difficultyLabel: 'Sangat Ramah Pemula',
    color: '#eab308',
    badge: 'Paling Populer',
    paradigm: 'Multi-paradigma (OOP, Prosedural, Fungsional)',
    description: 'Sintaks elegan dan mudah dibaca menyerupai bahasa Inggris. Menjadi standar emas dunia Artificial Intelligence, Data Science, dan Machine Learning.',
    whyLearn: 'Mulai coding paling cepat, ekosistem AI terlengkap, dan intuitif untuk memvisualisasikan algoritma.',
    iconName: 'LuCode',
    helloWorld: `def sapa(nama: str) -> str:
    return f"Halo {nama}, selamat datang di Kinetix Code!"

data = [64, 34, 25, 12, 22, 11, 90]
print(sapa("Pelajar"))`,
    visualTopics: ['Visual Bubble Sort Interaktif', 'Visualisasi Dynamic Typing', 'List Comprehension'],
    sampleAlgorithm: 'Bubble Sort & Binary Search',
  },
  {
    id: 'javascript',
    name: 'JavaScript / TypeScript',
    tier: 'high',
    tierLabel: 'Penguasa Web & Aplikasi',
    difficulty: 2,
    difficultyLabel: 'Mudah ke Menengah',
    color: '#06b6d4',
    badge: 'Jantung Web Global',
    paradigm: 'Event-driven, Asinkron, Prototype-based',
    description: 'Bahasa yang menggerakkan seluruh web modern dan aplikasi interaktif di browser jutaan pengguna setiap detik.',
    whyLearn: 'Bisa membuat website, game 2D/3D browser, mobile app, hingga server backend dengan Node.js.',
    iconName: 'LuGlobe',
    helloWorld: `const sapa = (nama) => {
  return \`Halo \${nama}! JavaScript siap beraksi\`;
};

console.log(sapa("Dunia"));`,
    visualTopics: ['Visual Event Loop & Microtask Queue', 'Async / Await Promise Tracker', 'DOM Manipulation'],
    sampleAlgorithm: 'Two Pointers Array Search',
  },
  {
    id: 'golang',
    name: 'Go (Golang)',
    tier: 'high',
    tierLabel: 'Cloud & High Concurrency',
    difficulty: 2,
    difficultyLabel: 'Bersih & Terstruktur',
    color: '#38bdf8',
    badge: 'Google Engineering',
    paradigm: 'Konkuren, Prosedural, Kompilasi Kilat',
    description: 'Diciptakan oleh Google untuk menangani jutaan request simultan dengan mekanisme Goroutine dan Channel yang sangat ringan.',
    whyLearn: 'Tulang punggung cloud computing modern (Docker, Kubernetes) dan backend mikroservis cepat.',
    iconName: 'LuLayers',
    helloWorld: `package main
import "fmt"

func main() {
    pesan := make(chan string)
    go func() { pesan <- "Halo dari Goroutine!" }()
    fmt.Println(<-pesan)
}`,
    visualTopics: ['Visual Goroutine Multi-threading', 'Channel Pipelines', 'Pointer Value Semantics'],
    sampleAlgorithm: 'Concurrent Merge Sort',
  },
  {
    id: 'java',
    name: 'Java',
    tier: 'high',
    tierLabel: 'Enterprise & Android',
    difficulty: 3,
    difficultyLabel: 'Menengah (Strict OOP)',
    color: '#f43f5e',
    badge: 'Write Once, Run Anywhere',
    paradigm: 'Object-Oriented Berorientasi Kelas',
    description: 'Bahasa enterprise yang telah berjalan di milyaran perangkat di seluruh dunia berkat Java Virtual Machine (JVM).',
    whyLearn: 'Fondasi arsitektur perbankan skala besar, backend korporasi, dan pemahaman mendalam tentang prinsip OOP & Design Patterns.',
    iconName: 'LuCoffee',
    helloWorld: `public class KinetixApp {
    public static void main(String[] args) {
        System.out.println("Halo dari Java Virtual Machine!");
    }
}`,
    visualTopics: ['JVM Memory Heap vs Stack', 'Garbage Collector Cycle', 'Inheritance & Polymorphism'],
    sampleAlgorithm: 'Selection Sort & Linear Search',
  },

  // ===== TIER MABA: WAJIB MAHASISWA BARU KULIAH =====
  {
    id: 'htmlcss',
    name: 'HTML & CSS',
    tier: 'campus',
    tierLabel: 'Wajib Maba • Web Dasar',
    difficulty: 1,
    difficultyLabel: 'Sangat Ramah Pemula',
    color: '#f97316',
    badge: 'Semester 1 Web',
    paradigm: 'Markup & Styling Deklaratif',
    description: 'Fondasi wajib mata kuliah Pemrograman Web Dasar. HTML menyusun struktur halaman (tag semantik), sedangkan CSS mengatur layout Flexbox, Grid, dan tampilan responsif.',
    whyLearn: 'Gerbang paling cepat melihat hasil kode langsung di browser, sekaligus modal dasar untuk tugas web kampus & portofolio pribadi.',
    iconName: 'LuGlobe',
    helloWorld: `<!-- Struktur Dasar HTML5 & CSS -->
<section class="card">
  <h1>Halo Mahasiswa Baru!</h1>
  <p>Siap membangun website pertamamu.</p>
</section>

<style>
  .card { display: flex; flex-direction: column; gap: 8px; }
</style>`,
    visualTopics: ['Box Model & Padding', 'Flexbox & CSS Grid', 'HTML5 Semantic Tags'],
    sampleAlgorithm: 'DOM Tree Layout Traversal',
  },
  {
    id: 'sql',
    name: 'SQL (MySQL / PostgreSQL)',
    tier: 'campus',
    tierLabel: 'Wajib Maba • Basis Data',
    difficulty: 2,
    difficultyLabel: 'Mudah Dipahami (Deklaratif)',
    color: '#0ea5e9',
    badge: 'Mata Kuliah Basis Data',
    paradigm: 'Deklaratif Relasional (RDBMS)',
    description: 'Bahasa standar untuk mengelola tabel database di mata kuliah Basis Data. Mulai dari SELECT, INSERT, UPDATE, DELETE hingga relasi JOIN antar tabel mahasiswa dan mata kuliah.',
    whyLearn: 'Hampir semua aplikasi backend, skripsi, dan pekerjaan developer membutuhkan pemahaman query database relasional.',
    iconName: 'LuLayers',
    helloWorld: `-- Query Dasar Tabel Mahasiswa
SELECT nama, jurusan, ipk
FROM mahasiswa
WHERE semester = 1 AND ipk >= 3.50
ORDER BY ipk DESC;`,
    visualTopics: ['SELECT & WHERE Filter', 'INNER vs LEFT JOIN', 'Primary & Foreign Key'],
    sampleAlgorithm: 'B-Tree Index Lookup',
  },
  {
    id: 'php',
    name: 'PHP',
    tier: 'campus',
    tierLabel: 'Wajib Maba • Backend Web',
    difficulty: 2,
    difficultyLabel: 'Ramah Pemula Web',
    color: '#818cf8',
    badge: 'CRUD & Laravel Kampus',
    paradigm: 'Server-Side Scripting & OOP',
    description: 'Bahasa backend paling populer di praktikum kampus Indonesia untuk membuat web dinamis, login session, CRUD dengan MySQL, hingga framework modern seperti Laravel.',
    whyLearn: 'Sangat cepat dipelajari untuk menyelesaikan proyek tugas akhir/kuliah web full-stack bersama MySQL.',
    iconName: 'LuCode',
    helloWorld: `<?php
$nama = "Maba Informatika";
$sks = 20;

echo "Halo $nama! Total SKS semester ini: $sks";
?>`,
    visualTopics: ['Request GET vs POST', 'Koneksi PDO / MySQL', 'Session & Autentikasi'],
    sampleAlgorithm: 'Form Validation & Array Filter',
  },
  {
    id: 'csharp',
    name: 'C# (.NET & Unity)',
    tier: 'campus',
    tierLabel: 'Wajib Maba • OOP & Game',
    difficulty: 3,
    difficultyLabel: 'Menengah (Terstruktur & OOP)',
    color: '#22c55e',
    badge: 'PBO & Game Unity',
    paradigm: 'Object-Oriented Modern & Strongly Typed',
    description: 'Bahasa modern buatan Microsoft yang sering dipakai di mata kuliah Pemrograman Berorientasi Objek (PBO), aplikasi desktop Windows, API .NET, hingga membuat game di Unity Engine.',
    whyLearn: 'Sintaks rapi dan aman tipe datanya, sangat kuat untuk memahami konsep Class, Interface, LINQ, dan pengembangan game 2D/3D.',
    iconName: 'LuCpu',
    helloWorld: `using System;

class Program {
    static void Main() {
        string kampus = "Informatika";
        Console.WriteLine($"Halo dari C# {kampus}!");
    }
}`,
    visualTopics: ['Class, Encapsulation & OOP', 'LINQ Collection Query', 'Unity MonoBehaviour Loop'],
    sampleAlgorithm: 'LINQ Filter & Quick Sort',
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    tier: 'campus',
    tierLabel: 'Wajib Maba • Android Mobile',
    difficulty: 3,
    difficultyLabel: 'Menengah (Modern & Null-Safe)',
    color: '#c084fc',
    badge: 'Android Resmi Google',
    paradigm: 'Multi-paradigma (OOP & Fungsional, Null-Safe)',
    description: 'Bahasa resmi pengembangan aplikasi Android yang ringkas, modern, dan anti NullPointerException. Banyak digunakan pada mata kuliah Pemrograman Perangkat Bergerak (Mobile).',
    whyLearn: 'Jauh lebih ringkas daripada Java tradisional, kompatibel penuh dengan ekosistem JVM, dan menjadi standar industri Android.',
    iconName: 'LuZap',
    helloWorld: `fun main() {
    val nama = "Maba Android"
    val nilai: Int? = 90
    println("Halo $nama, nilai awal: \${nilai ?: 0}")
}`,
    visualTopics: ['Null Safety (? & ?.)', 'Data Class & Val/Var', 'Coroutines Async Flow'],
    sampleAlgorithm: 'Null-Safe Collection Pipeline',
  },

  // ===== TIER 3: FUNCTIONAL & ESOTERIC / HARDEST =====
  {
    id: 'haskell',
    name: 'Haskell',
    tier: 'esoteric',
    tierLabel: 'Fungsional Murni & Matematika',
    difficulty: 5,
    difficultyLabel: 'Sangat Tinggi (Abstraksi Matematika)',
    color: '#8b5cf6',
    badge: 'Pure Functional',
    paradigm: 'Fungsional Murni, Lazy Evaluation, Static Monads',
    description: 'Tidak ada loop `for`, tidak ada mutasi variabel! Seluruh komputasi adalah fungsi matematika murni dengan evaluasi pemalas (lazy).',
    whyLearn: 'Mengubah total cara berpikir Anda tentang logika program. Menghasilkan kode anti-bug tingkat tinggi.',
    iconName: 'LuSparkles',
    helloWorld: `-- Quick Sort dalam 5 baris di Haskell!
quicksort :: (Ord a) => [a] -> [a]
quicksort [] = []
quicksort (x:xs) =
    quicksort [a | a <- xs, a <= x] ++ [x] ++ quicksort [a | a <- xs, a > x]`,
    visualTopics: ['Visual Rekursi Pohon Tree', 'Lazy Evaluation Stream', 'Purity vs Side Effect'],
    sampleAlgorithm: 'Quicksort via List Comprehension',
  },
  {
    id: 'brainfuck',
    name: 'Brainfuck',
    tier: 'esoteric',
    tierLabel: 'Tersulit & Esoterik Ekstrem',
    difficulty: 5,
    difficultyLabel: 'Ekstrem (Turing Tarpit)',
    color: '#ec4899',
    badge: 'Hanya 8 Karakter',
    paradigm: 'Turing Tape Machine Minimalist',
    description: 'Salah satu bahasa pemrograman esoterik paling terkenal di dunia. Didesain hanya dengan 8 karakter perintah (`> < + - . , [ ]`) yang mengontrol pita sel memori secara langsung.',
    whyLearn: 'Tantangan kecerdasan pemecahan masalah murni dan mengerti konsep pita Turing Machine secara nyata.',
    iconName: 'LuTerminal',
    helloWorld: `++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.
; Menghasilkan teks: "Hello World!"`,
    visualTopics: ['Visual Pita Sel Memori (Array of Bytes)', 'Pergeseran Pointer Pita', 'Looping Bracket Balance'],
    sampleAlgorithm: 'Memory Tape ASCII Accumulator',
  },
  {
    id: 'prolog',
    name: 'Prolog',
    tier: 'esoteric',
    tierLabel: 'Pemrograman Logika Deklaratif',
    difficulty: 4,
    difficultyLabel: 'Menantang (Pola Pikir Logika)',
    color: '#10b981',
    badge: 'AI Rule Engine',
    paradigm: 'Logika Predikat & Mesin Inferensi',
    description: 'Anda tidak mendikte langkah komputer ("bagaimana cara"), melainkan mendefinisikan fakta dan aturan ("apa yang benar"). Mesin Prolog akan membuktikan jawabannya sendiri.',
    whyLearn: 'Fondasi sistem pakar (expert systems), parser bahasa alami, dan penalaran inferensial cerdas.',
    iconName: 'LuCompass',
    helloWorld: `% Fakta dan Aturan Sederhana
orang_tua(joko, budi).
orang_tua(budi, ani).
kakek(X, Z) :- orang_tua(X, Y), orang_tua(Y, Z).
% Kueri: ?- kakek(joko, ani). -> Yes.`,
    visualTopics: ['Grafik Resolusi Unifikasi', 'Backtracking Search Tree', 'Inferensi Logika'],
    sampleAlgorithm: 'Grafik Jalur & Pembuktian Teorema',
  },
  {
    id: 'malbolge',
    name: 'Malbolge',
    tier: 'esoteric',
    tierLabel: 'Bahasa Paling Mustahil di Dunia',
    difficulty: 5,
    difficultyLabel: 'Tingkat Legenda (Hampir Mustahil)',
    color: '#a855f7',
    badge: 'Neraka Dante Tingkat 8',
    paradigm: 'Self-encrypting Ternary Virtual Machine',
    description: 'Didesain khusus pada tahun 1998 untuk menjadi bahasa yang paling mustahil dipahami manusia. Kode program mengenkripsi dirinya sendiri di setiap siklus eksekusi memori basis 3 (ternary).',
    whyLearn: 'Fenomena legendaris dalam sejarah komputasi di mana program pertamanya ("Hello World") harus dibuat oleh algoritma pencarian genetika komputer karena manusia tidak bisa menulisnya langsung.',
    iconName: 'LuFlame',
    helloWorld: '(=<`#9]~6ZY32Vx/4Rs+0No-&Jk)"Fh}|Bcy?`=*z]Kw%oG4UUS0/@-N',
    visualTopics: ['Siklus Enkripsi Memory Cipher', 'Ternary Trits Virtual Machine', 'Crazy Operator Matrix'],
    sampleAlgorithm: 'Ternary Machine Cipher Walk',
  },
]

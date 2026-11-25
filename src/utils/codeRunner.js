// Pure in-browser code execution engine & starter templates for Kinetix Code Playground
// Supports JavaScript (sandboxed Function), Brainfuck (30k-byte Turing tape),
// Python (lightweight AST/block interpreter), and C/C++/Java/Go/Rust statements.

const LANG_LABELS = {
  python: 'Python',
  javascript: 'JavaScript',
  c: 'C Language',
  cpp: 'C++',
  java: 'Java',
  golang: 'Go (Golang)',
  rust: 'Rust',
  brainfuck: 'Brainfuck',
}

export const PLAYGROUND_LANGUAGES = [
  { id: 'python', name: 'Python', ext: 'main.py' },
  { id: 'javascript', name: 'JavaScript', ext: 'main.js' },
  { id: 'c', name: 'C Language', ext: 'main.c' },
  { id: 'cpp', name: 'C++', ext: 'main.cpp' },
  { id: 'java', name: 'Java', ext: 'Main.java' },
  { id: 'golang', name: 'Go (Golang)', ext: 'main.go' },
  { id: 'rust', name: 'Rust', ext: 'main.rs' },
  { id: 'brainfuck', name: 'Brainfuck', ext: 'tape.bf' },
]

export const PLAYGROUND_TEMPLATES = {
  python: {
    hello: `# Python Interactive Sandbox\nnama = "Koder"\nprint(f"Halo {nama}, selamat datang di Kinetix Code!")\nprint("2 + 3 * 4 =", 2 + 3 * 4)`,
    loop: `# Perulangan & Akumulasi Total\ntotal = 0\nfor i in range(1, 6):\n    total += i\n    print(f"Langkah {i}: total = {total}")`,
    algo: `# Bubble Sort Array di Python\narr = [42, 17, 89, 5, 23]\nn = len(arr)\nfor i in range(n):\n    for j in range(0, n - i - 1):\n        if arr[j] > arr[j + 1]:\n            arr[j], arr[j + 1] = arr[j + 1], arr[j]\nprint("Terurut:", arr)`,
  },
  javascript: {
    hello: `// JavaScript Live Sandbox\nconst nama = "Koder";\nconsole.log(\`Halo \${nama}, siap eksekusi JS real-time!\`);\nconsole.log("Hasil:", [1, 2, 3, 4].map(n => n * n));`,
    loop: `// Perulangan & FizzBuzz Ringkas\nfor (let i = 1; i <= 10; i++) {\n  if (i % 15 === 0) console.log("FizzBuzz");\n  else if (i % 3 === 0) console.log(i, "-> Fizz");\n  else if (i % 5 === 0) console.log(i, "-> Buzz");\n  else console.log(i);\n}`,
    algo: `// Binary Search di JavaScript\nconst arr = [10, 22, 35, 44, 58, 72, 91];\nconst target = 44;\nlet low = 0, high = arr.length - 1, found = -1;\nwhile (low <= high) {\n  const mid = Math.floor((low + high) / 2);\n  if (arr[mid] === target) { found = mid; break; }\n  if (arr[mid] < target) low = mid + 1;\n  else high = mid - 1;\n}\nconsole.log("Target ditemukan di indeks:", found);`,
  },
  c: {
    hello: `#include <stdio.h>\n\nint main() {\n    int nilai = 42;\n    printf("Halo dari Bahasa C!\\n");\n    printf("Nilai variabel: %d\\n", nilai);\n    return 0;\n}`,
    loop: `#include <stdio.h>\n\nint main() {\n    int sum = 0;\n    for (int i = 1; i <= 5; i++) {\n        sum += i;\n        printf("i=%d, sum=%d\\n", i, sum);\n    }\n    return 0;\n}`,
    algo: `#include <stdio.h>\n\nint main() {\n    int a = 15, b = 40, temp;\n    printf("Sebelum swap: a=%d, b=%d\\n", a, b);\n    temp = a; a = b; b = temp;\n    printf("Sesudah swap: a=%d, b=%d\\n", a, b);\n    return 0;\n}`,
  },
  cpp: {
    hello: `#include <iostream>\n\nint main() {\n    int skor = 95;\n    std::cout << "Halo dari C++ Modern!" << std::endl;\n    std::cout << "Skor saat ini: " << skor << std::endl;\n    return 0;\n}`,
    loop: `#include <iostream>\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        std::cout << "Iterasi ke-" << i << " kuadrat = " << (i * i) << std::endl;\n    }\n    return 0;\n}`,
    algo: `#include <iostream>\n\nint main() {\n    int x = 12, y = 8;\n    int maks = (x > y) ? x : y;\n    std::cout << "Nilai maksimum: " << maks << std::endl;\n    return 0;\n}`,
  },
  java: {
    hello: `public class Main {\n    public static void main(String[] args) {\n        String pesan = "Halo dari Java!";\n        System.out.println(pesan);\n        System.out.println(10 + 25);\n    }\n}`,
    loop: `public class Main {\n    public static void main(String[] args) {\n        int total = 1;\n        for (int i = 1; i <= 5; i++) {\n            total *= i;\n            System.out.println("Faktorial " + i + " = " + total);\n        }\n    }\n}`,
    algo: `public class Main {\n    public static void main(String[] args) {\n        int a = 7, b = 3;\n        System.out.println("Hasil modulo: " + (a % b));\n    }\n}`,
  },
  golang: {
    hello: `package main\nimport "fmt"\n\nfunc main() {\n    nama := "Kinetix"\n    fmt.Println("Halo dari Go!", nama)\n    fmt.Println("Total:", 25 + 17)\n}`,
    loop: `package main\nimport "fmt"\n\nfunc main() {\n    sum := 0\n    for i := 1; i <= 5; i++ {\n        sum += i\n        fmt.Println("Langkah", i, "-> sum:", sum)\n    }\n}`,
    algo: `package main\nimport "fmt"\n\nfunc main() {\n    a := 10\n    b := 25\n    if b > a {\n        fmt.Println("Terbesar:", b)\n    } else {\n        fmt.Println("Terbesar:", a)\n    }\n}`,
  },
  rust: {
    hello: `fn main() {\n    let mut skor = 10;\n    skor += 32;\n    println!("Halo dari Rust!");\n    println!("Skor aman: {}", skor);\n}`,
    loop: `fn main() {\n    let mut total = 0;\n    for i in 1..6 {\n        total += i;\n        println!("i = {}, total = {}", i, total);\n    }\n}`,
    algo: `fn main() {\n    let a = 18;\n    let b = 27;\n    let selisih = b - a;\n    println!("Selisih nilai: {}", selisih);\n}`,
  },
  brainfuck: {
    hello: `; Mencetak "HI!" pada pita memori Brainfuck\n++++++++++[>+++++++>++++++++++>+++<<<-]>++.>+.>+++.`,
    loop: `; Menghasilkan huruf A B C D E secara berurutan\n++++++++[>++++++++<-]>+.[>+<-]>.+.[>+<-]>.+.[>+<-]>.+.[>+<-]>.+.`,
    algo: `; Penjumlahan 3 + 4 menjadi angka ASCII '7' (55)\n+++>++++<[->+<]>++++++++++++++++++++++++++++++++++++++++++++++++.`,
  },
}

export function getTemplateForLang(langId, preset = 'hello') {
  const map = {
    assembly: 'c',
    haskell: 'python',
    prolog: 'javascript',
    malbolge: 'brainfuck',
    htmlcss: 'javascript',
    sql: 'python',
    php: 'javascript',
    csharp: 'java',
    kotlin: 'java',
  }
  const normalized = PLAYGROUND_TEMPLATES[langId] ? langId : map[langId] || 'python'
  return {
    effectiveLang: normalized,
    code: PLAYGROUND_TEMPLATES[normalized]?.[preset] || PLAYGROUND_TEMPLATES.python.hello,
  }
}

function formatVal(val) {
  if (val === null) return 'null'
  if (val === undefined) return 'undefined'
  if (typeof val === 'string') return val
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val)
    } catch {
      return String(val)
    }
  }
  return String(val)
}

function maskStringsAndComments(code, lineCommentToken = '//') {
  let out = ''
  let i = 0
  let quote = null
  let inBlockComment = false
  let inLineComment = false

  while (i < code.length) {
    const ch = code[i]
    const next = code[i + 1]

    if (inLineComment) {
      if (ch === '\n') {
        inLineComment = false
        out += '\n'
      }
      i++
      continue
    }

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false
        i += 2
      } else {
        if (ch === '\n') out += '\n'
        i++
      }
      continue
    }

    if (quote) {
      if (ch === '\\' && i + 1 < code.length) {
        i += 2
        continue
      }
      if (ch === quote) {
        quote = null
        out += ch
      } else if (ch === '\n') {
        quote = null
        out += '\n'
      }
      i++
      continue
    }

    if (lineCommentToken === '//' && ch === '/' && next === '*') {
      inBlockComment = true
      i += 2
      continue
    }

    if (lineCommentToken && code.startsWith(lineCommentToken, i)) {
      inLineComment = true
      i += lineCommentToken.length
      continue
    }

    if (ch === '"' || ch === "'" || (lineCommentToken === '//' && ch === '`')) {
      quote = ch
      out += ch
      i++
      continue
    }

    out += ch
    i++
  }

  return out
}

function validateJavaScriptSyntax(code) {
  const masked = maskStringsAndComments(code, '//')
  if (/^\s*#\s*include\b/m.test(masked)) {
    return 'SyntaxError [JavaScript]: Direktif #include milik C/C++, bukan JavaScript.'
  }
  if (/\bdef\s+[a-zA-Z_]\w*\s*\([^)]*\)\s*:/m.test(masked) || /^\s*(?:elif|if|for|while)\b[^;{}\n]*:\s*$/m.test(masked) || /^\s*else\s*:\s*$/m.test(masked)) {
    return 'SyntaxError [JavaScript]: Sintaks Python terdeteksi (def/if/else dengan ":"). Gunakan kurung kurawal "{ ... }" di JavaScript.'
  }
  if (/\bSystem\.out\.|\bstd::cout\b|\bfmt\.Print|\bprintln!\s*\(|\b(?:int|void)\s+main\s*\(|\bfn\s+main\s*\(|\bpackage\s+main\b/.test(masked)) {
    return 'SyntaxError [JavaScript]: Terdeteksi sintaks bahasa lain (Java/C++/Go/Rust). Gunakan sintaks JavaScript & console.log().'
  }
  if (/(?<![.\w])print\s*\(/.test(masked)) {
    return 'ReferenceError [JavaScript]: Fungsi print() tidak valid untuk output console di JavaScript. Gunakan console.log(...).'
  }
  return null
}

function validatePythonSyntax(code) {
  const masked = maskStringsAndComments(code, '#')
  if (/^\s*#\s*include\b/m.test(masked)) {
    return 'SyntaxError [Python]: Direktif #include milik C/C++, bukan Python.'
  }
  if (/\b(?:int|void)\s+main\s*\(|\bpublic\s+class\b|\bpackage\s+main\b|\bfn\s+main\s*\(|\bfunc\s+main\s*\(/.test(masked)) {
    return 'SyntaxError [Python]: Struktur main()/class milik C/C++/Java/Go/Rust tidak digunakan di Python.'
  }
  if (/\bSystem\.out\.|\bstd::cout\b|\bcout\s*<<|\bconsole\.log\s*\(|\bprintf\s*\(|\bprintln!\s*\(|\bfmt\.Print/.test(masked)) {
    return 'SyntaxError [Python]: Perintah output bahasa lain terdeteksi. Gunakan fungsi print(...) di Python.'
  }
  if (/^\s*(?:if|else\s+if|else|for|while|function)\b[^\n]*\{\s*$/m.test(masked)) {
    return 'SyntaxError [Python]: Python memakai titik dua (:) dan indentasi, bukan kurung kurawal "{ }".'
  }
  if (/^\s*(?:const|let|var|int|float|double|long|String)\s+[a-zA-Z_]\w*\s*=/.test(masked)) {
    return 'SyntaxError [Python]: Deklarasi tipe/kata kunci JS/C/Java (let/const/int/String) tidak valid di Python.'
  }
  return null
}

function validateCStyleSyntax(code, langId) {
  const label = LANG_LABELS[langId] || langId
  const masked = maskStringsAndComments(code, '//')

  if (!masked.trim()) return null

  // Check balanced {} and ()
  let braceDepth = 0
  let parenDepth = 0
  for (let i = 0; i < masked.length; i++) {
    const ch = masked[i]
    if (ch === '{') braceDepth++
    else if (ch === '}') {
      braceDepth--
      if (braceDepth < 0) return `SyntaxError [${label}]: Kurung kurawal penutup '}' berlebih.`
    } else if (ch === '(') parenDepth++
    else if (ch === ')') {
      parenDepth--
      if (parenDepth < 0) return `SyntaxError [${label}]: Tanda kurung penutup ')' berlebih.`
    }
  }
  if (braceDepth !== 0) return `SyntaxError [${label}]: Kurung kurawal '{' belum ditutup dengan '}'.`
  if (parenDepth !== 0) return `SyntaxError [${label}]: Tanda kurung '(' belum ditutup dengan ')'.`

  // Reject Python-style blocks or print() across all C-style languages
  if (
    /^\s*(?:if|elif|else|for|while|def)\b[^;{}\n]*:\s*$/m.test(masked) ||
    /^\s*def\s+[a-zA-Z_]\w*\s*\(/m.test(masked) ||
    /\belif\b/.test(masked)
  ) {
    return `SyntaxError [${label}]: Sintaks Python (blok ":" / def / elif) terdeteksi. Gunakan sintaks ${label} yang valid dengan "{ }".`
  }

  if (/(?<![.\w])print\s*\(/.test(masked)) {
    return `SyntaxError [${label}]: Fungsi print() milik Python tidak valid di ${label}. Gunakan output standar ${label}.`
  }

  if (/\bconsole\.log\s*\(/.test(masked)) {
    return `SyntaxError [${label}]: console.log() milik JavaScript, bukan ${label}.`
  }

  // Language-specific cross-syntax checks
  if (langId === 'c') {
    if (/\bstd::cout\b|\bcout\s*<<|\busing\s+namespace\b|#\s*include\s*<iostream>/.test(masked)) {
      return 'SyntaxError [C Language]: Sintaks C++ (cout / iostream) tidak valid di Bahasa C murni. Gunakan <stdio.h> & printf().'
    }
    if (/\bSystem\.out\.|\bfmt\.Print|\bprintln!\s*\(|\bpackage\s+main\b|\bfn\s+main\b|\bpublic\s+class\b|\bfunc\s+main\b/.test(masked)) {
      return 'SyntaxError [C Language]: Terdeteksi sintaks Java/Go/Rust di editor C.'
    }
  } else if (langId === 'cpp') {
    if (/\bSystem\.out\.|\bfmt\.Print|\bprintln!\s*\(|\bpackage\s+main\b|\bfn\s+main\b|\bpublic\s+class\b|\bfunc\s+main\b/.test(masked)) {
      return 'SyntaxError [C++]: Terdeteksi sintaks Java/Go/Rust di editor C++.'
    }
  } else if (langId === 'java') {
    if (/^\s*#\s*include\b/m.test(masked) || /\bstd::cout\b|\bcout\s*<<|\bfmt\.Print|\bprintln!\s*\(|\bpackage\s+main\b|\bfn\s+main\b|\bfunc\s+main\b/.test(masked)) {
      return 'SyntaxError [Java]: Terdeteksi sintaks C/C++/Go/Rust di editor Java.'
    }
    if (/(?<!System\.out\.)\bprintf\s*\(/.test(masked)) {
      return 'SyntaxError [Java]: Gunakan System.out.println(...) di Java.'
    }
  } else if (langId === 'golang') {
    if (/^\s*#\s*include\b/m.test(masked) || /\bstd::cout\b|\bcout\s*<<|\bSystem\.out\.|\bprintln!\s*\(|\bpublic\s+class\b|\bfn\s+main\b|\bint\s+main\s*\(/.test(masked)) {
      return 'SyntaxError [Go (Golang)]: Terdeteksi sintaks C/C++/Java/Rust di editor Go.'
    }
  } else if (langId === 'rust') {
    if (/^\s*#\s*include\b/m.test(masked) || /\bstd::cout\b|\bcout\s*<<|\bSystem\.out\.|\bfmt\.Print|\bpublic\s+class\b|\bpackage\s+main\b|\bint\s+main\s*\(|\bfunc\s+main\b/.test(masked)) {
      return 'SyntaxError [Rust]: Terdeteksi sintaks C/C++/Java/Go di editor Rust.'
    }
  }

  // Semicolon check for strict C / C++ / Java
  if (langId === 'c' || langId === 'cpp' || langId === 'java') {
    const rawLines = masked.split('\n')
    for (let idx = 0; idx < rawLines.length; idx++) {
      const trimmed = rawLines[idx].trim()
      if (!trimmed) continue
      if (
        trimmed.startsWith('#include') ||
        trimmed.startsWith('using namespace') ||
        trimmed.startsWith('package ') ||
        trimmed.startsWith('import ')
      ) {
        continue
      }
      if (/[;{}]$/.test(trimmed)) continue

      // Allow control / function headers if next non-empty line starts with '{'
      let j = idx + 1
      while (j < rawLines.length && !rawLines[j].trim()) j++
      const nextTrimmed = j < rawLines.length ? rawLines[j].trim() : ''
      if (nextTrimmed.startsWith('{')) continue

      return `SyntaxError [${label}]: Baris ${idx + 1} tidak valid atau kurang titik koma (';'): "${trimmed.slice(0, 48)}"`
    }
  }

  return null
}

function runJavaScript(code) {
  const errMsg = validateJavaScriptSyntax(code)
  if (errMsg) return { stdout: [], stderr: errMsg }

  const stdout = []
  const fakeConsole = {
    log: (...args) => stdout.push(args.map(formatVal).join(' ')),
    info: (...args) => stdout.push(args.map(formatVal).join(' ')),
    warn: (...args) => stdout.push('[warn] ' + args.map(formatVal).join(' ')),
    error: (...args) => stdout.push('[error] ' + args.map(formatVal).join(' ')),
  }
  const blockedPrint = () => {
    throw new Error('ReferenceError [JavaScript]: Gunakan console.log(...), bukan print().')
  }
  try {
    const fn = new Function('console', 'print', code)
    fn(fakeConsole, blockedPrint)
    return { stdout, stderr: null }
  } catch (err) {
    return { stdout, stderr: `${err.name}: ${err.message}` }
  }
}

function runBrainfuck(code) {
  const ops = code.replace(/[^><+\-.,[\]]/g, '')
  if (code.trim().length > 0 && ops.length === 0) {
    return {
      stdout: [],
      stderr:
        'SyntaxError [Brainfuck]: Tidak ditemukan instruksi Brainfuck valid (> < + - . , [ ]). Kode bahasa lain tidak dapat dijalankan di mode Brainfuck.',
    }
  }
  const bracketMap = {}
  const stack = []
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === '[') stack.push(i)
    else if (ops[i] === ']') {
      if (stack.length === 0) return { stdout: [], stderr: `SyntaxError: Kurung ']' tidak berpasangan di posisi ${i}` }
      const open = stack.pop()
      bracketMap[open] = i
      bracketMap[i] = open
    }
  }
  if (stack.length > 0) {
    return { stdout: [], stderr: `SyntaxError: Kurung '[' tidak ditutup` }
  }

  const tape = new Uint8Array(30000)
  let ptr = 0
  let pc = 0
  let steps = 0
  const maxSteps = 100000
  let out = ''

  while (pc < ops.length) {
    if (++steps > maxSteps) {
      return {
        stdout: out ? out.split('\n') : [],
        stderr: `TimeoutError: Eksekusi melebihi ${maxSteps} langkah (kemungkinan infinite loop)`,
      }
    }
    const ch = ops[pc]
    if (ch === '>') ptr = (ptr + 1) % 30000
    else if (ch === '<') ptr = (ptr - 1 + 30000) % 30000
    else if (ch === '+') tape[ptr] = (tape[ptr] + 1) & 255
    else if (ch === '-') tape[ptr] = (tape[ptr] - 1) & 255
    else if (ch === '.') out += String.fromCharCode(tape[ptr])
    else if (ch === '[') {
      if (tape[ptr] === 0) pc = bracketMap[pc]
    } else if (ch === ']') {
      if (tape[ptr] !== 0) pc = bracketMap[pc]
    }
    pc++
  }

  const lines = out.length > 0 ? out.split('\n') : []
  return { stdout: lines, stderr: null }
}

// Split comma-separated arguments respecting quotes & brackets
function splitArgs(str) {
  const parts = []
  let cur = ''
  let depth = 0
  let quote = null
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    if (quote) {
      cur += ch
      if (ch === quote && str[i - 1] !== '\\') quote = null
    } else if (ch === '"' || ch === "'") {
      quote = ch
      cur += ch
    } else if (ch === '(' || ch === '[' || ch === '{') {
      depth++
      cur += ch
    } else if (ch === ')' || ch === ']' || ch === '}') {
      depth--
      cur += ch
    } else if (ch === ',' && depth === 0) {
      if (cur.trim()) parts.push(cur.trim())
      cur = ''
    } else {
      cur += ch
    }
  }
  if (cur.trim()) parts.push(cur.trim())
  return parts
}

function stripCommentOutsideStrings(line, commentToken) {
  let quote = null
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (quote) {
      if (ch === quote && line[i - 1] !== '\\') quote = null
    } else if (ch === '"' || ch === "'") {
      quote = ch
    } else if (line.startsWith(commentToken, i)) {
      return line.slice(0, i)
    }
  }
  return line
}

function evalExpression(expr, env) {
  let raw = expr.trim()
  if (!raw) return undefined

  // Handle Python f-strings: f"..." or f'...'
  raw = raw.replace(/\bf(["'])((?:\\.|[^\\])*?)\1/g, (_, q, body) => {
    const template = body.replace(/\{([^}]+)\}/g, (__, inner) => `\${(${inner})}`)
    return '`' + template + '`'
  })

  // Python keywords -> JS equivalents outside quotes
  raw = raw
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null')
    .replace(/\band\b/g, '&&')
    .replace(/\bor\b/g, '||')
    .replace(/\bnot\s+/g, '!')
    .replace(/\/\//g, '/*idiv*/')

  if (raw.includes('/*idiv*/')) {
    // Simple integer floor division support: a // b -> Math.floor((a)/(b))
    raw = raw.replace(/([a-zA-Z0-9_.\])]+)\s*\/\*idiv\*\/\s*([a-zA-Z0-9_.\[(]+)/g, 'Math.floor(($1)/($2))')
  }

  const keys = Object.keys(env).filter((k) => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k))
  const vals = keys.map((k) => env[k])
  try {
    const fn = new Function(...keys, `"use strict"; return (${raw});`)
    return fn(...vals)
  } catch (err) {
    throw new Error(`Gagal mengevaluasi ekspresi "${expr.trim()}": ${err.message}`)
  }
}

function formatPythonValue(v) {
  if (v === true) return 'True'
  if (v === false) return 'False'
  if (v === null || v === undefined) return 'None'
  if (Array.isArray(v)) return '[' + v.map((x) => (typeof x === 'string' ? `'${x}'` : formatPythonValue(x))).join(', ') + ']'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

function assignTarget(targetExpr, value, env) {
  const idxMatch = targetExpr.match(/^([a-zA-Z_]\w*)\[(.+)\]$/)
  if (idxMatch) {
    const arr = env[idxMatch[1]]
    const idx = evalExpression(idxMatch[2], env)
    if (Array.isArray(arr)) arr[idx] = value
    return
  }
  env[targetExpr.trim()] = value
}

function runPython(code) {
  const pyErr = validatePythonSyntax(code)
  if (pyErr) return { stdout: [], stderr: pyErr }

  const stdout = []
  const rawLines = code.split('\n')
  const parsed = []

  for (let i = 0; i < rawLines.length; i++) {
    const noComment = stripCommentOutsideStrings(rawLines[i], '#')
    if (!noComment.trim()) continue
    const indent = noComment.match(/^(\s*)/)[1].replace(/\t/g, '    ').length
    parsed.push({ lineNo: i + 1, indent, text: noComment.trim() })
  }

  function buildBlock(startIdx, minIndent) {
    const stmts = []
    let i = startIdx
    while (i < parsed.length) {
      const item = parsed[i]
      if (item.indent < minIndent) break
      if (item.text.startsWith('elif ') || item.text.startsWith('else:')) {
        if (item.indent === minIndent) break
      }
      if (item.text.endsWith(':')) {
        const header = item.text.slice(0, -1).trim()
        const bodyRes = buildBlock(i + 1, item.indent + 1)
        i = bodyRes.nextIdx

        if (header.startsWith('if ')) {
          const branches = [{ cond: header.slice(3).trim(), body: bodyRes.stmts }]
          while (i < parsed.length && parsed[i].indent === item.indent) {
            const nextTxt = parsed[i].text
            if (nextTxt.startsWith('elif ') && nextTxt.endsWith(':')) {
              const bRes = buildBlock(i + 1, item.indent + 1)
              branches.push({ cond: nextTxt.slice(5, -1).trim(), body: bRes.stmts })
              i = bRes.nextIdx
            } else if (nextTxt === 'else:') {
              const bRes = buildBlock(i + 1, item.indent + 1)
              branches.push({ cond: null, body: bRes.stmts })
              i = bRes.nextIdx
              break
            } else break
          }
          stmts.push({ kind: 'if', branches, lineNo: item.lineNo })
          continue
        }
        stmts.push({ kind: 'block', header, body: bodyRes.stmts, lineNo: item.lineNo })
        continue
      }
      stmts.push({ kind: 'stmt', text: item.text, lineNo: item.lineNo })
      i++
    }
    return { stmts, nextIdx: i }
  }

  const globalEnv = {
    range: (...args) => {
      let start = 0, end = 0, step = 1
      if (args.length === 1) end = args[0]
      else if (args.length >= 2) { start = args[0]; end = args[1]; step = args[2] ?? 1 }
      const out = []
      if (step > 0) for (let k = start; k < end; k += step) out.push(k)
      else if (step < 0) for (let k = start; k > end; k += step) out.push(k)
      return out
    },
    len: (x) => (x?.length !== undefined ? x.length : 0),
    sum: (arr) => (Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0),
    min: (...args) => (args.length === 1 && Array.isArray(args[0]) ? Math.min(...args[0]) : Math.min(...args)),
    max: (...args) => (args.length === 1 && Array.isArray(args[0]) ? Math.max(...args[0]) : Math.max(...args)),
    abs: Math.abs,
    round: Math.round,
    int: (x) => parseInt(x, 10),
    float: (x) => parseFloat(x),
    str: (x) => formatPythonValue(x),
    sorted: (arr) => [...arr].sort((a, b) => a - b),
    type: (x) => (Array.isArray(x) ? "<class 'list'>" : typeof x === 'number' ? (Number.isInteger(x) ? "<class 'int'>" : "<class 'float'>") : typeof x === 'string' ? "<class 'str'>" : "<class 'object'>"),
  }

  let steps = 0
  const MAX_STEPS = 5000

  function execStmts(stmts, env) {
    for (const node of stmts) {
      if (++steps > MAX_STEPS) throw new Error('TimeoutError: Eksekusi melebihi batas langkah aman')
      if (node.kind === 'if') {
        for (const br of node.branches) {
          if (br.cond === null || Boolean(evalExpression(br.cond, env))) {
            const sig = execStmts(br.body, env)
            if (sig) return sig
            break
          }
        }
        continue
      }
      if (node.kind === 'block') {
        const h = node.header
        if (h.startsWith('for ')) {
          const m = h.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.+)$/)
          if (!m) throw new Error(`SyntaxError (baris ${node.lineNo}): ${h}`)
          const iterVal = evalExpression(m[2], env)
          if (!Array.isArray(iterVal) && typeof iterVal !== 'string') {
            throw new Error(`TypeError (baris ${node.lineNo}): objek tidak bisa diiterasi`)
          }
          for (const item of iterVal) {
            env[m[1]] = item
            const sig = execStmts(node.body, env)
            if (sig?.type === 'break') break
            if (sig?.type === 'return') return sig
          }
        } else if (h.startsWith('while ')) {
          const cond = h.slice(6).trim()
          while (Boolean(evalExpression(cond, env))) {
            if (++steps > MAX_STEPS) throw new Error('TimeoutError: Perulangan while terlalu panjang')
            const sig = execStmts(node.body, env)
            if (sig?.type === 'break') break
            if (sig?.type === 'return') return sig
          }
        } else if (h.startsWith('def ')) {
          const m = h.match(/^def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)$/)
          if (!m) throw new Error(`SyntaxError (baris ${node.lineNo}): ${h}`)
          const fnName = m[1]
          const params = splitArgs(m[2]).map((p) => p.trim()).filter(Boolean)
          env[fnName] = (...callArgs) => {
            const localEnv = { ...env }
            params.forEach((p, idx) => { localEnv[p] = callArgs[idx] })
            const sig = execStmts(node.body, localEnv)
            return sig?.type === 'return' ? sig.value : undefined
          }
        }
        continue
      }

      const txt = node.text
      if (txt === 'break') return { type: 'break' }
      if (txt === 'continue') return { type: 'continue' }
      if (txt === 'pass') continue
      if (txt.startsWith('return')) {
        const expr = txt.slice(6).trim()
        return { type: 'return', value: expr ? evalExpression(expr, env) : undefined }
      }

      const printMatch = txt.match(/^print\s*\(([\s\S]*)\)$/)
      if (printMatch) {
        const args = splitArgs(printMatch[1]).map((a) => evalExpression(a, env))
        stdout.push(args.map(formatPythonValue).join(' '))
        continue
      }

      const appendMatch = txt.match(/^([a-zA-Z_]\w*)\.append\s*\(([\s\S]+)\)$/)
      if (appendMatch && Array.isArray(env[appendMatch[1]])) {
        env[appendMatch[1]].push(evalExpression(appendMatch[2], env))
        continue
      }

      const compMatch = txt.match(/^([a-zA-Z_]\w*(?:\[[^\]]+\])?)\s*(\+=|-=|\*=|\/=|%=)\s*([\s\S]+)$/)
      if (compMatch) {
        const [, lhs, op, rhs] = compMatch
        const cur = evalExpression(lhs, env)
        const val = evalExpression(rhs, env)
        let next = cur
        if (op === '+=') next = cur + val
        else if (op === '-=') next = cur - val
        else if (op === '*=') next = cur * val
        else if (op === '/=') next = cur / val
        else if (op === '%=') next = cur % val
        assignTarget(lhs, next, env)
        continue
      }

      // Assignment (including tuple unpack/swap `a, b = b, a`)
      const eqIdx = (() => {
        let q = null, d = 0
        for (let k = 0; k < txt.length; k++) {
          const ch = txt[k]
          if (q) { if (ch === q && txt[k - 1] !== '\\') q = null }
          else if (ch === '"' || ch === "'") q = ch
          else if ('([{'.includes(ch)) d++
          else if (')]}'.includes(ch)) d--
          else if (ch === '=' && d === 0 && txt[k + 1] !== '=' && !'<>!'.includes(txt[k - 1])) return k
        }
        return -1
      })()

      if (eqIdx > 0) {
        const lhs = txt.slice(0, eqIdx).trim()
        const rhs = txt.slice(eqIdx + 1).trim()
        const lhsParts = splitArgs(lhs)
        const rhsParts = splitArgs(rhs)
        if (lhsParts.length > 1) {
          const evalled = rhsParts.length > 1
            ? rhsParts.map((r) => evalExpression(r, env))
            : evalExpression(rhs, env)
          lhsParts.forEach((target, idx) => {
            assignTarget(target, Array.isArray(evalled) ? evalled[idx] : undefined, env)
          })
        } else {
          assignTarget(lhs, evalExpression(rhs, env), env)
        }
        continue
      }

      evalExpression(txt, env)
    }
    return null
  }

  try {
    const ast = buildBlock(0, 0)
    execStmts(ast.stmts, globalEnv)
    return { stdout, stderr: null }
  } catch (err) {
    return { stdout, stderr: err.message }
  }
}

// Lightweight C / C++ / Java / Go / Rust statement interpreter
function runCStyle(code, langId) {
  const label = LANG_LABELS[langId] || langId
  const preErr = validateCStyleSyntax(code, langId)
  if (preErr) return { stdout: [], stderr: preErr }

  const stdout = []
  let outputBuffer = ''

  const flushLine = (text, addNewline = true) => {
    outputBuffer += text
    if (addNewline) {
      stdout.push(outputBuffer)
      outputBuffer = ''
    }
  }

  // Strip comments and preprocessor/package boilerplate
  const cleanLines = code
    .split('\n')
    .map((l) => stripCommentOutsideStrings(l, '//'))
    .filter((l) => {
      const t = l.trim()
      if (!t) return false
      if (t.startsWith('#include') || t.startsWith('using namespace')) return false
      if (t.startsWith('package ') || t.startsWith('import ')) return false
      return true
    })
    .join('\n')

  // Extract body if wrapped in main() / class Main
  let body = cleanLines.trim()
  const mainMatch = body.match(/(?:int|void|fn|func|public\s+static\s+void)\s+main\s*\([^)]*\)\s*\{([\s\S]*)\}\s*\}?\s*$/)
  if (mainMatch) {
    body = mainMatch[1].trim()
  }

  // Tokenize into balanced statement tree { kind, header, body }
  function parseBlock(src, start = 0) {
    const stmts = []
    let i = start
    let cur = ''
    let quote = null
    let paren = 0

    while (i < src.length) {
      const ch = src[i]
      if (quote) {
        cur += ch
        if (ch === quote && src[i - 1] !== '\\') quote = null
        i++
        continue
      }
      if (ch === '"' || ch === "'") {
        quote = ch
        cur += ch
        i++
        continue
      }
      if (ch === '(') paren++
      if (ch === ')') paren = Math.max(0, paren - 1)

      if (ch === '{' && paren === 0) {
        const trimmedCur = cur.trim()
        // Array initializer like `int arr[] = {5, 2, 8};` or `[]int{1, 2}` is NOT a code block
        if (/=\s*$/.test(trimmedCur) || /\[\]\w*$/.test(trimmedCur)) {
          let depth = 1
          let j = i + 1
          let lit = '{'
          while (j < src.length && depth > 0) {
            if (src[j] === '{') depth++
            else if (src[j] === '}') depth--
            lit += src[j]
            j++
          }
          cur += lit
          i = j
          continue
        }
        const header = trimmedCur
        cur = ''
        const inner = parseBlock(src, i + 1)
        i = inner.nextIdx
        stmts.push({ kind: 'block', header, body: inner.stmts })
        continue
      }
      if (ch === '}' && paren === 0) {
        if (cur.trim()) stmts.push({ kind: 'stmt', text: cur.trim() })
        return { stmts, nextIdx: i + 1 }
      }
      if (ch === ';' && paren === 0 && !/^for\b/.test(cur.trim())) {
        if (cur.trim()) stmts.push({ kind: 'stmt', text: cur.trim() })
        cur = ''
        i++
        continue
      }
      if (ch === '\n' && paren === 0 && (langId === 'golang' || langId === 'rust')) {
        if (cur.trim() && !/^(if|else|for|while)\b/.test(cur.trim())) {
          stmts.push({ kind: 'stmt', text: cur.trim() })
          cur = ''
          i++
          continue
        }
      }
      cur += ch
      i++
    }
    if (cur.trim()) stmts.push({ kind: 'stmt', text: cur.trim() })
    return { stmts, nextIdx: i }
  }

  const env = {}
  let steps = 0
  const MAX_STEPS = 5000

  function execSimpleStmt(txt) {
    let t = txt.trim().replace(/;$/, '')
    if (!t || /^return\b/.test(t)) return

    // C / C++ / Go printf
    const printfMatch =
      langId === 'golang'
        ? t.match(/^fmt\.Printf\s*\(([\s\S]*)\)$/)
        : langId === 'c' || langId === 'cpp'
        ? t.match(/^printf\s*\(([\s\S]*)\)$/)
        : null
    if (printfMatch) {
      const args = splitArgs(printfMatch[1])
      if (args.length === 0) return
      let fmt = String(evalExpression(args[0], env) ?? '')
      let argIdx = 1
      fmt = fmt.replace(/%(\.\d+)?[difsc%]/g, (spec, prec) => {
        if (spec === '%%') return '%'
        const val = argIdx < args.length ? evalExpression(args[argIdx++], env) : ''
        if (spec.endsWith('f') && prec) return Number(val).toFixed(parseInt(prec.slice(1), 10))
        if (spec.endsWith('c') && typeof val === 'number') return String.fromCharCode(val)
        return String(val)
      })
      const parts = fmt.split('\n')
      parts.forEach((p, idx) => {
        if (idx < parts.length - 1) flushLine(p, true)
        else outputBuffer += p
      })
      return
    }

    // C++ std::cout << ... << std::endl
    if (langId === 'cpp' && /^(?:std::)?cout\s*<</.test(t)) {
      const chunks = t.replace(/^(?:std::)?cout\s*<<\s*/, '').split('<<')
      let line = ''
      let hasNewline = false
      for (const ch of chunks) {
        const c = ch.trim()
        if (c === 'std::endl' || c === 'endl') {
          hasNewline = true
        } else {
          const val = evalExpression(c, env)
          const str = String(val ?? '')
          if (str.includes('\n')) {
            const parts = str.split('\n')
            line += parts[0]
            flushLine(line, true)
            line = parts.slice(1).join('\n')
          } else {
            line += str
          }
        }
      }
      if (hasNewline) flushLine(line, true)
      else outputBuffer += line
      return
    }

    // Java System.out.println / print
    const javaOut = langId === 'java' ? t.match(/^System\.out\.(println|print)\s*\(([\s\S]*)\)$/) : null
    if (javaOut) {
      const val = javaOut[2].trim() ? evalExpression(javaOut[2], env) : ''
      if (javaOut[1] === 'println') flushLine(String(val), true)
      else outputBuffer += String(val)
      return
    }

    // Go fmt.Println / fmt.Print
    const goOut = langId === 'golang' ? t.match(/^fmt\.(Println|Print)\s*\(([\s\S]*)\)$/) : null
    if (goOut) {
      const args = splitArgs(goOut[2]).map((a) => evalExpression(a, env))
      const text = args.map(formatVal).join(' ')
      if (goOut[1] === 'Println') flushLine(text, true)
      else outputBuffer += text
      return
    }

    // Rust println!(...) / print!(...)
    const rustOut = langId === 'rust' ? t.match(/^(println|print)!\s*\(([\s\S]*)\)$/) : null
    if (rustOut) {
      const args = splitArgs(rustOut[2])
      if (args.length === 0) {
        if (rustOut[1] === 'println') flushLine('', true)
        return
      }
      let fmt = String(evalExpression(args[0], env) ?? '')
      let idx = 1
      fmt = fmt.replace(/\{\}/g, () => (idx < args.length ? formatVal(evalExpression(args[idx++], env)) : ''))
      if (rustOut[1] === 'println') flushLine(fmt, true)
      else outputBuffer += fmt
      return
    }

    // Single-line if without braces: `if (cond) stmt`
    const inlineIf = t.match(/^if\s*\(([^)]+)\)\s+([\s\S]+)$/)
    if (inlineIf) {
      if (evalExpression(inlineIf[1], env)) {
        execSimpleStmt(inlineIf[2])
      }
      return
    }

    // Array declarations: `int arr[] = {5, 2, 8}`, `int[] arr = {5, 2}`, `std::vector<int> arr = {5, 2}`, `arr := []int{5, 2}`, `let mut arr = vec![5, 2]`
    const arrDecl =
      t.match(/^(?:(?:const|var|let\s+mut|let|int|float|double|long|String|string|std::vector<[^>]+>)\s+)?(?:\[\]\s*)?([a-zA-Z_]\w*)(?:\s*\[[^\]]*\])?\s*:?=\s*(?:\[\]\w*\s*\{([\s\S]*)\}|\{([\s\S]*)\}|vec!\s*\[([\s\S]*)\]|\[([\s\S]*)\])$/)
    if (arrDecl) {
      const name = arrDecl[1]
      const rawItems = arrDecl[2] ?? arrDecl[3] ?? arrDecl[4] ?? arrDecl[5] ?? ''
      env[name] = rawItems.trim() ? splitArgs(rawItems).map((x) => evalExpression(x, env)) : []
      return
    }

    // Indexed array assignment: `arr[j] = arr[j + 1]`
    const idxAssign = t.match(/^([a-zA-Z_]\w*)\[([^\]]+)\]\s*=\s*([\s\S]+)$/)
    if (idxAssign) {
      const arr = env[idxAssign[1]]
      const idx = evalExpression(idxAssign[2], env)
      if (Array.isArray(arr)) {
        arr[idx] = evalExpression(idxAssign[3], env)
        return
      }
    }

    // Increment / decrement: i++, i--, ++i
    const incMatch = t.match(/^([a-zA-Z_]\w*)(\+\+|--)$/) || t.match(/^(\+\+|--)([a-zA-Z_]\w*)$/)
    if (incMatch) {
      const name = incMatch[1] === '++' || incMatch[1] === '--' ? incMatch[2] : incMatch[1]
      const op = incMatch[1] === '++' || incMatch[2] === '++' ? 1 : -1
      env[name] = (Number(env[name]) || 0) + op
      return
    }

    // Compound assignment +=, -=, *=, /=
    const compMatch = t.match(/^(?:(?:int|float|double|long|String|string|let\s+mut|let|var|const)\s+)?([a-zA-Z_]\w*)\s*(\+=|-=|\*=|\/=|%=)\s*([\s\S]+)$/)
    if (compMatch) {
      const [, name, op, rhs] = compMatch
      const cur = env[name] ?? 0
      const val = evalExpression(rhs, env)
      if (op === '+=') env[name] = cur + val
      else if (op === '-=') env[name] = cur - val
      else if (op === '*=') env[name] = cur * val
      else if (op === '/=') env[name] = cur / val
      else if (op === '%=') env[name] = cur % val
      return
    }

    // Multi or single declaration / assignment (int a = 1, b = 2; or let mut x = 10; or sum := 0)
    const declPrefixRe = /^(?:const|var|let\s+mut|let|int|float|double|long|char\s*\*?|String|string|auto)\s+/
    const hasDeclPrefix = declPrefixRe.test(t)
    const cleanDecl = t.replace(declPrefixRe, '')
    const declParts = splitArgs(cleanDecl)
    let matchedAll = declParts.length > 0
    for (const part of declParts) {
      const walrus = part.match(/^([a-zA-Z_]\w*)\s*:=\s*([\s\S]+)$/)
      if (walrus) {
        if (langId !== 'golang') {
          throw new Error(`SyntaxError [${label}]: Operator ":=" hanya digunakan di Go, bukan ${label}.`)
        }
        env[walrus[1]] = evalExpression(walrus[2], env)
        continue
      }
      const eq = part.match(/^([a-zA-Z_]\w*)\s*=\s*([\s\S]+)$/)
      if (eq) {
        env[eq[1]] = evalExpression(eq[2], env)
        continue
      }
      if (/^[a-zA-Z_]\w*$/.test(part.trim()) && hasDeclPrefix) {
        if (!(part.trim() in env)) env[part.trim()] = 0
        continue
      }
      matchedAll = false
    }
    if (matchedAll) return

    throw new Error(`SyntaxError [${label}]: Pernyataan tidak valid di ${label}: "${t.slice(0, 60)}"`)
  }

  function execTree(nodes) {
    for (let idx = 0; idx < nodes.length; idx++) {
      if (++steps > MAX_STEPS) throw new Error('TimeoutError: Eksekusi melebihi batas langkah aman')
      const n = nodes[idx]
      if (n.kind === 'stmt') {
        if (n.text === 'break') return 'break'
        execSimpleStmt(n.text)
        continue
      }

      const h = n.header.trim()
      // C-style for (init; cond; incr)
      const forParen = h.match(/^for\s*\(([^;]*);([^;]*);([^)]*)\)$/)
      if (forParen) {
        if (forParen[1].trim()) execSimpleStmt(forParen[1])
        while (!forParen[2].trim() || Boolean(evalExpression(forParen[2], env))) {
          if (++steps > MAX_STEPS) throw new Error('TimeoutError: Loop melebihi batas aman')
          const sig = execTree(n.body)
          if (sig === 'break') break
          if (forParen[3].trim()) execSimpleStmt(forParen[3])
        }
        continue
      }

      // Go for i := 0; i < 5; i++
      const goFor = h.match(/^for\s+([^;]+);([^;]+);(.+)$/)
      if (goFor) {
        execSimpleStmt(goFor[1])
        while (Boolean(evalExpression(goFor[2], env))) {
          if (++steps > MAX_STEPS) throw new Error('TimeoutError: Loop melebihi batas aman')
          const sig = execTree(n.body)
          if (sig === 'break') break
          execSimpleStmt(goFor[3])
        }
        continue
      }

      // Rust for i in 1..6
      const rustFor = h.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(\d+)\.\.(=?)(\d+)$/)
      if (rustFor) {
        const start = parseInt(rustFor[2], 10)
        const end = parseInt(rustFor[4], 10) + (rustFor[3] === '=' ? 1 : 0)
        for (let k = start; k < end; k++) {
          env[rustFor[1]] = k
          const sig = execTree(n.body)
          if (sig === 'break') break
        }
        continue
      }

      // while (cond)
      const whileMatch = h.match(/^while\s*\(([\s\S]+)\)$/) || h.match(/^while\s+([\s\S]+)$/)
      if (whileMatch) {
        while (Boolean(evalExpression(whileMatch[1], env))) {
          if (++steps > MAX_STEPS) throw new Error('TimeoutError: While loop terlalu panjang')
          const sig = execTree(n.body)
          if (sig === 'break') break
        }
        continue
      }

      // if / else
      const ifMatch = h.match(/^if\s*\(([\s\S]+)\)$/) || h.match(/^if\s+([\s\S]+)$/)
      if (ifMatch) {
        let taken = Boolean(evalExpression(ifMatch[1], env))
        if (taken) {
          const sig = execTree(n.body)
          if (sig === 'break') return 'break'
        }
        while (idx + 1 < nodes.length && nodes[idx + 1].kind === 'block' && /^else\b/.test(nodes[idx + 1].header)) {
          idx++
          const elseNode = nodes[idx]
          const elseIfMatch = elseNode.header.match(/^else\s+if\s*\(([\s\S]+)\)$/) || elseNode.header.match(/^else\s+if\s+([\s\S]+)$/)
          if (taken) continue
          if (elseIfMatch) {
            if (Boolean(evalExpression(elseIfMatch[1], env))) {
              taken = true
              const sig = execTree(elseNode.body)
              if (sig === 'break') return 'break'
            }
          } else {
            taken = true
            const sig = execTree(elseNode.body)
            if (sig === 'break') return 'break'
          }
        }
        continue
      }
    }
    return null
  }

  try {
    const parsed = parseBlock(body, 0)
    execTree(parsed.stmts)
    if (outputBuffer.length > 0) stdout.push(outputBuffer)
    return { stdout, stderr: null }
  } catch (err) {
    if (outputBuffer.length > 0) stdout.push(outputBuffer)
    return { stdout, stderr: err.message }
  }
}

export function executeCode(langId, code) {
  const start = performance.now()
  let result
  try {
    if (langId === 'javascript') result = runJavaScript(code)
    else if (langId === 'brainfuck') result = runBrainfuck(code)
    else if (langId === 'python') result = runPython(code)
    else result = runCStyle(code, langId)
  } catch (err) {
    result = { stdout: [], stderr: err?.message || 'Terjadi kesalahan saat mengeksekusi kode.' }
  }

  const durationMs = Math.max(1, Math.round(performance.now() - start))
  return {
    stdout: result.stdout || [],
    stderr: result.stderr || null,
    durationMs,
  }
}

// IDE-style Tab-expandable code snippets & autocomplete per language for CodePlayground
// "$CURSOR" marks where the caret lands after Tab expansion.

export const LANGUAGE_SNIPPETS = {
  python: [
    { trigger: 'if', label: 'if kondisi:', desc: 'Percabangan if', body: 'if $CURSOR:\n    print("Benar")' },
    { trigger: 'ifelse', label: 'if / else', desc: 'Percabangan if-else', body: 'if $CURSOR:\n    print("Benar")\nelse:\n    print("Salah")' },
    { trigger: 'elif', label: 'elif kondisi:', desc: 'Cabang elif', body: 'elif $CURSOR:\n    print("Alternatif")' },
    { trigger: 'for', label: 'for i in range(...)', desc: 'Perulangan for', body: 'for i in range($CURSOR):\n    print(i)' },
    { trigger: 'while', label: 'while kondisi:', desc: 'Perulangan while', body: 'while $CURSOR:\n    break' },
    { trigger: 'def', label: 'def fungsi():', desc: 'Definisi fungsi', body: 'def nama_fungsi($CURSOR):\n    return None' },
    { trigger: 'print', label: 'print(...)', desc: 'Cetak ke konsol', body: 'print($CURSOR)' },
    {
      trigger: 'bubble',
      label: 'Bubble Sort (Algoritma)',
      desc: 'Template Bubble Sort',
      body: 'arr = [54, 26, 93, 17, 44]\nn = len(arr)\nfor i in range(n):\n    for j in range(0, n - i - 1):\n        if arr[j] > arr[j + 1]:\n            arr[j], arr[j + 1] = arr[j + 1], arr[j]\nprint("Terurut:", arr)$CURSOR',
    },
  ],
  javascript: [
    { trigger: 'if', label: 'if (...) { }', desc: 'Percabangan if', body: 'if ($CURSOR) {\n  console.log("Benar");\n}' },
    { trigger: 'ifelse', label: 'if / else', desc: 'Percabangan if-else', body: 'if ($CURSOR) {\n  console.log("Benar");\n} else {\n  console.log("Salah");\n}' },
    { trigger: 'for', label: 'for (let i = 0; ...)', desc: 'Perulangan for', body: 'for (let i = 0; i < $CURSOR; i++) {\n  console.log(i);\n}' },
    { trigger: 'while', label: 'while (...) { }', desc: 'Perulangan while', body: 'while ($CURSOR) {\n  break;\n}' },
    { trigger: 'function', label: 'function nama()', desc: 'Deklarasi fungsi', body: 'function namaFungsi($CURSOR) {\n  return;\n}' },
    { trigger: 'log', label: 'console.log(...)', desc: 'Cetak ke konsol', body: 'console.log($CURSOR);' },
    {
      trigger: 'binary',
      label: 'Binary Search (Algoritma)',
      desc: 'Template Binary Search',
      body: 'const arr = [10, 22, 35, 44, 58, 72];\nlet low = 0, high = arr.length - 1, target = 44;\nwhile (low <= high) {\n  const mid = Math.floor((low + high) / 2);\n  if (arr[mid] === target) { console.log("Ketemu di:", mid); break; }\n  if (arr[mid] < target) low = mid + 1;\n  else high = mid - 1;\n}$CURSOR',
    },
  ],
  c: [
    { trigger: 'if', label: 'if (...) { }', desc: 'Percabangan if', body: 'if ($CURSOR) {\n    printf("Benar\\n");\n}' },
    { trigger: 'ifelse', label: 'if / else', desc: 'Percabangan if-else', body: 'if ($CURSOR) {\n    printf("Benar\\n");\n} else {\n    printf("Salah\\n");\n}' },
    { trigger: 'for', label: 'for (int i = 0; ...)', desc: 'Perulangan for', body: 'for (int i = 0; i < $CURSOR; i++) {\n    printf("%d\\n", i);\n}' },
    { trigger: 'while', label: 'while (...) { }', desc: 'Perulangan while', body: 'while ($CURSOR) {\n    break;\n}' },
    { trigger: 'printf', label: 'printf("...\\n");', desc: 'Cetak ke konsol', body: 'printf("$CURSOR\\n");' },
    { trigger: 'main', label: 'int main() { }', desc: 'Kerangka program C', body: '#include <stdio.h>\n\nint main() {\n    $CURSOR\n    return 0;\n}' },
  ],
  cpp: [
    { trigger: 'if', label: 'if (...) { }', desc: 'Percabangan if', body: 'if ($CURSOR) {\n    std::cout << "Benar" << std::endl;\n}' },
    { trigger: 'ifelse', label: 'if / else', desc: 'Percabangan if-else', body: 'if ($CURSOR) {\n    std::cout << "Benar" << std::endl;\n} else {\n    std::cout << "Salah" << std::endl;\n}' },
    { trigger: 'for', label: 'for (int i = 0; ...)', desc: 'Perulangan for', body: 'for (int i = 0; i < $CURSOR; i++) {\n    std::cout << i << std::endl;\n}' },
    { trigger: 'while', label: 'while (...) { }', desc: 'Perulangan while', body: 'while ($CURSOR) {\n    break;\n}' },
    { trigger: 'cout', label: 'std::cout << ...', desc: 'Output stream C++', body: 'std::cout << $CURSOR << std::endl;' },
  ],
  java: [
    { trigger: 'if', label: 'if (...) { }', desc: 'Percabangan if', body: 'if ($CURSOR) {\n    System.out.println("Benar");\n}' },
    { trigger: 'ifelse', label: 'if / else', desc: 'Percabangan if-else', body: 'if ($CURSOR) {\n    System.out.println("Benar");\n} else {\n    System.out.println("Salah");\n}' },
    { trigger: 'for', label: 'for (int i = 0; ...)', desc: 'Perulangan for', body: 'for (int i = 0; i < $CURSOR; i++) {\n    System.out.println(i);\n}' },
    { trigger: 'while', label: 'while (...) { }', desc: 'Perulangan while', body: 'while ($CURSOR) {\n    break;\n}' },
    { trigger: 'sout', label: 'System.out.println(...)', desc: 'Cetak ke konsol', body: 'System.out.println($CURSOR);' },
  ],
  golang: [
    { trigger: 'if', label: 'if kondisi { }', desc: 'Percabangan if', body: 'if $CURSOR {\n    fmt.Println("Benar")\n}' },
    { trigger: 'ifelse', label: 'if / else', desc: 'Percabangan if-else', body: 'if $CURSOR {\n    fmt.Println("Benar")\n} else {\n    fmt.Println("Salah")\n}' },
    { trigger: 'for', label: 'for i := 0; ...', desc: 'Perulangan for', body: 'for i := 0; i < $CURSOR; i++ {\n    fmt.Println(i)\n}' },
    { trigger: 'fmt', label: 'fmt.Println(...)', desc: 'Cetak ke konsol', body: 'fmt.Println($CURSOR)' },
  ],
  rust: [
    { trigger: 'if', label: 'if kondisi { }', desc: 'Percabangan if', body: 'if $CURSOR {\n    println!("Benar");\n}' },
    { trigger: 'ifelse', label: 'if / else', desc: 'Percabangan if-else', body: 'if $CURSOR {\n    println!("Benar");\n} else {\n    println!("Salah");\n}' },
    { trigger: 'for', label: 'for i in 1..6 { }', desc: 'Perulangan for', body: 'for i in 1..$CURSOR {\n    println!("{}", i);\n}' },
    { trigger: 'println', label: 'println!("...", ...);', desc: 'Macro output Rust', body: 'println!("$CURSOR");' },
  ],
}

export function getWordBeforeCaret(text, caretPos) {
  const before = text.slice(0, caretPos)
  const match = before.match(/([a-zA-Z_][a-zA-Z0-9_]*)$/)
  if (!match) return { word: '', start: caretPos }
  return { word: match[1], start: caretPos - match[1].length }
}

export function getMatchingSnippets(langId, prefix) {
  const p = String(prefix || '').toLowerCase()
  if (!p) return []
  const list = LANGUAGE_SNIPPETS[langId] || []
  return list
    .filter((s) => s.trigger.startsWith(p))
    .sort((a, b) => (a.trigger === p ? -1 : b.trigger === p ? 1 : a.trigger.length - b.trigger.length))
    .slice(0, 5)
}

import { useState, useEffect, useRef } from 'react'
import {
  LuTerminal,
  LuPlay,
  LuRotateCcw,
  LuCopy,
  LuCheck,
  LuTrash2,
  LuCode,
  LuSparkles,
} from 'react-icons/lu'
import {
  PLAYGROUND_LANGUAGES,
  getTemplateForLang,
  executeCode,
} from '../utils/codeRunner'
import { getWordBeforeCaret, getMatchingSnippets } from '../utils/editorSnippets'
import { playSoundCue } from './AccessibilityToolbar'
import './CodePlayground.css'

const AUTO_PAIRS = {
  '(': ')',
  '[': ']',
  '{': '}',
  '"': '"',
  "'": "'",
}

export default function CodePlayground({ selectedLangId = 'python', onCodeRun }) {
  const initialSetup = getTemplateForLang(selectedLangId, 'hello')
  const [editorLang, setEditorLang] = useState(initialSetup.effectiveLang)
  const [activePreset, setActivePreset] = useState('hello')
  const [code, setCode] = useState(initialSetup.code)
  const [stdout, setStdout] = useState([])
  const [stderr, setStderr] = useState(null)
  const [durationMs, setDurationMs] = useState(null)
  const [hasRun, setHasRun] = useState(false)
  const [copied, setCopied] = useState(false)
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 })
  const [suggestions, setSuggestions] = useState([])
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(0)

  const textareaRef = useRef(null)
  const gutterRef = useRef(null)

  const indentUnit = editorLang === 'javascript' ? '  ' : '    '

  useEffect(() => {
    const next = getTemplateForLang(selectedLangId, 'hello')
    setEditorLang(next.effectiveLang)
    setActivePreset('hello')
    setCode(next.code)
    setStdout([])
    setStderr(null)
    setHasRun(false)
    setSuggestions([])
  }, [selectedLangId])

  const handleSelectLanguage = (newLang) => {
    playSoundCue('click')
    const next = getTemplateForLang(newLang, activePreset)
    setEditorLang(next.effectiveLang)
    setCode(next.code)
    setStdout([])
    setStderr(null)
    setHasRun(false)
    setSuggestions([])
  }

  const handleSelectPreset = (presetId) => {
    playSoundCue('click')
    setActivePreset(presetId)
    const next = getTemplateForLang(editorLang, presetId)
    setCode(next.code)
    setStdout([])
    setStderr(null)
    setHasRun(false)
    setSuggestions([])
  }

  const handleRun = () => {
    setSuggestions([])
    const res = executeCode(editorLang, code)
    setStdout(res.stdout)
    setStderr(res.stderr)
    setDurationMs(res.durationMs)
    setHasRun(true)
    playSoundCue(res.stderr ? 'wrong' : 'success')
    onCodeRun?.()
  }

  const handleReset = () => {
    playSoundCue('click')
    const next = getTemplateForLang(editorLang, activePreset)
    setCode(next.code)
    setStdout([])
    setStderr(null)
    setHasRun(false)
    setSuggestions([])
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      playSoundCue('success')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Ignore clipboard refusal
    }
  }

  const syncGutterScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const setCaret = (pos) => {
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = pos
        updateCursorPosition(textareaRef.current, false)
      }
    })
  }

  const updateCursorPosition = (el, refreshSuggest = true) => {
    if (!el) return
    const pos = el.selectionStart || 0
    const before = el.value.slice(0, pos)
    const lines = before.split('\n')
    setCursorPos({ line: lines.length, col: lines[lines.length - 1].length + 1 })

    if (refreshSuggest) {
      const { word } = getWordBeforeCaret(el.value, pos)
      const matches = getMatchingSnippets(editorLang, word)
      setSuggestions(matches)
      setActiveSuggestionIdx(0)
    }
  }

  const applySnippet = (snippet) => {
    const el = textareaRef.current
    if (!el || !snippet) return
    const caret = el.selectionStart || 0
    const { start } = getWordBeforeCaret(code, caret)

    // Match current line's leading indentation for multi-line snippets
    const lineStart = code.lastIndexOf('\n', start - 1) + 1
    const baseIndent = (code.slice(lineStart, start).match(/^\s*/) || [''])[0]
    const indentedBody = snippet.body
      .split('\n')
      .map((line, i) => (i === 0 ? line : baseIndent + line))
      .join('\n')

    const cursorMarkerIdx = indentedBody.indexOf('$CURSOR')
    const cleanBody = indentedBody.replace('$CURSOR', '')
    const nextCode = code.slice(0, start) + cleanBody + code.slice(caret)
    const nextCaret =
      cursorMarkerIdx >= 0 ? start + cursorMarkerIdx : start + cleanBody.length

    setCode(nextCode)
    setSuggestions([])
    playSoundCue('chip')
    setCaret(nextCaret)
  }

  const handleKeyDown = (e) => {
    const el = e.currentTarget
    const start = el.selectionStart
    const end = el.selectionEnd

    // Ctrl/Cmd + Enter -> Run code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleRun()
      return
    }

    // Autocomplete popup keyboard navigation
    if (suggestions.length > 0) {
      if (e.key === 'Tab') {
        e.preventDefault()
        applySnippet(suggestions[activeSuggestionIdx] || suggestions[0])
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveSuggestionIdx((prev) => (prev + 1) % suggestions.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveSuggestionIdx((prev) => (prev - 1 + suggestions.length) % suggestions.length)
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setSuggestions([])
        return
      }
    }

    // Shift+Tab -> Unindent current line
    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault()
      const lineStart = code.lastIndexOf('\n', start - 1) + 1
      const lineText = code.slice(lineStart)
      const removeCount = lineText.startsWith(indentUnit)
        ? indentUnit.length
        : lineText.startsWith('  ')
        ? 2
        : lineText.startsWith(' ') || lineText.startsWith('\t')
        ? 1
        : 0
      if (removeCount > 0) {
        const nextVal = code.slice(0, lineStart) + code.slice(lineStart + removeCount)
        setCode(nextVal)
        setCaret(Math.max(lineStart, start - removeCount))
      }
      return
    }

    // Tab -> Insert language-appropriate indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const nextVal = code.slice(0, start) + indentUnit + code.slice(end)
      setCode(nextVal)
      setCaret(start + indentUnit.length)
      return
    }

    // Smart Auto-Indent on Enter (handles `if ...:` in Python, `{` in C/JS/Java/Go/Rust, and `{|}` expansion)
    if (e.key === 'Enter') {
      e.preventDefault()
      setSuggestions([])
      const lineStart = code.lastIndexOf('\n', start - 1) + 1
      const currentLineBefore = code.slice(lineStart, start)
      const baseIndent = (currentLineBefore.match(/^\s*/) || [''])[0]
      const trimmedBefore = currentLineBefore.trimEnd()
      const charAfter = code[end] || ''

      // Expand `{|}` into cleanly indented 3-line block
      if (trimmedBefore.endsWith('{') && charAfter === '}') {
        const insert = `\n${baseIndent}${indentUnit}\n${baseIndent}`
        const nextVal = code.slice(0, start) + insert + code.slice(end)
        setCode(nextVal)
        setCaret(start + 1 + baseIndent.length + indentUnit.length)
        return
      }

      // Auto-indent after `:` (Python if/for/while/def/else/elif) or `{` (C/C++/JS/Java/Go/Rust)
      const needsExtraIndent =
        (editorLang === 'python' && trimmedBefore.endsWith(':')) ||
        (editorLang !== 'python' && trimmedBefore.endsWith('{'))

      const nextIndent = needsExtraIndent ? baseIndent + indentUnit : baseIndent
      const nextVal = code.slice(0, start) + '\n' + nextIndent + code.slice(end)
      setCode(nextVal)
      setCaret(start + 1 + nextIndent.length)
      return
    }

    // Auto-close brackets & quotes
    if (AUTO_PAIRS[e.key] && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const closeChar = AUTO_PAIRS[e.key]
      const nextChar = code[end] || ''

      // If typing closing quote and cursor is already right before it, just step over
      if ((e.key === '"' || e.key === "'") && start === end && nextChar === e.key) {
        e.preventDefault()
        setCaret(start + 1)
        return
      }

      e.preventDefault()
      const selected = code.slice(start, end)
      const nextVal = code.slice(0, start) + e.key + selected + closeChar + code.slice(end)
      setCode(nextVal)
      setCaret(start + 1 + selected.length)
      return
    }

    // Step over closing `)` / `]` / `}` if already present
    if ((e.key === ')' || e.key === ']' || e.key === '}') && start === end && code[start] === e.key) {
      e.preventDefault()
      setCaret(start + 1)
      return
    }

    // Backspace deletes empty auto-closed pair
    if (e.key === 'Backspace' && start === end && start > 0) {
      const prevChar = code[start - 1]
      const nextChar = code[start]
      if (AUTO_PAIRS[prevChar] && AUTO_PAIRS[prevChar] === nextChar) {
        e.preventDefault()
        const nextVal = code.slice(0, start - 1) + code.slice(start + 1)
        setCode(nextVal)
        setCaret(start - 1)
      }
    }
  }

  const lineCount = code.split('\n').length
  const langMeta = PLAYGROUND_LANGUAGES.find((l) => l.id === editorLang) || PLAYGROUND_LANGUAGES[0]

  return (
    <div className="duo-subview-wrap playground-view">
      <div className="subview-header">
        <h2>
          <LuTerminal size={22} className="icon-inline" /> Code Playground
        </h2>
        <p>
          Tulis algoritma dengan auto-indent &amp; Tab snippet (ketik <code>if</code>, <code>for</code>, <code>ifelse</code> lalu tekan <strong>Tab</strong>).
        </p>
      </div>

      <div className="playground-container">
        {/* Top Toolbar */}
        <div className="playground-toolbar">
          <div className="playground-toolbar-left">
            <div className="pg-lang-select-wrap">
              <LuCode size={15} className="pg-lang-icon" />
              <select
                className="pg-lang-select"
                value={editorLang}
                onChange={(e) => handleSelectLanguage(e.target.value)}
                aria-label="Pilih bahasa editor"
              >
                {PLAYGROUND_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.ext})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="playground-toolbar-actions">
            <button
              type="button"
              className="btn-pg-ghost"
              onClick={handleCopy}
              title="Salin kode"
            >
              {copied ? <LuCheck size={14} /> : <LuCopy size={14} />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
            <button
              type="button"
              className="btn-pg-ghost"
              onClick={handleReset}
              title="Kembalikan template"
            >
              <LuRotateCcw size={14} />
              <span>Reset</span>
            </button>
            <button
              type="button"
              className="btn-run-code"
              onClick={handleRun}
            >
              <LuPlay size={15} /> Jalankan
            </button>
          </div>
        </div>

        {/* Preset Snippet Chips */}
        <div className="pg-presets-bar">
          <span className="pg-presets-label">Contoh Cepat:</span>
          {[
            { id: 'hello', label: 'Hello World' },
            { id: 'loop', label: 'Looping' },
            { id: 'algo', label: 'Algoritma' },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`pg-preset-chip ${activePreset === preset.id ? 'active' : ''}`}
              onClick={() => handleSelectPreset(preset.id)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* IDE Autocomplete / Tab Snippet Bar */}
        {suggestions.length > 0 && (
          <div className="pg-autocomplete-bar" role="listbox" aria-label="Saran kode Tab">
            <span className="pg-ac-hint">
              <LuSparkles size={12} /> Tekan <kbd>Tab</kbd>:
            </span>
            <div className="pg-ac-items">
              {suggestions.map((sug, idx) => (
                <button
                  key={sug.trigger}
                  type="button"
                  role="option"
                  aria-selected={idx === activeSuggestionIdx}
                  className={`pg-ac-pill ${idx === activeSuggestionIdx ? 'active' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    applySnippet(sug)
                  }}
                >
                  <code>{sug.label}</code>
                  <span>{sug.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Editor Workspace */}
        <div className="playground-editor-wrap">
          <div ref={gutterRef} className="editor-line-numbers" aria-hidden="true">
            {Array.from({ length: lineCount }, (_, idx) => (
              <span
                key={idx}
                className={cursorPos.line === idx + 1 ? 'active-gutter-line' : ''}
              >
                {idx + 1}
              </span>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            className="playground-editor"
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              updateCursorPosition(e.target, true)
            }}
            onScroll={syncGutterScroll}
            onClick={(e) => updateCursorPosition(e.target, false)}
            onKeyUp={(e) => {
              if (!['ArrowUp', 'ArrowDown', 'Escape', 'Tab'].includes(e.key)) {
                updateCursorPosition(e.target, e.key.length === 1 || e.key === 'Backspace')
              }
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setSuggestions([]), 150)}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
            placeholder="// Tulis kode kamu di sini... (ketik 'if' lalu tekan Tab)"
          />
        </div>

        {/* Status Bar */}
        <div className="pg-status-bar">
          <span>
            {langMeta.ext} • Auto-Indent &amp; Tab Snippet Aktif
          </span>
          <span>
            Ln {cursorPos.line}, Col {cursorPos.col} • {lineCount} baris
          </span>
        </div>

        {/* Live Output Console */}
        <div className="playground-console">
          <div className="console-header">
            <div className="console-dots-group">
              <span className="console-dot red" />
              <span className="console-dot yellow" />
              <span className="console-dot green" />
              <span className="console-title">Output Console</span>
            </div>
            <div className="console-meta-actions">
              {hasRun && (
                <span className={`console-status-pill ${stderr ? 'is-err' : 'is-ok'}`}>
                  {stderr ? '✗ Error' : `✓ ${durationMs} ms`}
                </span>
              )}
              {hasRun && (
                <button
                  type="button"
                  className="btn-clear-console"
                  onClick={() => {
                    setStdout([])
                    setStderr(null)
                    setHasRun(false)
                  }}
                >
                  <LuTrash2 size={12} /> Bersihkan
                </button>
              )}
            </div>
          </div>

          <pre className={`console-output ${stderr ? 'has-error' : ''}`}>
            {!hasRun
              ? '// Tekan "Jalankan" (atau Ctrl+Enter) untuk melihat output eksekusi nyata.'
              : [
                  ...stdout,
                  stderr ? `\n[Error] ${stderr}` : '',
                  !stderr && stdout.length === 0 ? '// Program selesai dieksekusi tanpa output.' : '',
                ]
                  .filter(Boolean)
                  .join('\n')}
          </pre>
        </div>
      </div>
    </div>
  )
}

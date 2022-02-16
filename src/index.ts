import { detectSyntax } from 'mlly'
import escapeRE from 'escape-string-regexp'
import type { Import, UnimportOptions } from './types'
import { excludeRE, stripCommentsAndStrings, toImports, separatorRE, importAsRE } from './utils'
import { resolvePreset } from './preset'
export * from './types'

interface Context {
  imports: Import[]
  matchRE: RegExp
  map: Map<string, Import>
}

export interface Unimport {
  addImports: (code: string) => { code: string }
}

export function createUnimport (opts: Partial<UnimportOptions>): Unimport {
  const ctx: Context = {
    imports: [].concat(opts.imports).filter(Boolean),
    map: new Map(),
    matchRE: /__never__/g
  }

  // Resolve presets
  for (const preset of opts.presets || []) {
    ctx.imports.push(...resolvePreset(preset))
  }

  // Normalize imports
  for (const _import of ctx.imports) {
    _import.as = _import.as || _import.name
  }

  // Detect duplicates
  const usedNames = new Set()
  for (const autoImport of ctx.imports) {
    if (!usedNames.has(autoImport.as)) {
      usedNames.add(autoImport.as)
    }
  }

  // Create regex
  ctx.matchRE = new RegExp(`\\b(${ctx.imports.map(i => escapeRE(i.as)).join('|')})\\b`, 'g')

  // Create map
  for (const _import of ctx.imports) {
    ctx.map.set(_import.as, _import)
  }

  return {
    addImports: (code: string) => addImports(code, ctx)
  }
}

function addImports (code: string, ctx: Context) {
  // Strip comments so we don't match on them
  const stripped = stripCommentsAndStrings(code)

  // Find all possible injection
  const matched = new Set(
    Array.from(stripped.matchAll(ctx.matchRE)).map(i => i[1])
  )

  // Remove those already defined
  for (const regex of excludeRE) {
    Array.from(stripped.matchAll(regex))
      .flatMap(i => [
        ...(i[1]?.split(separatorRE) || []),
        ...(i[2]?.split(separatorRE) || [])
      ])
      .map(i => i.replace(importAsRE, '').trim())
      .forEach(i => matched.delete(i))
  }

  if (!matched.size) {
    return { code }
  }

  const matchedImports = Array.from(matched)
    .map(name => ctx.map.get(name))
    .filter(Boolean)

  const isCJSContext = detectSyntax(stripped).hasCJS
  const imports = toImports(matchedImports, isCJSContext)

  return { code: imports + code }
}
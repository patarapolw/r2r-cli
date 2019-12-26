import showdown from 'showdown'
import 'jquery'

const anchorAttributes = {
  type: 'output',
  regex: /()\((.+=".+" ?)+\)/g,
  replace: (match: string, $1: string, $2: string) => {
    return $1.replace('">', `" ${$2}>`)
  },
}

const furiganaParser = {
  type: 'output',
  regex: /{([^}]+)}\(([^)]+)\)/g,
  replace: '<ruby>$1<rp>(</rp><rt>$2</rt><rp>)</rp></ruby>',
}

const mdConverter = new showdown.Converter({
  tables: true,
  extensions: [anchorAttributes, furiganaParser],
})

export function md2html (s: string, d: any): string {
  s = ankiMustache(s, d)
  return mdConverter.makeHtml(s.replace(/@([^\n]+)\n/g, ''))
}

export function fixHtml (s: string): string {
  for (const fix of [furiganaParser]) {
    s = s.replace(fix.regex, fix.replace)
  };
  return s
}

export function fixData (d: any): any {
  if (d.front && ['@md5\n', '@template\n', '@rendered\n'].some((c) => d.front.startsWith(c))) {
    d.front = '@rendered\n' + ankiMustache(d.tFront, d)
  }

  if (d.back && ['@md5\n', '@template\n', '@rendered\n'].some((c) => d.back.startsWith(c))) {
    d.back = '@rendered\n' + ankiMustache(d.tBack, d)
  }

  return d
}

export function quizDataToContent (
  data: any,
  side: 'front' | 'back' | 'note' | 'backAndNote' | null,
  template?: string,
): string {
  function cleanHtml (s: string) {
    const cleaned = s.replace(/@([^\n]+)\n/g, '')

    if (s.indexOf('@html\n') !== -1) {
      return fixHtml(cleaned)
    } else {
      return md2html(cleaned, data)
    }
  }

  function cleanCssJs (s: string, type: 'css' | 'js') {
    const cleaned = s.replace(/@([^\n]+)\n/g, '')

    return s.indexOf('@raw\n') !== -1 ? cleaned
      : (type === 'css' ? `<style>${cleaned}</style>` : `<script>${cleaned}</script>`)
  }

  data = fixData(data)

  return `
  ${data.css ? cleanCssJs(data.css, 'css') : '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">'}
  ${side === 'backAndNote'
    ? cleanHtml(data.back || '') + '\n<br/>\n' + cleanHtml(data.note || '') : cleanHtml(
      (side ? data[side] : template) || '',
    )}
  ${!data.js ? '<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>' : cleanCssJs(data.js, 'js')}
  `
}

export function ankiMustache (s: string, d: {
  front?: string
  data?: Record<string, any>
}): string {
  s = s.replace(/\{\{FrontSide}}/g, (d.front || '').replace(/@[^\n]+\n/g, ''))

  const data = d.data || {}
  if (!(data && data.constructor === Object)) {
    throw new Error('Data is not an object')
  }

  for (const [k, v] of Object.entries(data)) {
    if (typeof v === 'string') {
      s = s.replace(new RegExp(`\\{\\{(\\S+:)?${escapeRegExp(k)}}}`), v)
    }
  }

  const keys = Object.keys(data)

  s = s.replace(/\{\{#(\S+)}}(.*)\{\{\1}}/gs, (m, p1, p2) => {
    if (keys.includes(p1)) {
      return p2
    } else {
      return ''
    }
  })

  s = s.replace(/\{\{[^}]+}}/g, '')

  return s
}

export function escapeRegExp (s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function normalizeArray<T> (arr: T | T[]): T | undefined {
  if (Array.isArray(arr)) {
    return arr[0]
  }

  return arr
}

export function shuffle<T> (a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function slowClick ($selector: JQuery) {
  const duration = 200
  $selector.prop('disabled', true)

  $selector.addClass('animated')
  $selector.css({
    'animation-duration': `${duration}ms`,
  })
  setTimeout(() => {
    $selector.prop('disabled', false)
    $selector.click()
    $selector.removeClass('animated')
  }, duration)

  return $selector
}

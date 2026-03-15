export function normalizeSpaces(text: string): string {
  let out = '';
  let sp = true;
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) <= 32) {
      if (!sp) out += ' ';
      sp = true;
    } else {
      out += text[i];
      sp = false;
    }
  }
  return out.trim();
}

export function formatSize(b: number): string {
  if (!b || b < 1024) return (b || 0) + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

export function escapeHtml(str: unknown): string {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isVisible(el: HTMLElement): boolean {
  const s = window.getComputedStyle(el);
  if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

export function getProjectId(): string {
  try {
    const id = window.editor.call('project:settings') as { get(key: string): unknown } | null;
    if (id) {
      const val = id.get('id');
      if (val) return String(val);
    }
  } catch (_e) { /* fallback */ }

  const m = window.location.pathname.match(/\/(\d{4,})/);
  return m ? m[1] : 'unknown';
}

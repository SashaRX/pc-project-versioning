/**
 * window.config.project.id — доступен напрямую,
 * см. playcanvas/editor src/editor/config.ts
 */
export function getProjectId(): string {
  try {
    const id = window.config?.project?.id;
    if (id) return String(id);
  } catch (_e) { /* fallback */ }
  const m = window.location.pathname.match(/\/(\d{4,})/);
  return m ? m[1] : 'unknown';
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

/** 0.0.1 → 0.0.2, 1.2.3 → 1.2.4, garbage → 0.0.1 */
export function bumpPatch(version: string): string {
  const m = (version || '').match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return '0.0.1';
  return m[1] + '.' + m[2] + '.' + (Number(m[3]) + 1);
}

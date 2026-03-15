import { OVERLAY_ID } from './inject';
import { scanAssets, computeDiff } from '../core/assets';
import { readMeta, writeMeta } from '../core/storage';
import { escapeHtml, formatSize } from '../core/helpers';
import type { ProjectMeta, DiffResult, AssetEntry, ChangelogEntry } from '../types';

function closePanel(): void {
  const el = document.getElementById(OVERLAY_ID);
  if (el) el.remove();
}

function buildDiffHtml(diff: DiffResult): string {
  const hasChanges = diff.added.length + diff.removed.length + diff.modified.length > 0;
  if (!hasChanges) return '<div class="pv-empty">No changes</div>';

  let html = '';

  for (const a of diff.added) {
    html += line('pv-add', '+', a.name, escapeHtml(a.type) + ', ' + formatSize(a.size));
  }

  for (const m of diff.modified) {
    const x: string[] = [];
    if (m.curr.size !== m.prev.size) x.push(formatSize(m.prev.size) + ' \u2192 ' + formatSize(m.curr.size));
    if (m.curr.type !== m.prev.type) x.push(escapeHtml(m.prev.type) + ' \u2192 ' + escapeHtml(m.curr.type));
    if (!x.length) x.push('name changed');
    html += line('pv-mod', '~', m.curr.name, x.join(', '));
  }

  for (const r of diff.removed) {
    html += line('pv-rem', '-', r.name, escapeHtml(r.type));
  }

  return html;
}

function line(cls: string, mark: string, name: string, meta: string): string {
  return `<div class="pv-line ${cls}"><span class="pv-mark">${mark}</span><span class="pv-name">${escapeHtml(name)}</span><span class="pv-meta">${meta}</span></div>`;
}

function buildHistoryHtml(changelog: ChangelogEntry[]): string {
  if (!changelog.length) return '<div class="pv-empty">No history yet</div>';

  let html = '';
  for (const entry of changelog) {
    const total = (entry.added?.length || 0) + (entry.modified?.length || 0) + (entry.removed?.length || 0);

    html += '<div class="pv-hist-entry">';
    html += `<div class="pv-hist-head">`;
    html += `<span class="pv-hist-ver">${escapeHtml(entry.version)}</span>`;
    html += `<span class="pv-hist-date">${escapeHtml(entry.date)}</span>`;
    if (total > 0) {
      html += '<span class="pv-hist-counts">';
      if (entry.added?.length) html += `<span class="pv-c-add">+${entry.added.length}</span> `;
      if (entry.modified?.length) html += `<span class="pv-c-mod">~${entry.modified.length}</span> `;
      if (entry.removed?.length) html += `<span class="pv-c-rem">-${entry.removed.length}</span>`;
      html += '</span>';
    }
    html += '</div>';

    if (entry.notes) {
      html += `<div class="pv-hist-notes">${escapeHtml(entry.notes)}</div>`;
    }

    if (total > 0) {
      html += '<div class="pv-hist-files">';
      for (const name of entry.added || []) html += `<span class="pv-c-add">+ ${escapeHtml(name)}</span>`;
      for (const name of entry.modified || []) html += `<span class="pv-c-mod">~ ${escapeHtml(name)}</span>`;
      for (const name of entry.removed || []) html += `<span class="pv-c-rem">- ${escapeHtml(name)}</span>`;
      html += '</div>';
    }

    html += '</div>';
  }
  return html;
}

function switchTab(tab: 'snapshot' | 'history'): void {
  const snapshotTab = document.getElementById('pv-tab-snapshot');
  const historyTab = document.getElementById('pv-tab-history');
  const snapshotView = document.getElementById('pv-view-snapshot');
  const historyView = document.getElementById('pv-view-history');

  if (!snapshotTab || !historyTab || !snapshotView || !historyView) return;

  if (tab === 'snapshot') {
    snapshotTab.classList.add('pv-tab-active');
    historyTab.classList.remove('pv-tab-active');
    snapshotView.style.display = '';
    historyView.style.display = 'none';
  } else {
    snapshotTab.classList.remove('pv-tab-active');
    historyTab.classList.add('pv-tab-active');
    snapshotView.style.display = 'none';
    historyView.style.display = '';
  }
}

export function openPanel(): void {
  if (document.getElementById(OVERLAY_ID)) return;

  const current = scanAssets();
  const meta: ProjectMeta = readMeta() || { projectVersion: '0.0.0', changelog: [], snapshot: {} };
  const diff = computeDiff(meta.snapshot, current);
  const hasChanges = diff.added.length + diff.removed.length + diff.modified.length > 0;

  const diffHtml = buildDiffHtml(diff);
  const historyHtml = buildHistoryHtml(meta.changelog || []);

  const cs = hasChanges
    ? `<span class="pv-c-add">+${diff.added.length}</span> <span class="pv-c-mod">~${diff.modified.length}</span> <span class="pv-c-rem">-${diff.removed.length}</span>`
    : '<span class="pv-c-none">no changes</span>';

  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.className = 'pv-overlay';

  overlay.innerHTML = `
    <div class="pv-panel" role="dialog" aria-modal="true">
      <div class="pv-header">
        <span class="pv-ver">${escapeHtml(meta.projectVersion)}</span>
        <span class="pv-sep">\u00b7</span>
        <span class="pv-assets-count">${Object.keys(current).length} assets</span>
        <span class="pv-sep">\u00b7</span>
        ${cs}
        <span class="pv-spacer"></span>
        <button class="pv-tab pv-tab-active" id="pv-tab-snapshot" type="button">Snapshot</button>
        <button class="pv-tab" id="pv-tab-history" type="button">History</button>
        <span class="pv-sep">\u00b7</span>
        <button class="pv-close" id="pv-close" type="button">\u00d7</button>
      </div>

      <div id="pv-view-snapshot">
        ${hasChanges ? '<div class="pv-diff">' + diffHtml + '</div>' : ''}
        <div class="pv-footer">
          <input type="text" class="pv-input" id="pv-version" value="${escapeHtml(meta.projectVersion)}" placeholder="0.0.0" title="Version">
          <input type="text" class="pv-input pv-input-wide" id="pv-notes" placeholder="Notes..." title="Notes">
          <button class="pv-btn pv-btn-primary" id="pv-save" type="button">Save</button>
        </div>
      </div>

      <div id="pv-view-history" style="display:none">
        <div class="pv-history">${historyHtml}</div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('pv-close')!.onclick = closePanel;
  overlay.onclick = (e) => { if (e.target === overlay) closePanel(); };

  document.getElementById('pv-tab-snapshot')!.onclick = () => switchTab('snapshot');
  document.getElementById('pv-tab-history')!.onclick = () => switchTab('history');

  document.getElementById('pv-save')!.onclick = () => {
    const version = (document.getElementById('pv-version') as HTMLInputElement).value.trim() || meta.projectVersion || '0.0.0';
    const notes = (document.getElementById('pv-notes') as HTMLInputElement).value.trim();

    const entry = {
      version,
      date: new Date().toISOString().slice(0, 10),
      notes,
      added: diff.added.map((a: AssetEntry) => a.name),
      modified: diff.modified.map((m) => m.curr.name),
      removed: diff.removed.map((r: AssetEntry) => r.name),
    };

    const ok = writeMeta({
      projectVersion: version,
      changelog: [entry, ...(meta.changelog || [])].slice(0, 50),
      snapshot: current,
    });
    if (ok) closePanel();
  };
}

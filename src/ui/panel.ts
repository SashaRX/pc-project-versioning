import { scanAssets, computeDiff } from '../core/assets';
import { readMeta, writeMeta } from '../core/storage';
import { escapeHtml, formatSize, bumpPatch } from '../core/helpers';
import type { ProjectMeta, DiffResult, AssetEntry, ChangelogEntry } from '../types';

function buildDiffHtml(diff: DiffResult): string {
  const hasChanges = diff.added.length + diff.removed.length + diff.modified.length > 0;
  if (!hasChanges) return '<div class="pv-empty">No changes</div>';

  let html = '';
  for (const a of diff.added)
    html += line('pv-add', '+', a.name, escapeHtml(a.type) + ', ' + formatSize(a.size));
  for (const m of diff.modified) {
    const x: string[] = [];
    if (m.curr.size !== m.prev.size) x.push(formatSize(m.prev.size) + ' \u2192 ' + formatSize(m.curr.size));
    if (m.curr.type !== m.prev.type) x.push(escapeHtml(m.prev.type) + ' \u2192 ' + escapeHtml(m.curr.type));
    if (!x.length) x.push('name changed');
    html += line('pv-mod', '~', m.curr.name, x.join(', '));
  }
  for (const r of diff.removed)
    html += line('pv-rem', '-', r.name, escapeHtml(r.type));
  return html;
}

function line(cls: string, mark: string, name: string, meta: string): string {
  return `<div class="pv-line ${cls}"><span class="pv-mark">${mark}</span><span class="pv-name">${escapeHtml(name)}</span><span class="pv-meta">${meta}</span></div>`;
}

function buildHistoryHtml(changelog: ChangelogEntry[]): string {
  if (!changelog.length) return '<div class="pv-empty">No history yet</div>';

  let html = '';
  for (let i = 0; i < changelog.length; i++) {
    const entry = changelog[i];
    const total = (entry.added?.length || 0) + (entry.modified?.length || 0) + (entry.removed?.length || 0);
    const uid = 'pv-h-' + i;

    html += '<div class="pv-hist-entry">';

    // Header row — clickable to expand files
    html += `<div class="pv-hist-head" data-pv-toggle="${uid}">`;
    html += `<span class="pv-hist-ver">${escapeHtml(entry.version)}</span>`;
    html += `<span class="pv-hist-date">${escapeHtml(entry.date)}</span>`;
    if (entry.notes) html += `<span class="pv-hist-notes">${escapeHtml(entry.notes)}</span>`;
    html += '<span class="pv-spacer"></span>';
    if (total > 0) {
      html += '<span class="pv-hist-counts">';
      if (entry.added?.length) html += `<span class="pv-c-add">+${entry.added.length}</span> `;
      if (entry.modified?.length) html += `<span class="pv-c-mod">~${entry.modified.length}</span> `;
      if (entry.removed?.length) html += `<span class="pv-c-rem">-${entry.removed.length}</span>`;
      html += '</span>';
      html += `<span class="pv-hist-arrow" id="${uid}-arrow">\u25b6</span>`;
    }
    html += '</div>';

    // Collapsible file list
    if (total > 0) {
      html += `<div class="pv-hist-files pv-collapsed" id="${uid}">`;
      for (const n of entry.added || []) html += `<div class="pv-c-add">+ ${escapeHtml(n)}</div>`;
      for (const n of entry.modified || []) html += `<div class="pv-c-mod">~ ${escapeHtml(n)}</div>`;
      for (const n of entry.removed || []) html += `<div class="pv-c-rem">- ${escapeHtml(n)}</div>`;
      html += '</div>';
    }

    html += '</div>';
  }
  return html;
}

/**
 * Рендерит содержимое вкладки Versioning внутрь DOM-элемента.
 * Вызывается при показе панели (panel.on('show')).
 */
export function renderPanel(container: HTMLElement): void {
  const current = scanAssets();
  const meta: ProjectMeta = readMeta() || { projectVersion: '0.0.0', description: '', changelog: [], snapshot: {} };
  const diff = computeDiff(meta.snapshot, current);
  const hasChanges = diff.added.length + diff.removed.length + diff.modified.length > 0;

  const diffHtml = buildDiffHtml(diff);
  const historyHtml = buildHistoryHtml(meta.changelog || []);
  const nextVersion = bumpPatch(meta.projectVersion);

  const cs = hasChanges
    ? `<span class="pv-c-add">+${diff.added.length}</span> <span class="pv-c-mod">~${diff.modified.length}</span> <span class="pv-c-rem">-${diff.removed.length}</span>`
    : '<span class="pv-c-none">no changes</span>';

  container.innerHTML = `
    <div class="pv-root">
      <div class="pv-bar">
        <span class="pv-ver">${escapeHtml(meta.projectVersion)}</span>
        ${meta.description ? '<span class="pv-sep">\u00b7</span><span class="pv-desc">' + escapeHtml(meta.description) + '</span>' : ''}
        <span class="pv-sep">\u00b7</span>
        <span class="pv-info">${Object.keys(current).length} assets</span>
        <span class="pv-sep">\u00b7</span>
        ${cs}
        <span class="pv-spacer"></span>
        <button class="pv-tab pv-tab-active" data-pv-tab="snapshot" type="button">Snapshot</button>
        <button class="pv-tab" data-pv-tab="history" type="button">History</button>
      </div>

      <div class="pv-view" data-pv-view="snapshot">
        <div class="pv-desc-row">
          <input type="text" class="pv-input pv-input-wide" data-pv-field="description" value="${escapeHtml(meta.description)}" placeholder="Project description...">
        </div>
        ${hasChanges ? '<div class="pv-diff">' + diffHtml + '</div>' : '<div class="pv-diff"><div class="pv-empty">No changes</div></div>'}
        <div class="pv-footer">
          <input type="text" class="pv-input" data-pv-field="version" value="${escapeHtml(nextVersion)}" placeholder="0.0.0">
          <input type="text" class="pv-input pv-input-wide" data-pv-field="notes" placeholder="What changed...">
          <button class="pv-btn pv-btn-primary" data-pv-action="save" type="button">Save</button>
        </div>
      </div>

      <div class="pv-view" data-pv-view="history" style="display:none">
        <div class="pv-history">${historyHtml}</div>
      </div>
    </div>
  `;

  // Tab switching
  container.querySelectorAll<HTMLElement>('[data-pv-tab]').forEach(btn => {
    btn.onclick = () => {
      const tab = btn.dataset.pvTab!;
      container.querySelectorAll<HTMLElement>('[data-pv-tab]').forEach(b =>
        b.classList.toggle('pv-tab-active', b.dataset.pvTab === tab));
      container.querySelectorAll<HTMLElement>('[data-pv-view]').forEach(v =>
        v.style.display = v.dataset.pvView === tab ? '' : 'none');
    };
  });

  // History entry toggle (expand/collapse file list)
  container.querySelectorAll<HTMLElement>('[data-pv-toggle]').forEach(head => {
    head.onclick = () => {
      const id = head.dataset.pvToggle!;
      const files = container.querySelector<HTMLElement>('#' + id);
      const arrow = container.querySelector<HTMLElement>('#' + id + '-arrow');
      if (!files) return;
      const collapsed = files.classList.toggle('pv-collapsed');
      if (arrow) arrow.textContent = collapsed ? '\u25b6' : '\u25bc';
    };
  });

  // Save
  const saveBtn = container.querySelector<HTMLElement>('[data-pv-action="save"]');
  if (saveBtn) {
    saveBtn.onclick = () => {
      const versionInput = container.querySelector<HTMLInputElement>('[data-pv-field="version"]');
      const notesInput = container.querySelector<HTMLInputElement>('[data-pv-field="notes"]');
      const descInput = container.querySelector<HTMLInputElement>('[data-pv-field="description"]');
      const version = versionInput?.value.trim() || nextVersion;
      const notes = notesInput?.value.trim() || '';
      const description = descInput?.value.trim() || meta.description || '';

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
        description,
        changelog: [entry, ...(meta.changelog || [])].slice(0, 50),
        snapshot: current,
      });

      if (ok) renderPanel(container);
    };
  }

  // Auto-save description on blur (without creating a snapshot)
  const descInput = container.querySelector<HTMLInputElement>('[data-pv-field="description"]');
  if (descInput) {
    descInput.onblur = () => {
      const val = descInput.value.trim();
      if (val !== meta.description) {
        meta.description = val;
        writeMeta(meta);
      }
    };
  }
}

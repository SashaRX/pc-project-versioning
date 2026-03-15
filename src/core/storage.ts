import type { ProjectMeta } from '../types';
import { getProjectId } from './helpers';

function storageKey(): string {
  return 'pv_meta_' + getProjectId();
}

function normalizeMeta(data: unknown): ProjectMeta {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { projectVersion: '0.0.0', description: '', changelog: [], snapshot: {} };
  }

  const d = data as Record<string, unknown>;
  return {
    projectVersion:
      typeof d.projectVersion === 'string' && (d.projectVersion as string).trim()
        ? (d.projectVersion as string)
        : '0.0.0',
    description: typeof d.description === 'string' ? (d.description as string) : '',
    changelog: Array.isArray(d.changelog) ? d.changelog : [],
    snapshot:
      d.snapshot && typeof d.snapshot === 'object' && !Array.isArray(d.snapshot)
        ? (d.snapshot as ProjectMeta['snapshot'])
        : {},
  };
}

export function readMeta(): ProjectMeta | null {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return null;
    return normalizeMeta(JSON.parse(raw));
  } catch (e) {
    console.warn('[ProjectVersion] Failed to read meta:', e);
    return null;
  }
}

export function writeMeta(obj: ProjectMeta): boolean {
  try {
    const payload: ProjectMeta = {
      projectVersion: obj.projectVersion || '0.0.0',
      description: obj.description || '',
      changelog: Array.isArray(obj.changelog) ? obj.changelog : [],
      snapshot: obj.snapshot && typeof obj.snapshot === 'object' ? obj.snapshot : {},
    };
    localStorage.setItem(storageKey(), JSON.stringify(payload));
    syncMetaAsset(payload.projectVersion, payload.description);
    console.log('[ProjectVersion] Snapshot saved:', payload.projectVersion);
    return true;
  } catch (e) {
    console.error('[ProjectVersion] Write failed:', e);
    alert('Failed to write snapshot. Check console.');
    return false;
  }
}

/**
 * Синхронизирует projectVersion и description в ассет _project_meta.json
 * через REST API (PUT /api/assets/{id}?branchId=...).
 * OT ломается на set('data', obj), поэтому пишем файл напрямую.
 * Loading screen (loadingScreen.js) читает этот файл через XHR при запуске.
 */
function syncMetaAsset(version: string, description: string): void {
  try {
    const list = window.editor.call('assets:list') as { forEach(fn: (a: EditorAsset) => void): void };
    let asset: EditorAsset | null = null;
    list.forEach((a: EditorAsset) => {
      if (a.get('name') === '_project_meta.json' && a.get('type') === 'json') asset = a;
    });
    if (!asset) {
      console.warn('[ProjectVersion] _project_meta.json not found, skipping sync');
      return;
    }

    const assetId = asset.get('id') as number;
    const branchId = (window.config as Record<string, unknown> & { self?: { branch?: { id?: string } } })
      ?.self?.branch?.id || '';

    const json = JSON.stringify({ projectVersion: version, description }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const form = new FormData();
    form.append('file', blob, '_project_meta.json');

    const url = '/api/assets/' + assetId + (branchId ? '?branchId=' + branchId : '');

    fetch(url, { method: 'PUT', body: form })
      .then(r => {
        if (r.ok) console.log('[ProjectVersion] _project_meta.json synced:', version);
        else console.warn('[ProjectVersion] _project_meta.json sync failed:', r.status);
      })
      .catch(e => console.warn('[ProjectVersion] _project_meta.json sync error:', e));
  } catch (e) {
    console.warn('[ProjectVersion] Failed to sync _project_meta.json:', e);
  }
}

interface EditorAsset {
  get(key: string): unknown;
  set(path: string, value: unknown): void;
}

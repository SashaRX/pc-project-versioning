import type { ProjectMeta } from '../types';
import { getProjectId } from './helpers';

function storageKey(): string {
  return 'pv_meta_' + getProjectId();
}

function normalizeMeta(data: unknown): ProjectMeta {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { projectVersion: '0.0.0', changelog: [], snapshot: {} };
  }

  const d = data as Record<string, unknown>;
  return {
    projectVersion:
      typeof d.projectVersion === 'string' && (d.projectVersion as string).trim()
        ? (d.projectVersion as string)
        : '0.0.0',
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
      changelog: Array.isArray(obj.changelog) ? obj.changelog : [],
      snapshot: obj.snapshot && typeof obj.snapshot === 'object' ? obj.snapshot : {},
    };
    localStorage.setItem(storageKey(), JSON.stringify(payload));
    console.log('[ProjectVersion] Snapshot saved:', payload.projectVersion);
    return true;
  } catch (e) {
    console.error('[ProjectVersion] Write failed:', e);
    alert('Failed to write snapshot. Check console.');
    return false;
  }
}

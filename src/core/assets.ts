import type { AssetMap, DiffResult } from '../types';

interface EditorAsset {
  get(key: string): unknown;
}

function getAssetList(): EditorAsset[] {
  try {
    const list = window.editor.call('assets:list') as unknown;
    if (!list) return [];
    if (Array.isArray(list)) return list;
    if (typeof (list as { length?: number }).length === 'number') return Array.from(list as ArrayLike<EditorAsset>);
    if (typeof (list as { forEach?: Function }).forEach === 'function') {
      const arr: EditorAsset[] = [];
      (list as { forEach(fn: (item: EditorAsset) => void): void }).forEach((item) => arr.push(item));
      return arr;
    }
    return [];
  } catch (e) {
    console.error('[ProjectVersion] assets:list failed:', e);
    return [];
  }
}

export function scanAssets(): AssetMap {
  const list = getAssetList();
  const assets: AssetMap = {};

  for (const a of list) {
    if (!a || typeof a.get !== 'function') continue;
    const id = a.get('id') as string | number | undefined;
    const name = a.get('name') as string | undefined;
    const type = a.get('type') as string | undefined;
    if (!id || !name) continue;

    assets[String(id)] = {
      name: name || '',
      type: type || 'unknown',
      size: (a.get('file.size') as number) || 0,
    };
  }
  return assets;
}

export function computeDiff(prev: AssetMap, curr: AssetMap): DiffResult {
  const prevIds = new Set(Object.keys(prev || {}));
  const currIds = new Set(Object.keys(curr || {}));
  const added: DiffResult['added'] = [];
  const removed: DiffResult['removed'] = [];
  const modified: DiffResult['modified'] = [];

  for (const id of currIds) {
    if (!prevIds.has(id)) {
      added.push(curr[id]);
      continue;
    }
    const p = prev[id];
    const c = curr[id];
    if (p && c && (p.size !== c.size || p.name !== c.name || p.type !== c.type)) {
      modified.push({ prev: p, curr: c });
    }
  }

  for (const id of prevIds) {
    if (!currIds.has(id)) removed.push(prev[id]);
  }

  return { added, removed, modified };
}

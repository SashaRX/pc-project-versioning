export interface AssetEntry {
  name: string;
  type: string;
  size: number;
}

export interface AssetMap {
  [id: string]: AssetEntry;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  notes: string;
  added: string[];
  modified: string[];
  removed: string[];
}

export interface ProjectMeta {
  projectVersion: string;
  changelog: ChangelogEntry[];
  snapshot: AssetMap;
}

export interface DiffResult {
  added: AssetEntry[];
  removed: AssetEntry[];
  modified: { prev: AssetEntry; curr: AssetEntry }[];
}

declare global {
  interface Window {
    editor: {
      call(method: string, ...args: unknown[]): unknown;
    };
  }
}

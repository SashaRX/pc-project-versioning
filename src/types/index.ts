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
  description: string;
  notes: string;
  added: string[];
  modified: string[];
  removed: string[];
}

export interface ProjectMeta {
  projectVersion: string;
  description: string;
  changelog: ChangelogEntry[];
  snapshot: AssetMap;
}

export interface DiffResult {
  added: AssetEntry[];
  removed: AssetEntry[];
  modified: { prev: AssetEntry; curr: AssetEntry }[];
}

/* PlayCanvas Editor globals */

interface PcuiElement {
  dom: HTMLElement;
  element: HTMLElement;
  hidden: boolean;
  class: { add(cls: string): void; remove(cls: string): void; contains(cls: string): boolean };
  append(child: PcuiElement): void;
  on(event: string, fn: (...args: unknown[]) => void): { unbind(): void };
  destroy(): void;
}

interface PcuiContainer extends PcuiElement {
  clear(): void;
}

interface PcuiLib {
  Container: new (opts?: Record<string, unknown>) => PcuiContainer;
  Label: new (opts?: Record<string, unknown>) => PcuiElement;
  Button: new (opts?: Record<string, unknown>) => PcuiElement;
  TextInput: new (opts?: Record<string, unknown>) => PcuiElement & { value: string };
}

interface EditorApi {
  call(method: string, ...args: unknown[]): unknown;
  on(event: string, fn: (...args: unknown[]) => void): { unbind(): void };
  once(event: string, fn: (...args: unknown[]) => void): void;
  method(name: string, fn: (...args: unknown[]) => unknown): void;
  emit(event: string, ...args: unknown[]): void;
}

declare global {
  interface Window {
    editor: EditorApi;
    pcui: PcuiLib;
    config: {
      project: {
        id: number;
        name: string;
        settings: {
          loadingScreenScript: string | null;
          [key: string]: unknown;
        };
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
  }
}

import { normalizeSpaces, isVisible } from '../core/helpers';
import { openPanel } from './panel';

export const OVERLAY_ID = 'pv-overlay';
export const STYLE_ID = 'pv-style';
export const BTN_CLASS = 'pv-build-btn';
export const ROOT_CLASS = 'pv-build-root';

function getRootTitle(root: HTMLElement): string {
  const sels = [
    '.pcui-dialog-header', '.pcui-panel-header', '.dialog-header',
    '.header', '[class*="header"]', '.title', '[class*="title"]',
  ];
  for (const sel of sels) {
    for (const node of root.querySelectorAll(sel)) {
      const t = normalizeSpaces(node.textContent || '');
      if (t === 'BUILDS') return t;
    }
  }
  return '';
}

function findBuildWindows(): HTMLElement[] {
  const roots = Array.from(document.querySelectorAll<HTMLElement>([
    '.pcui-dialog', '.pcui-panel', '.ui-dialog', '.dialog',
    '[role="dialog"]', '[class*="dialog"]', '[class*="panel"]', '[class*="window"]',
  ].join(',')));

  return roots.filter((root) => {
    if (!root.isConnected || !isVisible(root)) return false;
    const text = normalizeSpaces(root.innerText || root.textContent || '').toUpperCase();
    return text.includes('BUILDS') && text.includes('PUBLISH TO PLAYCANVAS')
      && text.includes('DOWNLOAD .ZIP') && text.includes('EXISTING BUILDS')
      && getRootTitle(root).toUpperCase() === 'BUILDS';
  });
}

export function injectBuildButtons(): void {
  for (const root of findBuildWindows()) {
    if (!root.isConnected) continue;
    if (root.querySelector('.' + BTN_CLASS)) continue;

    root.classList.add(ROOT_CLASS);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = BTN_CLASS;
    btn.textContent = 'SNAPSHOT';
    btn.title = 'Open project snapshot';
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openPanel();
    };

    root.appendChild(btn);
    console.log('[ProjectVersion] Build button injected');
  }
}

export function observeUi(): void {
  new MutationObserver(() => injectBuildButtons())
    .observe(document.body, { childList: true, subtree: true });
}

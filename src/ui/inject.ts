import { normalizeSpaces, isVisible } from '../core/helpers';
import { BTN_CLASS, ROOT_CLASS } from './constants';
import { openPanel } from './panel';

const HEADER_SELS = 'h1,h2,h3,h4,.title,[class*="title"],[class*="header"],header,span,div';
const MARKERS = ['PUBLISH TO PLAYCANVAS', 'DOWNLOAD .ZIP', 'EXISTING BUILDS'];

function findBuildWindows(): HTMLElement[] {
  const results: HTMLElement[] = [];
  const seen = new WeakSet<HTMLElement>();

  // Ищем заголовок "BUILDS" среди типичных заголовочных элементов
  for (const el of document.querySelectorAll<HTMLElement>(HEADER_SELS)) {
    if (!el.isConnected) continue;
    // Только прямой текст (без вложенных), чтобы не матчить весь контейнер
    const ownText = normalizeSpaces(
      Array.from(el.childNodes)
        .filter(n => n.nodeType === 3)
        .map(n => n.textContent || '')
        .join('')
    );
    if (ownText !== 'BUILDS') continue;
    if (!isVisible(el)) continue;

    // Поднимаемся к контейнеру с маркерами
    let parent: HTMLElement | null = el.parentElement;
    for (let i = 0; i < 15 && parent; i++) {
      const text = (parent.innerText || '').toUpperCase();
      if (MARKERS.every(m => text.includes(m))) {
        if (!seen.has(parent)) { seen.add(parent); results.push(parent); }
        break;
      }
      parent = parent.parentElement;
    }
  }
  return results;
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
  let timer: ReturnType<typeof setTimeout> | null = null;
  new MutationObserver(() => {
    if (timer) return;
    timer = setTimeout(() => { timer = null; injectBuildButtons(); }, 300);
  }).observe(document.body, { childList: true, subtree: true });
}

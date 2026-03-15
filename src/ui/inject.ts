import { BTN_CLASS, ROOT_CLASS } from './constants';
import { openPanel } from './panel';

/**
 * Панель Builds регистрируется в editor через:
 *   editor.call('picker:project:registerMenu', 'builds-publish', 'Builds', panel, 'BUILDS & PUBLISH');
 * Контейнер получает класс 'picker-builds-publish'.
 * См. playcanvas/editor src/editor/pickers/picker-builds-publish.ts
 */
export function injectBuildButtons(): void {
  const root = document.querySelector<HTMLElement>('.picker-builds-publish');
  if (!root || !root.isConnected) return;
  if (root.querySelector('.' + BTN_CLASS)) return;

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

export function observeUi(): void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  new MutationObserver(() => {
    if (timer) return;
    timer = setTimeout(() => { timer = null; injectBuildButtons(); }, 300);
  }).observe(document.body, { childList: true, subtree: true });
}

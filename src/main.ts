import { getProjectId } from './core/helpers';
import { injectStyles } from './ui/styles';
import { renderPanel } from './ui/panel';

(function () {
  'use strict';

  function isReady(): boolean {
    return !!(window.editor && typeof window.editor.call === 'function' && document.body);
  }

  /**
   * Регистрируем вкладку "Versioning" в project picker.
   *
   * Используем editor API напрямую:
   *   editor.call('picker:project:registerMenu', name, title, panel, displayName)
   * См. playcanvas/editor src/editor/pickers/picker-project.ts
   *
   * Панель — PCUI Container, получает show/hide от picker-project при переключении табов.
   */
  function registerTab(): void {
    const { Container } = window.pcui;
    const panel = new Container({ flex: true, class: ['pv-versioning'] });

    panel.on('show', () => {
      renderPanel(panel.dom);
    });

    window.editor.call(
      'picker:project:registerMenu',
      'versioning',          // internal name
      'Versioning',          // title в правой панели
      panel,                 // PCUI Container
      'VERSIONING'           // текст в левом меню
    );

    // Открыть вкладку Versioning по методу
    window.editor.method('picker:versioning', () => {
      window.editor.call('picker:project', 'versioning');
    });

    console.log('[ProjectVersion] Registered as native tab (project ' + getProjectId() + ')');
  }

  function init(): void {
    injectStyles();
    registerTab();
  }

  function waitAndInit(): void {
    if (isReady()) {
      // editor.once('load') может уже быть отработан к моменту инжекции userscript.
      // Безопасный вариант: проверяем наличие pcui и registerMenu
      if (window.pcui?.Container && typeof window.editor.call === 'function') {
        try {
          init();
          return;
        } catch (e) {
          console.warn('[ProjectVersion] Init failed, retrying...', e);
        }
      }
      setTimeout(waitAndInit, 500);
      return;
    }
    setTimeout(waitAndInit, 500);
  }

  waitAndInit();
})();

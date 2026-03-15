import { getProjectId } from './core/helpers';
import { injectStyles } from './ui/styles';
import { injectBuildButtons, observeUi } from './ui/inject';

(function () {
  'use strict';

  function isReady(): boolean {
    return !!(window.editor && typeof window.editor.call === 'function' && document.body);
  }

  function init(): void {
    injectStyles();
    observeUi();
    injectBuildButtons();
    console.log('[ProjectVersion] Ready (localStorage, project ' + getProjectId() + ')');
  }

  function waitAndInit(): void {
    if (isReady()) { init(); return; }
    setTimeout(waitAndInit, 500);
  }

  waitAndInit();
})();

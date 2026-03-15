import { BTN_CLASS, ROOT_CLASS, STYLE_ID } from './inject';

export function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    .${ROOT_CLASS} { position: relative; }

    .${BTN_CLASS} {
      position: absolute; top: 56px; right: 18px; z-index: 20;
      appearance: none; border: 1px solid #ff8a2b; background: #ff7f1f; color: #1e2528;
      height: 28px; padding: 0 10px; border-radius: 2px;
      font: 600 11px Arial, sans-serif; letter-spacing: 0.04em;
      cursor: pointer; white-space: nowrap; text-transform: uppercase;
      box-shadow: 0 1px 0 rgba(0,0,0,0.25);
    }
    .${BTN_CLASS}:hover { background: #ff933f; border-color: #ff9f57; }
    .${BTN_CLASS}:active { background: #f07412; }

    .pv-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 100000; font-family: Arial, sans-serif;
    }

    .pv-panel {
      width: 520px; max-width: calc(100vw - 40px); max-height: calc(100vh - 40px);
      display: flex; flex-direction: column;
      background: #2d3c43; border: 1px solid #44525a; border-radius: 3px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.45); color: #d7dde0;
    }

    .pv-header {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 10px; border-bottom: 1px solid #425159; background: #26343a;
      font-size: 11px; line-height: 1;
    }
    .pv-title { font-size: 12px; font-weight: 600; color: #f0f4f6; text-transform: uppercase; letter-spacing: 0.04em; }
    .pv-ver { color: #8ad19d; font-weight: 600; }
    .pv-assets-count { color: #9eabb1; }
    .pv-sep { color: #555; }
    .pv-spacer { flex: 1; }

    .pv-c-add { color: #8ad19d; }
    .pv-c-mod { color: #d7c07f; }
    .pv-c-rem { color: #d48c8c; }
    .pv-c-none { color: #9eabb1; }

    .pv-close {
      appearance: none; border: 0; background: transparent; color: #a8b2b7;
      width: 22px; height: 22px; border-radius: 2px;
      font-size: 16px; line-height: 20px; cursor: pointer; flex: 0 0 auto;
    }
    .pv-close:hover { background: #33444c; color: #fff; }

    .pv-diff {
      max-height: 220px; overflow: auto;
      border-bottom: 1px solid #425159; background: #26343a;
    }

    .pv-line {
      display: grid; grid-template-columns: 14px minmax(0,1fr) auto;
      gap: 6px; align-items: center;
      padding: 3px 10px; font-size: 11px; line-height: 1.3;
    }
    .pv-line + .pv-line { border-top: 1px solid #2f3e45; }
    .pv-mark { text-align: center; opacity: 0.9; }
    .pv-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pv-meta { color: #9eabb1; white-space: nowrap; margin-left: 4px; font-size: 10px; }

    .pv-add { color: #8ad19d; }
    .pv-mod { color: #d7c07f; }
    .pv-rem { color: #d48c8c; }
    .pv-empty { padding: 6px 10px; font-size: 11px; color: #9eabb1; }

    .pv-footer {
      display: flex; gap: 6px; padding: 8px 10px; background: #26343a;
    }
    .pv-input {
      box-sizing: border-box; appearance: none;
      border: 1px solid #48545b; background: #243137; color: #e2e7ea;
      border-radius: 2px; padding: 5px 7px; font: 11px Arial, sans-serif; outline: none;
      width: 80px;
    }
    .pv-input-wide { flex: 1; width: auto; }
    .pv-input:focus { border-color: #64727a; background: #202b30; }

    .pv-btn {
      appearance: none; height: 26px; padding: 0 10px; border-radius: 2px;
      font: 600 11px Arial, sans-serif; text-transform: uppercase;
      letter-spacing: 0.04em; cursor: pointer; white-space: nowrap;
    }
    .pv-btn-primary { border: 1px solid #ff8a2b; background: #ff7f1f; color: #1e2528; }
    .pv-btn-primary:hover { background: #ff933f; border-color: #ff9f57; }
  `;
  document.head.appendChild(s);
}

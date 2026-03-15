const STYLE_ID = 'pv-style';

export function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    .pv-root { font-family: Arial, sans-serif; color: #d7dde0; }

    .pv-bar {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 10px; border-bottom: 1px solid #425159;
      font-size: 11px; line-height: 1;
    }
    .pv-ver { color: #8ad19d; font-weight: 600; }
    .pv-info { color: #9eabb1; }
    .pv-sep { color: #555; }
    .pv-spacer { flex: 1; }

    .pv-c-add { color: #8ad19d; }
    .pv-c-mod { color: #d7c07f; }
    .pv-c-rem { color: #d48c8c; }
    .pv-c-none { color: #9eabb1; }

    .pv-tab {
      appearance: none; border: 1px solid transparent; background: transparent;
      color: #9eabb1; padding: 3px 8px; border-radius: 2px;
      font: 600 10px Arial, sans-serif; text-transform: uppercase;
      letter-spacing: 0.04em; cursor: pointer;
    }
    .pv-tab:hover { color: #d7dde0; background: #33444c; }
    .pv-tab-active { color: #f0f4f6; background: #3a4d56; border-color: #4e6069; }

    .pv-diff {
      max-height: 260px; overflow: auto;
      border-bottom: 1px solid #425159;
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
    .pv-empty { padding: 10px; font-size: 11px; color: #9eabb1; }

    .pv-desc-row {
      display: flex; padding: 8px 10px 0;
    }

    .pv-footer {
      display: flex; gap: 6px; padding: 8px 10px;
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

    .pv-history { max-height: 400px; overflow: auto; }

    .pv-hist-entry { padding: 6px 10px; }
    .pv-hist-entry + .pv-hist-entry { border-top: 1px solid #2f3e45; }

    .pv-hist-head {
      display: flex; align-items: center; gap: 8px; font-size: 11px; line-height: 1;
      cursor: pointer; user-select: none;
    }
    .pv-hist-head:hover { background: rgba(255,255,255,0.03); margin: -2px -4px; padding: 2px 4px; border-radius: 2px; }
    .pv-hist-ver { color: #8ad19d; font-weight: 600; }
    .pv-hist-date { color: #9eabb1; }
    .pv-hist-notes { color: #c8cdd0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 260px; }
    .pv-hist-counts { display: flex; gap: 4px; font-size: 10px; }
    .pv-hist-arrow { color: #666; font-size: 8px; width: 12px; text-align: center; }

    .pv-hist-files {
      margin-top: 4px; padding: 4px 0 0 20px;
      font-size: 10px; line-height: 1.6;
      border-left: 1px solid #3a4a52;
    }
    .pv-hist-files.pv-collapsed { display: none; }
    .pv-hist-files div {
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
  `;
  document.head.appendChild(s);
}

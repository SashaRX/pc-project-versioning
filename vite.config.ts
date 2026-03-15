import { defineConfig, Plugin } from 'vite';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const header = `// ==UserScript==
// @name         PlayCanvas Project Versioning
// @namespace    https://github.com/SashaRX
// @version      ${pkg.version}
// @description  Snapshot ассетов, diff и версионирование из окна Builds
// @author       SashaRX
// @match        https://playcanvas.com/editor/*
// @grant        none
// @updateURL    https://gist.githubusercontent.com/SashaRX/0001d8aa0d715d3f5eca171df9021a21/raw/pc-project-versioning.user.js
// @downloadURL  https://gist.githubusercontent.com/SashaRX/0001d8aa0d715d3f5eca171df9021a21/raw/pc-project-versioning.user.js
// ==/UserScript==
`;

function userscriptHeader(): Plugin {
  return {
    name: 'userscript-header',
    closeBundle() {
      const outFile = resolve('dist', 'pc-project-versioning.user.js');
      const content = readFileSync(outFile, 'utf-8');
      writeFileSync(outFile, header + '\n' + content);
    },
  };
}

export default defineConfig({
  plugins: [userscriptHeader()],
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['iife'],
      name: 'PcProjectVersioning',
      fileName: () => 'pc-project-versioning.user.js',
    },
    minify: false,
    outDir: 'dist',
  },
});

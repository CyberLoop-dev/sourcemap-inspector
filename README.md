<div align="center">

![Source Map Inspector banner](https://capsule-render.vercel.app/api?type=waving&color=0:#7c2d12,100:#0f766e&height=170&section=header&text=Source%20Map%20Inspector&fontSize=34&fontColor=ffffff)

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=18&pause=1000&color=0f766e&center=true&vCenter=true&width=720&lines=Inspect%20source%20maps%20without%20uploading%20them%3BValidate%20mappings%20and%20source%20coverage" alt="Typing SVG" />

[![MIT](https://img.shields.io/badge/license-MIT-0f766e.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/language-JavaScript-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Stars](https://img.shields.io/github/stars/CyberLoop-dev/sourcemap-inspector?style=flat)](https://github.com/CyberLoop-dev/sourcemap-inspector/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/CyberLoop-dev/sourcemap-inspector)](https://github.com/CyberLoop-dev/sourcemap-inspector/commits/main)

**A local inspector for JavaScript source-map quality.**

<img src="assets/illustration.svg" alt="Source Map Inspector illustration" width="560" />

</div>

## 🧭 Overview

Source Map Inspector reads a Source Map v3 JSON file and checks mapping segments, source and name indexes, and sourcesContent coverage. It makes no network requests and never uploads the map.

## ✨ Features

- 🧭 Validates Source Map v3 structure.
- 🔢 Decodes Base64 VLQ mapping segments and checks indexes.
- 📂 Reports missing sourcesContent entries and duplicate sources.
- 📊 Summarizes sources, names, generated lines, and segments.
- 🔒 Reads local files only; no telemetry or network calls.

## 🖥️ Demo

```bash
npm start -- examples/app.js.map
```
The included sample map is intentionally small and valid; try removing a mapping field to see a validation issue.

## 🚀 Quick Start

```bash
git clone https://github.com/CyberLoop-dev/sourcemap-inspector.git
cd sourcemap-inspector
npm install
npm start -- examples/app.js.map
```

## 🧱 Tech Stack

- 🟨 Node.js 18+
- 📦 Zero runtime dependencies
- 🧪 Node built-in test runner

## 🗂️ Folder Structure

```text
sourcemap-inspector/
├── main.js
├── package.json
├── examples/app.js.map
├── test/main.test.js
├── assets/illustration.svg
├── .gitignore
└── README.md
```

## 🛣️ Roadmap

- [x] Source Map v3 structure and VLQ checks
- [x] JSON and text reports
- [ ] Optional source path existence checks

## 🤝 Contributing

Issues and pull requests are welcome. Please include a clear reproduction or sample input and keep changes focused.

## 📄 License

Released under the [MIT License](LICENSE).

<div align="center">

![Footer](https://capsule-render.vercel.app/api?type=waving&color=0:#0f766e,100:#7c2d12&height=100&section=footer)

</div>

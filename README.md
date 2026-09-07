# Portfolio & CMS Engine

> Production-grade developer portfolio and headless CMS console engineered with **Go (Golang)**, **Clean Architecture**, **SQLite**, and **React (Vite + TypeScript + Tailwind CSS)**.

---

## 🏛️ Architecture Highlights

- **Clean / Hexagonal Architecture**: Strict inward dependency flow (`domain` -> `usecase` -> `repository` / `handler`) in Go.
- **Swiss Engineering Precision UI**: Zero border-radius (`rounded-none`), 1px hairline dividers, and tabular typography powered by Geist Sans & JetBrains Mono.
- **Interactive Backend Telemetry & Webhook Simulator**: Built-in system health diagnostics and real-time HMAC signature verification engine inspired by production systems (`Hookbridge`, `Guardrail`, `Notihub`, `NontonPlus V2`).
- **Single Binary Packaging**: Fully standalone compiled executable using Go `//go:embed` to serve the embedded React frontend with an in-memory/file SQLite database (< 25MB RAM).

---

## 📚 Documentation & Specifications

- 📄 **[Product Requirements Document (PRD)](PRD.md)** — Complete product specs, user personas, STAR case study breakdowns, data models, and API definitions.
- ⚙️ **[Project Conventions & Guidelines (CLAUDE.md)](CLAUDE.md)** — Engineering rules, directory structures, testing standards, and development workflows.

---

## 🚀 Planned Tech Stack

| Component | Technology |
|---|---|
| **Backend Engine** | Go 1.23+ / Go Chi Router |
| **Architecture** | Clean Architecture (Hexagonal) |
| **Database** | SQLite (CGO-free via `modernc.org/sqlite`) |
| **Frontend Framework** | React 18/19 + Vite + TypeScript |
| **Styling & Fonts** | Tailwind CSS + Geist Sans & JetBrains Mono |
| **Distribution** | Single Executable Binary (`go:embed`) |

# 🛠️ Terminal & Development Plugins Installation Guide

This guide covers installation of recommended plugins for your development environment.

---

## Quick Reference (Keyword Mapping)

| Keyword | Plugin       | Use-case                    | Status |
| ------- | ------------ | --------------------------- | ------ |
| **ZLI** | Zellij       | Terminal multiplexer        | ✅     |
| **ACI** | Asciinema    | Terminal recording/playback | ✅     |
| **PTY** | opencode-pty | PTY for AI agents           | ✅     |
| **GHD** | gh-dash      | GitHub dashboard            | ✅     |
| **GHS** | gh-sync      | GitHub repo sync            | ✅     |
| **MON** | monocle      | Fuzzy file finder           | ✅     |
| **ROM** | room         | Tab switcher                | ✅     |
| **ZST** | zjstatus     | Custom status bar           | ✅     |

---

## Installed Stack ✅

| Tool           | Version  | Keyword | Command to Install             |
| -------------- | -------- | ------- | ------------------------------ |
| Zellij         | 0.44.1   | ZLI     | `brew install zellij`          |
| Asciinema      | 2.4.0    | ACI     | `brew install asciinema`       |
| GitHub CLI     | 2.91.0   | —       | `brew install gh`              |
| gh-dash        | 4.23.2   | GHD     | `gh extension install dlvhdr/gh-dash` |
| gh-sync        | 0.4.1    | GHS     | `gh extension install him0/gh-sync` |
| opencode-pty   | 0.3.4    | PTY     | `npm install -g opencode-pty` |
| Monocle        | latest   | MON     | `zellij plugin -- <url>`       |
| Room           | v1.2.1   | ROM     | `zellij plugin -- <url>`       |
| Zjstatus       | v0.22.0  | ZST     | `zellij plugin -- <url>`       |
| asciinema-player | 3.6.3 | ACI     | `npm install -g asciinema-player` |

---

## 1. Zellij — Terminal Workspace

### Install Zellij

```bash
# macOS
brew install zellij

# Linux (Cargo)
cargo install zellij

# Arch
pacman -S zellij

# Fedora
dnf install zellij
```

### Install Plugins

Popular plugins (wasm files):

```bash
# Monocle - Fuzzy file finder
~/.local/bin/zellij plugin -- https://github.com/imsnif/monocle/releases/download/v0.3.0/monocle.wasm

# Room - Quick tab switching
~/.local/bin/zellij plugin -- https://github.com/rvcas/room/releases/download/v1.0.0/room.wasm

# Zjstatus - Custom status bar
~/.local/bin/zellij plugin -- https://github.com/dj95/zjstatus/releases/download/v1.0.0/zjstatus.wasm

# File Picker
~/.local/bin/zellij plugin -- https://zellij.dev/plugins/filepicker.wasm

# Session Manager
~/.local/bin/zellij plugin -- https://zellij.dev/plugins/session-manager.wasm
```

### Configure Plugins

Edit `~/.config/zellij/config.kdl`:

```kdl
load_plugins {
    "file:~/.config/zellij/plugins/monocle.wasm"
    "file:~/.config/zellij/plugins/room.wasm"
    "file:~/.config/zellij/plugins/zjstatus.wasm"
}
```

---

## 2. Asciinema — Terminal Recording

### Install CLI

```bash
# macOS
brew install asciinema

# Linux
pip install asciinema

# Or from source
cargo install asciinema
```

### Install Web Player (NPM)

```bash
# Project installation
npm install asciinema-player@3.6.3

# Or standalone (copy to your assets)
# Download from: https://github.com/asciinema/asciinema-player/releases
```

### Usage

```bash
# Record
asciinema rec demo.cast

# Play
asciinema play demo.cast

# Embed in HTML
<script src="asciinema-player.min.js"></script>
<link rel="stylesheet" asciinema-player.css>
<asciinema-player src="demo.cast"></asciinema-player>
```

---

## 3. opencode-pty

### Installation

```bash
# Install from npm
npm install -g opencode-pty

# Check available
opencode --version
```

### Usage

```bash
# Start opencode with PTY
opencode --pty

# Or for persistent sessions
opencode attach
```

---

## 4. GitHub CLI Extensions

### Install gh CLI

```bash
# macOS
brew install gh

# Linux
# See: https://github.com/cli/cli#installation
```

### Install Extensions

```bash
# 1. gh-dash — Dashboard
gh extension install dlvhdr/gh-dash

# 2. gh-sync — Sync repos
gh extension install him0/gh-sync

# 3. gh-sweep — Auto-merge
gh extension install mgree/ghr-sweep

# 4. gh-todos — Issue tracking
gh extension install bh1xu/ghtodos

# 5. gh-open — Open in browser
gh extension install homeport/gh-open
```

### Useful gh Commands

```bash
# Authenticate
gh auth login

# Create repo
gh repo create my-project --public --clone

# List repos
gh repo list

# Create PR
gh pr create --title "Fix bug" --body "Description"

# View PRs
gh pr list

# Dashboard (GHD)
gh dash
```

---

## Quick Install Script

```bash
#!/bin/bash
set -e

echo "Installing Zellij..."
brew install zellij

echo "Installing Asciinema..."
brew install asciinema

echo "Installing GitHub CLI..."
brew install gh

echo "Installing opencode-pty..."
npm install -g opencode-pty

echo "Installing gh extensions..."
gh extension install dlvhdr/gh-dash
gh extension install him0/gh-sync

echo "Installing Zellij plugins..."
~/.local/bin/zellij plugin -- https://github.com/imsnif/monocle/releases/download/latest/monocle.wasm
~/.local/bin/zellij plugin -- https://github.com/rvcas/room/releases/download/latest/room.wasm
~/.local/bin/zellij plugin -- https://github.com/dj95/zjstatus/releases/download/latest/zjstatus.wasm

echo "Installing Asciinema web player..."
npm install -g asciinema-player@3.6.3

echo "✅ All plugins installed!"
```

---

## Verify Installation

```bash
# Check versions
zellij --version          # ZLI
asciinema --version       # ACI
gh --version              # GHD/GHS
opencode --version        # PTY
npm list -g asciinema-player  # ACI

# List installed plugins
ls ~/.config/zellij/plugins/
```

---

## Next Steps

- [x] Install Zellij: `brew install zellij` ✅
- [x] Install Asciinema: `brew install asciinema` ✅
- [x] Install GitHub CLI: `brew install gh` ✅
- [x] Configure gh: `gh auth login` ✅
- [x] Install gh extensions ✅
- [x] Install Zellij plugins (MON, ROM, ZST) ✅
- [x] Install asciinema-player ✅
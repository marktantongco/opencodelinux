---
name: wave-terminal
description: Configure Wave Terminal with advanced memory optimization, performance tweaks, startup hacks, and management. Covers settings.json tuning, Electron/Chromium flags, durable session config, themes, and widgets.

expects:
- key: config
  type: string
  description: Configuration or settings to apply
- key: environment
  type: string
  description: Target environment
  default: production
provides:
- key: status
  type: string
  description: Operation status or result
- key: deployment_url
  type: url
  description: URL of the deployed resource
---

# Wave Terminal: Configuration & Memory Optimization

## Overview
Wave Terminal (`~/.config/waveterm/`) is an open-source, Electron-based terminal. Its config uses flat `namespace:key` JSON. Memory optimization focuses on reducing Chromium's footprint: GPU acceleration, tab cache, scrollback buffer, and background processes.

## Config File Location
- **Main config:** `~/.config/waveterm/settings.json`
- **Themes:** `~/.config/waveterm/termthemes/`
- **Widgets:** `~/.config/waveterm/widgets/`
- **Backgrounds:** `~/.config/waveterm/presets/`

## Memory Optimization Settings

### Heavy Hitters (Biggest RAM Impact)

| Key | Recommended | Default | Why |
|-----|-------------|---------|-----|
| `window:disablehardwareacceleration` | `true` | `false` | Disables Chromium GPU process — saves 200-500MB on integrated GPUs |
| `window:maxtabcachesize` | `3-5` | `10` | Less cached tab state in RAM |
| `term:scrollback` | `3000-5000` | `10000` | Smaller scrollback buffer saves ~50MB per terminal |
| `window:reducedmotion` | `true` | `false` | Disables CSS animations — reduces render thread load |
| `editor:minimapenabled` | `false` | `true` | Disables Monaco editor minimap canvas |

### Medium Impact

| Key | Recommended | Default | Why |
|-----|-------------|---------|-----|
| `window:transparent` | `false` | `false` | Transparency requires GPU composite layers |
| `window:blur` | `false` | `false` | Blur effects use extra GPU passes |
| `telemetry:enabled` | `false` | `true` | Stops background HTTP requests |
| `autoupdate:intervalms` | `7200000` | `3600000` | Halves background update checks |
| `app:showoverlayblocknums` | `false` | `true` | Reduces overlay rendering |
| `term:disablewebgl` | `false` | `false` | Keep enabled — xterm.js uses WebGL for fast rendering |

### Low Impact / Quality of Life

| Key | Recommended | Why |
|-----|-------------|-----|
| `app:hideaibutton` | `false` | Shows AI button in UI (set `true` to hide for memory) |
| `app:confirmquit` | `false` | No quit confirmation dialog |
| `app:tabbar` | `"top"` | Horizontal tab bar |
| `term:copyonselect` | `true` | Auto-copy on selection |
| `term:allowbracketedpaste` | `true` | Better paste handling |
| `term:fontfamily` | `"JetBrains Mono"` | Efficient rendering font |
| `window:tilegapsize` | `2` | Tighter block layout |

## AI Configuration

Wave Terminal has a built-in AI panel with configurable modes.

### File Structure
- **AI modes:** `~/.config/waveterm/waveai/*.json` — each file is an AI mode (filename = mode ID)
- **Default mode:** Set via `waveai:defaultmode` in `settings.json`
- **Visibility:** Set `app:hideaibutton: false` to show AI panel in UI

### AI Mode Config Format (`AIModeConfigType`)
```json
{
  "display:name": "My Mode",
  "display:order": 1,
  "display:description": "What this mode does",
  "display:icon": "sparkles | zap | dollar-sign | brain | globe",
  "ai:provider": "openrouter | openai | google | anthropic | azure | wave | custom",
  "ai:apitype": "openai-chat | openai-responses | google-gemini",
  "ai:model": "model-name-here",
  "ai:thinkinglevel": "low | medium | high",
  "ai:verbosity": "low | medium | high",
  "ai:endpoint": "https://api.example.com/v1",
  "ai:apitoken": "sk-...",
  "ai:capabilities": ["tools", "images", "pdfs"],
  "ai:switchcompat": ["other-mode-id-1", "other-mode-id-2"]
}
```

### Supported Providers
| Provider | `ai:provider` | `ai:apitype` | Endpoint |
|----------|---------------|-------------|----------|
| OpenRouter | `openrouter` | `openai-chat` | `https://openrouter.ai/api/v1` |
| OpenAI | `openai` | `openai-responses` | auto |
| Google Gemini | `google` | `google-gemini` | auto |
| Anthropic | `custom` | `openai-chat` | depends on proxy |
| Wave Cloud | `wave` | — | built-in |

### Secret Storage
- Put API key directly in `ai:apitoken` field, OR
- Use Wave's secret manager: `wsh setsecret <name>` then reference with `ai:apitokensecretname`

### Switching Modes
- `ai:switchcompat` lists compatible mode IDs the user can switch to mid-conversation
- Set `waveai:defaultmode` in settings.json to your preferred default mode ID

## Startup Performance Tweaks

### Electron Flags (via CLI or desktop entry)
```bash
# Disable Chromium sandbox (for container/CI environments)
wave --no-sandbox

# Disable GPU shader disk cache
wave --disable-gpu-shader-disk-cache

# Disable Chromium features that consume memory
wave --disable-features=TranslateUI,ChromeWhatsNewUI
```

### Environment Variables
```bash
# Reduce Chromium shared memory
export ELECTRON_EXTRA_LAUNCH_ARGS="--disable-gpu-shader-disk-cache --max_old_space_size=4096"
```

## Durable Sessions (Memory-Safe Config)
Durable sessions persist terminal state across restarts. For memory-constrained setups:
```json
{
  "term:durable": false
}
```
Set to `false` to prevent session state accumulation.

## Management Commands
```bash
# Open config in built-in editor
wsh editconfig

# List all settings
wsh getconfig

# Set a specific value
wsh setconfig "term:fontsize" 14

# Open Wave config directory
wsh opendir
```

## Memory Monitoring
```bash
# Check Wave process memory
ps aux | grep wave | grep -v grep

# Check resident memory
ps -eo pid,comm,rss | grep wave

# Detailed Electron memory
cat /proc/$(pgrep -f wave | head -1)/status | grep -E "VmRSS|VmSize"
```

## Reset to Defaults
```bash
# Remove user config to reset
rm ~/.config/waveterm/settings.json
# Or selectively reset a key
wsh setconfig "window:disablehardwareacceleration" false
```

---

## Related: sys-tune (System Tuning Manager)

`sys-tune` is the companion CLI for system-level tuning, optimization, and memory management.

```bash
# Quick integration with Wave
sys-tune status                  # Shows Wave memory alongside system health
sys-tune doctor                  # Diagnoses system (incl. Wave GPU settings)
sys-tune cache flush             # Clears Wave caches + system caches
sys-tune profile apply desktop   # Balanced kernel params for desktop use
sys-tune browser optimize all    # Apply memory flags to all browsers
```

### Key Commands

| Command | What it does for Wave |
|---------|----------------------|
| `sys-tune status` | Shows Wave RSS, kernel params, memory health |
| `sys-tune auto` | Auto-selects profile based on available RAM |
| `sys-tune cache flush` | Clears Wave + npm + pip + system caches |
| `sys-tune doctor` | Checks Wave GPU setting, swappiness, OOM config |

### Profiles

| Profile | swappiness | cache_pressure | Use Case |
|---------|-----------|---------------|----------|
| `desktop` | 30 | 100 | Balanced — good with Wave open |
| `maxperf` | 10 | 50 | No Wave, need max speed |
| `memory` | 60 | 200 | Wave + many apps, low RAM |
| `server` | 10 | 200 | No GUI, remote machine |

### Installation
```bash
# sys-tune lives at ~/.local/bin/sys-tune
# Aliases: tune, tune-st, tune-dr, tune-auto, tune-mon, ...
# Bash completion included in ~/.bashrc
```

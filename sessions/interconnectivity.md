# Session: KDE Connect / Avahi / Firewall Interconnectivity

Date: 2026-05-21

## Goal
Configure KDE Connect persistent connection between Ubuntu 22.04 (GNOME 42.9) and HONOR 200 Pro smartphone.

## Architecture
- **KDE Connect daemon** (`kdeconnectd`, v21.12.3): runs via D-Bus activation (activatable name `org.kde.kdeconnect`), auto-starts on demand
- **Avahi** (mDNS/DNS-SD): provides zero-config device discovery on LAN
- **UFW firewall**: controls access to KDE Connect ports 1714-1764

## What's Configured

### Avahi (mDNS)
- Service: `avahi-daemon` — **enabled on boot, currently running**
- Socket: `avahi-daemon.socket` — active
- Provides automatic device discovery on local network

### Firewall (UFW)
- Status: **active** (was inactive)
- Rules: KDE Connect ports 1714-1764 TCP+UDP (IPv4 + IPv6), SSH port 22
- SSH preserved to avoid locking out remote access

### KDE Connect Daemon
- PID: auto-started via D-Bus activation
- D-Bus registration: `(true,)` — properly registered
- Memory: ~55 MB RSS, 0.7% of 7.6 GB RAM

### KDE Connect Config (`~/.config/kdeconnect/`)
| File | Purpose |
|------|---------|
| `certificate.pem` | Local device certificate (since Jul 2025) |
| `privateKey.pem` | Local device private key (since Jul 2025) |
| `trusted_devices` | Trusted device ID `a7ba9211a40749648b2c2e816abe1c07` in INI section format |
| `config` | General config: `autoReconnect=true`, connection timeout 30s |
| `a7ba9211a40749648b2c2e816abe1c07/` | HONOR 200 Pro device plugin data (`kdeconnect_runcommand`) |

### Autostart
- File: `~/.config/autostart/org.kde.kdeconnect.daemon.desktop`
- Exec: `/usr/lib/x86_64-linux-gnu/libexec/kdeconnectd`
- Delay: 5 seconds after GNOME Shell login
- X-GNOME-Autostart-enabled: true

## Current Limitations
- HONOR 200 Pro **not currently reachable** (not on same WiFi network; `kdeconnect-cli -a` shows 0 available)
- trusted_devices originally contained the phone's certificate (lost when file was rewritten); only device ID preserved
- When phone reconnects to LAN, it will re-discover via mDNS; may need manual re-pairing if certificate mismatch

## Next Steps (when phone is on same network)
1. Refresh: `kdeconnect-cli --refresh`
2. Check reachable: `kdeconnect-cli -a`
3. If re-pairing needed: `kdeconnect-cli --pair -d a7ba9211a40749648b2c2e816abe1c07` (accept on phone)
4. Test ping: `kdeconnect-cli -d a7ba9211a40749648b2c2e816abe1c07 --ping`
5. Test notification sync: `kdeconnect-cli -d a7ba9211a40749648b2c2e816abe1c07 --list-notifications`

## Key Commands Reference
```bash
# List all paired devices
kdeconnect-cli -l

# List reachable (online) paired devices  
kdeconnect-cli -a

# Re-discover network devices
kdeconnect-cli --refresh

# Send ping to device
kdeconnect-cli -d <device-id> --ping

# Share file/URL
kdeconnect-cli -d <device-id> --share /path/to/file
```

## Ports Used
- **TCP 1714-1764**: Encrypted data transfer (files, clipboard, notifications)
- **UDP 1714-1764**: Device discovery and presence announcements
- **mDNS 5353 (UDP)**: Avahi discovery (standard mDNS port)

# OWL-AGENT Installer — Session Record

## Session Date
2026-05-20

## Project Root
/home/x1/Documents/owl-agent-installer

## GitHub Repository
- URL: https://github.com/marktantongco/owl-agent-installer
- Pages: https://marktantongco.github.io/owl-agent-installer/
- Branch: main
- Commit: 21d8462

## Architecture Summary
Three-layer AI infrastructure deployment system:
1. **ccproxy-api** (port 8000) — Entry point, OAuth management, format translation, credential rotation
2. **OrcaFlow** (port 20130) — Provider routing, 209 models, 36 providers, per-provider proxy config
3. **9Router** (port 20129) — Port forwarding, proxy pool management (60000-60002)

## Key Design Decisions
- Zero global proxy (HTTP_PROXY, HTTPS_PROXY, ALL_PROXY unset)
- Per-provider routing via proxy-routing.json
- Free-first cost optimization strategy
- 3-tier failover: OrcaFlow → ccproxy-api → Free Proxy
- ccproxy-api replaces Antigravity (superior: plugins, WebSocket, credential rotation)
- OrcaFlow + 9Router kept (complementary strengths, not redundant)

## Files Created/Modified
| File | Purpose | Lines |
|------|---------|-------|
| owl-agent-installer.sh | Main installer | 1437 |
| ubuntu-addon.sh | System dependencies | 557 |
| podman/setup-9router-podman.sh | Podman containers | 598 |
| core/install-orcaflow-ubuntu.sh | OrcaFlow installer | 659 |
| core/proxy-pool-manager.sh | Proxy automation | 377 |
| core/setup-china-proxy.sh | China proxy setup | 81 |
| core/setup-synergy-v5.3.sh | v5.3 synergy upgrade | 586 |
| core/setup-ccproxy-v5.4.sh | v5.4 ccproxy integration | 399 |
| core/proxy-routing.json | Per-provider routing (v5.4) | 202 |
| core/cost-routing.json | Cost-aware routing | 37 |
| index.html | Neo-brutalism landing page | ~800 |
| README.md | Comprehensive guide | ~300 |
| docs/AI-AGENT-SUPERPOWERS.md | 11 agent capabilities | ~200 |
| docs/DEEP-ANALYSIS-v5.4.md | Full comparative analysis | 640 |
| docs/ADVANCED-OPTIMIZATION-v5.3.md | v5.3 optimization guide | 476 |
| docs/QUICK-START-v5.3.md | Quick reference | 74 |
| .github/workflows/deploy.yml | GitHub Pages CI/CD | ~30 |

## AI Agent Superpowers Defined
| ID | Name | Capability |
|----|------|------------|
| CTX-01 | Context Compressor | Compress history, preserve decisions |
| MEM-01 | Persistent Memory | Session continuity, crash recovery |
| BRW-01 | Browser Automation | OAuth flows, web testing |
| DEP-01 | Deployment Manager | Service orchestration, health checks |
| SUB-01 | Subagent Orchestration | Parallel task execution |
| PRX-01 | Proxy Intelligence | Provider-aware proxy selection |
| CST-01 | Cost Optimization | Free-first routing strategy |
| HLT-01 | Health Monitoring | Auto-recovery, cascade failover |
| FMT-01 | Format Translation | Anthropic ↔ OpenAI conversion |
| CRD-01 | Credential Rotation | Multi-account OAuth management |
| MDL-01 | Model Mapping | Model name alias resolution |

## Current System State
- OrcaFlow: Running on port 20130 (systemd user service)
- 9Proxy: Running (systemd system service)
- 9Router: Running in Podman container (port 20129)
- Proxy Ambassador: Running in Podman (ports 60000-60002)
- ccproxy-api: Config file created, not yet started (needs OAuth setup)
- Python: 3.10.12
- Node.js: 22.22.2
- OS: Ubuntu 22.04.5 LTS

## Bottleneck Analysis
The bottleneck is the FREE PROXY CHAIN, not the routers:
- Direct route: 300-1500ms
- Via free proxy: 1640-7040ms (5-10x slower)
- Reliability: 60-80% (vs 99.9% direct)
- Recommendation: Replace free proxies with paid residential proxies

## Hidden Factors Identified
1. OAuth/proxy rotation mismatch (auth endpoints must be direct)
2. WebSocket through proxy chain (free proxies don't support WS upgrade)
3. Credential state loss on restart (persist to DuckDB)
4. Model mapping collision (use provider namespace prefix)
5. Prometheus port conflict (use 9091 instead of 9090)
6. DuckDB file locking (separate files per instance)
7. CORS conflicts (align policies across services)
8. Python version compatibility (check pyproject.toml)
9. systemd resource limits (set MemoryMax per service)
10. Log rotation (/tmp cleared on reboot, use persistent dir)

## Next Steps (Not Yet Done)
1. Install ccproxy-api: `./core/setup-ccproxy-v5.4.sh`
2. Add OAuth accounts: `ccproxy auth login claude/codex/copilot`
3. Start ccproxy service: `systemctl --user start ccproxy.service`
4. Update OpenCode config: `ANTHROPIC_BASE_URL=http://127.0.0.1:8000/claude`
5. Replace free proxies with paid residential proxies (10x latency improvement)

## Backup Location
/home/x1/Documents/owl-agent-installer/.backup/

## Release Archives
- release/owl-agent-v5.2.tar.gz (96K)
- release/owl-agent-v5.3.tar.gz (43K)

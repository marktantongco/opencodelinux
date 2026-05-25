import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");

const server = new McpServer({
  name: "mcp-security-scanner",
  version: "1.0.0",
});

interface VulnerabilityPattern {
  name: string;
  severity: "critical" | "high" | "medium" | "low";
  pattern: RegExp;
  description: string;
  remediation: string;
}

const PATTERNS: VulnerabilityPattern[] = [
  { name: "hardcoded-api-key", severity: "critical", pattern: /(api[_-]?key|apikey)\s*[=:]\s*["'][A-Za-z0-9]{16,}["']/gi, description: "Hardcoded API key detected", remediation: "Move to environment variable or secrets manager" },
  { name: "hardcoded-password", severity: "critical", pattern: /(password|passwd|pwd)\s*[=:]\s*["'][^"']{4,}["']/gi, description: "Hardcoded password detected", remediation: "Use environment variables or a secrets manager" },
  { name: "hardcoded-secret", severity: "high", pattern: /(secret|token|access_key|private_key)\s*[=:]\s*["'][A-Za-z0-9+/=]{16,}["']/gi, description: "Hardcoded secret/token detected", remediation: "Move to environment variable or .env file" },
  { name: "sql-injection-risk", severity: "high", pattern: /(query|execute|raw)\s*\(\s*["'].*\$\{.*\}/gi, description: "Potential SQL injection via string interpolation", remediation: "Use parameterized queries or prepared statements" },
  { name: "eval-usage", severity: "high", pattern: /\beval\s*\(/gi, description: "Use of eval() detected", remediation: "Avoid eval(); use safer alternatives like JSON.parse()" },
  { name: "exec-usage", severity: "high", pattern: /\bexec\s*\(/gi, description: "Use of exec() detected", remediation: "Use spawn() with explicit arguments instead of exec()" },
  { name: "console-log-sensitive", severity: "medium", pattern: /console\.log\s*\(.*(?:password|secret|token|key|auth)/gi, description: "Sensitive data may be logged", remediation: "Remove sensitive data from console.log statements" },
  { name: "http-not-https", severity: "medium", pattern: /http:\/\/(?!localhost)[a-zA-Z0-9.-]+/g, description: "Non-HTTPS URL detected", remediation: "Use HTTPS for all external URLs" },
  { name: "todo-fixme", severity: "low", pattern: /\b(TODO|FIXME|HACK|XXX|BUG)\b/gi, description: "Unresolved code marker detected", remediation: "Address or track in issue tracker" },
];

interface Finding {
  name: string;
  severity: string;
  line: number;
  description: string;
  remediation: string;
  snippet: string;
}

function scanCode(code: string, severityThreshold: string): Finding[] {
  const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const threshold = severityOrder[severityThreshold] ?? 3;
  const findings: Finding[] = [];
  const lines = code.split("\n");

  for (const pattern of PATTERNS) {
    if (severityOrder[pattern.severity] > threshold) continue;
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(pattern.pattern);
      if (match) {
        const start = Math.max(0, i - 1);
        const end = Math.min(lines.length, i + 2);
        findings.push({
          name: pattern.name,
          severity: pattern.severity,
          line: i + 1,
          description: pattern.description,
          remediation: pattern.remediation,
          snippet: lines.slice(start, end).join("\n"),
        });
      }
    }
  }

  findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  return findings;
}

server.tool(
  "scan_code",
  "Scan code content for security vulnerabilities, secrets, and misconfigurations",
  {
    code: z.string().describe("The code content to scan"),
    file_path: z.string().optional().describe("Optional file path for context"),
    severity_threshold: z.enum(["critical", "high", "medium", "low"]).default("low").describe("Minimum severity level to report"),
  },
  async ({ code, file_path, severity_threshold }) => {
    const findings = scanCode(code, severity_threshold);
    const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          file: file_path || "unknown",
          total_findings: findings.length,
          by_severity: {
            critical: findings.filter((f) => f.severity === "critical").length,
            high: findings.filter((f) => f.severity === "high").length,
            medium: findings.filter((f) => f.severity === "medium").length,
            low: findings.filter((f) => f.severity === "low").length,
          },
          findings,
        }, null, 2),
      }],
    };
  }
);

server.tool(
  "scan_file",
  "Scan a file on disk for security vulnerabilities",
  {
    file_path: z.string().describe("Absolute path to the file to scan"),
    severity_threshold: z.enum(["critical", "high", "medium", "low"]).default("low").describe("Minimum severity level to report"),
  },
  async ({ file_path, severity_threshold }) => {
    try {
      const code = fs.readFileSync(file_path, "utf-8");
      const findings = scanCode(code, severity_threshold);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            file: file_path,
            total_findings: findings.length,
            by_severity: {
              critical: findings.filter((f) => f.severity === "critical").length,
              high: findings.filter((f) => f.severity === "high").length,
              medium: findings.filter((f) => f.severity === "medium").length,
              low: findings.filter((f) => f.severity === "low").length,
            },
            findings,
          }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `Error reading file: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  }
);

server.tool(
  "list_patterns",
  "List all security scan patterns and their severity levels",
  {},
  async () => {
    const patterns = PATTERNS.map((p) => ({
      name: p.name,
      severity: p.severity,
      description: p.description,
      remediation: p.remediation,
    }));
    return {
      content: [{ type: "text" as const, text: JSON.stringify(patterns, null, 2) }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);

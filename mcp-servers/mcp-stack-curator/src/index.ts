import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "mcp-stack-curator",
  version: "1.0.0",
});

const KNOWN_STACKS: Record<string, { name: string; tagline: string; servers: string[]; synergy: string[]; mismatches: string[] }> = {
  "agent-os": {
    name: "Agent OS",
    tagline: "Memory, orchestration, reasoning - the autonomous agent foundation",
    servers: ["memory", "sequential-thinking", "filesystem", "brave-search"],
    synergy: ["Remember (Memory) -> Reason (Thinking) -> Act (Filesystem) -> Verify (Search)"],
    mismatches: [],
  },
  "research-engine": {
    name: "Research Engine",
    tagline: "Deep research across web, academic, and code sources",
    servers: ["brave-search", "fetch", "arxiv", "memory"],
    synergy: ["Brave Search finds sources -> Fetch extracts full content", "Arxiv provides papers -> Memory indexes findings"],
    mismatches: [],
  },
  "fullstack-dev": {
    name: "Full-Stack Dev",
    tagline: "Code, database, deploy - the complete development pipeline",
    servers: ["github", "postgres", "filesystem", "sequential-thinking"],
    synergy: ["GitHub manages code -> Filesystem edits files -> Postgres manages data"],
    mismatches: ["Avoid Postgres and Supabase simultaneously"],
  },
  "creative-studio": {
    name: "Creative Studio",
    tagline: "From idea to visual - image generation meets design systems",
    servers: ["pictoflux-ai", "figma", "filesystem", "memory"],
    synergy: ["PictoFlux generates images -> Filesystem saves them", "Memory stores brand preferences -> consistent styles"],
    mismatches: [],
  },
  "security-audit": {
    name: "Security Audit",
    tagline: "Scan, analyze, report - comprehensive security review",
    servers: ["github", "filesystem", "sequential-thinking", "brave-search"],
    synergy: ["GitHub scans remote -> Filesystem scans local", "Brave Search finds CVEs -> Sequential Thinking assesses exploitability"],
    mismatches: [],
  },
};

server.tool(
  "recommend_stack",
  "Recommend an MCP server stack based on a use case description",
  {
    use_case: z.string().describe("Description of the use case or workflow"),
    max_servers: z.number().min(1).max(8).default(4).describe("Maximum number of servers in the stack"),
  },
  async ({ use_case, max_servers }) => {
    const useCaseLower = use_case.toLowerCase();
    const matches: string[] = [];

    if (useCaseLower.includes("research") || useCaseLower.includes("search") || useCaseLower.includes("academic")) matches.push("research-engine");
    if (useCaseLower.includes("agent") || useCaseLower.includes("autonomous") || useCaseLower.includes("orchestrat")) matches.push("agent-os");
    if (useCaseLower.includes("fullstack") || useCaseLower.includes("full-stack") || useCaseLower.includes("develop") || useCaseLower.includes("code")) matches.push("fullstack-dev");
    if (useCaseLower.includes("creative") || useCaseLower.includes("design") || useCaseLower.includes("image") || useCaseLower.includes("visual")) matches.push("creative-studio");
    if (useCaseLower.includes("security") || useCaseLower.includes("audit") || useCaseLower.includes("scan") || useCaseLower.includes("vulnerabilit")) matches.push("security-audit");

    if (matches.length === 0) matches.push("agent-os");

    const results = matches.slice(0, max_servers).map((id: string) => ({
      id,
      ...KNOWN_STACKS[id],
    }));

    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
    };
  }
);

server.tool(
  "validate_stack",
  "Validate an MCP server stack for compatibility and conflicts",
  {
    servers: z.array(z.string()).describe("List of MCP server names to validate together"),
  },
  async ({ servers }) => {
    const warnings: string[] = [];
    const conflicts: string[] = [];

    const hasPostgres = servers.some((s: string) => s.includes("postgres"));
    const hasSupabase = servers.some((s: string) => s.includes("supabase"));
    if (hasPostgres && hasSupabase) conflicts.push("Postgres and Supabase should not run simultaneously (database access conflict)");

    const hasMultipleSearch = servers.filter((s: string) => s.includes("search")).length > 1;
    if (hasMultipleSearch) warnings.push("Multiple search servers may cause redundant queries");

    const hasMultipleFileWrite = servers.filter((s: string) => s.includes("filesystem") || s.includes("file-write")).length > 1;
    if (hasMultipleFileWrite) warnings.push("Multiple file-write servers on same directory may conflict");

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          valid: conflicts.length === 0,
          conflicts,
          warnings,
          servers,
        }, null, 2),
      }],
    };
  }
);

server.tool(
  "list_stacks",
  "List all available pre-built MCP server stacks",
  {},
  async () => {
    const stacks = Object.entries(KNOWN_STACKS).map(([id, stack]) => ({
      id,
      name: stack.name,
      tagline: stack.tagline,
      server_count: stack.servers.length,
    }));
    return {
      content: [{ type: "text" as const, text: JSON.stringify(stacks, null, 2) }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);

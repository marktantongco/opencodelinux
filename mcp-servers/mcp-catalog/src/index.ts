import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "mcp-catalog",
  version: "1.0.0",
});

interface MCPServer {
  name: string;
  package_name: string;
  category: string;
  description: string;
  free: boolean;
  unlimited: boolean;
  rating: number;
  downloads: number;
}

const REGISTRY: MCPServer[] = [
  { name: "Sequential Thinking", package_name: "@modelcontextprotocol/server-sequential-thinking", category: "Reasoning", description: "Structured step-by-step reasoning for complex problem decomposition", free: true, unlimited: true, rating: 4.6, downloads: 156000 },
  { name: "Memory", package_name: "@modelcontextprotocol/server-memory", category: "Knowledge", description: "Knowledge graph-based persistent memory for contextual information", free: true, unlimited: true, rating: 4.6, downloads: 178000 },
  { name: "Filesystem", package_name: "@modelcontextprotocol/server-filesystem", category: "File Operations", description: "Secure file system access for reading, writing, and managing files", free: true, unlimited: true, rating: 4.8, downloads: 231000 },
  { name: "Brave Search", package_name: "@modelcontextprotocol/server-brave-search", category: "Web Search", description: "Web search via Brave Search API with result summarization", free: true, unlimited: false, rating: 4.5, downloads: 182000 },
  { name: "Fetch", package_name: "@modelcontextprotocol/server-fetch", category: "Web Scraping", description: "HTTP client for fetching web pages and API endpoints", free: true, unlimited: true, rating: 4.7, downloads: 215000 },
  { name: "GitHub", package_name: "@modelcontextprotocol/server-github", category: "DevOps", description: "GitHub API integration for repos, issues, PRs, and code search", free: true, unlimited: true, rating: 4.7, downloads: 205000 },
  { name: "Postgres", package_name: "@modelcontextprotocol/server-postgres", category: "Database", description: "PostgreSQL database server with schema inspection and queries", free: true, unlimited: true, rating: 4.6, downloads: 197000 },
  { name: "Puppeteer", package_name: "@modelcontextprotocol/server-puppeteer", category: "Browser", description: "Headless browser automation for navigation and screenshots", free: true, unlimited: true, rating: 4.3, downloads: 148000 },
  { name: "Arxiv", package_name: "@modelcontextprotocol/server-arxiv", category: "Academic", description: "ArXiv preprint server integration for paper search", free: true, unlimited: true, rating: 4.2, downloads: 56000 },
  { name: "SQLite", package_name: "@modelcontextprotocol/server-sqlite", category: "Database", description: "SQLite database server for local file-based data storage", free: true, unlimited: true, rating: 4.5, downloads: 164000 },
  { name: "Slack", package_name: "@modelcontextprotocol/server-slack", category: "Communication", description: "Slack workspace integration for channels and messages", free: true, unlimited: false, rating: 4.4, downloads: 132000 },
  { name: "Podman", package_name: "mcp-server-docker", category: "DevOps", description: "Podman container engine (Docker-compatible API via podman.sock)", free: true, unlimited: true, rating: 4.2, downloads: 67000 },
  { name: "Vercel", package_name: "mcp-server-vercel", category: "Cloud", description: "Vercel platform integration for deployments and projects", free: true, unlimited: true, rating: 4.2, downloads: 58000 },
  { name: "MCP Search", package_name: "mcp-search", category: "Web Search", description: "DuckDuckGo HTML POST web search (local, no API key needed)", free: true, unlimited: true, rating: 4.0, downloads: 1200 },
  { name: "PictoFlux AI", package_name: "pictoflux-ai", category: "Image Generation", description: "AI image generation via Pollinations.ai (free, no auth) with belt-backed editing", free: true, unlimited: true, rating: 4.1, downloads: 3400 },
  { name: "MCP Security Scanner", package_name: "mcp-security-scanner", category: "Security", description: "Regex-based static analysis for code vulnerabilities, secrets, and best practices", free: true, unlimited: true, rating: 4.0, downloads: 890 },
  { name: "MCP Catalog", package_name: "mcp-catalog", category: "Discovery", description: "Unified MCP server registry and stack curator (this server)", free: true, unlimited: true, rating: 4.0, downloads: 0 },
  { name: "Context7", package_name: "context7-mcp", category: "Documentation", description: "Documentation query service for programming libraries and frameworks", free: true, unlimited: true, rating: 4.3, downloads: 21000 },
  { name: "Podman Gateway 9Router", package_name: "9router-gateway", category: "AI Gateway", description: "Local Podman gateway for multi-model AI provider routing", free: true, unlimited: true, rating: 4.0, downloads: 500 },
];

server.tool(
  "search_servers",
  "Search the MCP server registry by keyword, category, or capability",
  {
    query: z.string().describe("Search keyword or capability"),
    category: z.string().optional().describe("Filter by category (e.g., Database, Web Search, DevOps)"),
    free_only: z.boolean().default(false).describe("Only show free servers"),
  },
  async ({ query, category, free_only }) => {
    const queryLower = query.toLowerCase();
    let results = REGISTRY.filter((s) => {
      const matchesQuery = queryLower.length === 0 ||
        s.name.toLowerCase().includes(queryLower) ||
        s.description.toLowerCase().includes(queryLower) ||
        s.category.toLowerCase().includes(queryLower) ||
        s.package_name.toLowerCase().includes(queryLower);
      const matchesCategory = !category || s.category.toLowerCase() === category.toLowerCase();
      const matchesFree = !free_only || s.free;
      return matchesQuery && matchesCategory && matchesFree;
    });
    results.sort((a, b) => b.downloads - a.downloads);
    return {
      content: [{ type: "text" as const, text: JSON.stringify({ count: results.length, servers: results }, null, 2) }],
    };
  }
);

server.tool(
  "get_server_details",
  "Get detailed information about a specific MCP server",
  {
    package_name: z.string().describe("NPM package name of the MCP server"),
  },
  async ({ package_name }) => {
    const found = REGISTRY.find((s) => s.package_name === package_name);
    if (!found) {
      return {
        content: [{ type: "text" as const, text: `Server not found: ${package_name}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text" as const, text: JSON.stringify(found, null, 2) }],
    };
  }
);

server.tool(
  "list_categories",
  "List all available MCP server categories",
  {},
  async () => {
    const categories = [...new Set(REGISTRY.map((s) => s.category))];
    const withCounts = categories.map((cat) => ({
      category: cat,
      count: REGISTRY.filter((s) => s.category === cat).length,
    }));
    return {
      content: [{ type: "text" as const, text: JSON.stringify(withCounts, null, 2) }],
    };
  }
);

interface MCPStack {
  name: string;
  tagline: string;
  servers: string[];
  synergy: string[];
  mismatches: string[];
}

const KNOWN_STACKS: Record<string, MCPStack> = {
  "agent-os": {
    name: "Agent OS",
    tagline: "Memory, orchestration, reasoning - the autonomous agent foundation",
    servers: ["memory", "sequential-thinking", "filesystem", "mcp-search"],
    synergy: ["Remember (Memory) -> Reason (Thinking) -> Act (Filesystem) -> Verify (MCP Search)"],
    mismatches: [],
  },
  "research-engine": {
    name: "Research Engine",
    tagline: "Deep research across web, academic, and code sources",
    servers: ["mcp-search", "fetch", "arxiv", "memory"],
    synergy: ["Search finds sources -> Fetch extracts full content", "Arxiv provides papers -> Memory indexes findings"],
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
    servers: ["pictoflux-ai", "filesystem", "memory"],
    synergy: ["PictoFlux generates images -> Filesystem saves them", "Memory stores brand preferences -> consistent styles"],
    mismatches: [],
  },
  "security-audit": {
    name: "Security Audit",
    tagline: "Scan, analyze, report - comprehensive security review",
    servers: ["github", "filesystem", "sequential-thinking", "mcp-search"],
    synergy: ["GitHub scans remote -> Filesystem scans local", "MCP Search finds CVEs -> Sequential Thinking assesses exploitability"],
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

    const hasPostgres = servers.some((s: string) => s.toLowerCase().includes("postgres"));
    const hasSupabase = servers.some((s: string) => s.toLowerCase().includes("supabase"));
    if (hasPostgres && hasSupabase) conflicts.push("Postgres and Supabase should not run simultaneously (database access conflict)");

    const hasMultipleSearch = servers.filter((s: string) => s.toLowerCase().includes("search")).length > 1;
    if (hasMultipleSearch) warnings.push("Multiple search servers may cause redundant queries");

    const hasMultipleFileWrite = servers.filter((s: string) => s.toLowerCase().includes("filesystem") || s.toLowerCase().includes("file-write")).length > 1;
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

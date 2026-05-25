import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "mcp-registry",
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
  { name: "Sequential Thinking", package_name: "@anthropic/mcp-server-sequential-thinking", category: "Reasoning", description: "Structured step-by-step reasoning for complex problem decomposition", free: true, unlimited: true, rating: 4.6, downloads: 156000 },
  { name: "Memory", package_name: "@anthropic/mcp-server-memory", category: "Knowledge", description: "Knowledge graph-based persistent memory for contextual information", free: true, unlimited: true, rating: 4.6, downloads: 178000 },
  { name: "Filesystem", package_name: "@anthropic/mcp-server-filesystem", category: "File Operations", description: "Secure file system access for reading, writing, and managing files", free: true, unlimited: true, rating: 4.8, downloads: 231000 },
  { name: "Brave Search", package_name: "@anthropic/mcp-server-brave-search", category: "Web Search", description: "Web search via Brave Search API with result summarization", free: true, unlimited: false, rating: 4.5, downloads: 182000 },
  { name: "Fetch", package_name: "@anthropic/mcp-server-fetch", category: "Web Scraping", description: "HTTP client for fetching web pages and API endpoints", free: true, unlimited: true, rating: 4.7, downloads: 215000 },
  { name: "GitHub", package_name: "@anthropic/mcp-server-github", category: "DevOps", description: "GitHub API integration for repos, issues, PRs, and code search", free: true, unlimited: true, rating: 4.7, downloads: 205000 },
  { name: "Postgres", package_name: "@anthropic/mcp-server-postgres", category: "Database", description: "PostgreSQL database server with schema inspection and queries", free: true, unlimited: true, rating: 4.6, downloads: 197000 },
  { name: "Puppeteer", package_name: "@anthropic/mcp-server-puppeteer", category: "Browser", description: "Headless browser automation for navigation and screenshots", free: true, unlimited: true, rating: 4.3, downloads: 148000 },
  { name: "Arxiv", package_name: "@anthropic/mcp-server-arxiv", category: "Academic", description: "ArXiv preprint server integration for paper search", free: true, unlimited: true, rating: 4.2, downloads: 56000 },
  { name: "SQLite", package_name: "@anthropic/mcp-server-sqlite", category: "Database", description: "SQLite database server for local file-based data storage", free: true, unlimited: true, rating: 4.5, downloads: 164000 },
  { name: "Slack", package_name: "@anthropic/mcp-server-slack", category: "Communication", description: "Slack workspace integration for channels and messages", free: true, unlimited: false, rating: 4.4, downloads: 132000 },
  { name: "Podman", package_name: "mcp-server-docker", category: "DevOps", description: "Podman container engine (Docker-compatible API via podman.sock)", free: true, unlimited: true, rating: 4.2, downloads: 67000 },
  { name: "Vercel", package_name: "mcp-server-vercel", category: "Cloud", description: "Vercel platform integration for deployments and projects", free: true, unlimited: true, rating: 4.2, downloads: 58000 },
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
      const matchesQuery = s.name.toLowerCase().includes(queryLower) ||
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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);

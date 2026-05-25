import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as cheerio from "cheerio";

const server = new McpServer({
  name: "mcp-search",
  version: "1.0.0",
});

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

async function searchWeb(query: string, numResults: number): Promise<SearchResult[]> {
  const res = await fetch("https://html.duckduckgo.com/html/", {
    method: "POST",
    body: new URLSearchParams({ q: query }),
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  const results: SearchResult[] = [];

  $(".result").each((_, el) => {
    if (results.length >= numResults) return false;
    const titleEl = $(el).find(".result__title a");
    const snippetEl = $(el).find(".result__snippet");
    const title = titleEl.text().trim();
    const href = titleEl.attr("href") || "";
    const snippet = snippetEl.text().trim();
    if (title && href) {
      const url = href.startsWith("http") ? href : `https://duckduckgo.com${href}`;
      results.push({ title, url, snippet });
    }
  });

  return results;
}

server.tool(
  "web_search",
  "Search the web using DuckDuckGo (free, no API key required). Returns results with titles, URLs, and snippets.",
  {
    query: z.string().describe("The search query"),
    num_results: z.number().min(1).max(20).default(8).describe("Number of results (max 20)"),
  },
  async ({ query, num_results }) => {
    try {
      const results = await searchWeb(query, num_results);
      return {
        content: [{ type: "text", text: JSON.stringify({
          status: "success",
          backend: "duckduckgo",
          results,
          query,
        }, null, 2) }],
      };
    } catch (e: any) {
      return {
        content: [{ type: "text", text: JSON.stringify({
          status: "error",
          message: e.message,
        }, null, 2) }],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);

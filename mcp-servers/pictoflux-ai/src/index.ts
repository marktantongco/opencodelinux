import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const server = new McpServer({
  name: "pictoflux-ai",
  version: "1.0.0",
});

function encodePrompt(s: string): string {
  return encodeURIComponent(s.replace(/\s+/g, " ").trim());
}

async function pollinationsGenerate(
  prompt: string,
  width = 1024,
  height = 1024,
  seed?: number,
): Promise<string> {
  let url = `https://image.pollinations.ai/prompt/${encodePrompt(prompt)}?width=${width}&height=${height}&nologo=true`;
  if (seed !== undefined) url += `&seed=${seed}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Pollinations API error: ${res.status} ${res.statusText}`);
  return res.url;
}

function belt(args: string): string {
  const out = execSync(`belt ${args} 2>&1; exit 0`, {
    encoding: "utf-8",
    timeout: 120000,
    maxBuffer: 50 * 1024 * 1024,
  });
  const errorLines = out.split("\n").filter(l => l.startsWith("✗") || l.startsWith("Error"));
  if (errorLines.length > 0) {
    const msg = errorLines.join("; ");
    if (/authentication required/i.test(msg)) {
      throw new Error(
        "inference.sh auth required. Run: belt login\n" +
        "Get a free API key: https://app.inference.sh/settings/keys\n" +
        "New accounts receive free credits."
      );
    }
    throw new Error(msg);
  }
  return out;
}

function beltImage(appId: string, input: Record<string, any>): { image: string } {
  const tmpFile = join(tmpdir(), `pictoflux-${Date.now()}.json`);
  try {
    writeFileSync(tmpFile, JSON.stringify(input));
    const output = belt(`app run ${appId} --input ${tmpFile}`);
    const jsonLine = output.split("\n").find(l => l.startsWith("{") || l.includes('"image"'));
    if (jsonLine) { try { return JSON.parse(jsonLine); } catch {} }
    const urlMatch = output.match(/https?:\/\/[^\s"]+\.(png|jpg|jpeg|webp)/i);
    if (urlMatch) return { image: urlMatch[0] };
    const fileMatch = output.match(/(\/[^\s]+\.(png|jpg|jpeg|webp))/i);
    if (fileMatch) return { image: fileMatch[1] };
    return { image: output.trim() };
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

const MODEL_MAP: Record<string, string> = {
  "flux-dev": "flux",
  "flux-schnell": "flux",
  "sd-xl": "flux",
  "dall-e-3": "flux",
};

server.tool(
  "generate_image",
  "Generate an AI image from a text prompt. Uses Pollinations.ai (free, no auth) or belt/inference.sh.",
  {
    prompt: z.string().describe("Text description of the image to generate"),
    width: z.number().min(256).max(2048).default(1024).describe("Image width"),
    height: z.number().min(256).max(2048).default(1024).describe("Image height"),
    seed: z.number().optional().describe("Random seed for reproducibility"),
  },
  async ({ prompt, width, height, seed }) => {
    try {
      const imageUrl = await pollinationsGenerate(prompt, width, height, seed);
      return {
        content: [{ type: "text", text: JSON.stringify({
          status: "success",
          backend: "pollinations.ai",
          image: imageUrl,
          prompt,
          width,
          height,
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

server.tool(
  "edit_image",
  "Edit an existing image using AI inpainting. Requires belt auth (inference.sh).",
  {
    image_path: z.string().describe("URL of the source image"),
    prompt: z.string().describe("Description of the edit"),
  },
  async ({ image_path, prompt }) => {
    try {
      const result = beltImage("pruna/p-image-edit", { prompt, images: [image_path] });
      return {
        content: [{ type: "text", text: JSON.stringify({
          status: "success",
          backend: "belt/inference.sh",
          model: "pruna/p-image-edit",
          image: result.image,
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

server.tool(
  "upscale_image",
  "Upscale an image using AI super-resolution. Requires belt auth (inference.sh).",
  {
    image_path: z.string().describe("URL of the source image"),
    scale_factor: z.enum(["2x", "4x"]).default("2x").describe("Upscale factor"),
  },
  async ({ image_path, scale_factor }) => {
    try {
      const result = beltImage("pruna/p-image-upscale", {
        image: image_path,
        upscale_factor: parseInt(scale_factor),
      });
      return {
        content: [{ type: "text", text: JSON.stringify({
          status: "success",
          backend: "belt/inference.sh",
          model: "pruna/p-image-upscale",
          image: result.image,
          scale_factor,
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

---
name: browser-use
description: Browser automation for web browsing, UI testing, data scraping, and any action a real user would perform in a browser. Use when you need to interact with websites programmatically.

expects:
- key: input
  type: string
  description: Source code or data to process
- key: options
  type: object
  description: Configuration options
provides:
- key: result
  type: string
  description: Processed output or generated code
- key: file_path
  type: path
  description: Path to any generated files
---

# browser-use

## context
Use this skill whenever you need to browse the web, test a UI, scrape data, or perform any action that a real user would do in a browser. It saves 80% of the tokens normally spent on raw Playwright scripts by letting you control the browser with natural language.

## instructions
1. Describe briefly the task (e.g., "Go to example.com, log in, click the dashboard link, and return the text of the first widget").
2. Invoke `browser-use` by prefixing your request with "Use browser to ...".
3. The skill will automatically launch a headful browser (or headless if configured) and execute your task.
4. It returns the result (HTML text, screenshots, or extracted data) without exposing the raw automation code.
5. If you need to do multi‑step flows, you can chain commands: "Now click the 'settings' icon and tell me what appears."

## constraints
- No manual Playwright code; always delegate to browser‑use.
- Browser sessions are isolated — state is not shared between commands unless explicitly saved.
- Always assume a 10‑second timeout for page loads; if a page is slow, wait but don't retry more than twice.

## examples
1. "Use browser to open https://news.ycombinator.com and return the top 5 story titles."  
2. "Use browser to log into our staging dashboard with email test@example.com, click on 'Reports', and tell me if the revenue chart is visible."
import { chromium } from "playwright";
import path from "path";

const OUT = "C:\\Users\\abhis\\AppData\\Local\\Temp\\claude\\e--autostacks-LibraryOS-sagar-LibraryOS-main\\33f27915-d221-4a3f-a014-97ddddcc8ae6\\scratchpad";
const BASE = "http://localhost:5173";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1040 } });
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));

  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.locator("input").first().fill("admin");
  await page.locator('input[type="password"]').fill("Admin@12345");
  await page.click('button:has-text("Sign in")');
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 8000 });
  await page.waitForTimeout(500);

  // Switch to dark mode to match the user's screenshots
  await page.click('button[role="switch"]');
  await page.waitForTimeout(400);

  // Backup & Data
  await page.goto(`${BASE}/settings?section=backup`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "settings-fix-01-backup.png") });

  // Integrations (short content)
  await page.goto(`${BASE}/settings?section=integrations`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "settings-fix-02-integrations.png") });

  // Audit logs, scroll main down to the very bottom
  await page.goto(`${BASE}/settings?section=audit`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, "settings-fix-03-audit-top.png") });
  const main = page.locator("main");
  await main.evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "settings-fix-04-audit-scrolled.png") });

  await browser.close();
  console.log("Done");
}

main().catch((e) => { console.error(e); process.exit(1); });

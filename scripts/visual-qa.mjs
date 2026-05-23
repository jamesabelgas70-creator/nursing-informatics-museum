import { mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "playwright-core";

const port = Number(process.env.QA_PORT ?? 3110);
const hostname = "127.0.0.1";
const chromePath =
  process.env.CHROME_PATH ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

await app.prepare();

const server = createServer((request, response) => {
  handle(request, response);
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(port, hostname, resolve);
});

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});

async function captureScreenshot(page, targetPath) {
  const session = await page.context().newCDPSession(page);
  const result = await session.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
    fromSurface: true
  });
  await writeFile(targetPath, Buffer.from(result.data, "base64"));
  await session.detach();
}

async function getCanvasMetrics(page) {
  return page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll("canvas"));
    let litPixels = 0;

    for (const canvas of canvases) {
      if (!(canvas instanceof HTMLCanvasElement) || canvas.width <= 0 || canvas.height <= 0) continue;
      const probe = document.createElement("canvas");
      probe.width = 80;
      probe.height = 80;
      const context = probe.getContext("2d", { willReadFrequently: true });
      if (!context) continue;

      let score = 0;
      context.drawImage(canvas, 0, 0, probe.width, probe.height);
      const pixels = context.getImageData(0, 0, probe.width, probe.height).data;
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index] + pixels[index + 1] + pixels[index + 2] + pixels[index + 3] > 35) {
          score += 1;
        }
      }
      litPixels = Math.max(litPixels, score);
    }

    return {
      canvasCount: canvases.length,
      litPixels,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2
    };
  });
}

try {
  await mkdir("qa", { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(`http://${hostname}:${port}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(4600);
  await captureScreenshot(page, path.join("qa", "desktop.png"));

  const desktopMetrics = await page.evaluate(() => {
    const sectionIds = ["hero", "pioneers", "timeline", "future", "credits"];

    return {
      title: document.title,
      hasMainHeadline:
        document.body.innerText.includes("Evolution of Nursing Informatics") ||
        document.body.innerText.includes("Museum of Nursing Informatics"),
      hasTimelineCopy: document.body.innerText.includes("Early Computer Use in Healthcare"),
      sectionsPresent: sectionIds.every((id) => Boolean(document.getElementById(id))),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2
    };
  });
  Object.assign(desktopMetrics, await getCanvasMetrics(page));

  await page.getByRole("button", { name: "Enter the Gallery" }).click({ timeout: 30000 });
  await page.waitForTimeout(5200);
  await captureScreenshot(page, path.join("qa", "gallery.png"));
  const galleryMetrics = {
    ...(await getCanvasMetrics(page)),
    hasGalleryHud: await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes("nursing informatics museum gallery") || text.includes("holographic healthcare museum");
    }),
    hasRoomTitle: await page.evaluate(() => document.body.innerText.toLowerCase().includes("1950s"))
  };

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobile.emulateMedia({ reducedMotion: "reduce" });
  await mobile.goto(`http://${hostname}:${port}`, { waitUntil: "networkidle", timeout: 60000 });
  await mobile.waitForTimeout(4600);
  await captureScreenshot(mobile, path.join("qa", "mobile.png"));
  const mobileMetrics = await mobile.evaluate(() => ({
    hasHeadline:
      document.body.innerText.includes("Evolution of Nursing Informatics") ||
      document.body.innerText.includes("Museum of Nursing Informatics"),
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2
  }));

  const failures = [];
  if (!desktopMetrics.hasMainHeadline) failures.push("Missing main headline");
  if (!desktopMetrics.hasTimelineCopy) failures.push("Missing timeline copy");
  if (!desktopMetrics.sectionsPresent) failures.push("Missing one or more required sections");
  if (desktopMetrics.canvasCount < 1) failures.push("No Three.js canvas rendered");
  if (desktopMetrics.litPixels < 80) failures.push("Three.js canvas appears blank");
  if (desktopMetrics.horizontalOverflow) failures.push("Desktop horizontal overflow detected");
  if (!galleryMetrics.hasGalleryHud) failures.push("Gallery HUD missing");
  if (!galleryMetrics.hasRoomTitle) failures.push("Gallery room title missing");
  if (galleryMetrics.canvasCount < 1) failures.push("Gallery canvas missing");
  if (galleryMetrics.litPixels < 80) failures.push("Gallery canvas appears blank");
  if (galleryMetrics.horizontalOverflow) failures.push("Gallery horizontal overflow detected");
  if (!mobileMetrics.hasHeadline) failures.push("Mobile headline missing");
  if (mobileMetrics.horizontalOverflow) failures.push("Mobile horizontal overflow detected");
  if (errors.length) failures.push(`Browser console errors: ${errors.join(" | ")}`);

  console.log(
    JSON.stringify(
      {
        desktopMetrics,
        galleryMetrics,
        mobileMetrics,
        screenshots: ["qa/desktop.png", "qa/gallery.png", "qa/mobile.png"],
        failures
      },
      null,
      2
    )
  );

  if (failures.length) {
    process.exitCode = 1;
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

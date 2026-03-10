/**
 * Performance test: run Lighthouse and print scores + Core Web Vitals.
 * Start the site first: npm run lh:serve (or npm run preview)
 * Then: node scripts/performance-test.mjs [url]
 * Or use npm run perf:report (runs against http://localhost:4173 by default)
 *
 * Requires: Chrome or Chromium installed (Lighthouse uses it in headless mode).
 * Alternative: Test the live site at https://pagespeed.web.dev/analysis?url=https://hamzaarya.com
 */
import { spawn } from 'child_process';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const reportDir = join(rootDir, 'lighthouse-reports');
const defaultUrl = process.env.PERF_URL || 'http://localhost:4173';
const url = process.argv[2] || defaultUrl;

function waitForUrl(u, maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      fetch(u, { method: 'HEAD', signal: AbortSignal.timeout(2000) })
        .then(() => resolve(true))
        .catch(() => {
          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error(`Server not ready at ${u} after ${maxAttempts} attempts`));
            return;
          }
          setTimeout(check, 1000);
        });
    };
    check();
  });
}

function runLighthouse(targetUrl) {
  return new Promise((resolve, reject) => {
    if (!existsSync(reportDir)) mkdirSync(reportDir, { recursive: true });
    const baseName = 'lighthouse-report';
    const jsonPath = join(reportDir, `${baseName}.json`);
    const htmlPath = join(reportDir, `${baseName}.html`);

    const args = [
      targetUrl,
      '--output=json',
      '--output=html',
      `--output-path=${join(reportDir, baseName)}`,
      '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
      '--only-categories=performance,accessibility,best-practices,seo',
      '--quiet',
    ];

    const child = spawn('npx', ['lighthouse', ...args], {
      cwd: rootDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    let stderr = '';
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Lighthouse exited ${code}\n${stderr}`));
        return;
      }
      resolve({ jsonPath, htmlPath });
    });
  });
}

function printReport(jsonPath) {
  const data = JSON.parse(readFileSync(jsonPath, 'utf8'));
  const categories = data.categories || {};
  const audits = data.audits || {};

  const score = (c) => (c && c.score != null ? Math.round(c.score * 100) : '-');
  const round = (n) => (n != null && typeof n === 'number' ? (Number.isInteger(n) ? n : n.toFixed(2)) : '-');

  console.log('\n========== Lighthouse scores ==========\n');
  console.log('  Performance:     ', score(categories.performance), '/ 100');
  console.log('  Accessibility:   ', score(categories.accessibility), '/ 100');
  console.log('  Best Practices:  ', score(categories['best-practices']), '/ 100');
  console.log('  SEO:             ', score(categories.seo), '/ 100');

  console.log('\n========== Core Web Vitals ==========\n');
  const lcp = audits['largest-contentful-paint'];
  const fid = audits['max-potential-fid'] || audits['total-blocking-time'];
  const cls = audits['cumulative-layout-shift'];
  const fcp = audits['first-contentful-paint'];
  const tbt = audits['total-blocking-time'];
  if (lcp) console.log('  LCP (target ≤2.5s):  ', round(lcp.numericValue), lcp.displayValue || '');
  if (fcp) console.log('  FCP:                ', round(fcp.numericValue), fcp.displayValue || '');
  if (tbt) console.log('  TBT (target ≤200ms):', round(tbt.numericValue), tbt.displayValue || '');
  if (cls) console.log('  CLS (target ≤0.1):  ', round(cls.numericValue), cls.displayValue || '');
  if (fid && fid.numericValue != null) console.log('  FID / INP:          ', round(fid.numericValue), fid.displayValue || '');

  console.log('\n========================================\n');
  console.log('Full HTML report: lighthouse-reports/lighthouse-report.html\n');
}

async function main() {
  console.log(`Performance test: ${url}\n`);
  try {
    console.log('Waiting for server...');
    await waitForUrl(url);
    console.log('Running Lighthouse...');
    const { jsonPath, htmlPath } = await runLighthouse(url);
    printReport(jsonPath);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

main();

#!/usr/bin/env node
import { exec as execCb } from 'node:child_process';
import { promisify } from 'node:util';
import { writeFile } from 'node:fs/promises';
import lighthouse from 'lighthouse';
import http from 'node:http';

const exec = promisify(execCb);

async function run() {
  // Build and start preview server
  await exec('npm run lh:build');
  const preview = exec('npm run lh:serve');

  // Wait for server to be up
  await waitForServer('http://localhost:4173');

  const url = process.env.LH_URL || 'http://localhost:4173';
  const config = {
    extends: 'lighthouse:default',
    settings: {
      formFactor: 'desktop',
      screenEmulation: { disabled: false },
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    },
  };

  const { lhr, report } = await lighthouse(url, { port: 0, output: ['html', 'json'] }, config);
  const htmlReport = Array.isArray(report) ? report[0] : report;
  const jsonReport = Array.isArray(report) ? report[1] : JSON.stringify(lhr, null, 2);

  await writeFile('lighthouse-report.html', htmlReport, 'utf8');
  await writeFile('lighthouse-report.json', typeof jsonReport === 'string' ? jsonReport : JSON.stringify(jsonReport, null, 2), 'utf8');

  // Print summary scores
  const cat = lhr.categories;
  console.log('Lighthouse scores:', {
    performance: cat.performance.score,
    accessibility: cat.accessibility.score,
    bestPractices: cat['best-practices'].score,
    seo: cat.seo.score,
  });

  // Kill preview server
  if (preview && preview.kill) preview.kill();
}

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          res.resume();
          resolve();
        });
        req.on('error', reject);
        req.end();
      });
      return;
    } catch (_) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error('Preview server did not start in time');
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});



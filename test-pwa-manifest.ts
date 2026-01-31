/**
 * PWA Manifest Verification Tests
 * Feature #2: PWA manifest is valid
 */

interface Manifest {
  name: string;
  short_name: string;
  description?: string;
  start_url: string;
  display: string;
  background_color: string;
  theme_color: string;
  orientation?: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }>;
  categories?: string[];
  shortcuts?: Array<{
    name: string;
    short_name: string;
    description: string;
    url: string;
    icons: Array<{ src: string; sizes: string }>;
  }>;
}

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

const RESULTS: TestResult[] = async function () {
  const results: TestResult[] = [];

  // Test 1: Manifest file exists
  try {
    const manifestRes = await fetch('http://localhost:5174/manifest.json');
    if (manifestRes.ok) {
      results.push({
        name: 'Manifest file exists',
        passed: true,
        details: 'manifest.json is accessible at /manifest.json'
      });
    } else {
      results.push({
        name: 'Manifest file exists',
        passed: false,
        details: `manifest.json returned status ${manifestRes.status}`
      });
    }
  } catch (e) {
    results.push({
      name: 'Manifest file exists',
      passed: false,
      details: `Failed to fetch manifest: ${e}`
    });
  }

  // Test 2: Manifest is valid JSON
  let manifest: Manifest | null = null;
  try {
    const manifestRes = await fetch('http://localhost:5174/manifest.json');
    const manifestText = await manifestRes.text();
    manifest = JSON.parse(manifestText);
    results.push({
      name: 'Manifest is valid JSON',
      passed: true,
      details: 'Manifest parses correctly'
    });
  } catch (e) {
    results.push({
      name: 'Manifest is valid JSON',
      passed: false,
      details: `Failed to parse manifest: ${e}`
    });
  }

  if (!manifest) {
    console.log('❌ Cannot continue tests - manifest is null');
    return results;
  }

  // Test 3: Manifest has required fields
  const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
  const missingFields = requiredFields.filter(f => !(f in manifest));
  if (missingFields.length === 0) {
    results.push({
      name: 'Manifest has required fields',
      passed: true,
      details: `Has all required fields: ${requiredFields.join(', ')}`
    });
  } else {
    results.push({
      name: 'Manifest has required fields',
      passed: false,
      details: `Missing fields: ${missingFields.join(', ')}`
    });
  }

  // Test 4: App name is correct
  if (manifest.name === 'OutFitWeather') {
    results.push({
      name: 'App name is correct',
      passed: true,
      details: `name: "${manifest.name}"`
    });
  } else {
    results.push({
      name: 'App name is correct',
      passed: false,
      details: `Expected "OutFitWeather", got "${manifest.name}"`
    });
  }

  // Test 5: Short name is set
  if (manifest.short_name && manifest.short_name.length > 0) {
    results.push({
      name: 'Short name is set',
      passed: true,
      details: `short_name: "${manifest.short_name}"`
    });
  } else {
    results.push({
      name: 'Short name is set',
      passed: false,
      details: 'short_name is missing or empty'
    });
  }

  // Test 6: Start URL is correct
  if (manifest.start_url === '/' || manifest.start_url === '.') {
    results.push({
      name: 'Start URL is correct',
      passed: true,
      details: `start_url: "${manifest.start_url}"`
    });
  } else {
    results.push({
      name: 'Start URL is correct',
      passed: false,
      details: `Expected "/" or ".", got "${manifest.start_url}"`
    });
  }

  // Test 7: Display mode is standalone
  if (manifest.display === 'standalone') {
    results.push({
      name: 'Display mode is standalone',
      passed: true,
      details: `display: "${manifest.display}" (app-like experience)`
    });
  } else {
    results.push({
      name: 'Display mode is standalone',
      passed: false,
      details: `Expected "standalone", got "${manifest.display}"`
    });
  }

  // Test 8: Theme color is set
  if (manifest.theme_color && manifest.theme_color.startsWith('#')) {
    results.push({
      name: 'Theme color is set',
      passed: true,
      details: `theme_color: "${manifest.theme_color}"`
    });
  } else {
    results.push({
      name: 'Theme color is set',
      passed: false,
      details: `Invalid theme_color: "${manifest.theme_color}"`
    });
  }

  // Test 9: Background color is set
  if (manifest.background_color && manifest.background_color.startsWith('#')) {
    results.push({
      name: 'Background color is set',
      passed: true,
      details: `background_color: "${manifest.background_color}"`
    });
  } else {
    results.push({
      name: 'Background color is set',
      passed: false,
      details: `Invalid background_color: "${manifest.background_color}"`
    });
  }

  // Test 10: Icons are defined
  if (manifest.icons && manifest.icons.length > 0) {
    results.push({
      name: 'Icons are defined',
      passed: true,
      details: `Found ${manifest.icons.length} icon(s)`
    });
  } else {
    results.push({
      name: 'Icons are defined',
      passed: false,
      details: 'No icons defined in manifest'
    });
  }

  // Test 11: Icons have required sizes (192x192 and 512x512)
  if (manifest.icons) {
    const sizes = manifest.icons.map(i => i.sizes);
    const has192 = sizes.some(s => s.includes('192'));
    const has512 = sizes.some(s => s.includes('512'));
    if (has192 && has512) {
      results.push({
        name: 'Icons have required sizes',
        passed: true,
        details: `Has 192x192 and 512x512 sizes`
      });
    } else {
      results.push({
        name: 'Icons have required sizes',
        passed: false,
        details: `Missing sizes - has192: ${has192}, has512: ${has512}`
      });
    }
  }

  // Test 12: Icon files are accessible
  const iconTests = [];
  if (manifest.icons) {
    for (const icon of manifest.icons) {
      try {
        const iconRes = await fetch(`http://localhost:5174${icon.src}`);
        if (iconRes.ok) {
          const contentType = iconRes.headers.get('content-type');
          if (contentType === 'image/png') {
            iconTests.push(`${icon.src} (${icon.sizes})`);
          } else {
            results.push({
              name: 'Icon files are accessible',
              passed: false,
              details: `${icon.src} has wrong content-type: ${contentType}`
            });
          }
        } else {
          results.push({
            name: 'Icon files are accessible',
            passed: false,
            details: `${icon.src} returned ${iconRes.status}`
          });
        }
      } catch (e) {
        results.push({
          name: 'Icon files are accessible',
          passed: false,
          details: `Failed to fetch ${icon.src}: ${e}`
        });
      }
    }
  }
  if (iconTests.length > 0) {
    results.push({
      name: 'Icon files are accessible',
      passed: true,
      details: `Accessible icons: ${iconTests.join(', ')}`
    });
  }

  // Test 13: Icons have purpose set
  if (manifest.icons && manifest.icons.every(i => i.purpose)) {
    results.push({
      name: 'Icons have purpose set',
      passed: true,
      details: `All icons have purpose: ${manifest.icons[0].purpose}`
    });
  } else {
    results.push({
      name: 'Icons have purpose set',
      passed: false,
      details: 'Some icons missing purpose field'
    });
  }

  // Test 14: HTML links to manifest
  try {
    const htmlRes = await fetch('http://localhost:5174/');
    const htmlText = await htmlRes.text();
    if (htmlText.includes('rel="manifest"') || htmlText.includes("rel='manifest'")) {
      results.push({
        name: 'HTML links to manifest',
        passed: true,
        details: 'index.html contains <link rel="manifest">'
      });
    } else {
      results.push({
        name: 'HTML links to manifest',
        passed: false,
        details: 'index.html missing manifest link'
      });
    }
  } catch (e) {
    results.push({
      name: 'HTML links to manifest',
      passed: false,
      details: `Failed to check HTML: ${e}`
    });
  }

  // Test 15: HTML has apple-touch-icon
  try {
    const htmlRes = await fetch('http://localhost:5174/');
    const htmlText = await htmlRes.text();
    if (htmlText.includes('apple-touch-icon')) {
      results.push({
        name: 'HTML has apple-touch-icon',
        passed: true,
        details: 'index.html contains apple-touch-icon link'
      });
    } else {
      results.push({
        name: 'HTML has apple-touch-icon',
        passed: false,
        details: 'index.html missing apple-touch-icon link'
      });
    }
  } catch (e) {
    results.push({
      name: 'HTML has apple-touch-icon',
      passed: false,
      details: `Failed to check HTML: ${e}`
    });
  }

  // Test 16: Description is set (optional but recommended)
  if (manifest.description && manifest.description.length > 0) {
    results.push({
      name: 'Description is set',
      passed: true,
      details: `description: "${manifest.description.substring(0, 50)}..."`
    });
  } else {
    results.push({
      name: 'Description is set',
      passed: false,
      details: 'description field is missing or empty'
    });
  }

  // Test 17: Categories are set (optional)
  if (manifest.categories && manifest.categories.length > 0) {
    results.push({
      name: 'Categories are set',
      passed: true,
      details: `categories: ${manifest.categories.join(', ')}`
    });
  } else {
    results.push({
      name: 'Categories are set',
      passed: false,
      details: 'No categories defined (optional field)'
    });
  }

  // Test 18: Icon file sizes are reasonable (>1KB)
  const iconSizeTests = [];
  if (manifest.icons) {
    for (const icon of manifest.icons) {
      try {
        const iconRes = await fetch(`http://localhost:5174${icon.src}`);
        const blob = await iconRes.blob();
        const sizeKB = Math.round(blob.size / 1024);
        if (blob.size > 1024) {
          iconSizeTests.push(`${icon.src}: ${sizeKB}KB`);
        } else {
          results.push({
            name: 'Icon file sizes are reasonable',
            passed: false,
            details: `${icon.src} is too small: ${sizeKB}KB (likely corrupted)`
          });
        }
      } catch (e) {
        // Already tested in test 12
      }
    }
  }
  if (iconSizeTests.length > 0) {
    results.push({
      name: 'Icon file sizes are reasonable',
      passed: true,
      details: iconSizeTests.join(', ')
    });
  }

  return results;
}();

// Wait for async tests to complete
(async () => {
  const results = await RESULTS;

  console.log('\n========================================');
  console.log('PWA MANIFEST VERIFICATION RESULTS');
  console.log('========================================\n');

  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);

  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    if (!result.passed || process.env.DEBUG) {
      console.log(`   ${result.details}`);
    }
  });

  console.log('\n========================================');
  console.log(`SUMMARY: ${passed}/${total} tests passed (${percentage}%)`);
  console.log('========================================\n');

  if (passed === total) {
    console.log('✅ Feature #2: PWA manifest is valid - PASSING\n');
    process.exit(0);
  } else {
    console.log('❌ Feature #2: PWA manifest is valid - FAILING\n');
    process.exit(1);
  }
})();

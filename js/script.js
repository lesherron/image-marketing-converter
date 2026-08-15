document.addEventListener('DOMContentLoaded', function () {

  /* =========================================================
     SECTION: TAB NAVIGATION (ARIA tabs pattern)
     ========================================================= */
  const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

  function activateTab(tab) {
    tabButtons.forEach(btn => {
      const isActive = btn === tab;
      btn.setAttribute('aria-selected', String(isActive));
      btn.tabIndex = isActive ? 0 : -1;
    });

    tabPanels.forEach(panel => {
      const shouldShow = panel.id === tab.getAttribute('aria-controls');
      panel.hidden = !shouldShow;
      panel.classList.toggle('is-active', shouldShow);
    });

    tab.focus();
  }

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => activateTab(btn));

    // Arrow-key navigation between tabs, per ARIA authoring practices
    btn.addEventListener('keydown', (e) => {
      let newIndex = null;
      if (e.key === 'ArrowRight') newIndex = (index + 1) % tabButtons.length;
      if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      if (e.key === 'Home') newIndex = 0;
      if (e.key === 'End') newIndex = tabButtons.length - 1;
      if (newIndex !== null) {
        e.preventDefault();
        activateTab(tabButtons[newIndex]);
      }
    });
  });

  /* =========================================================
     SECTION: RATIO CONVERTER
     ========================================================= */
  const widthInput = document.getElementById('width');
  const heightInput = document.getElementById('height');
  const unitSelect = document.getElementById('unit');
  const ppiInput = document.getElementById('ppi');
  const imageUpload = document.getElementById('image-upload');

  const converterForm = document.getElementById('converter-form');
  const swapBtn = document.getElementById('swap-btn');
  const clearBtn = document.getElementById('clear-btn');
  const copyRatioBtn = document.getElementById('copy-ratio');
  const addToHistoryBtn = document.getElementById('add-to-history');
  const toggleToolsBtn = document.getElementById('toggle-tools');
  const clearHistoryBtn = document.getElementById('clear-history');

  const resultBox = document.getElementById('result-box');
  const ratioResult = document.getElementById('ratio-result');
  const decimalRatio = document.getElementById('decimal-ratio');
  const commonRatioMatch = document.getElementById('common-ratio-match');
  const ratioVisualization = document.getElementById('ratio-visualization');
  const widthError = document.getElementById('width-error');
  const heightError = document.getElementById('height-error');
  const additionalTools = document.getElementById('additional-tools');
  const conversionResult = document.getElementById('conversion-result');
  const toastMessage = document.getElementById('toast-message');
  const historyList = document.getElementById('history-list');
  const historyEmpty = document.getElementById('history-empty');
  const resolutionInfo = document.getElementById('resolution-info');
  const megapixelsDisplay = document.getElementById('megapixels');
  const fileSizeDisplay = document.getElementById('file-size');

  const presetButtons = document.querySelectorAll('.preset-btn');

  const commonRatios = [
    { ratio: [1, 1], name: 'Square (1:1)' },
    { ratio: [3, 2], name: 'Classic 35mm Film (3:2)' },
    { ratio: [4, 3], name: 'Standard TV/Computer Monitor (4:3)' },
    { ratio: [16, 9], name: 'Widescreen TV/HD Video (16:9)' },
    { ratio: [21, 9], name: 'Ultrawide/Cinematic (21:9)' },
    { ratio: [5, 4], name: 'Large Format Photography (5:4)' },
    { ratio: [3, 4], name: 'Portrait Photo (3:4)' },
    { ratio: [9, 16], name: 'Vertical Video/Mobile (9:16)' },
    { ratio: [2, 3], name: 'Portrait 35mm Film (2:3)' },
    { ratio: [8, 5], name: '8:5 / 16:10 (Golden Ratio)' },
    { ratio: [4, 5], name: 'Instagram Portrait (4:5)' },
    { ratio: [1.85, 1], name: 'Cinema Standard (1.85:1)' },
    { ratio: [2.35, 1], name: 'Anamorphic Widescreen (2.35:1)' }
  ];

  let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
  updateHistoryDisplay();

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  function simplifyRatio(width, height) {
    const divisor = gcd(width, height);
    return [width / divisor, height / divisor];
  }

  function findMatchingCommonRatio(simplified) {
    for (const common of commonRatios) {
      if (common.ratio[0] === simplified[0] && common.ratio[1] === simplified[1]) {
        return common.name;
      }
      if (common.ratio[0] === simplified[1] && common.ratio[1] === simplified[0]) {
        return common.name + ' (Portrait)';
      }
    }

    const calculatedRatio = simplified[0] / simplified[1];
    for (const common of commonRatios) {
      const commonRatio = common.ratio[0] / common.ratio[1];
      if (Math.abs(calculatedRatio - commonRatio) < 0.01) {
        return common.name + ' (Approximate)';
      }
      const flippedCommonRatio = common.ratio[1] / common.ratio[0];
      if (Math.abs(calculatedRatio - flippedCommonRatio) < 0.01) {
        return common.name + ' (Portrait, Approximate)';
      }
    }

    return null;
  }

  function showFieldError(input, errorEl, message) {
    errorEl.textContent = message;
    errorEl.classList.add('is-visible');
    input.setAttribute('aria-invalid', 'true');
  }

  function clearFieldError(input, errorEl) {
    errorEl.classList.remove('is-visible');
    input.removeAttribute('aria-invalid');
  }

  function validateInputs() {
    let isValid = true;

    if (!widthInput.value || widthInput.value <= 0) {
      showFieldError(widthInput, widthError, 'Please enter a valid width.');
      isValid = false;
    } else {
      clearFieldError(widthInput, widthError);
    }

    if (!heightInput.value || heightInput.value <= 0) {
      showFieldError(heightInput, heightError, 'Please enter a valid height.');
      isValid = false;
    } else {
      clearFieldError(heightInput, heightError);
    }

    return isValid;
  }

  function calculateRatio() {
    if (!validateInputs()) return;

    const width = parseInt(widthInput.value, 10);
    const height = parseInt(heightInput.value, 10);
    const unit = unitSelect.value;

    const simplified = simplifyRatio(width, height);

    ratioResult.textContent = `${simplified[0]}:${simplified[1]}`;

    const decimalValue = (width / height).toFixed(2);
    decimalRatio.textContent = `(${decimalValue}:1)`;

    const matchingRatio = findMatchingCommonRatio(simplified);
    commonRatioMatch.textContent = matchingRatio
      ? `Matches ${matchingRatio}`
      : 'This is a custom aspect ratio.';

    updateVisualization(simplified);
    updateResolutionInfo(width, height, unit);

    resultBox.hidden = false;

    if (unit === 'pixels' || unit === 'inches') {
      updateUnitConversion(width, height, unit);
    }
  }

  function updateResolutionInfo(width, height, unit) {
    if (unit === 'pixels') {
      const megapixels = (width * height / 1000000).toFixed(2);
      megapixelsDisplay.textContent = `Megapixels: ${megapixels} MP`;

      const bytesPerPixel = 3; // 24-bit RGB
      const totalBytes = width * height * bytesPerPixel;
      const fileSizeMB = (totalBytes / (1024 * 1024)).toFixed(2);
      fileSizeDisplay.textContent = `Estimated file size (uncompressed): ~${fileSizeMB} MB`;
      resolutionInfo.style.display = 'block';
    } else {
      resolutionInfo.style.display = 'none';
    }
  }

  function updateUnitConversion(width, height, unit) {
    const ppi = parseInt(ppiInput.value, 10) || 72;

    if (unit === 'pixels') {
      const widthInches = (width / ppi).toFixed(2);
      const heightInches = (height / ppi).toFixed(2);
      conversionResult.textContent = `${width}×${height}px at ${ppi} PPI = ${widthInches}"×${heightInches}"`;
    } else if (unit === 'inches') {
      const widthPixels = Math.round(width * ppi);
      const heightPixels = Math.round(height * ppi);
      conversionResult.textContent = `${width}"×${height}" at ${ppi} PPI = ${widthPixels}×${heightPixels}px`;
    }
  }

  function updateVisualization(simplified) {
    const maxDimension = 280;
    const ratioValue = simplified[0] / simplified[1];
    let boxWidth, boxHeight;

    if (ratioValue >= 1) {
      boxWidth = maxDimension;
      boxHeight = maxDimension / ratioValue;
    } else {
      boxHeight = maxDimension;
      boxWidth = maxDimension * ratioValue;
    }

    ratioVisualization.style.width = `${boxWidth}px`;
    ratioVisualization.style.height = `${boxHeight}px`;
    ratioVisualization.setAttribute('aria-label', `Rectangle showing the ${simplified[0]}:${simplified[1]} aspect ratio`);
  }

  function swapDimensions() {
    const temp = widthInput.value;
    widthInput.value = heightInput.value;
    heightInput.value = temp;
    if (!resultBox.hidden) calculateRatio();
  }

  function clearFields() {
    widthInput.value = '';
    heightInput.value = '';
    clearFieldError(widthInput, widthError);
    clearFieldError(heightInput, heightError);
    resultBox.hidden = true;
  }

  function showToast(message) {
    toastMessage.textContent = message;
    toastMessage.classList.add('is-visible');
    setTimeout(() => toastMessage.classList.remove('is-visible'), 2200);
  }

  function copyRatioToClipboard() {
    const text = ratioResult.textContent;
    navigator.clipboard.writeText(text)
      .then(() => showToast('Ratio copied to clipboard!'))
      .catch(() => showToast('Could not copy — please copy manually.'));
  }

  function toggleTools() {
    const isHidden = additionalTools.hidden;
    additionalTools.hidden = !isHidden;
    toggleToolsBtn.textContent = isHidden ? 'Hide Additional Tools' : 'Show Additional Tools';
    toggleToolsBtn.setAttribute('aria-expanded', String(isHidden));
  }

  function addToHistory() {
    const width = widthInput.value;
    const height = heightInput.value;
    const unit = unitSelect.value;
    const ratio = ratioResult.textContent;

    if (!width || !height) return;

    const entry = {
      id: Date.now(),
      width,
      height,
      unit,
      ratio,
      timestamp: new Date().toLocaleString()
    };

    history.unshift(entry);
    if (history.length > 50) history = history.slice(0, 50);

    localStorage.setItem('conversionHistory', JSON.stringify(history));
    updateHistoryDisplay();
    showToast('Saved to history!');
  }

  function updateHistoryDisplay() {
    historyList.innerHTML = '';

    if (history.length === 0) {
      historyEmpty.style.display = 'block';
      return;
    }

    historyEmpty.style.display = 'none';

    history.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'history-item';

      const dataEl = document.createElement('div');
      dataEl.className = 'history-data';
      dataEl.innerHTML = `<strong>${item.ratio}</strong> (${item.width}×${item.height} ${item.unit})<div>${item.timestamp}</div>`;

      const actionsEl = document.createElement('div');
      actionsEl.className = 'history-actions';

      const loadBtn = document.createElement('button');
      loadBtn.className = 'btn btn-small';
      loadBtn.type = 'button';
      loadBtn.textContent = 'Load';
      loadBtn.addEventListener('click', () => loadHistoryItem(item));

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-small btn-secondary';
      deleteBtn.type = 'button';
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', `Delete ${item.ratio} entry from ${item.timestamp}`);
      deleteBtn.addEventListener('click', () => deleteHistoryItem(item.id));

      actionsEl.append(loadBtn, deleteBtn);
      itemEl.append(dataEl, actionsEl);
      historyList.appendChild(itemEl);
    });
  }

  function loadHistoryItem(item) {
    widthInput.value = item.width;
    heightInput.value = item.height;
    unitSelect.value = item.unit;
    activateTab(document.getElementById('tab-converter'));
    calculateRatio();
  }

  function deleteHistoryItem(id) {
    history = history.filter(item => item.id !== id);
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    updateHistoryDisplay();
  }

  function clearAllHistory() {
    history = [];
    localStorage.removeItem('conversionHistory');
    updateHistoryDisplay();
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = function () {
        widthInput.value = img.width;
        heightInput.value = img.height;
        unitSelect.value = 'pixels';
        calculateRatio();
        imageUpload.value = '';
      };
      img.src = URL.createObjectURL(file);
    }
  }

  converterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    calculateRatio();
  });

  swapBtn.addEventListener('click', swapDimensions);
  clearBtn.addEventListener('click', clearFields);
  copyRatioBtn.addEventListener('click', copyRatioToClipboard);
  addToHistoryBtn.addEventListener('click', addToHistory);
  toggleToolsBtn.addEventListener('click', toggleTools);
  clearHistoryBtn.addEventListener('click', clearAllHistory);
  imageUpload.addEventListener('change', handleImageUpload);

  ppiInput.addEventListener('input', function () {
    if (!resultBox.hidden) {
      updateUnitConversion(parseInt(widthInput.value, 10), parseInt(heightInput.value, 10), unitSelect.value);
    }
  });

  unitSelect.addEventListener('change', function () {
    if (!resultBox.hidden) calculateRatio();
  });

  presetButtons.forEach(button => {
    button.addEventListener('click', function () {
      widthInput.value = this.dataset.width;
      heightInput.value = this.dataset.height;
      unitSelect.value = 'pixels';
      calculateRatio();
    });
  });

  /* =========================================================
     SECTION: BATCH CONVERTER
     ========================================================= */
  const batchInput = document.getElementById('batch-input');
  const batchConvertBtn = document.getElementById('batch-convert-btn');
  const batchResults = document.getElementById('batch-results');
  const batchResultsBody = document.getElementById('batch-results-body');

  let batchData = []; // holds structured rows for export

  function processBatchConversion() {
    const lines = batchInput.value.trim().split('\n');

    if (lines.length === 0 || (lines.length === 1 && lines[0] === '')) {
      showToast('Please enter at least one set of dimensions.');
      return;
    }

    batchResultsBody.innerHTML = '';
    batchData = [];

    lines.forEach(line => {
      const match = line.match(/(\d+)\s*[x×X]\s*(\d+)/);
      if (match) {
        const width = parseInt(match[1], 10);
        const height = parseInt(match[2], 10);
        const simplified = simplifyRatio(width, height);
        const decimalValue = (width / height).toFixed(2);
        const matchingRatio = findMatchingCommonRatio(simplified) || 'Custom';

        batchData.push({
          dimensions: `${width} x ${height}`,
          ratio: `${simplified[0]}:${simplified[1]}`,
          decimal: `${decimalValue}:1`,
          common: matchingRatio
        });

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${width} × ${height}</td>
          <td>${simplified[0]}:${simplified[1]}</td>
          <td>${decimalValue}:1</td>
          <td>${matchingRatio}</td>
        `;
        batchResultsBody.appendChild(row);
      }
    });

    if (batchData.length > 0) {
      batchResults.hidden = false;
    } else {
      showToast('No valid dimensions found. Use format "width x height".');
    }
  }

  batchConvertBtn.addEventListener('click', processBatchConversion);

  [widthInput, heightInput].forEach(input => {
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        calculateRatio();
      }
    });
  });

  /* =========================================================
     SECTION: SOCIAL MEDIA PIXEL SIZES
     Sizes shared across platforms are combined into one row
     (see "platforms" array) to keep the table compact.
     ========================================================= */
  const socialSizes = [
    { useCase: 'Square post', size: '1080 x 1080', ratio: '1:1', platforms: ['Instagram', 'Facebook', 'LinkedIn', 'X/Twitter'] },
    { useCase: 'Portrait feed post', size: '1080 x 1350', ratio: '4:5', platforms: ['Instagram', 'Facebook'] },
    { useCase: 'Landscape feed post', size: '1080 x 566', ratio: '1.91:1', platforms: ['Instagram', 'Facebook', 'X/Twitter', 'LinkedIn'] },
    { useCase: 'Story / Reel / vertical video', size: '1080 x 1920', ratio: '9:16', platforms: ['Instagram', 'Facebook', 'YouTube (Shorts)'] },
    { useCase: 'Profile picture', size: '400 x 400', ratio: '1:1', platforms: ['Instagram', 'X/Twitter', 'LinkedIn'] },
    { useCase: 'Profile picture (larger)', size: '720 x 720', ratio: '1:1', platforms: ['Facebook', 'YouTube', 'Pinterest'] },
    { useCase: 'Cover / banner photo', size: '820 x 312', ratio: '2.63:1', platforms: ['Facebook'] },
    { useCase: 'Cover photo (page)', size: '851 x 315', ratio: '2.7:1', platforms: ['Facebook (Page)'] },
    { useCase: 'Header / banner image', size: '1500 x 500', ratio: '3:1', platforms: ['X/Twitter'] },
    { useCase: 'Company banner', size: '1128 x 191', ratio: '5.9:1', platforms: ['LinkedIn (Company Page)'] },
    { useCase: 'Personal profile banner', size: '1584 x 396', ratio: '4:1', platforms: ['LinkedIn (Personal)'] },
    { useCase: 'Channel banner', size: '2560 x 1440', ratio: '16:9', platforms: ['YouTube'] },
    { useCase: 'Video thumbnail', size: '1280 x 720', ratio: '16:9', platforms: ['YouTube'] },
    { useCase: 'Standard video upload', size: '1920 x 1080', ratio: '16:9', platforms: ['YouTube', 'Facebook', 'LinkedIn'] },
    { useCase: 'Standard Pin', size: '1000 x 1500', ratio: '2:3', platforms: ['Pinterest'] },
    { useCase: 'Square Pin', size: '1000 x 1000', ratio: '1:1', platforms: ['Pinterest'] },
    { useCase: 'Idea Pin / Story Pin', size: '1080 x 1920', ratio: '9:16', platforms: ['Pinterest'] },
    { useCase: 'Board cover', size: '600 x 600', ratio: '1:1', platforms: ['Pinterest'] }
  ];

  const socialSizesBody = document.getElementById('social-sizes-body');
  const socialSearch = document.getElementById('social-search');
  const filterChips = document.querySelectorAll('.filter-chip');
  let activeFilter = 'all';

  function renderSocialSizes() {
    const query = socialSearch.value.trim().toLowerCase();
    socialSizesBody.innerHTML = '';

    const filtered = socialSizes.filter(row => {
      const matchesFilter = activeFilter === 'all' ||
        row.platforms.some(p => p.toLowerCase().includes(activeFilter.toLowerCase()));

      const haystack = `${row.useCase} ${row.size} ${row.ratio} ${row.platforms.join(' ')}`.toLowerCase();
      const matchesSearch = query === '' || haystack.includes(query);

      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `<td colspan="4">No matching sizes found. Try clearing your search or filter.</td>`;
      socialSizesBody.appendChild(emptyRow);
      return;
    }

    filtered.forEach(row => {
      const tr = document.createElement('tr');
      const platformTags = row.platforms.map(p => `<span class="use-case-tag">${p}</span>`).join(' ');
      tr.innerHTML = `
        <td>${row.useCase}</td>
        <td>${row.size}px</td>
        <td>${row.ratio}</td>
        <td>${platformTags}</td>
      `;
      socialSizesBody.appendChild(tr);
    });
  }

  socialSearch.addEventListener('input', renderSocialSizes);

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', 'true');
      activeFilter = chip.dataset.filter;
      renderSocialSizes();
    });
  });

  renderSocialSizes();

  /* =========================================================
     SECTION: EXPORT HELPERS (CSV, XLSX, Google Sheets copy)
     Works entirely client-side — no server or login needed.
     ========================================================= */
  function downloadCSV(rows, headers, filename) {
    const csvLines = [headers.join(',')];
    rows.forEach(row => {
      const line = headers.map(h => {
        const val = String(row[h] ?? '').replace(/"/g, '""');
        return `"${val}"`;
      }).join(',');
      csvLines.push(line);
    });

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, filename);
  }

  function downloadXLSX(rows, headers, filename, sheetName) {
    if (typeof XLSX === 'undefined') {
      showToast('Excel export is still loading — try again in a moment.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filename);
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function copyForGoogleSheets(rows, headers, statusEl) {
    // Tab-separated values paste cleanly into Google Sheets cells.
    const tsvLines = [headers.join('\t')];
    rows.forEach(row => {
      tsvLines.push(headers.map(h => String(row[h] ?? '')).join('\t'));
    });

    navigator.clipboard.writeText(tsvLines.join('\n'))
      .then(() => {
        showToast('Copied! Paste directly into Google Sheets.');
        if (statusEl) statusEl.textContent = 'Copied — paste into a Google Sheet with Ctrl/Cmd+V.';
      })
      .catch(() => showToast('Could not copy — please try the CSV export instead.'));
  }

  // --- Batch export wiring ---
  const batchHeaders = ['dimensions', 'ratio', 'decimal', 'common'];
  const batchExportStatus = document.getElementById('batch-export-status');

  document.getElementById('batch-export-csv').addEventListener('click', () => {
    if (batchData.length === 0) return showToast('Run a batch conversion first.');
    downloadCSV(batchData, batchHeaders, 'batch-aspect-ratios.csv');
  });

  document.getElementById('batch-export-xlsx').addEventListener('click', () => {
    if (batchData.length === 0) return showToast('Run a batch conversion first.');
    downloadXLSX(batchData, batchHeaders, 'batch-aspect-ratios.xlsx', 'Batch Ratios');
  });

  document.getElementById('batch-copy-sheets').addEventListener('click', () => {
    if (batchData.length === 0) return showToast('Run a batch conversion first.');
    copyForGoogleSheets(batchData, batchHeaders, batchExportStatus);
  });

  // --- Social sizes export wiring (exports the currently filtered view) ---
  const socialHeaders = ['useCase', 'size', 'ratio', 'platforms'];
  const socialExportStatus = document.getElementById('social-export-status');

  function getVisibleSocialRows() {
    const query = socialSearch.value.trim().toLowerCase();
    return socialSizes
      .filter(row => {
        const matchesFilter = activeFilter === 'all' ||
          row.platforms.some(p => p.toLowerCase().includes(activeFilter.toLowerCase()));
        const haystack = `${row.useCase} ${row.size} ${row.ratio} ${row.platforms.join(' ')}`.toLowerCase();
        const matchesSearch = query === '' || haystack.includes(query);
        return matchesFilter && matchesSearch;
      })
      .map(row => ({
        useCase: row.useCase,
        size: `${row.size}px`,
        ratio: row.ratio,
        platforms: row.platforms.join(', ')
      }));
  }

  document.getElementById('social-export-csv').addEventListener('click', () => {
    downloadCSV(getVisibleSocialRows(), socialHeaders, 'social-media-sizes.csv');
  });

  document.getElementById('social-export-xlsx').addEventListener('click', () => {
    downloadXLSX(getVisibleSocialRows(), socialHeaders, 'social-media-sizes.xlsx', 'Social Sizes');
  });

  document.getElementById('social-copy-sheets').addEventListener('click', () => {
    copyForGoogleSheets(getVisibleSocialRows(), socialHeaders, socialExportStatus);
  });

});

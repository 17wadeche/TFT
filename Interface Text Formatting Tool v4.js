/* eslint semi: ["error", "always"] */
import config from "./styles";
const CN_RE = /\b[A-Z]{2,4}-\d{3,}\b/;
function* allRoots(rootDoc) {
  function* walk(node) {
    if (node) yield node;
    const elements = node?.querySelectorAll ? Array.from(node.querySelectorAll("*")) : [];
    for (const el of elements) {
      if (el.shadowRoot) {
        yield* walk(el.shadowRoot);
      }
    }
  }
  yield* walk(rootDoc);
  try {
    const iframes = Array.from(rootDoc.querySelectorAll("iframe"));
    for (const f of iframes) {
      try {
        const idoc = f.contentDocument || f.contentWindow?.document;
        if (idoc) yield* walk(idoc);
      } catch(_) {}
    }
  } catch(_) {}
}
function pullText(el) {
  return (el?.textContent || el?.innerText || '')
    .replace(/\s+\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
}
function findSourceInfosGrids() {
  const root = top?.document || document;
  const grids = new Set();
  for (const r of allRoots(root)) {
    try {
      r.querySelectorAll('[role="grid"], table[role="grid"]').forEach(g => {
        const label = (g.getAttribute('aria-label') || '').trim();
        if (/^source infos?/i.test(label)) grids.add(g);
      });
      r.querySelectorAll('[role="grid"]').forEach(g => {
        if (grids.has(g)) return;
        const headers = Array.from(g.querySelectorAll('[role="columnheader"], th'))
          .map(h => pullText(h));
        if (headers.some(h => /^source information$/i.test(h))) {
          grids.add(g);
        }
      });
    } catch (_) {}
  }
  return Array.from(grids);
}
function queryDeepForLink(rootNode) {
  for (const n of allRoots(rootNode)) {
    try {
      const a = n.querySelector && n.querySelector('a[href]');
      if (a) return a;
    } catch(_) {}
  }
  return null;
}
function harvestRowsFromGrid(grid) {
  const rows = [];
  const rowEls = grid.querySelectorAll('[role="row"]');
  let dataRowCounter = 0;
  rowEls.forEach(rowEl => {
    const cells = rowEl.querySelectorAll('td[role="gridcell"]');
    if (!cells.length) return;
    const ariaIdx = parseInt(rowEl.getAttribute('aria-rowindex') || '', 10);
    dataRowCounter += 1;
    const rowIndex = Number.isFinite(ariaIdx) ? ariaIdx : dataRowCounter;
    let sourceText = '';
    let add = null;
    cells.forEach(td => {
      const label = (td.getAttribute('data-label') || '').trim();
      const key   = (td.getAttribute('data-col-key-value') || '').trim();
      if (/^source information$/i.test(label) || /Source_Information/i.test(key)) {
        const rich = td.querySelector('lightning-base-formatted-text, lightning-formatted-rich-text, lightning-formatted-text, lst-basic-rich-text');
        sourceText = pullText(rich) || pullText(td) || sourceText;
      }
      if (/^additional info review$/i.test(label) || /AdditionalInfoReview/i.test(key)) {
        const a = queryDeepForLink(td); // walks shadow roots
        if (a) {
          add = {
            title: (a.getAttribute('title') || a.textContent || '').trim(),
            href: a.getAttribute('href') || '#',
            rowIndex
          };
        }
      }
    });
    if (sourceText || add) rows.push({ sourceText, add, rowIndex });
  });
  return rows;
}
async function getRowwiseSourceInfoEnsured() {
  const onSI = await ensureOnTab("Source Info") || await ensureOnTab("Source Information");
  if (!onSI) return [];
  const started = Date.now();
  while (Date.now() - started < 8000) {
    const grids = findSourceInfosGrids();
    const rows = grids.flatMap(g => harvestRowsFromGrid(g));
    if (rows.length) return rows;
    await new Promise(r => setTimeout(r, 200));
  }
  return [];
}
function findSourceInfosRoots() {
  const roots = [];
  const root = top?.document || document;
  for (const r of allRoots(root)) {
    try {
      r.querySelectorAll('table[role="grid"]').forEach(t => {
        const label = t.getAttribute('aria-label') || '';
        if (/^source infos?/i.test(label)) roots.push(t);
      });
      r.querySelectorAll('[role="grid"][aria-label]').forEach(t => {
        const label = t.getAttribute('aria-label') || '';
        if (/^source infos?/i.test(label)) roots.push(t);
      });
    } catch(_) {}
  }
  return roots;
}
function getAllSourceInfoFromGrid() {
  const blocks = [];
  const roots = findSourceInfosRoots();
  if (!roots.length) return blocks;
  const pullText = (el) => (el?.textContent || el?.innerText || '').replace(/\s+\n/g, '\n').replace(/\s+/g, ' ').trim();
  for (const grid of roots) {
    grid.querySelectorAll('td[role="gridcell"][data-label]').forEach(td => {
      const label = (td.getAttribute('data-label') || '').trim();
      if (/^source information$/i.test(label)) {
        const rich = td.querySelector('lightning-base-formatted-text, lightning-formatted-rich-text, lightning-formatted-text, lst-basic-rich-text');
        let txt = pullText(rich) || pullText(td);
        if (!txt) {
          txt = (td.getAttribute('title') || td.getAttribute('aria-label') || '').trim();
        }
        if (txt) blocks.push(txt);
      }
    });
    grid.querySelectorAll('td[role="gridcell"][data-col-key-value]').forEach(td => {
      const key = td.getAttribute('data-col-key-value') || '';
      if (/Source_Information/i.test(key)) {
        const rich = td.querySelector('lightning-base-formatted-text, lightning-formatted-rich-text, lightning-formatted-text, lst-basic-rich-text');
        const txt = pullText(rich) || pullText(td);
        if (txt) blocks.push(txt);
      }
    });
  }
  const seen = new Set();
  return blocks.filter(b => (seen.has(b) ? false : (seen.add(b), true)));
}
function getAdditionalInfoRefsFromGrid() {
  const refs = [];
  const roots = findSourceInfosRoots();
  if (!roots.length) return refs;
  for (const grid of roots) {
    grid.querySelectorAll('td[role="gridcell"][data-label], td[role="gridcell"][data-col-key-value]').forEach(td => {
      const label = (td.getAttribute('data-label') || '').trim();
      const key   = (td.getAttribute('data-col-key-value') || '').trim();
      if (/^additional info review$/i.test(label) || /AdditionalInfoReview/i.test(key)) {
        const a = td.querySelector('a[href]');
        if (a) {
          refs.push({
            title: (a.getAttribute('title') || a.textContent || '').trim(),
            href: a.getAttribute('href')
          });
        }
      }
    });
  }
  const seen = new Set();
  return refs.filter(r => {
    const k = (r.href || '') + '|' + (r.title || '');
    return seen.has(k) ? false : (seen.add(k), true);
  });
}
async function getSourceInfoFromGridEnsured() {
  const onSI = await ensureOnTab("Source Info") || await ensureOnTab("Source Information");
  if (!onSI) return { blocks: [], adds: [] };
  const started = Date.now();
  while (Date.now() - started < 8000) {
    const blocks = getAllSourceInfoFromGrid();
    const adds   = getAdditionalInfoRefsFromGrid();
    if (blocks.length || adds.length) return { blocks, adds };
    await new Promise(r => setTimeout(r, 200));
  }
  return { blocks: [], adds: [] };
}
function openTabEarly() {
  const w = window.open("about:blank", "_blank");
  if (!w || !w.document) {
    alert("Couldn’t open a new tab. Please allow popups for this site.");
    return null;
  }
  try {
    w.document.open();
    w.document.write(`<!doctype html><html><head><meta charset="utf-8">
      <title>Interface Formatter</title>
      <style>body{font-family:system-ui,sans-serif;padding:24px;color:#1f2937}
      .muted{opacity:.7}</style></head>
      <body><h2>Interface Formatter</h2>
      <p class="muted">Loading…</p></body></html>`);
    w.document.close();
  } catch(_) {}
  return w;
}
const norm = s => (s || "").replace(/\s+/g, " ").trim();
const valOf = el => el?.value ?? el?.getAttribute?.("value") ?? el?.textContent ?? el?.innerText ?? el?.title ?? "";
function mergeConfig(target, source) {
  if (!source) return;
  if (source.styleWords) target.styleWords.push(...source.styleWords);
  if (source.boldLinesKeyWords) target.boldLinesKeyWords.push(...source.boldLinesKeyWords);
}
function getFieldTextByLabel(label){
  const re = new RegExp("\\b" + label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
  const root = top?.document || document;
  for (const r of allRoots(root)) {
    try {
      const candidates = Array.from(r.querySelectorAll(".slds-form-element__label, label, span, div, lightning-output-field"));
      const labelEl = candidates.find(n => re.test(norm(n.textContent)));
      if (!labelEl) continue;
      const container = labelEl.closest("records-record-layout-item, lightning-layout, .slds-form-element, div, section") || labelEl.parentElement;
      if (!container) continue;
      const valueEl =
        container.querySelector("[slot='output'][data-output-element-id='output-field']") ||
        container.querySelector("lightning-formatted-textarea, lightning-formatted-rich-text, lightning-formatted-text") ||
        container.querySelector("[data-output-element], [data-value], [title]");
      const v = norm(valOf(valueEl));
      if (v) return v;
    } catch(_) {}
  }
  return null;
}
function getActiveTabLabel(){
  const root = top?.document || document;
  for (const r of allRoots(root)) {
    try {
      const selected = r.querySelector('[role="tab"][aria-selected="true"]');
      if (!selected) continue;
      const lbl = selected.getAttribute("data-label") || selected.textContent || "";
      return norm(lbl);
    } catch(_) {}
  }
  return null;
}
function safeClick(el){
  try {
    el.dispatchEvent(new MouseEvent("mousedown", {bubbles:true, cancelable:true}));
    el.dispatchEvent(new MouseEvent("mouseup",   {bubbles:true, cancelable:true}));
    el.click();
  } catch(_) { try { el.click(); } catch(_) {} }
}
async function ensureOnTab(label, {timeout=6000} = {}){
  const root = top?.document || document;
  const wanted = findTabByLabel(label);
  if (!wanted) return false;
  if (wanted.getAttribute("aria-selected") === "true") return true;
  safeClick(wanted);
  const ok = await waitFor(() => wanted.getAttribute("aria-selected") === "true", {timeout});
  return !!ok;
}
function findRecordIdOnce() {
  const root = top?.document || document;
  const tHit = (root.title || "").match(CN_RE);
  if (tHit) return tHit[0];
  for (const r of allRoots(root)) {
    try {
      const els = [
        ...r.querySelectorAll("[data-output-element-id='output-field']"),
        ...r.querySelectorAll("lightning-formatted-text[slot='output']"),
        ...r.querySelectorAll("lightning-formatted-text"),
        ...r.querySelectorAll(".slds-page-header__title, h1, h2, [title], [aria-label]")
      ];
      for (const el of els) {
        const candidates = [
          el?.textContent, el?.innerText, el?.title, el?.getAttribute?.("title"),
          el?.getAttribute?.("aria-label"), el?.getAttribute?.("value")
        ];
        for (const s of candidates) {
          const m = (s || "").match(CN_RE);
          if (m) return m[0];
        }
      }
    } catch(_) {}
  }
  try {
    const walker = root.createTreeWalker(root.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const m = (node.nodeValue || "").match(CN_RE);
      if (m) return m[0];
    }
  } catch(_) {}
  return null;
}
async function getRecordIdSmart(timeoutMs = 8000) {
  let id = findRecordIdOnce();
  if (id) return id;
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    await new Promise(r => setTimeout(r, 150));
    id = findRecordIdOnce();
    if (id) return id;
  }
  return null;
}
function findTabByLabel(label){
  const root = top?.document || document;
  const isLbl = s => (s||"").replace(/\s+/g," ").trim().toLowerCase() === label.toLowerCase();
  for (const r of allRoots(root)) {
    try {
      const el = r.querySelector(`[role="tab"][data-label="${label}"]`);
      if (el) return el;
      const tabs = Array.from(r.querySelectorAll('[role="tab"]'));
      const hit = tabs.find(t => isLbl(t.getAttribute("data-label")) || isLbl(t.textContent));
      if (hit) return hit;
    } catch(_) {}
  }
  return null;
}
function waitFor(predicate, {interval=150, timeout=4000} = {}){
  return new Promise(resolve => {
    const start = Date.now();
    const tick = () => {
      try {
        const v = predicate();
        if (v) return resolve(v);
      } catch(_) {}
      if (Date.now() - start >= timeout) return resolve(null);
      setTimeout(tick, interval);
    };
    tick();
  });
}
function getOUFromPage() {
  const keyMap = new Map(Object.keys(config).map(k => [k.toLowerCase(), k]));
  const tryMatch = (str) => {
    const t = norm(str);
    return t ? (keyMap.get(t.toLowerCase()) || null) : null;
  };
  const root = top?.document || document;
  for (const r of allRoots(root)) {
    try {
      const lfts = Array.from(r.querySelectorAll("lightning-formatted-text"));
      for (const el of lfts) {
        const v = valOf(el);
        const hit = tryMatch(v);
        if (hit) return hit;
      }
    } catch(_) {}
    try {
      const all = Array.from(r.querySelectorAll("*"));
      const labelEl = all.find(n => /Responsible\s+Integrated\s+OU/i.test(norm(n.textContent)));
      if (labelEl) {
        const container = labelEl.closest("records-record-layout-item, lightning-layout, div, section") || labelEl.parentElement;
        if (container) {
          const valueEl =
            container.querySelector("lightning-formatted-text") ||
            container.querySelector("[data-output-element], [data-value], [title]");
          const v = valOf(valueEl);
          const hit = tryMatch(v);
          if (hit) return hit;
        }
      }
    } catch(_) {}
  }
  return null;
}
async function getSourceInfoTextEnsured(){
  const onSI = await ensureOnTab("Source Information") || await ensureOnTab("Source Info");
  if (!onSI) return null;
  const txt = await waitFor(() => getFieldTextByLabel("Source Information") || getFieldTextByLabel("Source Info"), {timeout: 6000});
  return txt || null;
}
async function getOUEnsured(){
  let ou = getOUFromPage();
  if (ou) return ou;
  const onDetails = await ensureOnTab("Details", {timeout: 8000});
  if (!onDetails) return null;
  ou = await waitFor(() => getOUFromPage(), {timeout: 5000});
  return ou || null;
}
(async function run() {
  const tab = openTabEarly();
  if (!tab) return;
  const originalTab = getActiveTabLabel();
  const OUKey = await getOUEnsured();
  const finalConfig = { styleWords: [], boldLinesKeyWords: [] };
  if (OUKey && config[OUKey]) {
    mergeConfig(finalConfig, config[OUKey]);
  } else {
    console.warn("[Interface Formatter] OU not found in page or not defined in styles.js.", OUKey);
  }
  if (finalConfig.styleWords.length) {
    const seen = new Set();
    finalConfig.styleWords = finalConfig.styleWords.filter(sw => {
      const key = sw.style + "||" + (sw.words || []).join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  const rows = await getRowwiseSourceInfoEnsured();
  const srcRows = rows.filter(r => r.sourceText && !r.add);
  const addRows = rows.filter(r => r.add); 
  const recordId = (await getRecordIdSmart()) || "Record";
  if (originalTab) {
    if (!(await ensureOnTab(originalTab))) {
      if (/^details$/i.test(originalTab)) {
        await ensureOnTab("Details");
      } else if (/source info(rmation)?/i.test(originalTab)) {
        await ensureOnTab("Source Information") || await ensureOnTab("Source Info");
      }
    }
  }
  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function applyCombinedStyles(text, styleRules) {
    let events = [];
    styleRules.forEach(rule => {
      rule.words.forEach(word => {
        const pattern = /\s/.test(word)
          ? escapeRegExp(word)
          : "\\b" + escapeRegExp(word) + "\\b";
        const regex = new RegExp(pattern, "gi");
        let match;
        while ((match = regex.exec(text)) !== null) {
          events.push({
            index: match.index,
            type: "start",
            style: rule.style
          });
          events.push({
            index: match.index + match[0].length,
            type: "end",
            style: rule.style
          });
        }
      });
    });
    events.sort((a, b) => {
      if (a.index !== b.index) return a.index - b.index;
      return a.type === "start" ? -1 : 1;
    });
    let result = "";
    let currentIndex = 0;
    let activeStyles = [];
    events.forEach(event => {
      if (event.index > currentIndex) {
        let segment = text.slice(currentIndex, event.index);
        if (activeStyles.length > 0) {
          let combined = activeStyles.join(";");
          result += `<span style="${combined}">${segment}</span>`;
        } else {
          result += segment;
        }
        currentIndex = event.index;
      }
      if (event.type === "start") {
        activeStyles.push(event.style);
      } else {
        let idx = activeStyles.indexOf(event.style);
        if (idx !== -1) {
          activeStyles.splice(idx, 1);
        }
      }
    });
    if (currentIndex < text.length) {
      let segment = text.slice(currentIndex);
      if (activeStyles.length > 0) {
        let combined = activeStyles.join(";");
        result += `<span style="${combined}">${segment}</span>`;
      } else {
        result += segment;
      }
    }
    return result;
  }
  if (finalConfig.styleWords.length || finalConfig.boldLinesKeyWords.length) {
    var styleWords = finalConfig.styleWords;
    var boldLinesKeyWords = finalConfig.boldLinesKeyWords;
    styleWords.forEach(s => {
      s.words.sort((a, b) => b.length - a.length);
    });
    var lines = [];
    var links = [];
    var linkIdCounter = 0;

    function formatText(text, txtType) {
      text = text.replace(/\r\n|\r/g, "\n");
      text = text.replace(/(?<!\*)\*(?!\*)/g, "\n*");
      text = text.replace(/-###-From (SR|PE)-/g, "\n$&");
      var linesArr = text.split("\n").filter(l => l.trim().length > 0);
      var localLinks = [];
      var startLine = 0;
      let newLinesArr = [];
      linesArr.forEach(function(l, lineNo) {
        l = l.replace(/\s+$/, "");
        l = l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        let dateMatch = l.includes("WEBMREMOTEWS") ? l.match(
          /(\b(?:\d{4}[-/.](?:\d{1,2}|[A-Za-z]{3})[-/.]\d{1,2}|(?:\d{1,2}[-/ ](?:[A-Za-z]{3,9})[-/ ]\d{4})|(?:[A-Za-z]{3,9} \d{1,2}, \d{4})|(?:\d{1,2}[-/]\d{1,2}[-/]\d{4}))(?: \d{1,2}:\d{2}(?::\d{2})?(?: ?[APap][Mm])?)?\b)/
        ) : null;
        let hasDate = false;
        if (
          l.includes("WEBMREMOTEWS") &&
          dateMatch &&
          newLinesArr.length > 0 &&                              
          newLinesArr[newLinesArr.length - 1].trim() !== "" 
        ) {
          newLinesArr.push("");
        }
        if (dateMatch) {
          hasDate = true;
          let dateStr = dateMatch[0];
          l =
            `<span style="position: relative;" id="lnk${linkIdCounter}">` +
            `<span class="arrowPointer" id="lnk${linkIdCounter}-arrow">&#x2192;</span>` +
            l +
            `</span>`;
          if (txtType === "General") {
            localLinks.push({
              id: `lnk${linkIdCounter}`,
              title: dateStr,
              level: 1,
              start: startLine,
              end: lineNo
            });
            startLine = lineNo + 1;
          } else {
            if (localLinks.length > 0) {
              localLinks[localLinks.length - 1].end = lineNo - 1;
            }
            localLinks.push({
              id: `lnk${linkIdCounter}`,
              title: dateStr,
              level: 1,
              start: lineNo,
              end: null
            });
          }
          linkIdCounter++;
        }
        boldLinesKeyWords.forEach(kw => {
          if (l.indexOf(kw) >= 0 && !hasDate) {
            l =
              `<span style="position: relative;" id="lnk${linkIdCounter}">` +
              `<span class="arrowPointer" id="lnk${linkIdCounter}-arrow">&#x2192;</span>` +
              l +
              `</span>`;
            localLinks.push({
              id: `lnk${linkIdCounter}`,
              title: kw,
              level: 1,
              start: lineNo,
              end: lineNo
            });
            linkIdCounter++;
          }
        });
        l = applyCombinedStyles(l, styleWords);
        newLinesArr.push(l);
      });
      linesArr = newLinesArr;
      if (localLinks.length > 0 && txtType !== "General") {
        localLinks[localLinks.length - 1].end = linesArr.length - 1;
        startLine = linesArr.length;
      }
      if (localLinks.length === 0) {
        return {
          lines: linesArr,
          links: []
        };
      }
      var LinksSorted = localLinks.concat().sort(function(a, b) {
        var dateA = new Date(a.title);
        var dateB = new Date(b.title);
        if (isNaN(dateA) || isNaN(dateB)) {
          return a.title.localeCompare(b.title);
        }
        return dateA - dateB;
      });
      return {
        lines: linesArr,
        links: LinksSorted
      };
    }
    const recordId = (await getRecordIdSmart()) || "Record";
    const textInfoF = ["Source Information"];
    if (srcRows.length) {
      const t = "Source Information";
      const tId = t.replace(/\W/gi, "");
      lines.push('<div class="card">');
      lines.push('<h2 id="' + tId + '">' + t + "</h2>");
      srcRows.forEach((r, i) => {
        const ft = formatText(r.sourceText, t);
        lines.push(`<div><strong>Row ${i+1}</strong></div>`);
        lines = lines.concat(ft.lines);
        if (i < srcRows.length - 1) lines.push("<br/>");
      });
      links.push({ id: tId, title: t });
      lines.push("</div>");
    } else {
      console.warn("[Interface Formatter] No Source Information rows found.");
    }
    if (addRows.length) {
      const t = "Additional Source Information";
      const tId = t.replace(/\W/gi, "");
      lines.push('<div class="card">');
      lines.push('<h2 id="' + tId + '">' + t + "</h2>");
      addRows.forEach(r => {
        const { title, href, rowIndex } = r.add;
        const label = title || "Additional Info Review";
        lines.push(`<div>Row ${rowIndex}: <a target="_blank" rel="noopener" href="${href}">${label}</a></div>`);
      });
      links.push({ id: tId, title: t });
      lines.push("</div>");
    }
    console.info("[Interface Formatter] harvested rows:",
      rows.map((r,i) => ({i: i+1, hasSource: !!r.sourceText, hasAdd: !!r.add, addTitle: r.add?.title})));
    var content = lines.join("<br/>");
    var groupedNav = [];
    var currentGroup = null;
    links.forEach(function(link) {
      if (!link.level) {
        currentGroup = { header: link, children: [] };
        groupedNav.push(currentGroup);
      } else {
        if (currentGroup) {
          currentGroup.children.push(link);
        } else {
          currentGroup = {
            header: { id: "default", title: "Default" },
            children: [link]
          };
          groupedNav.push(currentGroup);
        }
      }
    });
    var styleBlock = `
  <style>
  body {
    margin: 0;
    padding: 0;
    font-family: system-ui, sans-serif;
    background: #EEF2F7;
  }
  #modern-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background: #2C5282;
    color: #fff;
    padding: 20px;
    box-shadow: 3px 0 8px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
    box-sizing: border-box;
    z-index: 9999;
  }
  .ou-pill{
    margin: 4px 0 12px 0;
    display: inline-block;
    padding: 6px 10px;
    border-radius: 9999px;
    background: rgba(255,255,255,0.15);
    color: #E6F6FF;
    font-weight: 600;
    letter-spacing:.2px;
  }
  .brand small{ display:block; opacity:.85; font-weight:600; margin-top:2px; }
  .brand {
    font-size: 1.4rem;
    font-weight: 900;
    margin-bottom: 24px;
    background: linear-gradient(90deg, #BEE3E8 0%, #63B3ED 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 1px;
    line-height: 1.4;
  }
  #modern-nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  #modern-nav li {
    margin-bottom: 8px;
  }
  #modern-nav ul ul {
    padding-left: 1.2em;
  }
  #modern-nav a {
    color: #F8FAFC;
    text-decoration: none;
    display: inline-block;
    padding: 5px 0;
    border-radius: 4px;
    transition: transform 0.25s ease, background 0.25s ease;
  }
  #modern-nav a:hover {
    background: rgba(255,255,255,0.1);
    transform: scale(1.05);
  }
  #main-content {
    margin-left: 300px;
    padding: 20px;
    box-sizing: border-box;
    min-height: 100vh;
  }
  .card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
    box-sizing: border-box;
    word-wrap: break-word;
    white-space: pre-wrap;
    line-height: 1.5;
  }
  h2 {
    margin-top: 0;
    margin-bottom: 12px;
    font-size: 1.2rem;
    border-bottom: 2px solid #3182FE;
    padding-bottom: 6px;
    color: #2D3748;
  }
  @media (max-width: 768px) {
    #modern-nav {
      position: static;
      width: 100%;
      height: auto;
      box-shadow: none;
      margin-bottom: 10px;
    }
    #main-content {
      margin-left: 0;
      min-height: auto;
    }
  }
  .arrowPointer {
    color: red !important;
    background-color: white;
    font-weight: bold;
    display: none;
    font-size: 1.2em;
    margin-right: 5px;
    animation: arrowFade 2s ease-out;
  }
  @keyframes arrowFade {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
  </style>
  `;
    var htmlParts = [];
    htmlParts.push('<div id="modern-nav">');
    htmlParts.push(`<div class="brand">Interface Formatter<br/>${recordId}</div>`);
    const ouText = OUKey ? `OU: ${OUKey}` : "OU: Unknown";
    htmlParts.push(`<ul>`);
    htmlParts.push(`<li class="ou-pill">${ouText}</li>`);
    groupedNav.forEach(group => {
      htmlParts.push("<li>");
      htmlParts.push(
        `<a href="javascript:void(0);" onclick="
          const el = document.getElementById('${group.header.id}');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        ">
        ${group.header.title}
        </a>`
      );
      if (group.children && group.children.length > 0) {
        htmlParts.push("<ul>");
        group.children.forEach(child => {
          htmlParts.push(
            `<li>
              <a href="javascript:void(0);"
                  onclick="
                    const el = document.getElementById('${child.id}');
                    const arrow = document.getElementById('${child.id}-arrow');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                      // Show arrow for two seconds
                      if (arrow) {
                        arrow.style.display = 'inline';
                        setTimeout(() => { arrow.style.display = 'none'; }, 2000);
                      }
                    }
                  ">
                  ${child.title}
              </a>
            </li>`
          );
        });
        htmlParts.push("</ul>");
      }
      htmlParts.push("</li>");
    });
    htmlParts.push("</ul>");
    htmlParts.push("</div>");
    htmlParts.push(`<div id="main-content">${content}</div>`);
    var scriptBlock = `
      <script>
        console.log('Nav is fixed on wide screens, stacked on top at narrow. Date-based line re-ordering applied.');
      </script>
    `;
    function renderInTab(html) {
      try {
        tab.document.open();
        tab.document.write(`<!doctype html><html><head><meta charset="utf-8">
          <title>Interface Formatter</title></head>
          <body>${html}</body></html>`);
        tab.document.close();
      } catch (_) {
        setTimeout(() => {
          try {
            tab.document.open();
            tab.document.write(`<!doctype html><html><head><meta charset="utf-8">
              <title>Interface Formatter</title></head>
              <body>${html}</body></html>`);
            tab.document.close();
          } catch(e) {}
        }, 100);
      }
    }
    renderInTab(styleBlock + htmlParts.join("") + scriptBlock);
  }
})();
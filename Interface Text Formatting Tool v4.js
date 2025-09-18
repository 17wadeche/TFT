/* eslint semi: ["error", "always"] */
import config from "./styles";
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
function getRecordIdFromPage(){
  const root = top?.document || document;
  const titleHit = (root.title || "").match(/\b[A-Z]{2}-\d{3,}\b/);
  if (titleHit) return titleHit[0];
  const cnRe = /\b[A-Z]{2}-\d{3,}\b/;
  for (const r of allRoots(root)) {
    try {
      let els = Array.from(r.querySelectorAll("[data-output-element-id='output-field']"));
      els = els.concat(Array.from(r.querySelectorAll("lightning-formatted-text[slot='output']")));
      els = els.concat(Array.from(r.querySelectorAll("lightning-formatted-text")));
      for (const el of els) {
        const t = norm(valOf(el));
        if (!t) continue;
        const m = t.match(cnRe);
        if (m) return m[0];
      }
    } catch(_) {}
  }
  try {
    const walker = root.createTreeWalker(root.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const txt = norm(node.nodeValue);
      const m = txt.match(cnRe);
      if (m) return m[0];
    }
  } catch(_) {}
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
async function getOUWithTabHop(){
  let ou = getOUFromPage();
  if (ou) return ou;
  const srcTab = findTabByLabel("Source Info");
  const detTab = findTabByLabel("Details");
  if (!srcTab || !detTab) return null;
  if (srcTab.getAttribute("aria-selected") !== "true" && detTab.getAttribute("aria-selected") === "true") {
    return await waitFor(() => getOUFromPage());
  }
  detTab.click();
  await waitFor(() => detTab.getAttribute("aria-selected") === "true");
  ou = await waitFor(() => getOUFromPage());
  try {
    srcTab.click();
    await waitFor(() => srcTab.getAttribute("aria-selected") === "true");
  } catch(_) {}
  return ou;
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
  const txtSourceInfo = await getSourceInfoTextEnsured();
  const recordId = getRecordIdFromPage() || "Record";
  if (originalTab) {
    if (!(await ensureOnTab(originalTab))) {
      if (/^details$/i.test(originalTab)) {
        await ensureOnTab("Details");
      } else if (/source info(rmation)?/i.test(originalTab)) {
        await ensureOnTab("Source Information") || await ensureOnTab("Source Info");
      }
    }
  }
  if (!txtSourceInfo) {
    console.warn("[Interface Formatter] No Source Information found to render.");
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
    const recordId = getRecordIdFromPage() || "Record";
    const textInfoF = ["Source Information"];
    textInfoF.forEach(function(t) {
      const txt = (t === "Source Information") ? txtSourceInfo : getFieldTextByLabel(t);
      const tId = t.replace(/\W/gi, "");
      if (txt) {
        lines.push('<div class="card">');
        lines.push('<h2 id="' + tId + '">' + recordId + " " + t + "</h2>");
        const ft = formatText(txt, t);
        lines = lines.concat(ft.lines);
        links.push({ id: tId, title: t });
        links = links.concat(ft.links);
        lines.push("</div>");
      }
    });
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
    htmlParts.push("<ul>");
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
    var q = window.open("../crm_ui_frame/blank.htm");
    setTimeout(function() {
      if (!q || !q.document) { alert("Popup blocked or failed to open."); return; }
      q.document.body.innerHTML = styleBlock + htmlParts.join("") + scriptBlock;
      setTimeout(function(){
        const late = getRecordIdFromPage();
        if (late) {
          const brand = q.document.querySelector(".brand");
          if (brand) brand.innerHTML = `Interface Formatter<br/>${late}`;
        }
      }, 600);
    }, 100);
  }
})();
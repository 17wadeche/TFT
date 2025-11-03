/* eslint semi: ["error", "always"] */
import config from "./BUstyles";
const GLOBAL_MATCH_MODE = 'substring';
var primBUPartner = top.GUIDE.PE[top.GUIDE.PE.curPrEv].PartnersTable.find(
  p => p.PartnerFunction === "BU Responsible" && p.MainPartner
);
var BUresp = primBUPartner ? primBUPartner.Name : null;
var primOUPartner = top.GUIDE.PE[top.GUIDE.PE.curPrEv].PartnersTable.find(
  p => p.PartnerFunction === "OU Responsible" && p.MainPartner
);
var OUResp = primOUPartner ? primOUPartner.Name : null;
function mergeConfig(target, source) {
  if (!source) return;
  if (source.styleWords) {
    target.styleWords.push(...source.styleWords);
  }
  if (source.boldLinesKeyWords) {
    target.boldLinesKeyWords.push(...source.boldLinesKeyWords);
  }
  if (source.matchMode) target.matchMode = source.matchMode;
}
var finalConfig = {
  styleWords: [],
  boldLinesKeyWords: [],
  matchMode: GLOBAL_MATCH_MODE
};
if (BUresp && config[BUresp]) {
  mergeConfig(finalConfig, config[BUresp]);
  if (OUResp) {
    if (config[BUresp][OUResp]) {
      mergeConfig(finalConfig, config[BUresp][OUResp]);
    } else {
      for (const possibleOU of Object.keys(config[BUresp])) {
        if (possibleOU === "styleWords" || possibleOU === "boldLinesKeyWords") {
          continue;
        }
        const ouObj = config[BUresp][possibleOU];
        if (ouObj && typeof ouObj === "object" && ouObj[OUResp]) {
          mergeConfig(finalConfig, ouObj);
          mergeConfig(finalConfig, ouObj[OUResp]);
          break;
        }
      }
    }
  }
}
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function applyCombinedStyles(text, styleRules, defaultMatchMode = 'word') {
  let events = [];
  styleRules.forEach(rule => {
    const mode = (rule.matchMode || defaultMatchMode).toLowerCase(); // rule can override global
    rule.words.forEach(word => {
      let pattern;
      if (/\s/.test(word)) {
        pattern = escapeRegExp(word);
      } else {
        pattern = mode === 'substring'
          ? escapeRegExp(word)                  // inner-word allowed
          : "\\b" + escapeRegExp(word) + "\\b"; // whole-word only
      }
      const regex = new RegExp(pattern, "gi");
      let match;
      while ((match = regex.exec(text)) !== null) {
        events.push({ index: match.index, type: "start", style: rule.style });
        events.push({ index: match.index + match[0].length, type: "end", style: rule.style });
        if (match.index === regex.lastIndex) regex.lastIndex++; // avoid zero-length loops
      }
    });
  });
  events.sort((a, b) => (a.index !== b.index ? a.index - b.index : a.type === "start" ? -1 : 1));
  let result = "", currentIndex = 0, activeStyles = [];
  events.forEach(event => {
    if (event.index > currentIndex) {
      const segment = text.slice(currentIndex, event.index);
      result += activeStyles.length ? `<span style="${activeStyles.join(";")}">${segment}</span>` : segment;
      currentIndex = event.index;
    }
    if (event.type === "start") {
      activeStyles.push(event.style);
    } else {
      const idx = activeStyles.indexOf(event.style);
      if (idx !== -1) activeStyles.splice(idx, 1);
    }
  });
  if (currentIndex < text.length) {
    const segment = text.slice(currentIndex);
    result += activeStyles.length ? `<span style="${activeStyles.join(";")}">${segment}</span>` : segment;
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
        newLinesArr.length > 0 &&                              // not the first line overall
        newLinesArr[newLinesArr.length - 1].trim() !== ""      // previous line isn't already blank
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
      l = applyCombinedStyles(l, styleWords, finalConfig.matchMode);
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
  var textInfoF = ["Interface Details", "Interface Update Details", "As Reported Event Description"];
  textInfoF.forEach(function(t) {
    var txt = top.GUIDE.PE[top.GUIDE.PE.curPrEv].textInfo[t];
    var tId = t.replace(/\W/gi, "");
    if (txt) {
      lines.push('<div class="card">');
      lines.push('<h2 id="' + tId + '">' + top.GUIDE.PE.curPrEv + " " + t + "</h2>");
      var ft = formatText(txt, t);
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
  htmlParts.push(`<div class="brand">Interface Formatter<br/>${top.GUIDE.PE.curPrEv}</div>`);
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
    if (!q || !q.document) {
      alert("Popup blocked or failed to open.");
      return;
    }
    q.document.body.innerHTML = styleBlock + htmlParts.join("") + scriptBlock;
  }, 100);
}
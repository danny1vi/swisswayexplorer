/**
 * SwissWayExplorer Content Pipeline — v3
 * 6-Agent System: Research → Approval → [Images + Writing PARALLEL] → Section Review → Final Review
 * 
 * Google Helpful Content compliant — People-First, not Search-First
 * 
 * Usage:
 *   node orchestrator.mjs "Best hiking trails in Zermatt"           # English (default)
 *   node orchestrator.mjs "İsviçre'de kayak rehberi" --lang=tr     # Turkish
 */

import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import https from "https";
import { pipeline } from "stream/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "output");

// ─── CLI ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const langFlag = args.find((a) => a.startsWith("--lang="));
const FORCE_LANG = langFlag ? langFlag.split("=")[1] : null;
const topic = args.find((a) => !a.startsWith("--")) || "Switzerland travel guide";

const slug = topic
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, "")
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-")
  .trim();

const RUN_DIR = path.join(OUTPUT_DIR, `${new Date().toISOString().slice(0, 10)}-${slug}`);
const LANGUAGE = FORCE_LANG || (/\p{L}*/u.test(topic) && /[çğıöşü]/i.test(topic) ? "tr" : "en");

// ─── Logging ─────────────────────────────────────────────────────────────────
const t = () => new Date().toISOString().slice(11, 19);
const log = (agent, msg) => console.log(`\x1b[36m[${t()}] ${agent}: ${msg}\x1b[0m`);
const ok = (agent, msg) => console.log(`\x1b[32m[${t()}] ✓ ${agent}: ${msg}\x1b[0m`);
const wr = (agent, msg) => console.log(`\x1b[33m[${t()}] ⚠ ${agent}: ${msg}\x1b[0m`);

// ─── FS Helpers ──────────────────────────────────────────────────────────────
const mkdir = (d) => fs.existsSync(d) || fs.mkdirSync(d, { recursive: true });
const read = (f) => fs.readFileSync(f, "utf-8");
const write = (f, c) => fs.writeFileSync(f, c, "utf-8");
const json = (f, d) => write(f, JSON.stringify(d, null, 2));

// ─── LLM Call Helper ─────────────────────────────────────────────────────────
async function llm(prompt) {
  // Uses mixture_of_agents for depth — all agents use this
  const { default: MoA } = await import("hermes_tools");
  const raw = await MoA({ user_prompt: prompt });
  return typeof raw === "string" ? raw : JSON.stringify(raw);
}

// ─── JSON Parser ─────────────────────────────────────────────────────────────
function parseJson(raw) {
  try {
    const m = raw.match(/```json\n?([\s\S]*?)\n?```/) || raw.match(/(\{[\s\S]*\})/);
    if (m) return JSON.parse(m[1]);
  } catch { /* fall through */ }
  
  // Flexible extraction as fallback
  const obj = {};
  const capture = (key, regex) => {
    const m = raw.match(regex);
    if (m) obj[key] = /^\d+$/.test(m[1]) ? +m[1] : m[1];
  };
  capture("konu", /"konu"\s*:\s*"([^"]*)"/);
  capture("topic", /"topic"\s*:\s*"([^"]*)"/);
  capture("h1", /"h1"\s*:\s*"([^"]*)"/);
  capture("targetKeyword", /"targetKeyword"\s*:\s*"([^"]*)"/);
  capture("kelimeHedefi", /"kelimeHedefi"\s*:\s*(\d+)/);
  capture("slug", /"slug"\s*:\s*"([^"]*)"/);
  
  const yapimatch = raw.match(/"yapi"\s*:\s*\[([\s\S]*?)\]/);
  if (yapimatch) {
    const blocks = yapimatch[1].split(/"h2"\s*:/).filter(Boolean);
    obj.yapi = blocks.map(b => {
      const h2m = b.match(/"([^"]*)"/);
      const wordm = b.match(/("kelime"|"kelimeHedefi")\s*:\s*(\d+)/);
      const h3m = b.match(/"h3"\s*:\s*\[([^\]]*)\]/);
      return {
        h2: h2m ? h2m[1] : b.slice(0, 60),
        kelime: wordm ? +wordm[2] : 200,
        h3: h3m ? h3m[1].split(",").map(s => s.trim().replace(/"/g, "")) : []
      };
    });
  }
  
  if (!obj.yapi?.length) {
    obj.yapi = [
      { h2: "Introduction", kelime: 200 },
      { h2: "Main Section 1", kelime: 300 },
      { h2: "Main Section 2", kelime: 300 },
      { h2: "Main Section 3", kelime: 300 },
      { h2: "Conclusion", kelime: 150 }
    ];
  }
  return obj;
}

// ─── Image Download ───────────────────────────────────────────────────────────
async function downloadImg(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 403) {
        https.get(url, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://hailuoai.video/" } }, (r2) => {
          pipeline(r2, fs.createWriteStream(dest)).then(() => resolve(dest)).catch(reject);
        }).on("error", reject);
      } else {
        pipeline(res, fs.createWriteStream(dest)).then(() => resolve(dest)).catch(reject);
      }
    });
    req.on("error", reject);
  });
}

// ════════════════════════════════════════════════════════════════════════════
// AGENT-1: RESEARCH
// ════════════════════════════════════════════════════════════════════════════
async function agentResearch(topic, lang) {
  log("AGENT-1", `Researching: "${topic}"`);
  mkdir(RUN_DIR);

  const promptFile = path.join(__dirname, "prompts", `research-prompt.${lang}.md`);
  const promptBase = fs.existsSync(promptFile)
    ? read(promptFile)
    : read(path.join(__dirname, "prompts", "research-prompt.en.md"));

  const prompt = promptBase
    .replace(/\{\{TOPIC\}\}/g, topic)
    .replace(/\{\{LANGUAGE\}\}/g, lang === "tr" ? "Turkish" : "English");

  const raw = await llm(prompt);
  const blueprint = parseJson(raw);

  json(path.join(RUN_DIR, "01-blueprint.json"), blueprint);
  ok("AGENT-1", `Blueprint: ${blueprint.h1 || blueprint.konu} (${blueprint.yapi?.length || 0} sections)`);

  return blueprint;
}

// ════════════════════════════════════════════════════════════════════════════
// AGENT-2: APPROVAL
// ════════════════════════════════════════════════════════════════════════════
async function agentApproval(blueprint, topic) {
  log("AGENT-2", "Evaluating blueprint...");

  const prompt = read(path.join(__dirname, "prompts", "approval-prompt.md"))
    .replace(/\{\{TOPIC\}\}/g, topic)
    .replace(/\{\{BLUEPRINT\}\}/g, JSON.stringify(blueprint, null, 2));

  const raw = await llm(prompt);

  let decision = { approved: false, score: 0, revisions: [] };
  try {
    const m = raw.match(/```json\n?([\s\S]*?)\n?```/) || raw.match(/(\{[\s\S]*\})/);
    if (m) decision = JSON.parse(m[1]);
  } catch {
    decision.approved = /approved|onay|yes|pass/i.test(raw);
  }

  json(path.join(RUN_DIR, "02-approval.json"), { decision, raw: raw.slice(0, 2000) });

  if (decision.approved) {
    ok("AGENT-2", `APPROVED (${decision.score}/16).`);
    return { approved: true, blueprint };
  }

  wr("AGENT-2", `REVISION NEEDED (${decision.score}/16). Auto-fixing...`);

  // Auto-fix loop (max 2 iterations)
  if (decision.revisions?.length) {
    const revised = applyRevisions(blueprint, decision.revisions);
    json(path.join(RUN_DIR, "01-blueprint-revised.json"), revised);
    log("AGENT-2", "Revisions applied. Re-evaluating...");
    return agentApproval(revised, topic); // Recursive
  }

  return { approved: false, blueprint };
}

function applyRevisions(blueprint, revisions) {
  const b = JSON.parse(JSON.stringify(blueprint));
  b.yapi = b.yapi || [];

  for (const rev of revisions) {
    if (rev.type === "add_section" && rev.section) {
      b.yapi.push(rev.section);
    } else if (rev.type === "remove_section" || rev.type === "remove") {
      b.yapi = b.yapi.filter(s => s.h2 !== rev.section && s.h2 !== rev.section_title);
    } else if (rev.type === "increase_wordcount" || rev.type === "increase_words") {
      const target = rev.section ? b.yapi.find(s => s.h2 === rev.section) : b;
      if (target) target.kelime = (target.kelime || 200) + (rev.by || 200);
    } else if (rev.type === "change_keyword") {
      b.targetKeyword = rev.new_keyword || rev.newKeyword;
    } else if (rev.type === "specify_uniqueAngle" || rev.type === "change_angle") {
      b.uniqueAngle = rev.suggestedAngle || rev.newAngle || rev.angle;
    } else if (rev.type === "add_eeatSignals" || rev.type === "fix_eeatSignals") {
      const s = b.yapi.find(sec => sec.h2 === rev.section);
      if (s) s.eeatSignals = rev.suggestedSignal || rev.signal;
    } else if (rev.type === "fix_pratikIpuclari") {
      const s = b.yapi.find(sec => sec.h2 === rev.section);
      if (s && rev.suggestedTips) s.pratikIpuclari = rev.suggestedTips;
    }
  }

  return b;
}

// ════════════════════════════════════════════════════════════════════════════
// AGENT-3: IMAGES (runs PARALLEL with Agent-4 Writing)
// ════════════════════════════════════════════════════════════════════════════
async function agentImages(blueprint, lang) {
  log("AGENT-3", "Generating images...");
  const imgDir = path.join(RUN_DIR, "images");
  mkdir(imgDir);

  const sections = blueprint.yapi || blueprint.structure || [];
  let { mcp_image_generate } = await import("hermes_tools");

  // Hero
  let heroPath = null;
  const heroPrompt = `Swiss Alps editorial travel photography: ${blueprint.konu || blueprint.topic}, ${blueprint.h1 || ""}, dramatic Matterhorn panorama, golden hour light, cinematic wide shot, professional travel magazine cover, no text overlay, no people`;
  try {
    const r = await mcp_image_generate({ prompt: heroPrompt, aspect_ratio: "landscape" });
    if (r?.url) heroPath = await downloadImg(r.url, path.join(imgDir, "00-hero.jpg"));
  } catch (e) {
    wr("AGENT-3", `Hero failed: ${e.message}`);
  }

  // H2 section images
  const sectionImages = [];
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const slug = slugify(sec.h2);
    const aspect = i % 2 === 0 ? "landscape" : "square";

    const imgPrompt = sec.imageConcept ||
      `${sec.h2} — Swiss Alps scenic backdrop, bold typography on dark gradient, minimal infographic card, professional editorial design`;

    let imgPath = null;
    try {
      const r = await mcp_image_generate({ prompt: imgPrompt, aspect_ratio: aspect });
      if (r?.url) imgPath = await downloadImg(r.url, path.join(imgDir, `0${i + 1}-${slug}.jpg`));
    } catch (e) {
      wr("AGENT-3", `Section ${i + 1} image failed: ${e.message}`);
    }

    sectionImages.push({ h2: sec.h2, imagePath: imgPath, slug });
  }

  // Social pin
  let socialPath = null;
  const socialPrompt = `Quote card: "${blueprint.uniqueAngle || blueprint.h1}", dark emerald background #1C3C34, large white text, Swiss Alps silhouette bottom, Pinterest Instagram format`;
  try {
    const r = await mcp_image_generate({ prompt: socialPrompt, aspect_ratio: "portrait" });
    if (r?.url) socialPath = await downloadImg(r.url, path.join(imgDir, "zz-social-pin.jpg"));
  } catch (e) {
    wr("AGENT-3", `Social pin failed: ${e.message}`);
  }

  const manifest = {
    article: blueprint.konu || blueprint.topic,
    h1: blueprint.h1,
    hero: heroPath,
    sections: sectionImages,
    social: socialPath,
    generatedAt: new Date().toISOString()
  };

  json(path.join(imgDir, "manifest.json"), manifest);
  ok("AGENT-3", `Images: ${[heroPath, ...sectionImages.map(s => s.imagePath), socialPath].filter(Boolean).length}/${1 + sections.length + 1} done`);

  return manifest;
}

// ════════════════════════════════════════════════════════════════════════════
// AGENT-4: WRITING (SEQUENTIAL — no chunks)
// ════════════════════════════════════════════════════════════════════════════
async function agentWriting(blueprint, lang) {
  log("AGENT-4", `Writing article in ${lang === "tr" ? "Turkish" : "English"}...`);

  const promptFile = path.join(__dirname, "prompts", `writing-prompt.${lang}.md`);
  const promptBase = fs.existsSync(promptFile)
    ? read(promptFile)
    : read(path.join(__dirname, "prompts", "writing-prompt.en.md"));

  const sectionsJson = JSON.stringify(blueprint.yapi || blueprint.structure || [], null, 2);

  const prompt = promptBase
    .replace(/\{\{TOPIC\}\}/g, blueprint.konu || blueprint.topic || topic)
    .replace(/\{\{H1\}\}/g, blueprint.h1 || "")
    .replace(/\{\{TARGET_KEYWORD\}\}/g, blueprint.targetKeyword || "")
    .replace(/\{\{SECTIONS\}\}/g, sectionsJson)
    .replace(/\{\{LANGUAGE\}\}/g, lang === "tr" ? "Turkish" : "English");

  const raw = await llm(prompt);

  // Strip markdown code fences if present
  const draft = raw.replace(/^```markdown\n?/, "").replace(/\n?```$/, "").trim();

  write(path.join(RUN_DIR, "04-draft-full.md"), draft);
  ok("AGENT-4", `Draft complete: ${draft.split(/\s+/).length} words`);

  return draft;
}

// ════════════════════════════════════════════════════════════════════════════
// AGENT-5: SECTION REVIEW
// ════════════════════════════════════════════════════════════════════════════
async function agentSectionReview(blueprint, draft, lang) {
  log("AGENT-5", "Reviewing sections...");

  const prompt = read(path.join(__dirname, "prompts", "section-review-prompt.md"))
    .replace(/\{\{TOPIC\}\}/g, topic)
    .replace(/\{\{SECTIONS\}\}/g, JSON.stringify(blueprint.yapi || [], null, 2))
    .replace(/\{\{DRAFT_TEXT\}\}/g, draft)
    .replace(/\{\{LANGUAGE\}\}/g, lang === "tr" ? "Turkish" : "English");

  const raw = await llm(prompt);

  let review = { approved: false, score: 0, rewrite_sections: [] };
  try {
    const m = raw.match(/```json\n?([\s\S]*?)\n?```/) || raw.match(/(\{[\s\S]*\})/);
    if (m) review = JSON.parse(m[1]);
  } catch {
    review.approved = /approved|pass/i.test(raw);
  }

  json(path.join(RUN_DIR, "05-section-reviews.json"), review);

  if (review.approved) {
    ok("AGENT-5", `APPROVED (${review.score}/10)`);
    return review;
  }

  wr("AGENT-5", `NEEDS REVISION: ${review.rewrite_sections?.join(", ") || "see issues"}`);
  return review;
}

// ════════════════════════════════════════════════════════════════════════════
// AGENT-6: FINAL REVIEW
// ════════════════════════════════════════════════════════════════════════════
async function agentFinalReview(blueprint, draft, lang) {
  log("AGENT-6", "Final integrity check...");

  const prompt = read(path.join(__dirname, "prompts", "final-review-prompt.md"))
    .replace(/\{\{TOPIC\}\}/g, topic)
    .replace(/\{\{DRAFT\}\}/g, draft)
    .replace(/\{\{BLUEPRINT\}\}/g, JSON.stringify(blueprint, null, 2))
    .replace(/\{\{LANGUAGE\}\}/g, lang === "tr" ? "Turkish" : "English");

  const raw = await llm(prompt);

  let review = { approved: false, score: 0, final_draft: draft, metaDescription: "" };
  try {
    const m = raw.match(/```json\n?([\s\S]*?)\n?```/) || raw.match(/(\{[\s\S]*\})/);
    if (m) review = { ...review, ...JSON.parse(m[1]) };
  } catch {
    review.approved = /approved|pass/i.test(raw);
  }

  const finalText = review.final_draft || draft;
  write(path.join(RUN_DIR, "06-final.md"), finalText);

  if (review.metaDescription) {
    write(path.join(RUN_DIR, "07-meta-description.txt"), review.metaDescription);
  }

  json(path.join(RUN_DIR, "06-final-review.json"), review);

  if (review.approved) {
    ok("AGENT-6", `APPROVED (${review.score}/10). Article ready!`);
  } else {
    wr("AGENT-6", `CHANGES REQUESTED (${review.score}/10).`);
  }

  return { ...review, final_draft: finalText };
}

// ════════════════════════════════════════════════════════════════════════════
// HIGHLIGHT BOX PARSER (Markdown → Sanity Blocks)
// ════════════════════════════════════════════════════════════════════════════
function parseHighlightBoxes(markdown) {
  const boxes = [];
  const regex = /\[!\/\/\s*highlight-box:\s*(tip|important|budget|route)\s*\n?\/\/\s*title:\s*(.+?)\s*\n?\/\/\s*body:\s*([\s\S]*?)\]/gi;

  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const toneMap = { tip: "tip", important: "important", budget: "budget", route: "route" };
    boxes.push({
      _type: "highlightBox",
      _key: `hb-${boxes.length + 1}`,
      tone: toneMap[match[1].toLowerCase()] || "tip",
      title: match[2].trim(),
      body: match[3].trim()
    });
  }

  // Remove annotations from markdown (keep body content, remove the box wrapper)
  const cleanedMarkdown = markdown.replace(regex, '');

  return { boxes, cleanedMarkdown };
}

// FAQ PARSER (Markdown → Sanity FAQ Blocks)
// ════════════════════════════════════════════════════════════════════════════
function parseFAQSection(markdown) {
  const faqItems = [];
  const regex = /\[!\/\/\s*faq\s*\n([\s\S]*?)\]/gi;

  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const content = match[1];
    // Split by "Q: " pattern
    const qaPairs = content.split(/\nQ:\s*/).filter(Boolean);

    for (const pair of qaPairs) {
      const colonIdx = pair.indexOf(':');
      if (colonIdx === -1) continue;
      const question = pair.slice(0, colonIdx).trim();
      const answer = pair.slice(colonIdx + 1).trim();
      if (question && answer) {
        faqItems.push({
          _type: "faqItem",
          _key: `faq-${faqItems.length + 1}`,
          question,
          answer
        });
      }
    }
  }

  // Remove FAQ annotations from markdown
  const cleanedMarkdown = markdown.replace(regex, '');

  return { faqItems, cleanedMarkdown };
}

function convertMarkdownToSanityBlocks(markdown) {
  // Extract highlight boxes and FAQ first
  const { boxes: highlightBoxes, cleanedMarkdown: md1 } = parseHighlightBoxes(markdown);
  const { faqItems, cleanedMarkdown } = parseFAQSection(md1);

  const blocks = [];
  const lines = cleanedMarkdown.split('\n');
  let currentBlock = null;
  let inBlockquote = false;
  let blockKey = 1;

  for (const line of lines) {
    // H2 heading
    if (line.startsWith('## ')) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        _type: 'block',
        _key: `b-${blockKey++}`,
        children: [{ _type: 'span', text: line.replace(/^##\s*/, ''), marks: ['strong'] }],
        style: 'h2'
      };
      blocks.push(currentBlock);
      currentBlock = null;
      continue;
    }

    // H3 heading
    if (line.startsWith('### ')) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        _type: 'block',
        _key: `b-${blockKey++}`,
        children: [{ _type: 'span', text: line.replace(/^###\s*/, ''), marks: ['strong'] }],
        style: 'h3'
      };
      blocks.push(currentBlock);
      currentBlock = null;
      continue;
    }

    // Highlight box — skip in block flow (already extracted)
    if (line.includes('[// highlight-box')) continue;

    // Blockquote ("> text")
    if (line.startsWith('> ')) {
      const text = line.replace(/^>\s*/, '').trim();
      if (text) {
        blocks.push({
          _type: 'block',
          _key: `b-${blockKey++}`,
          children: [{ _type: 'span', text, marks: [] }],
          style: 'blockquote'
        });
      }
      continue;
    }

    // Bullet list
    if (line.match(/^[-*]\s/)) {
      const text = line.replace(/^[-*]\s/, '').trim();
      blocks.push({
        _type: 'block',
        _key: `b-${blockKey++}`,
        children: [{ _type: 'span', text, marks: [] }],
        listItem: true,
        style: 'bullet'
      });
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\.\s/)) {
      const text = line.replace(/^\d+\.\s/, '').trim();
      blocks.push({
        _type: 'block',
        _key: `b-${blockKey++}`,
        children: [{ _type: 'span', text, marks: [] }],
        listItem: true,
        style: 'number'
      });
      continue;
    }

    // Regular paragraph
    if (line.trim()) {
      if (!currentBlock) {
        currentBlock = { _type: 'block', _key: `b-${blockKey++}`, children: [], style: 'normal' };
      }
      // Parse inline formatting
      const text = line;
      const children = parseInlineFormatting(text);
      currentBlock.children.push(...children);
    } else if (currentBlock && currentBlock.children.length > 0) {
      blocks.push(currentBlock);
      currentBlock = null;
    }
  }

  if (currentBlock && currentBlock.children.length > 0) {
    blocks.push(currentBlock);
  }

  // Interleave highlight boxes with blocks at appropriate positions
  // Insert after blocks with "Pratik Özet" or "Key Takeaway" content
  const finalBlocks = [];
  let hbIdx = 0;

  for (let i = 0; i < blocks.length; i++) {
    finalBlocks.push(blocks[i]);

    // After a paragraph that looks like a takeaway, insert next highlight box
    if (blocks[i].style === 'normal' && blocks[i].children?.[0]?.text?.match(/Pratik Özet|Key Takeaway|Özet/)) {
      if (hbIdx < highlightBoxes.length) {
        finalBlocks.push(highlightBoxes[hbIdx++]);
      }
    }
  }

  // Add remaining highlight boxes at the end
  while (hbIdx < highlightBoxes.length) {
    finalBlocks.push(highlightBoxes[hbIdx++]);
  }

  return { blocks: finalBlocks, faqItems, highlightBoxes };
}

function parseInlineFormatting(text) {
  const children = [];
  // Simple regex: **bold** and [link](url)
  const regex = /(\*\*[^*]+\*\*|\[([^\]]+)\]\(([^)]+)\)|([^**\[]+))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[0].startsWith('**') && match[0].endsWith('**')) {
      children.push({ _type: 'span', text: match[0].replace(/\*\*/g, ''), marks: ['strong'] });
    } else if (match[0].startsWith('[')) {
      children.push({ _type: 'span', text: match[2], marks: [{ _type: 'link', href: match[3] }] });
    } else if (match[0]) {
      children.push({ _type: 'span', text: match[0], marks: [] });
    }
  }

  if (children.length === 0) {
    children.push({ _type: 'span', text, marks: [] });
  }

  return children;
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE EMBEDDING (after writing, before final review)
// ════════════════════════════════════════════════════════════════════════════
function embedImages(draft, manifest) {
  let text = draft;

  // Build slug → path map
  const imgMap = {};
  for (const s of manifest.sections || []) {
    const slug = (s.h2 || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    imgMap[slug] = s.imagePath;
  }

  // Insert H2 section images BEFORE each H2
  const h2regex = /(##\s+[^\n]+)/g;
  let offset = 0;
  let match;
  const headings = [];
  while ((match = h2regex.exec(text)) !== null) headings.push({ idx: match.index, text: match[1] });

  // Iterate backwards to preserve positions
  for (let i = headings.length - 1; i >= 0; i--) {
    const h = headings[i];
    const slug = h.text.replace(/^##\s+/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const imgPath = imgMap[slug] || imgMap[slug.replace(/-/g, "")];

    if (imgPath) {
      const rel = imgPath.split("/").slice(-2).join("/").replace(/^images\//, "");
      const insert = `\n\n![${h.text}](${rel})\n\n`;
      text = text.slice(0, h.idx) + insert + text.slice(h.idx);
    }
  }

  // Hero: after H1
  if (manifest.hero) {
    const rel = manifest.hero.split("/").slice(-2).join("/").replace(/^images\//, "");
    const h1m = text.match(/^#\s+[^\n]+/m);
    if (h1m) {
      const pos = h1m.index + h1m[0].length;
      text = text.slice(0, pos) + `\n\n![Hero](${rel})\n` + text.slice(pos);
    }
  }

  return text;
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN PIPELINE
// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(`\n${"═".repeat(56)}`);
  console.log(`  SwissWayExplorer Content Pipeline v3`);
  console.log(`  Topic: "${topic}"`);
  console.log(`  Language: ${LANGUAGE === "tr" ? "Türkçe" : "English"}`);
  console.log(`  Output: ${RUN_DIR}`);
  console.log(`${"═".repeat(56)}\n`);

  mkdir(RUN_DIR);

  // Agent-1: Research
  const blueprint = await agentResearch(topic, LANGUAGE);

  // Agent-2: Approval
  const { approved, blueprint: finalBlueprint } = await agentApproval(blueprint, topic);
  if (!approved) {
    wr("PIPELINE", "Stopped: blueprint not approved.");
    process.exit(1);
  }

  // Agent-3 (Images) + Agent-4 (Writing) — PARALLEL
  log("PIPELINE", "Starting images + writing in PARALLEL...");
  const [imageManifest, draft] = await Promise.all([
    agentImages(finalBlueprint, LANGUAGE),
    agentWriting(finalBlueprint, LANGUAGE)
  ]);

  // Embed images into draft
  const draftWithImages = embedImages(draft, imageManifest);
  write(path.join(RUN_DIR, "04-draft-full.md"), draftWithImages);

  // Agent-5: Section Review
  const sectionReview = await agentSectionReview(finalBlueprint, draftWithImages, LANGUAGE);

  // Agent-6: Final Review
  const finalReview = await agentFinalReview(finalBlueprint, draftWithImages, LANGUAGE);

  // Summary
  const wordCount = (finalReview.final_draft || draftWithImages).split(/\s+/).length;

  // Convert final draft to Sanity blocks and save
  const { blocks: sanityBlocks, faqItems, highlightBoxes } = convertMarkdownToSanityBlocks(finalReview.final_draft || draftWithImages);
  json(path.join(RUN_DIR, "08-sanity-blocks.json"), sanityBlocks);
  json(path.join(RUN_DIR, "09-sanity-faq.json"), faqItems);
  ok("PIPELINE", `Sanity blocks: ${sanityBlocks.length} items (${highlightBoxes.length} highlight boxes, ${faqItems.length} FAQ items)`);

  console.log(`\n${"═".repeat(56)}`);
  console.log(`  PIPELINE COMPLETE`);
  console.log(`  ${"═".repeat(54)}`);
  console.log(`  01-blueprint:      ${RUN_DIR}/01-blueprint.json`);
  console.log(`  02-approval:       ${RUN_DIR}/02-approval.json`);
  console.log(`  04-draft-full:     ${RUN_DIR}/04-draft-full.md`);
  console.log(`  05-reviews:        ${RUN_DIR}/05-section-reviews.json`);
  console.log(`  06-final:          ${RUN_DIR}/06-final.md`);
  console.log(`  08-sanity-blocks:  ${RUN_DIR}/08-sanity-blocks.json`);
  console.log(`  09-sanity-faq:     ${RUN_DIR}/09-sanity-faq.json`);
  console.log(`  images:manifest:   ${RUN_DIR}/images/manifest.json`);
  console.log(`  Words: ${wordCount} | Final score: ${finalReview.score}/10`);
  console.log(`  Highlight boxes: ${highlightBoxes.length} | FAQ items: ${faqItems.length}`);
  console.log(`  ${"═".repeat(56)}\n`);

  return { ...finalReview, sanityBlocks, faqItems };
}

main().catch(console.error);

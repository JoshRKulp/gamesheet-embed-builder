"use client";

import { useMemo, useState } from "react";

type PageKey = "games" | "schedule" | "standings" | "players" | "goalies" | "team-stats";
type Scope = "seasons" | "leagues";
type GameType = "exhibition" | "regular_season" | "playoff" | "tournament";

type BuilderState = {
  scope: Scope;
  id: string;
  page: PageKey;
  primary: string;
  secondary: string;
  width: string;
  height: string;
  logo: boolean;
  navigation: boolean;
  statCards: boolean;
  filters: boolean;
  links: boolean;
  standings: boolean;
  compact: boolean;
  infiniteScroll: boolean;
  division: string;
  team: string;
  query: string;
  gameType: "all" | GameType;
  position: "all" | "forward" | "defence";
  venue: "all" | "home" | "away";
  standingsCols: string;
  playersCols: string;
  goaliesCols: string;
  playersSort: string;
  goaliesSort: string;
  playersLimit: string;
  goaliesLimit: string;
};

const defaults: BuilderState = {
  scope: "seasons", id: "", page: "games", primary: "F9C308", secondary: "36383D",
  width: "100%", height: "1000px", logo: true, navigation: true, statCards: true,
  filters: true, links: true, standings: true, compact: false, infiniteScroll: true,
  division: "", team: "", query: "", gameType: "all", position: "all", venue: "all",
  standingsCols: "rk,logo,team,gp,w,l,t,otl,pts", playersCols: "", goaliesCols: "",
  playersSort: "", goaliesSort: "", playersLimit: "", goaliesLimit: "",
};

const pageOptions: { key: PageKey; label: string; icon: string }[] = [
  { key: "games", label: "Games", icon: "▣" }, { key: "schedule", label: "Schedule", icon: "◷" },
  { key: "standings", label: "Standings", icon: "☷" }, { key: "players", label: "Players", icon: "♙" },
  { key: "goalies", label: "Goalies", icon: "◉" }, { key: "team-stats", label: "Team stats", icon: "⌁" },
];

const standingColumns = "rk, logo, team, gp, w, l, t, otw, otl, sow, sol, pts, ppct, rw, row, gf, ga, diff, stk, pim, ppo, ppg, shga, pppct, tsh, shg, ppga, pkpct";

const faqs = [
  ["What is a Gamesheet embed?", "A Gamesheet embed is an iframe that displays scores, schedules, standings, player stats, goalie stats, or team stats on your website. This builder creates the iframe URL and HTML for you."],
  ["Where do I find my Gamesheet season ID?", "Open any page inside your Gamesheet season. The season ID is the number shown in your browser address bar. You can also switch the builder to League and use your league ID."],
  ["Can I customize the colors and layout?", "Yes. Choose primary and secondary colors, set the iframe dimensions, and control logos, navigation, filters, links, standings, compact view, and infinite scrolling."],
  ["Can I embed a tournament schedule?", "Yes. Use the tournament preset to generate separate standings, round-robin, and playoff iframe blocks that are ready to paste into your website."],
];

function buildUrl(state: BuilderState, page = state.page, overrides: Record<string, string | boolean> = {}) {
  if (!state.id.trim()) return "";
  const params = new URLSearchParams();
  const add = (key: string, value: string | boolean | undefined) => {
    if (value !== undefined && value !== "" && value !== false && value !== "all") params.set(key, String(value));
  };
  add("configuration[primary-colour]", state.primary.replace(/^#/, ""));
  add("configuration[secondary-colour]", state.secondary.replace(/^#/, ""));
  if (!state.logo) add("configuration[logo]", false);
  if (!state.navigation) add("configuration[navigation]", false);
  if (!state.statCards) add("configuration[stat-cards]", false);
  if (!state.filters) add("configuration[filters]", false);
  if (!state.links) add("configuration[links]", false);
  if (!state.standings) add("configuration[standings]", false);
  if (state.compact) add("configuration[compact-view]", true);
  if (!state.infiniteScroll) add("configuration[infinite-scroll]", false);
  add("filter[division]", state.division);
  add("filter[team]", state.team);
  add("filter[query]", state.query);
  add("filter[type]", state.gameType);
  add("filter[position-group]", state.position);
  add("filter[venue-type]", state.venue);
  if (page === "standings") add("configuration[standings-cols]", state.standingsCols.replace(/\s/g, ""));
  if (page === "players") {
    add("configuration[players-cols]", state.playersCols.replace(/\s/g, ""));
    add("configuration[players-sort]", state.playersSort.replace(/\s/g, ""));
    add("configuration[players-limit]", state.playersLimit);
  }
  if (page === "goalies") {
    add("configuration[goalies-cols]", state.goaliesCols.replace(/\s/g, ""));
    add("configuration[goalies-sort]", state.goaliesSort.replace(/\s/g, ""));
    add("configuration[goalies-limit]", state.goaliesLimit);
  }
  Object.entries(overrides).forEach(([key, value]) => add(key, value));
  const query = params.toString();
  return `https://gamesheetstats.com/${state.scope}/${encodeURIComponent(state.id.trim())}/${page}${query ? `?${query}` : ""}`;
}

function iframeCode(url: string, width: string, height: string) {
  return `<iframe src="${url}" frameborder="0" style="width:${width}; height:${height};"></iframe>`;
}

export default function Home() {
  const [state, setState] = useState(defaults);
  const [advanced, setAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tournament, setTournament] = useState(false);
  const update = <K extends keyof BuilderState>(key: K, value: BuilderState[K]) => setState((current) => ({ ...current, [key]: value }));
  const url = useMemo(() => buildUrl(state), [state]);
  const code = iframeCode(url || "YOUR_GAMESHEET_URL", state.width, state.height);
  const tournamentBlocks = useMemo(() => {
    if (!state.id.trim()) return [];
    const shared = { "configuration[navigation]": false };
    return [
      ["Tournament standings", buildUrl(state, "standings", shared)],
      ["Round robin", buildUrl({ ...state, page: "schedule", gameType: "tournament", standings: false }, "schedule")],
      ["Playoffs", buildUrl({ ...state, page: "schedule", gameType: "playoff", standings: false }, "schedule")],
    ];
  }, [state]);

  async function copyCode() {
    try { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="https://www.embed-gamesheet.dev/" aria-label="embed-gamesheet.dev home"><span className="brand-mark">⌘</span><span>embed<span className="accent">-gamesheet.dev</span></span></a>
        <span className="version">GAMESHEET BUILDER <i>•</i> V1.0</span>
        <nav className="header-links" aria-label="Project links"><a className="docs-link" href="https://help.gamesheet.app/article/10-scores-schedule-standings-stats-embed-tool" target="_blank" rel="noreferrer">Documentation ↗</a><a className="docs-link github-link" href="https://github.com/JoshRKulp/gamesheet-embed-builder" target="_blank" rel="noreferrer">GitHub ↗</a></nav>
      </header>
      <section className="hero"><div><p className="eyebrow">CONFIGURE ONCE. EMBED ANYWHERE.</p><h1>Your stats.<br /><span>Your way.</span></h1><p className="intro">Build a clean, custom Gamesheet embed without hand-writing URL parameters.</p></div><div className="hero-badge"><span>↗</span><small>LIVE<br />PREVIEW</small></div></section>
      <div className="workspace">
        <section className="card builder-card">
          <div className="card-heading"><div><span className="section-number">01</span><h2>Choose your view</h2></div><span className="status-dot">READY</span></div>
          <div className="field-group"><label>Source</label><div className="segmented"><button className={state.scope === "seasons" ? "selected" : ""} onClick={() => update("scope", "seasons")}>Season</button><button className={state.scope === "leagues" ? "selected" : ""} onClick={() => update("scope", "leagues")}>League</button></div></div>
          <div className="field-group"><label htmlFor="source-id">{state.scope === "seasons" ? "Season" : "League"} ID <span className="required">*</span></label><input id="source-id" placeholder={state.scope === "seasons" ? "e.g. 317" : "e.g. 1148418"} value={state.id} inputMode="numeric" onChange={(e) => update("id", e.target.value.replace(/[^0-9]/g, ""))} /><p className="hint">Found in the URL of your Gamesheet {state.scope === "seasons" ? "season" : "league"}.</p></div>
          <div className="field-group"><label>Page</label><div className="page-grid">{pageOptions.map((option) => <button key={option.key} className={`page-option ${state.page === option.key ? "selected" : ""}`} onClick={() => update("page", option.key)}><span>{option.icon}</span>{option.label}</button>)}</div></div>
          <div className="divider" />
          <div className="card-heading compact-heading"><div><span className="section-number">02</span><h2>Style & sizing</h2></div></div>
          <div className="color-row"><div className="field-group"><label htmlFor="primary">Primary colour</label><div className="color-input"><input id="primary" type="color" value={`#${state.primary.replace(/^#/, "")}`} onChange={(e) => update("primary", e.target.value)} /><input value={state.primary.replace(/^#/, "").toUpperCase()} maxLength={6} onChange={(e) => update("primary", e.target.value.replace(/[^0-9a-f]/gi, "").slice(0, 6))} /></div></div><div className="field-group"><label htmlFor="secondary">Secondary colour</label><div className="color-input"><input id="secondary" type="color" value={`#${state.secondary.replace(/^#/, "")}`} onChange={(e) => update("secondary", e.target.value)} /><input value={state.secondary.replace(/^#/, "").toUpperCase()} maxLength={6} onChange={(e) => update("secondary", e.target.value.replace(/[^0-9a-f]/gi, "").slice(0, 6))} /></div></div></div>
          <div className="size-row"><div className="field-group"><label htmlFor="width">Width</label><input id="width" value={state.width} onChange={(e) => update("width", e.target.value)} /></div><div className="field-group"><label htmlFor="height">Height</label><input id="height" value={state.height} onChange={(e) => update("height", e.target.value)} /></div></div>
          <div className="toggle-grid">{([ ["logo", "GameSheet logo"], ["navigation", "Navigation links"], ["statCards", "Standings stat cards"], ["filters", "Filter controls"], ["links", "Clickable links"], ["standings", "Show standings"], ["compact", "Compact view"], ["infiniteScroll", "Infinite scroll"] ] as [keyof BuilderState, string][]).map(([key, label]) => <label className="toggle" key={key}><input type="checkbox" checked={Boolean(state[key])} onChange={(e) => update(key, e.target.checked as never)} /><span className="switch" />{label}</label>)}</div>
          <button className="advanced-button" onClick={() => setAdvanced(!advanced)}><span>＋</span> {advanced ? "Hide" : "Show"} advanced options <b>{advanced ? "⌃" : "⌄"}</b></button>
          {advanced && <div className="advanced-panel"><div className="field-group"><label>Division IDs</label><input placeholder="2290, 2291 or overall" value={state.division} onChange={(e) => update("division", e.target.value)} /></div><div className="field-group"><label>Team IDs</label><input placeholder="14410, 14411" value={state.team} onChange={(e) => update("team", e.target.value)} /></div><div className="field-group"><label>Search query</label><input placeholder="Toronto, venue, or game #" value={state.query} onChange={(e) => update("query", e.target.value)} /></div><div className="field-group"><label>Game type</label><select value={state.gameType} onChange={(e) => update("gameType", e.target.value as BuilderState["gameType"])}><option value="all">All game types</option><option value="exhibition">Exhibition</option><option value="regular_season">Regular season</option><option value="playoff">Playoff</option><option value="tournament">Tournament</option></select></div><div className="size-row"><div className="field-group"><label>Position group</label><select value={state.position} onChange={(e) => update("position", e.target.value as BuilderState["position"])}><option value="all">All positions</option><option value="forward">Forward</option><option value="defence">Defence</option></select></div><div className="field-group"><label>Venue</label><select value={state.venue} onChange={(e) => update("venue", e.target.value as BuilderState["venue"])}><option value="all">All venues</option><option value="home">Home</option><option value="away">Away</option></select></div></div><div className="field-group"><label>Standings columns</label><input value={state.standingsCols} onChange={(e) => update("standingsCols", e.target.value)} /><p className="hint">Available: {standingColumns}</p></div><div className="size-row"><div className="field-group"><label>Players columns</label><input placeholder="rk,player,team,num,g,a" value={state.playersCols} onChange={(e) => update("playersCols", e.target.value)} /></div><div className="field-group"><label>Goalies columns</label><input placeholder="rk,player,team,sv%" value={state.goaliesCols} onChange={(e) => update("goaliesCols", e.target.value)} /></div></div><div className="size-row"><div className="field-group"><label>Players sort / limit</label><div className="inline-inputs"><input placeholder="-g" value={state.playersSort} onChange={(e) => update("playersSort", e.target.value)} /><input type="number" min="1" placeholder="5" value={state.playersLimit} onChange={(e) => update("playersLimit", e.target.value)} /></div></div><div className="field-group"><label>Goalies sort / limit</label><div className="inline-inputs"><input placeholder="-sv%" value={state.goaliesSort} onChange={(e) => update("goaliesSort", e.target.value)} /><input type="number" min="1" placeholder="5" value={state.goaliesLimit} onChange={(e) => update("goaliesLimit", e.target.value)} /></div></div></div></div>}
          <div className="builder-actions"><button className="reset-button" onClick={() => { setState(defaults); setAdvanced(false); setTournament(false); }}>Reset</button><button className="primary-button" onClick={() => document.querySelector(".preview-card")?.scrollIntoView({ behavior: "smooth" })}>Preview embed <span>→</span></button></div>
        </section>
        <section className="preview-card card">
          <div className="card-heading"><div><span className="section-number">03</span><h2>Preview & copy</h2></div><span className={`preview-status ${url ? "live" : ""}`}><i />{url ? "LIVE PREVIEW" : "AWAITING ID"}</span></div>
          <div className={`preview-frame ${url ? "has-url" : ""}`} style={{ "--primary": `#${state.primary}` } as React.CSSProperties}>{url ? <iframe title="Gamesheet preview" src={url} style={{ width: state.width, height: state.height }} /> : <div className="empty-preview"><div className="empty-icon">⌁</div><p>Your live preview appears here</p><small>Enter a season or league ID to get started</small></div>}</div>
          <div className="code-label"><span>EMBED CODE</span><span>HTML</span></div><div className="code-box"><code>{code}</code><button onClick={copyCode} aria-label="Copy embed code">{copied ? "✓" : "▣"}<span>{copied ? "Copied" : "Copy"}</span></button></div>
          <div className="url-row"><span>Generated URL</span><button onClick={() => url && navigator.clipboard.writeText(url)} disabled={!url}>{url ? "Copy URL" : "Waiting for ID"}</button></div><div className="url-text">{url || "https://gamesheetstats.com/seasons/your-id/games"}</div>
          <div className="tournament-callout"><div><strong>Building a tournament page?</strong><p>Generate a ready-made standings, round robin, and playoff set.</p></div><button className={`small-toggle ${tournament ? "on" : ""}`} onClick={() => setTournament(!tournament)}>{tournament ? "Enabled" : "Try preset"} <span>→</span></button></div>
          {tournament && <div className="tournament-results">{tournamentBlocks.length ? tournamentBlocks.map(([label, blockUrl]) => <div className="tournament-block" key={label}><label>{label}</label><code>{iframeCode(blockUrl, state.width, state.height)}</code></div>) : <p className="hint">Add an ID to generate tournament blocks.</p>}</div>}
        </section>
      </div>
      <section className="seo-content" aria-labelledby="about-heading">
        <div className="seo-intro"><p className="eyebrow">THE FASTER WAY TO EMBED GAMESHEET</p><h2 id="about-heading">Build a Gamesheet embed<br /><span>without the guesswork.</span></h2><p>embed-gamesheet.dev is a free Gamesheet iframe generator for leagues, clubs, and tournament organizers. Configure your scores, schedule, standings, or stats widget visually, then copy one clean snippet into your website.</p></div>
        <div className="seo-features"><div><span>01</span><h3>Pick a view</h3><p>Start with a season or league and choose games, schedule, standings, players, goalies, or team stats.</p></div><div><span>02</span><h3>Make it yours</h3><p>Match your organization with custom colors, dimensions, visibility controls, filters, columns, and sorting.</p></div><div><span>03</span><h3>Paste and publish</h3><p>Copy the generated iframe HTML into any website builder or HTML block. Preview it before you publish.</p></div></div>
        <div className="faq-section"><p className="eyebrow">COMMON QUESTIONS</p><h2>Gamesheet embed FAQ</h2><div className="faq-grid">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>＋</span></summary><p>{answer}</p></details>)}</div></div>
        <div className="related-links"><p className="eyebrow">GO DEEPER</p><div><a href="/gamesheet-standings-embed">Gamesheet standings embed <span>→</span></a><a href="/gamesheet-schedule-embed">Gamesheet schedule embed <span>→</span></a><a href="/gamesheet-tournament-embed">Gamesheet tournament embed <span>→</span></a></div></div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "WebSite", "@id": "https://www.embed-gamesheet.dev/#website", "url": "https://www.embed-gamesheet.dev/", "name": "embed-gamesheet.dev", "description": "Gamesheet embed builder for scores, schedules, standings, and stats.", "potentialAction": { "@type": "SearchAction", "target": "https://www.embed-gamesheet.dev/?q={search_term_string}", "query-input": "required name=search_term_string" } }, { "@type": "SoftwareApplication", "name": "embed-gamesheet.dev", "url": "https://www.embed-gamesheet.dev/", "applicationCategory": "DeveloperApplication", "operatingSystem": "Web", "description": "A free visual builder for Gamesheet scores, schedule, standings, and stats iframe embeds.", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } }, { "@type": "FAQPage", "mainEntity": faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) }] }) }} />
      <footer><span>EMBED-GAMESHEET.DEV <b>×</b> GAMESHEET</span><span>Built for leagues, tournaments & clubs · <a href="https://github.com/JoshRKulp/gamesheet-embed-builder" target="_blank" rel="noreferrer">View source on GitHub ↗</a></span></footer>
    </main>
  );
}

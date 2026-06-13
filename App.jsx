import { useEffect, useState } from "react";
import TimelineInput from "./components/TimelineInput";
import ToneSelector from "./components/ToneSelector";
import DraftPanel from "./components/DraftPanel";
import SeverityBadge from "./components/SeverityBadge";
import "./App.css";

const SAMPLE_TIMELINE = `14:02 — Alert: API error rate spiked to 45% on us-east-1
14:05 — On-call paged; initial triage shows Redis cluster failover stuck
14:12 — Customer login and checkout flows failing; ~12k active sessions impacted
14:25 — Root cause: misconfigured health check blocked new primary promotion
14:40 — Fix deployed; error rate dropping, monitoring recovery
14:55 — All metrics green; post-incident review scheduled`;

export default function App() {
  const [timeline, setTimeline] = useState(SAMPLE_TIMELINE);
  const [tone, setTone] = useState("calm");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiMode, setAiMode] = useState("unknown");

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((data) => setAiMode(data.ai_mode))
      .catch(() => setAiMode("offline"));
  }, []);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeline, tone }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed (${res.status})`);
      }

      setResult(await res.json());
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header__brand">
          <span className="header__icon" aria-hidden="true">
            ⚡
          </span>
          <div>
            <h1>Customer Outage Comms Drafter</h1>
            <p className="header__tagline">
              Technical timeline → customer-ready status updates
            </p>
          </div>
        </div>
        <div className="header__meta">
          <span className={`mode-pill mode-pill--${aiMode}`}>
            {aiMode === "openai" ? "GPT Live" : aiMode === "mock" ? "Demo Mode" : "Offline"}
          </span>
        </div>
      </header>

      <main className="layout">
        <section className="panel panel--input">
          <h2>Engineer Timeline</h2>
          <p className="panel__hint">
            Paste the internal incident timeline. The agent will detect severity and draft
            three customer-facing messages.
          </p>

          <TimelineInput value={timeline} onChange={setTimeline} />

          <ToneSelector value={tone} onChange={setTone} />

          <button
            className="btn btn--primary"
            onClick={handleGenerate}
            disabled={loading || timeline.trim().length < 10}
          >
            {loading ? "Generating…" : "Generate Customer Drafts"}
          </button>

          {error && <div className="alert alert--error">{error}</div>}
        </section>

        <section className="panel panel--output">
          <div className="panel__header-row">
            <h2>Customer Drafts</h2>
            {result && (
              <div className="panel__badges">
                <SeverityBadge severity={result.severity} />
                <span className="tone-badge">Tone: {result.tone}</span>
              </div>
            )}
          </div>

          {!result && !loading && (
            <div className="empty-state">
              <p>Drafts will appear here after generation.</p>
              <p className="empty-state__sub">
                You'll get <strong>initial</strong>, <strong>in-progress</strong>, and{" "}
                <strong>resolved</strong> messages tuned to your selected tone.
              </p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>Analyzing severity and drafting messages…</p>
            </div>
          )}

          {result && !loading && <DraftPanel drafts={result.drafts} />}
        </section>
      </main>

      <footer className="footer">
        <span>POC — Tone-controlled · Severity-aware · LangChain + OpenAI</span>
      </footer>
    </div>
  );
}

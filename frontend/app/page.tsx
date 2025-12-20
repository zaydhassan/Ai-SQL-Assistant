import UploadDatasetForm from "@/components/UploadDatasetForm";
import DatasetsList from "@/components/DatasetsList";
import ExamplePrompts from "@/components/ExamplePrompts";

export default function HomePage() {
  return (
    <main className="container">
      {/* ================= HERO ================= */}
      <section className="hero fade-in">
        <h1>AI SQL Analytics Assistant</h1>
        <p className="muted hero-sub">
          Upload a CSV and ask questions in plain English.
          Powered by PostgreSQL, Python, and AI.
        </p>

        <ExamplePrompts />

        {/* TRUST BAR */}
        <div className="confidence-bar">
          <span>✔ Schema detected</span>
          <span>✔ Read-only SQL</span>
          <span>✔ Secure processing</span>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-it-works fade-in">
        <div className="how-step">
          <span>1</span>
          <h4>Upload CSV</h4>
          <p>Any structured dataset</p>
        </div>
        <div className="how-step">
          <span>2</span>
          <h4>AI Understands</h4>
          <p>Schema & relationships</p>
        </div>
        <div className="how-step">
          <span>3</span>
          <h4>Ask in English</h4>
          <p>No SQL required</p>
        </div>
        <div className="how-step">
          <span>4</span>
          <h4>Get Insights</h4>
          <p>Charts & KPIs</p>
        </div>
      </section>

      <section className="capabilities fade-in">
        <h3>What you can ask</h3>
        <div className="cap-grid">
          <div className="cap-card">📈 Sales trends over time</div>
          <div className="cap-card">🏆 Top products by revenue</div>
          <div className="cap-card">📊 Month-over-month growth</div>
          <div className="cap-card">💰 Average order value</div>
        </div>
      </section>

      <section className="grid fade-in">
        <UploadDatasetForm />
        <DatasetsList />
      </section>

      <section className="activity-feed fade-in">
        <div>⚡ Dataset indexed · 2 minutes ago</div>
        <div>🤖 Query executed · just now</div>
      </section>
    </main>
  );
}
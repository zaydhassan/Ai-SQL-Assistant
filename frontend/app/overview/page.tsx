export default function OverviewPage() {
  return (
    <main className="container py-16">
      {/* Header */}
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold">Overview</h1>
        <p className="mt-3 text-muted">
          A simple way to explore and understand structured data using plain English.
        </p>
      </div>

      {/* Feature cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-saas">
          <h3 className="text-lg font-semibold">Upload Data</h3>
          <p className="mt-2 text-muted">
            Upload CSV files and automatically detect schema and relationships.
          </p>
        </div>

        <div className="card-saas">
          <h3 className="text-lg font-semibold">Query in English</h3>
          <p className="mt-2 text-muted">
            Ask questions in natural language without writing SQL queries.
          </p>
        </div>

        <div className="card-saas">
          <h3 className="text-lg font-semibold">Safe & Secure</h3>
          <p className="mt-2 text-muted">
            Queries are read-only and executed in a secure environment.
          </p>
        </div>
      </div>

      {/* Why section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-saas">
          <h3 className="font-semibold">Who is this for?</h3>
          <ul className="mt-3 space-y-2 text-muted">
            <li>• Business analysts</li>
            <li>• Founders & product teams</li>
            <li>• Students learning data analysis</li>
          </ul>
        </div>

        <div className="card-saas">
          <h3 className="font-semibold">Why this product?</h3>
          <p className="mt-3 text-muted">
            Most data tools require SQL knowledge. This product removes that
            barrier and makes insights accessible to everyone.
          </p>
        </div>
      </div>
    </main>
  );
}
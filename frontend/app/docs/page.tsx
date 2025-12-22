export default function DocsPage() {
  return (
    <main className="container py-16">
      <h1 className="text-3xl font-semibold">Documentation</h1>
      <p className="mt-3 text-muted max-w-2xl">
        Everything you need to get started and understand how the system works.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-saas">
          <h3 className="font-semibold">Getting Started</h3>
          <p className="mt-2 text-muted">
            Learn how to upload your first dataset and begin exploring data.
          </p>
        </div>

        <div className="card-saas">
          <h3 className="font-semibold">Data Upload</h3>
          <p className="mt-2 text-muted">
            Supported formats, file size limits, and schema detection.
          </p>
        </div>

        <div className="card-saas">
          <h3 className="font-semibold">Query Processing</h3>
          <p className="mt-2 text-muted">
            How natural language is converted into safe SQL queries.
          </p>
        </div>

        <div className="card-saas">
          <h3 className="font-semibold">Security</h3>
          <p className="mt-2 text-muted">
            Read-only execution, isolation, and best practices.
          </p>
        </div>
      </div>
    </main>
  );
}
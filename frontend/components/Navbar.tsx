export default function Navbar() {
  return (
    <nav className="glass" style={{ padding: "14px 28px", margin: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>AI SQL</strong>
        <span style={{ color: "#a78bfa" }}>Datasets</span>
      </div>
    </nav>
  );
}
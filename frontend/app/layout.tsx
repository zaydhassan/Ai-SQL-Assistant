import "../app/globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        
        <nav className="navbar glass">
          <span className="logo">AI SQL</span>
          <a href="/" className="nav-link">
            Datasets
          </a>
        </nav>

        {children}

        <Toaster
          position="top-center"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}

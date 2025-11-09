export const metadata = {
  title: "Agentic E-Designer",
  description: "Design electronics from plain text requirements",
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

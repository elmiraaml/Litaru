import "./globals.css";

export const metadata = {
  title: "Litaru",
  description: "Digital library app by SMK Taruna Bhakti",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
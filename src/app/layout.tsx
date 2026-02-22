import './globals.css';

export const metadata = {
  title: 'Candidate Manager — Workflow',
  description: 'Candidate Decision System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

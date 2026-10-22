import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'BPJS Kesehatan Madiun Information Center — Portal Informasi & Layanan Terpadu JKN',
  description: 'Portal Informasi Resmi, Layanan Terpadu, dan Edukasi Peserta JKN Kantor Cabang Madiun berbasis Web & Google Apps Script',
  openGraph: {
    title: 'BPJS Kesehatan Madiun Information Center',
    description: 'Portal Informasi Resmi, Layanan Terpadu, dan Edukasi Peserta JKN Kantor Cabang Madiun',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BPJS Kesehatan Madiun Information Center',
    description: 'Portal Informasi Resmi, Layanan Terpadu, dan Edukasi Peserta JKN Kantor Cabang Madiun',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

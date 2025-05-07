import "./globals.css"; // Import global styles
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>WordMaster</title>
      </head>

      <body className="bg-gray-100">
        <div className="flex min-h-screen">
          <section className="flex-1 p-6 bg-gray-50">
            {children}
          </section>
        </div>
      </body>
    </html>
  );
}
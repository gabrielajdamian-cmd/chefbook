import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChefBook",
  description: "Aplicación de recetas y roles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "sans-serif", margin: 0, padding: 0, background: "#f9fafb" }}>
        {children}
      </body>
    </html>
  );
}

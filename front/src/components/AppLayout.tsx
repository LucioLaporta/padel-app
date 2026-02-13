import AppHeader from "./AppHeader";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AppHeader />

      <main style={{ padding: 20 }}>{children}</main>
    </div>
  );
}

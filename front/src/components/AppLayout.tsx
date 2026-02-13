import Navbar from "./Navbar";
import SidebarCourts from "./SidebarCourts";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />

      <div style={container}>
        <SidebarCourts />

        <div style={content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const container = {
  display: "flex",
};

const content = {
  flex: 1,
  padding: 20,
};

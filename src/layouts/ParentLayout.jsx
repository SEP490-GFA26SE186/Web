import { useState } from "react";
import { Outlet } from "react-router-dom";
import ParentSidebar from "../components/parent/ParentSidebar";
import ParentTopbar from "../components/parent/ParentTopbar";

function ParentLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      <ParentSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <ParentTopbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 lg:px-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ParentLayout;

import Header from "../components/Header";
import React from "react";
import Sidebar from "../components/Sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 w-full">
        <Header />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sticky Sidebar */}
        <div className="sticky top-0 h-screen w-64">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 m-5 bg-[#fffefc] border-2 rounded-md overflow-hidden">
          <div className="h-full overflow-y-auto p-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950">

      <Sidebar />

      <div className="flex h-screen flex-col lg:ml-72">

        <Header />

        <main className="mt-20 flex-1 overflow-y-auto p-4 md:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}
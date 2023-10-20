import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";

type Props = {
  projectId: string;
  children?: React.ReactNode;
};

const Layout = ({ projectId, children }: Props) => {
  return (
    <div className="w-screen h-screen bg-primary-800">
      <Navbar />
      <div className="grid grid-cols-[300px_auto]">
        <Sidebar projectId={projectId} />

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Layout;

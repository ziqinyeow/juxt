import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="w-screen h-screen">
      <Navbar />
      <div className="grid grid-cols-[300px_auto]">
        <Sidebar />

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Layout;

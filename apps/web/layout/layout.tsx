import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  projectId: string;
  children?: React.ReactNode;
};

const Layout = ({ projectId, children }: Props) => {
  const { hideSidePanel } = useStore();
  return (
    <div className="w-screen h-screen bg-primary-800">
      <Navbar />
      <div
        className={cn([
          "grid",
          hideSidePanel ? "grid-cols-[70px_auto]" : "grid-cols-[300px_auto]",
        ])}
      >
        <Sidebar projectId={projectId} />

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Layout;

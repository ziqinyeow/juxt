"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useHydration } from "@/lib/hooks/useHydration";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

const Loader = ({ children }: Props) => {
  const hydrated = useHydration();

  if (hydrated) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="border-4 border-white border-solid rounded-full w-7 h-7 animate-spinner border-t-transparent" />
    </div>
  );
};

export default Loader;

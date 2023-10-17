"use client";

import Canvas from "@/components/Canvas";
import Panel from "@/components/Panel";
import Layout from "@/layout/layout";
import { useStore } from "@/lib/store";
import { notFound } from "next/navigation";
import React, { useEffect } from "react";

const Page = ({ params }: { params: { id: string } }) => {
  const { projects, setCurrentProjectId } = useStore();

  useEffect(() => {
    setCurrentProjectId(params.id);
  }, [params.id, setCurrentProjectId]);

  if (projects.find((project) => project.id === params.id)) {
    return (
      <Layout>
        <div className="flex flex-col justify-between h-full bg-primary-800">
          <div className="relative h-full">
            <Canvas projectId={params?.id} />
          </div>
          <div className="">
            <Panel projectId={params?.id} />
          </div>
        </div>
      </Layout>
    );
  } else {
    return notFound();
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="border-4 border-white border-solid rounded-full w-7 h-7 animate-spinner border-t-transparent" />
    </div>
  );
};

export default Page;

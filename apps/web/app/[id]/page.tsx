"use client";

import Canvas from "@/components/Canvas";
import Dropzone from "@/components/Dropzone";
import Panel from "@/components/Panel";
import Layout from "@/layout/layout";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import React, { useEffect } from "react";

const Page = ({ params }: { params: { id: string } }) => {
  const { projects, setCurrentProjectId, hidePanel } = useStore();

  useEffect(() => {
    setCurrentProjectId(params.id);
    // refreshTracks(canvas);
  }, [params.id, setCurrentProjectId]);

  // console.log(projects.find((project) => project.id === params.id));

  if (projects.find((project) => project.id === params.id)) {
    return (
      <Dropzone projectId={params.id}>
        <Layout projectId={params.id}>
          <div
            className={cn([
              "h-full bg-light-200 dark:bg-primary-800 grid",
              hidePanel
                ? "grid-rows-[auto_calc(90px)]"
                : "grid-rows-[auto_calc(220px_+_90px)]",
            ])}
          >
            <div className="relative h-full">
              <Canvas projectId={params?.id} />
            </div>
            <div className="">
              <Panel projectId={params?.id} />
            </div>
          </div>
        </Layout>
      </Dropzone>
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

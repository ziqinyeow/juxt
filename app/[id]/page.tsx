import Canvas from "@/components/Canvas";
import Panel from "@/components/Panel";
import Layout from "@/layout/layout";
import React from "react";

const Page = () => {
  return (
    <Layout>
      <div className="flex flex-col justify-between h-full bg-primary-800">
        <div className="relative h-full">
          <Canvas />
        </div>
        <div className="">
          <Panel />
        </div>
      </div>
    </Layout>
  );
};

export default Page;

"use client";
import ChartModal from "@/components/Modal/ChartModal";
import React, { useState } from "react";

const Page = () => {
  const [openChartModal, setOpenChartModal] = useState(false);
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <div
        onClick={() => {
          setOpenChartModal(true);
        }}
        className="bg-black p-5 cursor-pointer text-white"
      >
        chart metrics.json
      </div>
      <ChartModal
        open={openChartModal}
        setOpen={setOpenChartModal}
        onClose={() => {}}
      />
    </div>
  );
};

export default Page;

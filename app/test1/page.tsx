"use client";

import { traverse } from "@/components/Dropzone/utils";
import { getFile, storeFile } from "@/lib/store/storage";
import { useTest } from "@/lib/store/test";
import { useEffect } from "react";

const Page = () => {
  const { bucket, mergeBucket } = useTest();

  useEffect(() => {
    const handlePasteAnywhere = async (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const text = e.clipboardData.getData("Text");

      const { bucket, files } = await traverse(e.clipboardData.items);
      //   (async () => {
      //     const file = await storeFile(files?.[0].file);
      //     console.log(file);
      //   })();
      //   if (bucket) {
      //     mergeBucket(bucket);
      //   }
    };

    window.addEventListener("paste", handlePasteAnywhere);
    return () => {
      window.removeEventListener("paste", handlePasteAnywhere);
    };
  }, [mergeBucket]);

  const ok = async () => {
    const file = (await getFile("sem7.png-icIAuAI9f5gAa1Rs0sKhZ")) as File;
    const url = URL.createObjectURL(file);
    console.log(url);
  };

  //   ok();

  return <div className="text-white">Page</div>;
};

export default Page;

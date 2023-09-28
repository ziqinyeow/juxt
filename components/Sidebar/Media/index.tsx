import { cn } from "@/lib/utils";
import Droparea from "../droparea";
import { useFile } from "@/lib/store/file";

const Media = () => {
  const { bucket } = useFile();
  console.log(bucket);

  return (
    <div className="px-2 h-[calc(100vh_-_64px_-_60px)] overflow-auto no_scrollbar">
      {bucket["/"].length === 0 ? (
        <Droparea id="upload-2" />
      ) : (
        <div className={cn([""])}></div>
      )}
    </div>
  );
};

export default Media;

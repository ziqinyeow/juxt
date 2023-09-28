import { useOperatingSystem } from "@/lib/hooks/useOperatingSystem";
import { useFile } from "@/lib/store/file";
import { IconPackageImport } from "@tabler/icons-react";
import { Files, Folders, Youtube } from "lucide-react";

const Droparea = ({ id }: { id: string }) => {
  const os = useOperatingSystem();
  const { mergeFileListToBucket } = useFile();

  return (
    <label htmlFor={id} className="w-full">
      <input
        id={id}
        name={id}
        onChange={(e) => {
          mergeFileListToBucket(e.target.files);
        }}
        type="file"
        className="hidden"
        multiple
      />
      <div className="border cursor-pointer flex tracking-widest text-sm p-4 items-center hover:text-secondary-200/60 text-secondary-200/40 justify-center border-primary-400 h-[calc(100vh_-_64px_-_60px)] rounded">
        <div className="flex flex-col items-center gap-8 transition-all">
          <div className="flex items-center gap-3">
            <IconPackageImport className="w-14 h-14" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span>Drag and drop</span>
            <span>OR</span>
            <span>Paste ({os === "mac" ? "⌘" : "ctrl"} + c and v)</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span>-</span>
              <Files className="w-5 h-5" />
              <span>Files</span>
            </div>
            <div className="flex items-center gap-2">
              <span>-</span>
              <Folders className="w-5 h-5" />
              <span>Folders</span>
            </div>
            <div className="flex items-center gap-2">
              <span>-</span>
              <Youtube className="w-5 h-5" />
              <span>Youtube Links</span>
            </div>
          </div>
        </div>
      </div>
    </label>
  );
};

export default Droparea;

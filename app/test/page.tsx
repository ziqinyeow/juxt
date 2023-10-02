import Canvas from "@/components/Canvas";
import Tools from "@/components/Canvas/tools";
import Panel from "@/components/Panel";
import Layout from "@/layout/layout";

export default function Home() {
  return (
    <div className="relative flex items-center justify-center w-screen h-screen bg-black">
      <Tools />
    </div>
  );
}

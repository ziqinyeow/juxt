import Canvas from "@/components/Canvas";
import Panel from "@/components/Panel";

export default function Home() {
  return (
    <div className="flex flex-col justify-between w-screen h-screen bg-primary-800">
      <div className="w-full h-20 bg-primary-600"></div>
      <div className="relative">
        <Canvas />
      </div>
      <div>
        <Panel />
      </div>
    </div>
  );
}

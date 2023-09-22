import Canvas from "@/components/Canvas";
import Panel from "@/components/Panel";

export default function Home() {
  return (
    <div className="flex flex-col justify-between w-screen h-screen bg-primary-800">
      <div className="w-full h-20 bg-primary-600"></div>
      <div className="h-[calc(100vh_-_5rem_-_310px)] w-full bg-primary-800">
        <Canvas />
      </div>
      <div>
        <Panel />
      </div>
    </div>
  );
}

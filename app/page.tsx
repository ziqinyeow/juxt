import Panel from "@/components/Panel";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col justify-between">
      <div className=""></div>
      <div></div>
      <div>
        <Panel />
      </div>
      {/* <div className="w-[80vw] h-[80vh]">
        <canvas className="border-2 w-full h-full"></canvas>
      </div> */}
    </div>
  );
}

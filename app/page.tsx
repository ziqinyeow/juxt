import Panel from "@/components/Panel";

export default function Home() {
  return (
    <div className="flex flex-col justify-between w-screen h-screen">
      <div className=""></div>
      <div></div>
      <div>
        <Panel />
      </div>
      {/* <div className="w-[80vw] h-[80vh]">
        <canvas className="w-full h-full border-2"></canvas>
      </div> */}
    </div>
  );
}

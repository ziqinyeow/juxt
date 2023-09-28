import Canvas from "@/components/Canvas";
import Panel from "@/components/Panel";
import Layout from "@/layout/layout";

export default function Home() {
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
}

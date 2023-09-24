import Canvas from "@/components/Canvas";
import Panel from "@/components/Panel";
import Layout from "@/layout/layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col justify-between bg-primary-800">
        <div className="relative">
          <Canvas />
        </div>
        <div>
          <Panel />
        </div>
      </div>
    </Layout>
  );
}

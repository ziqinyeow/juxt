import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { colors } from "@/lib/constants/colors";
import { Tag } from "@/lib/types/project";
import { cn } from "@/lib/utils";
import { IconScriptPlus } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import metrics from "@/public/metrics.json";
import ReactECharts from "echarts-for-react";
import chartTheme from "@/public/theme/chart.json";
import ChartDropdown from "../Chart/ChartDropdown";
import _ from "lodash";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
};

const metricMap = {
  Acceleration: "acceleration",
  "Non-smoothen Acceleration": "acceleration_no_smooth",
  Distance: "distance",
  "Original X": "raw_ori_x",
  "Original Y": "raw_ori_y",
  "Raw X": "raw_x",
  "Raw Y": "raw_y",
  Speed: "speed",
  "Non-smoothen Speed": "speed_no_smooth",
  X: "x",
  "Acceleration of X": "x_acceleration",
  "Non-smoothen Acceleration of X": "x_acceleration_no_smooth",
  "Displacement of X": "x_displacement",
  "Speed of X": "x_speed",
  "Non-smoothen Speed of X": "x_speed_no_smooth",
  Y: "y",
  "Acceleration of Y": "y_acceleration",
  "Non-smoothen Acceleration of Y": "y_acceleration_no_smooth",
  "Displacement of Y": "y_displacement",
  "Speed of Y": "y_speed",
  "Non-smoothen Speed of Y": "y_speed_no_smooth",
};

const bodyJoints = [
  "Nose",
  "Left Eye",
  "Right Eye",
  "Left Ear",
  "Right Ear",
  "Left Shoulder",
  "Right Shoulder",
  "Left Elbow",
  "Right Elbow",
  "Left Wrist",
  "Right Wrist",
  "Left Hip",
  "Right Hip",
  "Left Knee",
  "Right Knee",
  "Left Ankle",
  "Right Ankle",
];

const ChartModal = ({ open, setOpen, onClose }: Props) => {
  const [persons, setPersons] = useState([
    metrics.human_profiles.map((human) => String(human.metadata.human_idx))[0],
  ]);
  const [selectedBodyJoints, setSelectedBodyJoints] = useState<string[]>(
    bodyJoints
    // []
  );
  //   console.log(selectedBodyJoints);
  const [selectedMetrics, setSelectedMetrics] = useState(["Raw X"]);
  const [time, setTime] = useState(["frame"]);

  const series = useMemo(
    () =>
      metrics.human_profiles
        .find((human) => human.metadata.human_idx === Number(persons[0]))
        ?.body_joints.filter((body_joint) =>
          selectedBodyJoints.includes(body_joint.metadata.name)
        )
        ?.map((body_joint) => ({
          name: body_joint.metadata.name,
          // @ts-ignore
          data: body_joint.metrics?.[metricMap?.[selectedMetrics[0]]],
          type: "line",
        })),
    [persons, selectedBodyJoints, selectedMetrics]
  );
  //   console.log(
  //     selectedMetrics,
  //     _.flatten(
  //       metrics.human_profiles[0].body_joints.map((body_joint) =>
  //         selectedMetrics.map((selectedMetric) => ({
  //           name: body_joint.metadata.name,
  //           // @ts-ignore
  //           data: body_joint.metrics?.[metricMap?.[selectedMetric]],
  //           type: "line",
  //         }))
  //       )
  //     )
  //   );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
        setOpen(open);
      }}
    >
      {/* <DialogContent className="z-[1000] min-w-[90%] h-[90%] flex flex-col font-mono text-white border-0 bg-primary-600"> */}
      <DialogContent className="z-[1000] min-w-[90%] h-[90%] flex flex-col font-mono text-white border-0 bg-light-200 dark:bg-primary-600">
        <DialogHeader className="">
          <DialogTitle className="flex items-center gap-3 text-secondary-100 dark:text-secondary-200">
            <span>
              <TrendingUp className="w-5 h-5 text-secondary-100 dark:text-secondary-200" />
            </span>
            <span className="flex gap-3 item-center">Chart</span>
          </DialogTitle>
        </DialogHeader>

        <div className="h-full grid gap-3 grid-cols-12">
          <ReactECharts
            className="col-span-9 border rounded-md"
            style={{
              height: "100%",
              width: "100%",
            }}
            // className="h-full w-full"
            theme={chartTheme}
            option={{
              title: {
                text: `${time[0].toUpperCase()} vs ${selectedMetrics[0]?.toUpperCase()}`,
                subtext: `${selectedMetrics[0]} over ${time[0]}`,
                left: "center",
                top: 10,
              },
              xAxis: {
                type: "category",
                data: metrics.human_profiles
                  .find(
                    (human) => human.metadata.human_idx === Number(persons[0])
                  )
                  ?.body_joints?.[0].metrics?.raw_ori_x?.map((t, i) => i),
              },
              yAxis: {
                type: "value",
              },
              //   legend: {
              //     type: "scroll",
              //     orient: "horizontal",
              //     data: metrics.human_profiles[0].body_joints.map(
              //       (body_joint) => body_joint.metadata.name
              //     ),
              //   },
              tooltip: {
                trigger: "axis",
                // formatter: "{b} <br/>{a} : {c}",
              },
              series,
              dataZoom: [
                {
                  type: "slider",
                  xAxisIndex: 0,
                  filterMode: "none",
                },
                {
                  type: "slider",
                  right: 20,
                  yAxisIndex: 0,
                  filterMode: "none",
                },
                {
                  type: "inside",
                  xAxisIndex: 0,
                  filterMode: "none",
                },
                {
                  type: "inside",
                  yAxisIndex: 0,
                  filterMode: "none",
                },
              ],
            }}
          />
          <div className="col-span-3 border space-y-4 rounded-md p-3 h-full text-black dark:text-white">
            <div className="space-y-2">
              <div>Person ID</div>
              <ChartDropdown
                list={metrics.human_profiles.map((human) =>
                  String(human.metadata.human_idx)
                )}
                currentList={persons}
                setCurrentList={setPersons}
              />
            </div>
            <div className="space-y-2">
              <div>Body Joints</div>
              <ChartDropdown
                list={bodyJoints}
                currentList={selectedBodyJoints}
                setCurrentList={setSelectedBodyJoints}
                multi
              />
            </div>
            <div className="space-y-2">
              <div>Metrics</div>
              <ChartDropdown
                list={Object.keys(metricMap)}
                currentList={selectedMetrics}
                setCurrentList={setSelectedMetrics}
              />
            </div>
            <div className="space-y-2">
              <div>X-Axis</div>
              <ChartDropdown
                list={[
                  "frame",
                  "absolute time ❎",
                  "relative time ❎",
                  "normalized time ❎",
                ]}
                currentList={time}
                setCurrentList={setTime}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChartModal;

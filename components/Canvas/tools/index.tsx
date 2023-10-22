"use client";
import { DivProps } from "@/lib/types/html";

import { Tools } from "@/lib/types/tools";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import {
  drawText,
  drawPolygon,
  drawRect,
  drawTriangle,
  setToDefaultCanvas,
  setToDrawingCanvas,
  buildHumanSkeleton,
} from "@/lib/utils/tools";
import { Item, Menu, Row } from "./utils";
import useKeyboardJs from "react-use/lib/useKeyboardJs";

const Tools = ({ tools, ...props }: { tools: Tools[] } & DivProps) => {
  const { canvas, addShape, addText, disableKeyboardShortcut } = useStore();
  const [currentToolIndex, setCurrentToolIndex] = useState<number | null>(0);
  const [currentTools, setCurrentTools] = useState(
    tools?.map((t) => t.tools[0])
  );
  const [one] = useKeyboardJs("1");
  const [two] = useKeyboardJs("2");
  const [three] = useKeyboardJs("3");
  const [four] = useKeyboardJs("4");
  const [five] = useKeyboardJs("5");
  const [six] = useKeyboardJs("6");
  // console.log(currentTools, currentToolIndex);

  useEffect(() => {
    if (!disableKeyboardShortcut) {
      if (one) {
        setCurrentToolIndex(0);
      } else if (two) {
        setCurrentToolIndex(1);
      } else if (three) {
        setCurrentToolIndex(2);
      } else if (four) {
        // setCurrentToolIndex(3);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableKeyboardShortcut, one, two, three, four]);

  useEffect(() => {
    if (!canvas) return;
    if (currentToolIndex !== null) {
      switch (currentTools[currentToolIndex].name) {
        case "pointer": {
          setToDefaultCanvas(canvas);
          break;
        }

        case "text": {
          setToDefaultCanvas(canvas);
          setToDrawingCanvas(canvas, "text");
          drawText(canvas, (text) => {
            setCurrentToolIndex(0);
            addText(
              text,
              {
                text: text.text,
                fontSize: text.fontSize,
                fontWeight: text.fontWeight,
                splittedTexts: [],
              },
              {
                x: text.left ?? 0,
                y: text.top ?? 0,
                width: text.width ?? 0,
                height: text.height ?? 0,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
              }
            );
          });
          canvas?.requestRenderAll();
          break;
        }

        case "square roi": {
          setToDefaultCanvas(canvas);
          setToDrawingCanvas(canvas);
          drawRect(canvas, (shape) => {
            setCurrentToolIndex(0);
            addShape("square", shape, {
              x: shape.left ?? 0,
              y: shape.top ?? 0,
              width: shape.width ?? 0,
              height: shape.height ?? 0,
              rotation: 0,
              scaleX: 1,
              scaleY: 1,
            });
          }); // set to pointer
          canvas?.requestRenderAll();
          break;
        }

        case "tri roi": {
          setToDefaultCanvas(canvas);
          setToDrawingCanvas(canvas);
          drawTriangle(canvas, (shape: fabric.Triangle) => {
            setCurrentToolIndex(0);
            addShape("triangle", shape, {
              x: shape.left ?? 0,
              y: shape.top ?? 0,
              width: shape.width ?? 0,
              height: shape.height ?? 0,
              rotation: 0,
              scaleX: 1,
              scaleY: 1,
            });
          }); // set to pointer
          canvas?.requestRenderAll();
          break;
        }

        case "poly roi": {
          setToDefaultCanvas(canvas);
          setToDrawingCanvas(canvas);
          drawPolygon(canvas, (shape: fabric.Polyline) => {
            setCurrentToolIndex(0);
            addShape(
              "polygon",
              shape,
              {
                x: shape.left ?? 0,
                y: shape.top ?? 0,
                width: shape.width ?? 0,
                height: shape.height ?? 0,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
              },
              {
                coords: shape.points,
              }
            );
            setToDefaultCanvas(canvas);
          }); // set to pointer
          canvas?.requestRenderAll();
          break;
        }

        case "pose": {
          setToDefaultCanvas(canvas);
          setToDrawingCanvas(canvas, "pointer");
          const { left, top } = canvas?.getCenter();
          const skeleton = buildHumanSkeleton(canvas, { x: left, y: top });
          // canvas?.centerObject(skeleton);
          canvas?.requestRenderAll();
          canvas?.on("object:moving", function (event) {
            const { target, pointer } = event;
            if (target && pointer && target?.type === "circle") {
              skeleton.moveJoint(target, pointer);
            }
          });
          setToDefaultCanvas(canvas);
          setCurrentToolIndex(0);
          break;

          // drawPose(canvas, (shape) => {
          //   setCurrentToolIndex(0);
          // });
        }

        default: {
          break;
        }
      }
    } else {
      setToDefaultCanvas(canvas);
    }
  }, [canvas, currentTools, currentToolIndex, addShape, addText]);

  return (
    <div
      {...props}
      className="overflow-hidden border-2 rounded-md z-[200] shadow border-light-400 dark:border-primary-800"
    >
      {tools?.map((tool, i) => (
        <Row
          key={i}
          {...{
            index: i,
            currentToolIndex,
            setCurrentToolIndex,
            currentTools,
          }}
        >
          {tool?.tools?.length > 1 && (
            <Menu>
              {tool?.tools?.map((_tool, _i) => (
                <Item
                  key={_i}
                  tool={_tool}
                  onClick={() => {
                    const temp = [...currentTools];
                    temp[i] = _tool;
                    setCurrentTools(temp);
                    setCurrentToolIndex(i);
                  }}
                />
              ))}
            </Menu>
          )}
        </Row>
      ))}
    </div>
  );
};

export default Tools;

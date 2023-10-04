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
} from "@/lib/utils/tools";
import { Item, Menu, Row } from "./utils";

const Tools = ({ tools, ...props }: { tools: Tools[] } & DivProps) => {
  const { canvas, addShape, addText } = useStore();
  const [currentToolIndex, setCurrentToolIndex] = useState<number | null>(0);
  const [currentTools, setCurrentTools] = useState(
    tools?.map((t) => t.tools[0])
  );

  useEffect(() => {
    if (!canvas) return;
    if (currentToolIndex !== null) {
      switch (currentTools[currentToolIndex].name) {
        case "pointer":
          setToDefaultCanvas(canvas);
          break;

        case "text":
          setToDrawingCanvas(canvas, "pointer");
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

        case "square roi":
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

        case "tri roi":
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

        case "poly roi":
          setToDrawingCanvas(canvas);
          drawPolygon(canvas, (shape: fabric.Polyline) => {
            setCurrentToolIndex(0);
            addShape("polygon", shape, {
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

        default:
          break;
      }
      // setToDefaultCanvas(canvas);
    } else {
      setToDefaultCanvas(canvas);
    }
  }, [canvas, currentTools, currentToolIndex, addShape, addText]);

  return (
    <div
      {...props}
      className="overflow-hidden border-2 rounded-md z-[200] shadow border-primary-800"
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

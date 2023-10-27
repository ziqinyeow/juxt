// @ts-nocheck
import { useEffect } from "react";
import { fabric } from "fabric";

// import { fabric } from "fabric";

export function drawCircleIcon(ctx, left, top, styleOverride, fabricObject) {
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.lineWidth = 3;
  ctx.shadowBlur = 2;
  ctx.shadowColor = "black";
  ctx.arc(0, 0, 5.5, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();
}

export function drawVerticalLineIcon(
  ctx,
  left,
  top,
  styleOverride,
  fabricObject
) {
  const size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.lineWidth = 3;
  ctx.shadowBlur = 2;
  ctx.shadowColor = "black";
  ctx.moveTo(-0.5, -size / 4);
  ctx.lineTo(-0.5, -size / 4 + size / 2);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.restore();
}

export function drawHorizontalLineIcon(
  ctx,
  left,
  top,
  styleOverride,
  fabricObject
) {
  const size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.lineWidth = 3;
  ctx.shadowBlur = 2;
  ctx.shadowColor = "black";
  ctx.moveTo(-size / 4, -0.5);
  ctx.lineTo(-size / 4 + size / 2, -0.5);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.restore();
}

export function drawRotateIcon(ctx, left, top, styleOverride, fabricObject) {
  const radius = 6;
  let lineWidth = radius / 3;
  let arrowWidth = radius / 2;
  const center = {
    x: left,
    y: top,
  };
  let arrow1 = {
    startAngle: (1 / 2) * Math.PI + 0.6,
    endAngle: (3 / 2) * Math.PI,
  };

  let arrow2 = {
    startAngle: (3 / 2) * Math.PI + 0.6,
    endAngle: (1 / 2) * Math.PI,
  };
  function draw(startAngle, endAngle) {
    ctx.beginPath();
    ctx.shadowBlur = 0;

    ctx.arc(center.x, center.y, radius, startAngle, endAngle);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    ctx.beginPath();
    let arrowTop = getPointOnCircle(center, radius, endAngle + 0.4);

    ctx.moveTo(arrowTop.x, arrowTop.y);

    let arrowLeft = getPointOnCircle(center, radius - arrowWidth, endAngle);
    ctx.lineTo(arrowLeft.x, arrowLeft.y);

    let arrowRight = getPointOnCircle(center, radius + arrowWidth, endAngle);
    ctx.lineTo(arrowRight.x, arrowRight.y);
    ctx.fillStyle = "#000000";

    ctx.closePath();
    ctx.fill();
  }

  function getPointOnCircle(center, radius, angle) {
    let pX = center.x + Math.cos(angle) * radius;
    let pY = center.y + Math.sin(angle) * radius;
    return { x: pX, y: pY };
  }

  ctx.save();
  ctx.translate(0, 0);

  ctx.beginPath();
  ctx.arc(center.x, center.y, radius + 6, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.shadowBlur = 2;
  ctx.shadowColor = "black";
  ctx.fill();
  ctx.closePath();
  draw(arrow1.startAngle, arrow1.endAngle);
  draw(arrow2.startAngle, arrow2.endAngle);
  ctx.restore();
}

function useCanvasConfig() {
  /**
   * Customize fabric controls
   */
  useEffect(() => {
    // fabric.Object.prototype.transparentCorners = false;
    // fabric.Object.prototype.cornerColor = "#20bf6b";
    // fabric.Object.prototype.cornerStyle = "circle";
    // fabric.Object.prototype.borderColor = "#00D9E1";
    // fabric.Object.prototype.cornerSize = 12;
    // fabric.Object.prototype.borderScaleFactor = 2.4;
    // fabric.Object.prototype.borderOpacityWhenMoving = 0;

    fabric.Object.prototype.controls.tr = new fabric.Control({
      x: 0.5,
      y: -0.5,
      actionHandler: fabric.controlsUtils.scalingEqually,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionName: fabric.controlsUtils.scaleOrSkewActionName,
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    fabric.Object.prototype.controls.tl = new fabric.Control({
      x: -0.5,
      y: -0.5,
      actionHandler: fabric.controlsUtils.scalingEqually,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionName: fabric.controlsUtils.scaleOrSkewActionName,
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    fabric.Object.prototype.controls.bl = new fabric.Control({
      x: -0.5,
      y: 0.5,
      actionHandler: fabric.controlsUtils.scalingEqually,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionName: fabric.controlsUtils.scaleOrSkewActionName,
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    fabric.Object.prototype.controls.br = new fabric.Control({
      x: 0.5,
      y: 0.5,
      actionHandler: fabric.controlsUtils.scalingEqually,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionName: fabric.controlsUtils.scaleOrSkewActionName,
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    fabric.Object.prototype.controls.ml = new fabric.Control({
      x: -0.5,
      y: 0,
      actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionName: fabric.controlsUtils.scaleOrSkewActionName,
      render: drawVerticalLineIcon,
      cornerSize: 28,
      withConnection: true,
    });

    fabric.Object.prototype.controls.mt = new fabric.Control({
      x: 0,
      y: -0.5,
      actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionName: fabric.controlsUtils.scaleOrSkewActionName,
      render: drawHorizontalLineIcon,
      cornerSize: 28,
      withConnection: true,
    });

    fabric.Object.prototype.controls.mb = new fabric.Control({
      x: 0,
      y: 0.5,
      actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionName: fabric.controlsUtils.scaleOrSkewActionName,
      render: drawHorizontalLineIcon,
      cornerSize: 28,
      withConnection: true,
    });

    fabric.Object.prototype.controls.mr = new fabric.Control({
      x: 0.5,
      y: 0,
      actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionName: fabric.controlsUtils.scaleOrSkewActionName,
      render: drawVerticalLineIcon,
      cornerSize: 28,
      withConnection: true,
    });

    fabric.Object.prototype.controls.mtr = new fabric.Control({
      x: 0,
      y: -0.5,
      offsetY: -40,
      actionHandler: fabric.controlsUtils.rotationWithSnapping,
      cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
      actionName: "rotate",
      render: drawRotateIcon,
      cornerSize: 28,
      withConnection: false,
    });

    // Texbox controls
    fabric.Textbox.prototype.controls.tr = fabric.Object.prototype.controls.tr;
    fabric.Textbox.prototype.controls.tl = fabric.Object.prototype.controls.tl;
    fabric.Textbox.prototype.controls.bl = fabric.Object.prototype.controls.bl;
    fabric.Textbox.prototype.controls.br = fabric.Object.prototype.controls.br;

    fabric.Textbox.prototype.controls.mt = new fabric.Control({
      render: () => false,
    });

    fabric.Textbox.prototype.controls.mb = fabric.Textbox.prototype.controls.mt;

    fabric.Textbox.prototype.controls.mr = new fabric.Control({
      x: 0.5,
      y: 0,
      actionHandler: fabric.controlsUtils.changeWidth,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionName: "resizing",
      render: drawVerticalLineIcon,
      cornerSize: 28,
      withConnection: true,
    });

    fabric.Textbox.prototype.controls.ml = new fabric.Control({
      x: -0.5,
      y: 0,
      actionHandler: fabric.controlsUtils.changeWidth,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionName: "resizing",
      render: drawVerticalLineIcon,
      cornerSize: 28,
      withConnection: true,
    });

    fabric.Textbox.prototype.controls.mtr = new fabric.Control({
      x: 0,
      y: -0.5,
      offsetY: -40,
      actionHandler: fabric.controlsUtils.rotationWithSnapping,
      cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
      actionName: "rotate",
      render: drawRotateIcon,
      cornerSize: 28,
      withConnection: false,
    });
  }, []);
}

export default useCanvasConfig;

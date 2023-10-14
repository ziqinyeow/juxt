import { fabric } from "fabric";
import { IEvent, Object } from "fabric/fabric-impl";

const STROKE_COLOR = "#2BEBC8";
const STROKE_WIDTH = 5;

/** @typedef {{distance: number, angle: number}} JointPlacement */
/** @typedef {{x: number, y: number}} Posn A position*/
/** @typedef {0} ForwardDirection */
/** @typedef {1} BackwardDirection */
/** @typedef {ForwardDirection | BackwardDirection} BijectionDirection */

type Posn = { x: number; y: number };
// var canvas = new fabric.Canvas("c", { selection: false });
// fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";

/**
 * Represents a Bijection (two-way map)
 * @template T
 * @template U
 */
class Bijection {
  /** @type {ForwardDirection} */
  static FORWARD = 0;
  /** @type {BackwardDirection} */
  static BACKWARD = 1;

  /** @type {[Map<T,U>, Map<U,T>]} */
  #maps = [new Map(), new Map()];

  /**
   * @template {BijectionDirection} Direction
   * @param {Direction} direction
   * @param {Direction extends ForwardDirection ? T : U} key
   * @returns {(Direction extends ForwardDirection ? U : T) | undefined}
   */
  get(direction: any, key: any) {
    return this.#maps[direction].get(key);
  }

  /**
   * @param {T} forwardKey
   * @param {U} backwardKey
   */
  set(forwardKey: any, backwardKey: any) {
    // ensure order is consistent
    const frwdMappedVal = this.#maps[0].get(forwardKey);
    this.#maps[0].delete(forwardKey);
    this.#maps[1].delete(frwdMappedVal);

    const backMappedVal = this.#maps[1].get(backwardKey);
    this.#maps[0].delete(backwardKey);
    this.#maps[1].delete(backMappedVal);

    // populate maps with new values
    this.#maps[0].set(forwardKey, backwardKey);
    this.#maps[1].set(backwardKey, forwardKey);
  }
}

class Joint {
  name: string;
  /** @type {Map<Joint, JointPlacement>} */
  #children = new Map();
  /** @type {Joint?} */
  #parent = null;
  /** @type {Joint?} */
  #root = null;

  constructor(name: string) {
    this.name = name; // for debugging convenience
  }

  getChildren() {
    return [...this.#children];
  }

  getChildPlacement(node: any) {
    return this.#children.get(node);
  }

  getParent() {
    return this.#parent;
  }

  addChild(node: any, distance: any, globalAngle: any) {
    if (node.#root !== null || node === this) {
      throw new Error(
        `Detected a cycle: "${node.name}" is already in the tree.`
      );
    }

    this.#children.set(node, { distance, angle: globalAngle });
    node.#parent = this;
    node.#root = this.#root ?? this;
    return this;
  }

  /**
   * Recursively updates child joints with angle change.
   * @param {number} dTheta
   */
  transmitPlacementChange(dTheta: number) {
    for (const [childJoint, { distance, angle }] of this.#children) {
      this.#children.set(childJoint, { distance, angle: angle + dTheta });
      childJoint.transmitPlacementChange(dTheta);
    }
  }
}

class Skeleton {
  static #SCALE_FACTOR = 25;

  /** @type {Bijection<Joint, fabric.Circle>} */
  #jointCircleBijection = new Bijection();
  /** @type {Joint, fabric.Line>} */
  #jointLineMap = new Map();
  /** @type {Joint} */
  #rootJoint;
  /** @type {Posn} */
  #posn;
  canvas: fabric.Canvas;

  /**
   * @param {Joint} rootJoint
   * @param {Posn} param1
   */
  constructor(canvas: fabric.Canvas, rootJoint: Joint, posn: any) {
    this.#rootJoint = rootJoint;
    this.#posn = posn;
    this.canvas = canvas;
    this.#draw();
  }

  getRootJoint() {
    return this.#rootJoint;
  }

  /**
   * Tries to move the joint to the given coordinates as close as possible.
   * Affects child joints but not parents (no inverse kinematics)
   * @param {fabric.Circle} circle
   * @param {Posn} coords
   */
  moveJoint(circle: fabric.Circle | Object, coords: Posn) {
    const joint = this.#jointCircleBijection.get(Bijection.BACKWARD, circle);
    if (!joint) return;

    if (joint === this.#rootJoint) {
      this.#drawSubtree(this.#rootJoint, coords);
      return;
    }

    /** @type {Joint} */
    const parent = joint.getParent();
    const parentCircle = this.#jointCircleBijection.get(
      Bijection.FORWARD,
      parent
    );
    const px = parentCircle.left;
    const py = parentCircle.top;

    const { x, y } = coords;
    const rawAngle = toDegrees(Math.atan2(py - y, x - px));
    const newAngle = rawAngle < 0 ? rawAngle + 360 : rawAngle;

    const jointPlacement = parent.getChildPlacement(joint);
    if (jointPlacement) {
      const { angle: oldAngle } = jointPlacement;
      jointPlacement.angle = newAngle;
      const dTheta = newAngle - oldAngle;
      joint.transmitPlacementChange(dTheta);

      this.#drawSubtree(parent, { x: px, y: py });
    }
  }

  /** Draws the skeleton starting from the root joint. */
  #draw() {
    this.#drawSubtree(this.#rootJoint, this.#posn);
    this.#jointCircleBijection
      .get(Bijection.FORWARD, this.#rootJoint)
      ?.set({ fill: "red" });
  }

  /**
   * Recursively draws the skeleton's joints.
   * @param {Joint} root
   * @param {Posn} param1
   */
  #drawSubtree(root: Joint, { x, y }: any) {
    const SCALE_FACTOR = Skeleton.#SCALE_FACTOR;

    for (const [joint, { distance, angle }] of root.getChildren()) {
      const childX = x + Math.cos(toRadians(angle)) * distance * SCALE_FACTOR;
      const childY = y + Math.sin(toRadians(angle)) * distance * -SCALE_FACTOR;

      let line = this.#jointLineMap.get(joint);
      if (line) {
        line.set({ x1: x, y1: y, x2: childX, y2: childY });
        line.setCoords();
      } else {
        line = makeLine([x, y, childX, childY]);
        this.#jointLineMap.set(joint, line);
        this.canvas?.add(line);
      }

      this.#drawSubtree(joint, { x: childX, y: childY });
    }

    let circle = this.#jointCircleBijection.get(Bijection.FORWARD, root);
    if (circle) {
      circle.set({ left: x, top: y });
      circle.setCoords();
    } else {
      circle = makeCircle(x, y);
      this.#jointCircleBijection.set(root, circle);
      this.canvas?.add(circle);
    }
  }
}

/**
 * Creates a skeleton in the shape of a human.
 * @param {fabric.Canvas} canvas
 * @param {Posn} posn
 * @returns {Skeleton}
 */
export function buildHumanSkeleton(canvas: fabric.Canvas, posn: Posn) {
  const root = new Joint("hips");
  const leftFoot = new Joint("left foot");
  const rightFoot = new Joint("left foot");
  const leftKnee = new Joint("left knee");
  const rightKnee = new Joint("left knee");
  const chest = new Joint("chest");
  const leftWrist = new Joint("left wrist");
  const rightWrist = new Joint("right wrist");
  const leftElbow = new Joint("left elbow");
  const rightElbow = new Joint("right elbow");
  const leftHand = new Joint("left hand");
  const rightHand = new Joint("right hand");
  const head = new Joint("head");

  rightElbow.addChild(rightWrist.addChild(rightHand, 1.1, 315), 1.75, 315);
  leftElbow.addChild(leftWrist.addChild(leftHand, 1.1, 225), 1.75, 225);
  chest
    .addChild(leftElbow, 2, 225)
    .addChild(rightElbow, 2, 315)
    .addChild(head, 2, 90);

  leftKnee.addChild(leftFoot, 2, 240);
  rightKnee.addChild(rightFoot, 2, 300);
  root
    .addChild(leftKnee, 3.5, 240)
    .addChild(rightKnee, 3.5, 300)
    .addChild(chest, 2.75, 90);

  return new Skeleton(canvas, root, posn);
}

// const skeleton = buildHumanSkeleton({ x: 175, y: 175 });

/**
 * @param {[number,number,number,number]} coords
 * @returns {fabric.Line}
 */
function makeLine(coords: number[]) {
  return new fabric.Line(coords, {
    fill: STROKE_COLOR,
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    selectable: false,
    evented: false,
    originX: "center",
    originY: "center",
  });
}

/**
 * @param {number} x
 * @param {number} y
 * @returns {fabric.Circle}
 */
function makeCircle(x: number, y: number) {
  return new fabric.Circle({
    hasControls: false,
    left: x,
    top: y,
    strokeWidth: 3,
    radius: 10,
    fill: "#fff",
    stroke: "black",
    originX: "center",
    originY: "center",
  });
}

/** @param {number} degrees */
function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

/** @param {number} radians */
function toDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

// export const drawPose = (
//   canvas: fabric.Canvas,
//   mouseUp: (shape: any) => void
// ) => {
//   fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";

//   function makeCircle(left, top, line1, line2, line3, line4) {
//     var c = new fabric.Circle({
//       left: left,
//       top: top,
//       strokeWidth: 5,
//       radius: 12,
//       fill: "#fff",
//       stroke: "#666",
//       hasControls: false,
//       hasBorders: false,
//     });

//     c.line1 = line1;
//     c.line2 = line2;
//     c.line3 = line3;
//     c.line4 = line4;

//     return c;
//   }

//   function makeLine(coords: number[]) {
//     return new fabric.Line(coords, {
//       fill: "red",
//       stroke: "red",
//       strokeWidth: 5,
//       selectable: false,
//       evented: false,
//     });
//   }

//   var line = makeLine([250, 125, 250, 175]),
//     line2 = makeLine([250, 175, 250, 250]),
//     line3 = makeLine([250, 250, 300, 350]),
//     line4 = makeLine([250, 250, 200, 350]),
//     line5 = makeLine([250, 175, 175, 225]),
//     line6 = makeLine([250, 175, 325, 225]);

//   canvas?.add(line, line2, line3, line4, line5, line6);

//   canvas?.add(
//     makeCircle(line.get("x1"), line.get("y1"), null, line),
//     makeCircle(line.get("x2"), line.get("y2"), line, line2, line5, line6),
//     makeCircle(line2.get("x2"), line2.get("y2"), line2, line3, line4),
//     makeCircle(line3.get("x2"), line3.get("y2"), line3),
//     makeCircle(line4.get("x2"), line4.get("y2"), line4),
//     makeCircle(line5.get("x2"), line5.get("y2"), line5),
//     makeCircle(line6.get("x2"), line6.get("y2"), line6)
//   );

//   // let i = 0;

//   canvas?.on("object:moving", function (e) {
//     var p = e.target;
//     if (p.type == "activeSelection") {
//       for (let i = 0; i < p._objects.length; i++) {
//         p._objects[i].line1 &&
//           p._objects[i].line1.set({
//             x2: p.left + p._objects[i].left,
//             y2: p.top + p._objects[i].top,
//           });
//         p._objects[i].line2 &&
//           p._objects[i].line2.set({
//             x1: p.left + p._objects[i].left,
//             y1: p.top + p._objects[i].top,
//           });
//         p._objects[i].line3 &&
//           p._objects[i].line3.set({
//             x1: p.left + p._objects[i].left,
//             y1: p.top + p._objects[i].top,
//           });
//         p._objects[i].line4 &&
//           p._objects[i].line4.set({
//             x1: p.left + p._objects[i].left,
//             y1: p.top + p._objects[i].top,
//           });
//       }
//     } else {
//       p.line1 && p.line1.set({ x2: p.left, y2: p.top });
//       p.line2 && p.line2.set({ x1: p.left, y1: p.top });
//       p.line3 && p.line3.set({ x1: p.left, y1: p.top });
//       p.line4 && p.line4.set({ x1: p.left, y1: p.top });
//     }

//     canvas?.requestRenderAll();
//   });
//   mouseUp("");
// };

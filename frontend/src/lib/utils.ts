import { Point, StrokeElement, StrokeState, Tools, ToolType } from "@/types";
import getStroke, { StrokeOptions } from "perfect-freehand";
import rough from "roughjs";
import { Options } from "roughjs/bin/core";

const widthMap = {
  thin: 8,
  bold: 15,
  extrabold: 20,
};

export const drawStroke = (
  ctx: CanvasRenderingContext2D,
  points: Point[] = [],
  strokeSetting: StrokeState
): void => {
  const strokeOption: StrokeOptions = {
    size: widthMap[strokeSetting.strokeWidth],
    // smoothing: 0.1,
    // thinning: 0.5,
  };

  // const stroke = getStroke(points, strokeOption);

  // // adding color of a particular stroke
  // ctx.fillStyle = strokeSetting.strokeColor;

  // ctx.beginPath();

  // // start the initial point of the stroke(beginning point)
  // ctx.moveTo(stroke[0][0], stroke[0][1]);

  // // draw the complete stroke
  // for (let i = 1; i < stroke.length; i++) {
  //   ctx.lineTo(stroke[i][0], stroke[i][1]);
  // }

  // ctx.closePath();
  // ctx.fill();

  // ---------------------------------------------------
  const strokePoints = getStroke(points, strokeOption);
  const formattedPoints: [number, number][] = strokePoints.map((point) => {
    if (point.length !== 2) {
      throw new Error(
        `Expected point to have exactly 2 elements, got ${point.length}`
      );
    }
    return [point[0], point[1]];
  });
  const stroke = getSvgPathFromStroke(formattedPoints);
  ctx.fillStyle = strokeSetting.strokeColor;
  ctx.fill(new Path2D(stroke));
};

// draw shapes

// draw line
export const drawLine = (
  canvas: HTMLCanvasElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  strokeSetting: StrokeState
) => {
  const roughCanvas = rough.canvas(canvas);

  if (!roughCanvas) return;

  return roughCanvas.line(x1, y1, x2, y2, {
    strokeWidth: widthMap[strokeSetting.strokeWidth] / 3,
    roughness: 0,
    preserveVertices: false,
    maxRandomnessOffset: 0,
    stroke: strokeSetting.strokeColor,
    disableMultiStroke: true,
    // smoothing the edges
  });
};

// draw a square or rectangle
export const drawSquareOrRectangle = (
  canvas: HTMLCanvasElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  strokeSetting: StrokeState
) => {
  const roughCanvas = rough.canvas(canvas);

  if (!roughCanvas) return;

  const options: Options = {
    strokeWidth: widthMap[strokeSetting.strokeWidth] / 3,
    roughness: 0,
    preserveVertices: true,
    maxRandomnessOffset: 0,
    stroke: strokeSetting.strokeColor,
    disableMultiStroke: true,
    hachureAngle: 60, // angle of hachure,
    hachureGap: 8,
  };

  if (strokeSetting.strokeBackground !== "#ebebeb") {
    options.fill = strokeSetting.strokeBackground;
    options.fillStyle = "zigzag";
  }

  return roughCanvas.rectangle(x1, y1, x2, y2, options);
};

// draw circle
export const drawCircle = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  radius: number,
  strokeSetting: StrokeState
) => {
  const roughCanvas = rough.canvas(canvas);

  if (!roughCanvas) return;

  return roughCanvas.circle(x, y, radius, {
    strokeWidth: widthMap[strokeSetting.strokeWidth] / 3,
    roughness: 0,
    stroke: strokeSetting.strokeColor,
    fill: strokeSetting.strokeBackground,
  });
};

const getSvgPathFromStroke = (stroke: [number, number][]) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (
      acc: string[],
      [x0, y0]: [number, number],
      i: number,
      arr: [number, number][]
    ) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(
        x0.toString(),
        y0.toString(),
        ((x0 + x1) / 2).toString(),
        ((y0 + y1) / 2).toString()
      );
      return acc;
    },
    ["M", ...stroke[0].map((num) => num.toString()), "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

// function to get an element a position
export const getElementAtPosition = (
  x: number,
  y: number,
  elements: StrokeElement[]
) => {
  // return elements
  //   .map((element) => ({
  //     ...element,
  //     position: positionWithinElement(x, y, element),
  //   }))
  //   .find((element) => element.position !== null);

  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];
    const position = positionWithinElement(x, y, element);
    if (position !== null) {
      return {
        ...element,
        position,
      };
    }
  }
  return null;
};

//function to check if the point lies inside or outside the points
const positionWithinElement = (
  x: number,
  y: number,
  element: StrokeElement
) => {
  const { type } = element;
  switch (type) {
    case "drawing": {
      const betweenPoints = element.points!.some((currentPoint, index) => {
        const nextPoint = element.points![index + 1];
        if (!nextPoint) return false;

        return onLine(
          currentPoint.x,
          currentPoint.y,
          nextPoint.x,
          nextPoint.y,
          x,
          y,
          5
        );
      });
      // console.log(betweenPoints);
      return betweenPoints ? "inside" : null;
    }
    case "line": {
      return onLine(element.x1, element.y1, element.x2, element.y2, x, y);
    }
    default:
      return null;
  }
};

// function to check if the point is inside the line
const onLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number,
  maxDistance: number = 5
): string | null => {
  const a: Point = { x: x1, y: y1 };
  const b: Point = { x: x2, y: y2 };
  const c: Point = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

// function to calculate the euclidian's distance
const distance = (a: Point, b: Point) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

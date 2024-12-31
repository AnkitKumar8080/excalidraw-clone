import { Point, StrokeElement, StrokeState } from "@/types";
import getStroke, { StrokeOptions } from "perfect-freehand";
import rough from "roughjs";
import { Options } from "roughjs/bin/core";

const widthMap = {
  thin: 8,
  bold: 15,
  extrabold: 20,
};

const stylesMap = {
  dashed: [10, 5],
  dotted: [2, 4],
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

  const stroke = getStroke(points, strokeOption);

  // adding color of a particular stroke
  ctx.fillStyle = strokeSetting.strokeColor;

  ctx.beginPath();

  // start the initial point of the stroke(beginning point)
  ctx.moveTo(stroke[0][0], stroke[0][1]);

  // draw the complete stroke
  for (let i = 1; i < stroke.length; i++) {
    ctx.lineTo(stroke[i][0], stroke[i][1]);
  }

  ctx.closePath();
  ctx.fill();

  // ---------------------------------------------------
  // const strokePoints = getStroke(points, strokeOption);
  // const formattedPoints: [number, number][] = strokePoints.map((point) => {
  //   if (point.length !== 2) {
  //     throw new Error(
  //       `Expected point to have exactly 2 elements, got ${point.length}`
  //     );
  //   }
  //   return [point[0], point[1]];
  // });
  // const stroke = getSvgPathFromStroke(formattedPoints);
  // ctx.fillStyle = strokeSetting.strokeColor;
  // ctx.fill(new Path2D(stroke));
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
  const options: Options = {
    strokeWidth: widthMap[strokeSetting.strokeWidth] / 3,
    roughness: 0,
    preserveVertices: true,
    maxRandomnessOffset: 0,
    stroke: strokeSetting.strokeColor,
    disableMultiStroke: true,
    hachureAngle: 60, // angle of hachure,
    hachureGap: 8,
    fill: strokeSetting.strokeBackground,
  };
  if (
    strokeSetting.strokeStyle === "dashed" ||
    strokeSetting.strokeStyle === "dotted"
  ) {
    options.strokeLineDash = stylesMap[strokeSetting.strokeStyle];
  }

  return roughCanvas.line(x1, y1, x2, y2, options);
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
    fill: strokeSetting.strokeBackground,
  };

  if (strokeSetting.strokeBackground !== "#ebebeb") {
    options.fill = strokeSetting.strokeBackground;
    options.fillStyle = "zigzag";
  }

  if (
    strokeSetting.strokeStyle === "dashed" ||
    strokeSetting.strokeStyle === "dotted"
  ) {
    options.strokeLineDash = stylesMap[strokeSetting.strokeStyle];
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

  const options: Options = {
    strokeWidth: widthMap[strokeSetting.strokeWidth] / 3,
    roughness: 0,
    preserveVertices: true,
    maxRandomnessOffset: 0,
    stroke: strokeSetting.strokeColor,
    disableMultiStroke: true,
    hachureAngle: 60, // angle of hachure,
    hachureGap: 8,
    fill: strokeSetting.strokeBackground,
  };

  if (
    strokeSetting.strokeStyle === "dashed" ||
    strokeSetting.strokeStyle === "dotted"
  ) {
    options.strokeLineDash = stylesMap[strokeSetting.strokeStyle];
  }

  return roughCanvas.circle(x, y, radius, options);
};

export const drawText = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  textvalue: string,
  strokeSetting: StrokeState
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  ctx.font = "16px Arial";
  ctx.fillStyle = strokeSetting.strokeColor;
  ctx.fillText(textvalue, x, y);
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
      return betweenPoints ? "inside" : null;
    }
    case "line": {
      return onLine(element.x1, element.y1, element.x2, element.y2, x, y);
    }

    case "rectangle": {
      const topLeft = nearPoint(x, y, element.x1, element.y1, "topLeft");
      const topRight = nearPoint(
        x,
        y,
        element.x2 + element.x1,
        element.y1,
        "topRight"
      );
      const bottomLeft = nearPoint(
        x,
        y,
        element.x1,
        element.y2 + element.y1,
        "bottomLeft"
      );
      const bottomRight = nearPoint(
        x,
        y,
        element.x2 + element.x1,
        element.y2 + element.y1,
        "bottomRight"
      );

      const xStart = Math.min(element.x1, element.x1 + element.x2);
      const xEnd = Math.max(element.x1, element.x1 + element.x2);
      const yStart = Math.min(element.y1, element.y1 + element.y2);
      const yEnd = Math.max(element.y1, element.y1 + element.y2);

      const inside =
        x >= xStart && x <= xEnd && y >= yStart && y <= yEnd ? "inside" : null;

      return topLeft || topRight || bottomLeft || bottomRight || inside;
    }

    case "circle": {
      const dist = distance({ x, y }, { x: element.x1, y: element.y1 });
      const margin = 1;
      const radius = element.x2 / 2;

      if (Math.abs(dist - radius) < margin) {
        return "inside";
      } else if (dist < radius) {
        return "inside";
      } else {
        return null;
      }
    }

    case "text": {
      const charWidthFactor = 0.6;
      const textWidth = element.textValue!.length * 16 * charWidthFactor;

      const textHeight = 16; // its the font size

      return x >= element.x1 &&
        x <= element.x1 + textWidth &&
        y >= element.y1 - textHeight && // Above the baseline
        y <= element.y1 // Below the baseline
        ? "inside"
        : null;
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

export const nearPoint = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  name: string
): string | null => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

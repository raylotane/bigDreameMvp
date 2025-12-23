import React, { useRef } from "react";
import { useSize } from "ahooks";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";
import {
  type ICommonProps,
  type IFrame,
  ETool,
  type IShape,
  type IObject,
} from "./types";

export interface CanvasProps extends ICommonProps {
  currentFrameIndex: number;
  frames: IFrame[];
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  startPos: { x: number; y: number } | null;
  setStartPos: (pos: { x: number; y: number } | null) => void;
  currentShape: IShape | null;
  setCurrentShape: (shape: IShape | null) => void;
  addObject: (currentFrameIndex: number, obj: IShape) => void;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  onionSkin: boolean;
  setOnionSkin: (onionSkin: boolean) => void;
  selectedObject: IObject | null;
  setSelectedObject: (obj: IObject | null) => void;
}

const Canvas: React.FC<CanvasProps> = (props: CanvasProps) => {
  const {
    selectTool: currentTool,
    currentFrameIndex,
    frames,
    isDrawing,
    setIsDrawing,
    startPos,
    setStartPos,
    currentShape,
    setCurrentShape,
    addObject,
    fillColor,
    strokeColor,
    strokeWidth,
    setStrokeWidth,
    onionSkin,
    setOnionSkin,
    selectedObject,
    setSelectedObject,
  } = props;

  const wrapRef = useRef(null);
  const size = useSize(wrapRef);

  const stageRef = useRef(null);

  const currentFrame = frames[currentFrameIndex];
  const prevFrame =
    currentFrameIndex > 0 ? frames[currentFrameIndex - 1] : null;
  const nextFrame =
    currentFrameIndex < frames.length - 1
      ? frames[currentFrameIndex + 1]
      : null;

  // 计算高度，保持16:9比例
  const calaHeight = (width?: number) => {
    if (!width) return 0;
    let height = 1080;
    if (width) {
      height = (width / 16) * 9;
    }
    return height;
  };

  // 处理点击事件
  const handleClick = (e: any) => {
    const pos = e.target.getStage().getPointerPosition() as {
      x: number;
      y: number;
    };
    // console.log("handleClick", pos, e);
  };
  // 处理鼠标按下事件
  const handleMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition() as {
      x: number;
      y: number;
    };

    if (currentTool === "line") {
      setIsDrawing(true);
      setCurrentShape({
        type: currentTool,
        points: [pos.x, pos.y],
        stroke: "#000",
        strokeWidth: 10,
      });
    } else if (currentTool === "rect" || currentTool === "circle") {
      // 判断有无开始绘制矩形或圆形
      setIsDrawing(true);
      // 保存起始位置
      setStartPos(pos);
      // 创建当前形状
      setCurrentShape({
        type: currentTool,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
    }
    // else if (currentTool === "eraser") {
    //   // 检测 hit 对象
    //   const intersected = stageRef.current.getIntersection(pos);
    //   if (intersected) {
    //     const objId = intersected.attrs.id; // 我们会为每个形状设置 attrs.id = obj.id
    //     if (objId) {
    //     //   dispatch(removeObject({ frameIndex: currentFrameIndex, objId }));
    //     }
    //   }
    // }
  };
  // 处理鼠标移动事件
  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    const pos = e.target.getStage().getPointerPosition();
    if (currentTool === ETool.LINE) {
      // console.log("handleMouseMove", currentShape?.points);
      if (!currentShape?.points) return;
      const newShape = {
        ...currentShape,
        points: [...currentShape?.points!, pos.x, pos.y] as number[],
      } as IShape;

      setCurrentShape(newShape);
    } else if (currentTool === ETool.RECT) {
      const newShape = {
        ...currentShape,
        width: pos.x - startPos?.x!,
        height: pos.y - startPos?.y!,
      } as IShape;

      setCurrentShape(newShape);
    } else if (currentTool === ETool.CIRCLE) {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPos?.x!, 2) + Math.pow(pos.y - startPos?.y!, 2)
      );

      const newShape = {
        ...currentShape,
        radius,
      } as IShape;
      setCurrentShape(newShape);
    }
  };
  // 处理鼠标抬起事件
  const handleMouseUp = () => {
    if (isDrawing && currentShape) {
      if (currentTool === "circle") {
        // 对于 circle，x/y 是中心，radius 计算
        // currentShape.x = startPos?.x;
        // currentShape.y = startPos?.y;
      }

      const { type, width, height } = currentShape;
      if (
        (type === ETool.RECT && width === 0 && height === 0) ||
        (type === ETool.CIRCLE &&
          currentShape.radius === 0 &&
          currentShape.radius === undefined) ||
        (type === ETool.LINE && currentShape?.points!.length < 4)
      ) {
        setCurrentShape(null);
        return;
      }

      addObject(currentFrameIndex, currentShape);
      setCurrentShape(null);
    }
    setIsDrawing(false);
    setStartPos(null);
  };
  // 渲染对象
  const renderObject = (
    obj: IObject,
    key: string | number,
    opacity = 1,
    isOnion = false
  ) => {
    const props = {
      key,
      opacity,
      id: obj.id, // 设置 id 为 attrs.id
      onClick: () => {
        if (!isOnion) {
          setSelectedObject(obj);
        }
      },
      onTap: () => {
        if (!isOnion) {
          setSelectedObject(obj);
        }
      },
    };

    if (obj.type === "line") {
      return (
        <Line
          {...props}
          points={obj.points}
          stroke={obj.stroke}
          strokeWidth={obj.strokeWidth}
          tension={0.5}
          lineCap="round"
        // draggable
        />
      );
    } else if (obj.type === "rect") {
      return (
        <Rect
          {...props}
          x={obj.x}
          y={obj.y}
          width={obj.width}
          height={obj.height}
          fill={obj.fill}
          stroke={obj.stroke}
          strokeWidth={obj.strokeWidth}
        //   draggable
        />
      );
    } else if (obj.type === "circle") {
      return (
        <Circle
          {...props}
          x={obj.x}
          y={obj.y}
          radius={obj.radius}
          fill={obj.fill}
          stroke={obj.stroke}
          strokeWidth={obj.strokeWidth}
        //   draggable
        />
      );
    }
    return null;
  };
  return (
    <div className="h-full flex justify-center align-center " ref={wrapRef}>
      <div
        className="editor-main bg-white"
        style={{
          width: size?.width ? size?.width - 20 : 0,
          height: calaHeight(size?.width) ? calaHeight(size?.width) - 20 : 0,
        }}
      >
        <Stage
          ref={stageRef}
          width={size?.width ? size?.width : 0}
          height={calaHeight(size?.width)}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onClick={handleClick}
        >
          {onionSkin && prevFrame && (
            <Layer opacity={0.3}>
              {prevFrame.objects.map((obj, i) =>
                renderObject(obj, `prev-${i}`, 0.3, true)
              )}
            </Layer>
          )}

          {/* 图形绘制 */}
          <Layer>
            {currentFrame?.objects.map((obj, i) => renderObject(obj, i))}

            {currentShape &&
              renderObject(
                { ...currentShape, id: "preview" } as IObject,
                "preview"
              )}
            {/* {currentShape && renderObject(currentShape, "preview")} */}

            {/* <Text text="Try to drag shapes" fontSize={15} />
            <Rect
              x={20}
              y={50}
              width={100}
              height={100}
              fill="red"
              shadowBlur={10}
              draggable
            />
            <Circle x={200} y={100} radius={50} fill="green" draggable /> */}
          </Layer>

          {onionSkin && nextFrame && (
            <Layer opacity={0.3}>
              {nextFrame.objects.map((obj, i) =>
                renderObject(obj, `next-${i}`, 0.3, true)
              )}
            </Layer>
          )}
        </Stage>
      </div>
    </div>
  );
};

export default Canvas;

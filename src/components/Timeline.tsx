import React from "react";
import classNames from "classnames";
import type { IFrame } from "./types";
import { v4 as uuidv4 } from "uuid";

export interface ITimelineProps {
  currentFrameIndex: number;
  setCurrentFrameIndex: (index: number) => void;
  addFrame: () => void;
  frames: IFrame[];
}

const Timeline: React.FC<ITimelineProps> = (props: ITimelineProps) => {
  const { currentFrameIndex, setCurrentFrameIndex, addFrame, frames } = props;

  return (
    <div
      className="h-[100px]"
      style={{
        overflow: "hidden",
      }}
    >
      <div
        className="flex"
        style={{
          overflowX: "scroll",
        }}
      >
        {frames.map((item, index) => {
          const mergeClass = classNames(
            "w-[50px] h-[50px]  text-black shrink-0 border text-center cursor-pointer",
            {
              "border-red-400": index % 3 === 0 ? true : false,
              "bg-green-500": index === currentFrameIndex ? true : false,
              //   "bg-white": item !== currentFrameIndex + 1 ? true : false,
              //   "bg-green-50": frames[item - 1]?.id ? true : false,
            },
            [`${frames[index]?.id ? "bg-green-100" : "bg-white"}`]
          );

          return (
            <div>   
              <div
                key={index}
                className={mergeClass}
                onClick={() => {
                  console.log(index, currentFrameIndex);

                  if (!frames[currentFrameIndex]?.id) {
                    frames[currentFrameIndex].id = uuidv4();
                  }
                  setCurrentFrameIndex(index);
                  // addFrame();
                }}
              >
                {index + 1}
              </div>
            </div>
          );
        })}
        <div
          onClick={addFrame}
          className="w-[50px] h-[50px]  text-black shrink-0 border text-center cursor-pointer"
        >
          +1
        </div>
      </div>
    </div>
  );
};

export default Timeline;

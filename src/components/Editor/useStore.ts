import { useState } from "react";
import { type IObject, type IBaseShape, ETool, type IShape } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorageState } from 'ahooks';

const useStore = () => {

    // const [selectTool, setSelectTool] = useState<ETool>();

    const [selectTool, setSelectTool] = useLocalStorageState("selectTool", {
        defaultValue: ETool.LINE
    })

    // const [frames, setFrames] = useState<IFrame[]>([{
    //     id: uuidv4(),
    //     objects: []
    // }]);

    const [frames, setFrames] = useLocalStorageState<{
        id: string,
        objects: IObject[]
    }[]>("frames", {
        defaultValue: [{
            id: uuidv4(),
            objects: []
        }]
    })

    // const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);

    const [currentFrameIndex, setCurrentFrameIndex] = useLocalStorageState("currentFrameIndex", {
        defaultValue: 0
    })

    const [isDrawing, setIsDrawing] = useState(false);

    const [startPos, setStartPos] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [currentShape, setCurrentShape] = useState<IBaseShape | null>(null);
    // 添加一个对象
    const addObject = (frameIndex: number, shape: IShape) => {

        const obj: IObject = {
            ...shape,
            id: uuidv4(),
        }

        if (!frames[frameIndex]) {
            addFrame();
        }

        frames[frameIndex].objects.push(obj);
        setFrames([...frames]);
    }

    const addFrame = () => {

        // if (!frames[currentFrameIndex]) {
        //     setFrames([...frames, {
        //         id: uuidv4(),
        //         objects: []
        //     }])
        // }

        setFrames([...frames, {
            id: uuidv4(),
            objects: []
        }])
    }

    // 填充色
    // const [fillColor, setFillColor] = useState<string>("#000");

    const [fillColor, setFillColor] = useLocalStorageState("fillColor", {
        defaultValue: "#000"
    })

    // 线条颜色
    // const [strokeColor, setStrokeColor] = useState<string>("#000");

    const [strokeColor, setStrokeColor] = useLocalStorageState("strokeColor", {
        defaultValue: "#000"
    })

    // const [onionSkin, setOnionSkin] = useState(true);

    const [onionSkin, setOnionSkin] = useLocalStorageState("onionSkin", {
        defaultValue: true
    })

    // 选中的图形
    const [selectedObject, setSelectedObject] = useLocalStorageState<IObject | null>("selectedObject", {
        defaultValue: null
    })

    // 更新图形对象
    const updateObject = (frameIndex: number, objectId: string, updates: Partial<IObject>) => {
        const frame = frames[frameIndex];
        if (!frame) return;
        
        const objectIndex = frame.objects.findIndex(obj => obj.id === objectId);
        if (objectIndex === -1) return;
        
        frame.objects[objectIndex] = { ...frame.objects[objectIndex], ...updates };
        setFrames([...frames]);
        
        // 如果更新的是当前选中的对象，同时更新选中状态
        if (selectedObject?.id === objectId) {
            setSelectedObject(frame.objects[objectIndex]);
        }
    }

    // 删除图形对象
    const deleteObject = (frameIndex: number, objectId: string) => {
        const frame = frames[frameIndex];
        if (!frame) return;
        
        frame.objects = frame.objects.filter(obj => obj.id !== objectId);
        setFrames([...frames]);
        
        // 如果删除的是当前选中的对象，清除选中状态
        if (selectedObject?.id === objectId) {
            setSelectedObject(null);
        }
    }

    return {
        selectTool,
        setSelectTool,
        frames,
        setFrames,
        addFrame,
        currentFrameIndex,
        setCurrentFrameIndex,

        isDrawing,
        setIsDrawing,
        startPos,
        setStartPos,
        currentShape,
        setCurrentShape,
        addObject,
        updateObject,
        deleteObject,

        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,

        onionSkin,
        setOnionSkin,

        selectedObject,
        setSelectedObject

    };
};

export default useStore;
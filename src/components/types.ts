

export enum ETool {
    LINE = "line",
    RECT = "rect",
    CIRCLE = "circle"
}

// "line" | "rect" | "circle" | null


export interface ICommonProps {
    selectTool: ETool;
    setSelectTool: (tool: ETool) => void
}

export interface IBaseShape {
    type: ETool
    /**
     * 线条颜色 or 边框颜色
     */
    stroke?: string
}

/**
 * 线条
 */
export interface ILine extends IBaseShape {
    /**
     * 位置编码
     */
    points?: number[]
    /**
     * 宽度
     */
    strokeWidth?: number
}

/**
 * 矩形
 */
export interface IRect extends IBaseShape {
    x?: number
    y?: number
    width?: number
    height?: number
    /**
     * 填充颜色
     * @example #000 or "rgba(0,0,255,0.5)"
     */
    fill?: string
}

export interface ICircle extends IBaseShape {
    x?: number
    y?: number
    /**
     * 半径
     */
    radius?: number
    /**
     * 填充颜色
     */
    fill?: string
}

export interface IShape extends ILine, IRect, ICircle {

}

export interface IObject extends IShape {
    id: string
    dash: number[] | null
}


export interface IFrame {
    id: string,
    objects: IObject[]
}




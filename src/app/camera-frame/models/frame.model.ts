import { FrameType } from '../enums/frame-type.enum';

export interface FrameConfig {
  type: FrameType;
  name: string;
  emoji: string;
  description: string;
}

export interface PhotoArea {
  x: number;
  y: number;
  w: number;
  h: number;
  radius?: number;
}

export interface CanvasDimensions {
  width: number;
  height: number;
}

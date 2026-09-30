import { PhotoArea, CanvasDimensions } from '../models/frame.model';

export interface FrameRenderer {
  getCanvasDimensions(): CanvasDimensions;
  getPhotoArea(): PhotoArea;
  renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void;
  renderOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, photoArea: PhotoArea, caption?: string, date?: string): void;
}

import { FrameRenderer } from '../frame-renderer.interface';
import { PhotoArea, CanvasDimensions } from '../../models/frame.model';

export class GlassRenderer implements FrameRenderer {
  getCanvasDimensions(): CanvasDimensions {
    return { width: 900, height: 720 };
  }

  getPhotoArea(): PhotoArea {
    return { x: 35, y: 35, w: 830, h: 650, radius: 20 };
  }

  renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.fillStyle = '#141a24';
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 26);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  renderOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, photoArea: PhotoArea): void {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 3;
    ctx.strokeRect(photoArea.x, photoArea.y, photoArea.w, photoArea.h);
  }
}

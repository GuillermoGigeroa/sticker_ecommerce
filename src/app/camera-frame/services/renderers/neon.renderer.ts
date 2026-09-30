import { FrameRenderer } from '../frame-renderer.interface';
import { PhotoArea, CanvasDimensions } from '../../models/frame.model';

export class NeonRenderer implements FrameRenderer {
  getCanvasDimensions(): CanvasDimensions {
    return { width: 900, height: 720 };
  }

  getPhotoArea(): PhotoArea {
    return { x: 30, y: 30, w: 840, h: 600, radius: 12 };
  }

  renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.fillStyle = '#06070a';
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 18);
    ctx.fill();

    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  renderOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, photoArea: PhotoArea): void {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 3;
    ctx.strokeRect(photoArea.x, photoArea.y, photoArea.w, photoArea.h);

    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = '#00f2fe';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 10;
    ctx.fillText('LIVE FEED // 2026', width / 2, height - 45);
    ctx.shadowBlur = 0;
  }
}

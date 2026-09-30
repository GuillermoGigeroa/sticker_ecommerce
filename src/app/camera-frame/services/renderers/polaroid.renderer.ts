import { FrameRenderer } from '../frame-renderer.interface';
import { PhotoArea, CanvasDimensions } from '../../models/frame.model';

export class PolaroidRenderer implements FrameRenderer {
  getCanvasDimensions(): CanvasDimensions {
    return { width: 800, height: 1000 };
  }

  getPhotoArea(): PhotoArea {
    return { x: 40, y: 40, w: 720, h: 780, radius: 4 };
  }

  renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.fillStyle = '#faf8f5';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = '#e2dfd8';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
  }

  renderOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, photoArea: PhotoArea, caption?: string, date?: string): void {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 3;
    ctx.strokeRect(photoArea.x, photoArea.y, photoArea.w, photoArea.h);

    const text = caption || 'Momento Especial ✨';
    ctx.font = '600 44px "Caveat", cursive, sans-serif';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.fillText(text, width / 2, height - 110);

    if (date) {
      ctx.font = '600 16px "Inter", sans-serif';
      ctx.fillStyle = '#888';
      ctx.letterSpacing = '2px';
      ctx.fillText(date, width / 2, height - 60);
    }
  }
}

import { FrameRenderer } from '../frame-renderer.interface';
import { PhotoArea, CanvasDimensions } from '../../models/frame.model';

export class WoodRenderer implements FrameRenderer {
  getCanvasDimensions(): CanvasDimensions {
    return { width: 960, height: 780 };
  }

  getPhotoArea(): PhotoArea {
    return { x: 60, y: 60, w: 840, h: 660, radius: 6 };
  }

  renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const woodGrad = ctx.createLinearGradient(0, 0, width, height);
    woodGrad.addColorStop(0, '#381f11');
    woodGrad.addColorStop(0.3, '#5c371d');
    woodGrad.addColorStop(0.7, '#442614');
    woodGrad.addColorStop(1, '#241208');
    ctx.fillStyle = woodGrad;
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 14);
    ctx.fill();

    ctx.strokeStyle = '#180a03';
    ctx.lineWidth = 6;
    ctx.stroke();
  }

  renderOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, photoArea: PhotoArea): void {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 3;
    ctx.strokeRect(photoArea.x, photoArea.y, photoArea.w, photoArea.h);
  }
}

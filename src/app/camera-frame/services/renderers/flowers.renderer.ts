import { FrameRenderer } from '../frame-renderer.interface';
import { PhotoArea, CanvasDimensions } from '../../models/frame.model';

export class FlowersRenderer implements FrameRenderer {
  getCanvasDimensions(): CanvasDimensions {
    return { width: 900, height: 750 };
  }

  getPhotoArea(): PhotoArea {
    return { x: 50, y: 50, w: 800, h: 650, radius: 18 };
  }

  renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.fillStyle = '#fefdf9';
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 28);
    ctx.fill();

    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 8;
    ctx.stroke();
  }

  renderOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, photoArea: PhotoArea): void {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 3;
    ctx.strokeRect(photoArea.x, photoArea.y, photoArea.w, photoArea.h);

    this.drawDaisy(ctx, 55, 55, 26);
    this.drawDaisy(ctx, width - 55, 55, 26);
    this.drawDaisy(ctx, 55, height - 55, 26);
    this.drawDaisy(ctx, width - 55, height - 55, 26);
  }

  private drawDaisy(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number): void {
    ctx.save();
    ctx.translate(x, y);

    const numPetals = 10;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 6;

    for (let i = 0; i < numPetals; i++) {
      ctx.rotate((2 * Math.PI) / numPetals);
      ctx.beginPath();
      ctx.ellipse(0, radius * 0.75, radius * 0.35, radius * 0.7, 0, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.45, 0, 2 * Math.PI);
    ctx.fillStyle = '#facc15';
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }
}

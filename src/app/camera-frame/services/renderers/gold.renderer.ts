import { FrameRenderer } from '../frame-renderer.interface';
import { PhotoArea, CanvasDimensions } from '../../models/frame.model';

export class GoldRenderer implements FrameRenderer {
  getCanvasDimensions(): CanvasDimensions {
    return { width: 960, height: 800 };
  }

  getPhotoArea(): PhotoArea {
    return { x: 70, y: 70, w: 820, h: 630, radius: 0 };
  }

  renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, '#d4af37');
    goldGrad.addColorStop(0.25, '#8c6721');
    goldGrad.addColorStop(0.5, '#fbf0b9');
    goldGrad.addColorStop(0.75, '#7d5a1b');
    goldGrad.addColorStop(1, '#caa14c');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#f8f5ee';
    ctx.fillRect(45, 45, width - 90, height - 90);

    ctx.strokeStyle = '#bfa76f';
    ctx.lineWidth = 4;
    ctx.strokeRect(45, 45, width - 90, height - 90);
  }

  renderOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, photoArea: PhotoArea): void {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 3;
    ctx.strokeRect(photoArea.x, photoArea.y, photoArea.w, photoArea.h);

    const plaqueW = 280;
    const plaqueH = 50;
    const plaqueX = (width - plaqueW) / 2;
    const plaqueY = height - 85;

    const plqGrad = ctx.createLinearGradient(plaqueX, plaqueY, plaqueX, plaqueY + plaqueH);
    plqGrad.addColorStop(0, '#f9e49a');
    plqGrad.addColorStop(1, '#b88924');
    ctx.fillStyle = plqGrad;
    ctx.fillRect(plaqueX, plaqueY, plaqueW, plaqueH);

    ctx.strokeStyle = '#5a3d0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(plaqueX, plaqueY, plaqueW, plaqueH);

    ctx.font = 'bold 15px "Playfair Display", serif';
    ctx.fillStyle = '#3a2605';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '3px';
    ctx.fillText('RETRATO VIVO', width / 2, plaqueY + 22);

    ctx.font = 'italic 12px "Playfair Display", serif';
    ctx.fillStyle = '#52380a';
    ctx.letterSpacing = '1px';
    ctx.fillText('Colección Privada • Óleo Digital', width / 2, plaqueY + 40);
  }
}

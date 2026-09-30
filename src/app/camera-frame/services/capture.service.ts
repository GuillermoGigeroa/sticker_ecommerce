import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { CameraService } from './camera.service';
import { FrameService } from './frame.service';
import { FilterService } from './filter.service';
import { FrameType } from '../enums/frame-type.enum';
import { FilterType } from '../enums/filter-type.enum';

@Injectable({
  providedIn: 'root'
})
export class CaptureService {
  constructor(
    private cameraService: CameraService,
    private frameService: FrameService,
    private filterService: FilterService
  ) {}

  capturePhoto(
    frameType: FrameType,
    filterType: FilterType,
    isMirrorOn: boolean,
    caption?: string,
    date?: string
  ): Observable<string> {
    return from(this.renderPhoto(frameType, filterType, isMirrorOn, caption, date));
  }

  private async renderPhoto(
    frameType: FrameType,
    filterType: FilterType,
    isMirrorOn: boolean,
    caption?: string,
    date?: string
  ): Promise<string> {
    const video = this.cameraService.getVideoElement();
    if (!video) {
      throw new Error('Video element not available');
    }

    const renderer = this.frameService.getRenderer(frameType);
    if (!renderer) {
      throw new Error('Frame renderer not found');
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    const dimensions = renderer.getCanvasDimensions();
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    renderer.renderBackground(ctx, dimensions.width, dimensions.height);

    const photoArea = renderer.getPhotoArea();

    ctx.save();

    if (photoArea.radius) {
      ctx.beginPath();
      ctx.roundRect(photoArea.x, photoArea.y, photoArea.w, photoArea.h, photoArea.radius);
      ctx.clip();
    }

    const canvasFilter = this.filterService.getCanvasFilter(filterType);
    if (canvasFilter && canvasFilter !== 'none') {
      ctx.filter = canvasFilter;
    }

    if (isMirrorOn) {
      ctx.translate(photoArea.x + photoArea.w, photoArea.y);
      ctx.scale(-1, 1);
      this.drawImageProp(ctx, video, 0, 0, photoArea.w, photoArea.h);
    } else {
      this.drawImageProp(ctx, video, photoArea.x, photoArea.y, photoArea.w, photoArea.h);
    }

    ctx.restore();

    renderer.renderOverlay(ctx, dimensions.width, dimensions.height, photoArea, caption, date);

    return canvas.toDataURL('image/png');
  }

  private drawImageProp(
    ctx: CanvasRenderingContext2D,
    img: HTMLVideoElement,
    x: number,
    y: number,
    w: number,
    h: number,
    offsetX: number = 0.5,
    offsetY: number = 0.5
  ): void {
    const iw = img.videoWidth || img.width;
    const ih = img.videoHeight || img.height;
    const r = Math.min(w / iw, h / ih);
    let nw = iw * r;
    let nh = ih * r;
    let cx, cy, cw, ch, ar = 1;

    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;

    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  }

  playBeep(frequency: number = 440, duration: number = 0.15): void {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio API not available');
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FrameType } from '../enums/frame-type.enum';
import { FrameConfig, PhotoArea, CanvasDimensions } from '../models/frame.model';
import { FrameRenderer } from './frame-renderer.interface';
import { PolaroidRenderer } from './renderers/polaroid.renderer';
import { GoldRenderer } from './renderers/gold.renderer';
import { FlowersRenderer } from './renderers/flowers.renderer';
import { NeonRenderer } from './renderers/neon.renderer';
import { WoodRenderer } from './renderers/wood.renderer';
import { GlassRenderer } from './renderers/glass.renderer';

@Injectable({
  providedIn: 'root'
})
export class FrameService {
  private frames: FrameConfig[] = [
    {
      type: FrameType.POLAROID,
      name: 'Polaroid Retro',
      emoji: '📸',
      description: 'Borde blanco clásico con pie de foto personalizable'
    },
    {
      type: FrameType.GOLD,
      name: 'Museo Dorado',
      emoji: '🏛️',
      description: 'Moldura dorada con paspartú crema'
    },
    {
      type: FrameType.FLOWERS,
      name: 'Flores & Margaritas',
      emoji: '🌼',
      description: 'Esquinas ornamentadas con margaritas'
    },
    {
      type: FrameType.NEON,
      name: 'Neón Cyber',
      emoji: '⚡',
      description: 'Bordes animados con iluminación neón'
    },
    {
      type: FrameType.WOOD,
      name: 'Madera Rústica',
      emoji: '🪵',
      description: 'Portarretratos acogedor con textura de madera'
    },
    {
      type: FrameType.GLASS,
      name: 'Cristal Moderno',
      emoji: '🪟',
      description: 'Efecto glassmorphism contemporáneo'
    }
  ];

  private renderers: Map<FrameType, FrameRenderer>;
  private currentFrameSubject = new BehaviorSubject<FrameType>(FrameType.POLAROID);
  currentFrame$ = this.currentFrameSubject.asObservable();

  constructor() {
    this.renderers = new Map<FrameType, FrameRenderer>();
    this.renderers.set(FrameType.POLAROID, new PolaroidRenderer());
    this.renderers.set(FrameType.GOLD, new GoldRenderer());
    this.renderers.set(FrameType.FLOWERS, new FlowersRenderer());
    this.renderers.set(FrameType.NEON, new NeonRenderer());
    this.renderers.set(FrameType.WOOD, new WoodRenderer());
    this.renderers.set(FrameType.GLASS, new GlassRenderer());
  }

  getFrames(): FrameConfig[] {
    return this.frames;
  }

  getCurrentFrame(): FrameType {
    return this.currentFrameSubject.value;
  }

  setFrame(frameType: FrameType): void {
    this.currentFrameSubject.next(frameType);
  }

  getFrameConfig(frameType: FrameType): FrameConfig | undefined {
    return this.frames.find(f => f.type === frameType);
  }

  getRenderer(frameType: FrameType): FrameRenderer | undefined {
    return this.renderers.get(frameType);
  }

  getCurrentRenderer(): FrameRenderer | undefined {
    return this.renderers.get(this.currentFrameSubject.value);
  }

  getCanvasDimensions(frameType: FrameType): CanvasDimensions {
    const renderer = this.renderers.get(frameType);
    return renderer ? renderer.getCanvasDimensions() : { width: 800, height: 1000 };
  }

  getPhotoArea(frameType: FrameType): PhotoArea {
    const renderer = this.renderers.get(frameType);
    return renderer ? renderer.getPhotoArea() : { x: 40, y: 40, w: 720, h: 780, radius: 4 };
  }
}

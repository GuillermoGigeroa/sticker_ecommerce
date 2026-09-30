import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CameraService } from '../../services/camera.service';
import { FrameService } from '../../services/frame.service';
import { FilterService } from '../../services/filter.service';
import { CaptureService } from '../../services/capture.service';
import { FrameType } from '../../enums/frame-type.enum';
import { FilterType } from '../../enums/filter-type.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-camera-frame',
  templateUrl: './camera-frame.component.html',
  styleUrls: ['./camera-frame.component.scss'],
  standalone: false
})
export class CameraFrameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  
  isCameraOn = false;
  isMirrorOn = true;
  currentFrame: FrameType = FrameType.POLAROID;
  currentFilter: FilterType = FilterType.NORMAL;
  
  useTimer = true;
  timerSeconds = 3;
  countdown = 0;
  isCountingDown = false;
  
  polaroidCaption = 'Recuerdo Especial ✨';
  captionDate = '';
  
  isFlashActive = false;
  showPhotoModal = false;
  capturedPhotoUrl = '';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private cameraService: CameraService,
    private frameService: FrameService,
    private filterService: FilterService,
    private captureService: CaptureService
  ) {
    this.updateDateDisplay();
  }

  ngAfterViewInit(): void {
    this.cameraService.setVideoElement(this.videoElement.nativeElement);
    
    this.subscriptions.push(
      this.cameraService.isCameraOn$.subscribe(isOn => {
        this.isCameraOn = isOn;
      }),
      this.cameraService.isMirrorOn$.subscribe(isOn => {
        this.isMirrorOn = isOn;
      }),
      this.frameService.currentFrame$.subscribe(frame => {
        this.currentFrame = frame;
      }),
      this.filterService.currentFilter$.subscribe(filter => {
        this.currentFilter = filter;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.cameraService.cleanup();
  }

  updateDateDisplay(): void {
    const now = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric' } as const;
    this.captionDate = now.toLocaleDateString('es-ES', options).toUpperCase();
  }

  onActivateCamera(): void {
    this.cameraService.startCamera().subscribe();
  }

  onCapture(): void {
    if (!this.isCameraOn) {
      alert('Por favor enciende tu cámara primero para tomar la foto.');
      return;
    }

    if (this.useTimer) {
      this.startCountdown();
    } else {
      this.executeCapture();
    }
  }

  startCountdown(): void {
    this.isCountingDown = true;
    this.countdown = this.timerSeconds;
    this.captureService.playBeep(440, 0.1);

    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown > 0) {
        this.captureService.playBeep(440, 0.1);
      } else {
        clearInterval(interval);
        this.isCountingDown = false;
        this.captureService.playBeep(880, 0.25);
        this.executeCapture();
      }
    }, 1000);
  }

  executeCapture(): void {
    this.isFlashActive = true;
    setTimeout(() => {
      this.isFlashActive = false;
    }, 100);

    this.captureService.capturePhoto(
      this.currentFrame,
      this.currentFilter,
      this.isMirrorOn,
      this.polaroidCaption,
      this.captionDate
    ).subscribe(dataUrl => {
      this.capturedPhotoUrl = dataUrl;
      this.showPhotoModal = true;
    });
  }

  closePhotoModal(): void {
    this.showPhotoModal = false;
  }

  getFrameClass(): string {
    return `frame-${this.currentFrame}`;
  }

  getFilterClass(): string {
    return `filter-${this.currentFilter}`;
  }

  getMirrorClass(): string {
    return this.isMirrorOn ? 'mirror-mode' : '';
  }

  showPolaroidFooter(): boolean {
    return this.currentFrame === FrameType.POLAROID;
  }

  showGoldFooter(): boolean {
    return this.currentFrame === FrameType.GOLD;
  }

  showNeonFooter(): boolean {
    return this.currentFrame === FrameType.NEON;
  }
}

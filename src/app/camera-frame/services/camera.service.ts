import { Injectable } from '@angular/core';
import { from, Observable, Subject, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;
  
  private isCameraOnSubject = new BehaviorSubject<boolean>(false);
  private isMirrorOnSubject = new BehaviorSubject<boolean>(true);
  private errorSubject = new Subject<string>();

  isCameraOn$ = this.isCameraOnSubject.asObservable();
  isMirrorOn$ = this.isMirrorOnSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor() {}

  setVideoElement(video: HTMLVideoElement): void {
    this.videoElement = video;
  }

  startCamera(): Observable<void> {
    if (!this.videoElement) {
      this.errorSubject.next('Video element not set');
      return from([]);
    }

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    return from(navigator.mediaDevices.getUserMedia(constraints)).pipe(
      tap((mediaStream) => {
        this.stream = mediaStream;
        if (this.videoElement) {
          this.videoElement.srcObject = mediaStream;
          
          this.videoElement.onloadedmetadata = () => {
            this.videoElement!.play();
            this.isCameraOnSubject.next(true);
          };
        }
      }),
      map(() => void 0),
      catchError((error) => {
        console.error('Error accessing camera:', error);
        this.errorSubject.next('No se pudo acceder a la cámara. Asegúrate de otorgar permisos.');
        this.isCameraOnSubject.next(false);
        return from([]);
      })
    );
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
    
    this.isCameraOnSubject.next(false);
  }

  toggleCamera(): void {
    if (this.isCameraOnSubject.value) {
      this.stopCamera();
    } else {
      this.startCamera().subscribe();
    }
  }

  toggleMirror(): void {
    const currentMirror = this.isMirrorOnSubject.value;
    this.isMirrorOnSubject.next(!currentMirror);
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }

  cleanup(): void {
    this.stopCamera();
    this.isCameraOnSubject.complete();
    this.isMirrorOnSubject.complete();
    this.errorSubject.complete();
  }
}

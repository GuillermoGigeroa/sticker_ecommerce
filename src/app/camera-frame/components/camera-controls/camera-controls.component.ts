import { Component, Input } from '@angular/core';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-camera-controls',
  templateUrl: './camera-controls.component.html',
  styleUrls: ['./camera-controls.component.scss'],
  standalone: false
})
export class CameraControlsComponent {
  isCameraOn = false;
  isMirrorOn = true;

  constructor(private cameraService: CameraService) {
    this.cameraService.isCameraOn$.subscribe(isOn => {
      this.isCameraOn = isOn;
    });
    this.cameraService.isMirrorOn$.subscribe(isOn => {
      this.isMirrorOn = isOn;
    });
  }

  toggleCamera(): void {
    this.cameraService.toggleCamera();
  }

  toggleMirror(): void {
    this.cameraService.toggleMirror();
  }
}

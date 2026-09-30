import { Component } from '@angular/core';
import { FrameConfig } from '../../models/frame.model';
import { FrameType } from '../../enums/frame-type.enum';
import { FrameService } from '../../services/frame.service';

@Component({
  selector: 'app-frame-selector',
  templateUrl: './frame-selector.component.html',
  styleUrls: ['./frame-selector.component.scss'],
  standalone: false
})
export class FrameSelectorComponent {
  frames: FrameConfig[] = [];
  selectedFrame: FrameType = FrameType.POLAROID;

  constructor(private frameService: FrameService) {
    this.frames = this.frameService.getFrames();
    this.selectedFrame = this.frameService.getCurrentFrame();
  }

  selectFrame(frameType: FrameType): void {
    this.selectedFrame = frameType;
    this.frameService.setFrame(frameType);
  }

  isSelected(frameType: FrameType): boolean {
    return this.selectedFrame === frameType;
  }
}

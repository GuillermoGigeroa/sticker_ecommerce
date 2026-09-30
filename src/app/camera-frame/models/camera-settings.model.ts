import { FrameType } from '../enums/frame-type.enum';
import { FilterType } from '../enums/filter-type.enum';

export interface CameraSettings {
  isCameraOn: boolean;
  isMirrorOn: boolean;
  currentFrame: FrameType;
  currentFilter: FilterType;
  useTimer: boolean;
  timerSeconds: number;
  polaroidCaption: string;
}

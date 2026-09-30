import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CameraFrameComponent } from './components/camera-frame/camera-frame.component';
import { FrameSelectorComponent } from './components/frame-selector/frame-selector.component';
import { FilterSelectorComponent } from './components/filter-selector/filter-selector.component';
import { CameraControlsComponent } from './components/camera-controls/camera-controls.component';
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';

@NgModule({
  declarations: [
    CameraFrameComponent,
    FrameSelectorComponent,
    FilterSelectorComponent,
    CameraControlsComponent,
    PhotoModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class CameraFrameModule { }

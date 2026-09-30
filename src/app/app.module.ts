import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { NavigationService } from './shared/services/navigation.service';
import { UtilsService } from './shared/services/utils.service';
import { DataService } from './shared/services/data.service';
import { FormsModule } from '@angular/forms';
import { CameraFrameModule } from './camera-frame/camera-frame.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    CameraFrameModule,
  ],
  providers: [
    DataService,
    NavigationService,
    UtilsService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }

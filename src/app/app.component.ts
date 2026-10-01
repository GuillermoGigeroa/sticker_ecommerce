import { Component } from '@angular/core';
import { Menu } from './shared/enums/menu.enum';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
    title = 'El Ermitario';
    menu = Menu;
}

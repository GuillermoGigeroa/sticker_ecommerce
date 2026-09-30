import { Component } from '@angular/core';

class Item {
    image: string;
    text: string;
    constructor(image: string, text: string) {
        this.image = image;
        this.text = text;
    }
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent {
    items: Array<Item> = new Array<Item>();
    constructor() {
        this.generateObjects();
    }

    private generateObjects() {
        this.items.push(new Item('assets/images/1.png', 'Sticker 1'));
        this.items.push(new Item('assets/images/2.png', 'Sticker 2'));
        this.items.push(new Item('assets/images/3.png', 'Sticker 3'));
        this.items.push(new Item('assets/images/4.png', 'Sticker 4'));
        this.items.push(new Item('assets/images/5.png', 'Sticker 5'));
        this.items.push(new Item('assets/images/6.png', 'Sticker 6'));
        this.items.push(new Item('assets/images/7.png', 'Sticker 7'));
    }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.scss'],
  standalone: false
})
export class PhotoModalComponent {
  @Input() isOpen = false;
  @Input() photoDataUrl = '';
  @Input() isFavorite = false;
  @Output() close = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();
  @Output() favorite = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onDownload(): void {
    this.download.emit();
  }

  onFavorite(): void {
    this.favorite.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}

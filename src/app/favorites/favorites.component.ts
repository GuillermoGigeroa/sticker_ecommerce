import { Component, OnInit } from '@angular/core';
import { FavoritesService, FavoriteItem } from '../shared/services/favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: false
})
export class FavoritesComponent implements OnInit {
  favorites: FavoriteItem[] = [];
  filter: 'all' | 'sticker' | 'photo' = 'all';

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    if (this.filter === 'all') {
      this.favorites = this.favoritesService.getFavorites();
    } else {
      this.favorites = this.favoritesService.getFavoritesByType(this.filter);
    }
  }

  setFilter(filterType: 'all' | 'sticker' | 'photo'): void {
    this.filter = filterType;
    this.loadFavorites();
  }

  removeFavorite(id: string): void {
    this.favoritesService.removeFavorite(id);
    this.loadFavorites();
  }

  isFavorite(id: string): boolean {
    return this.favoritesService.isFavorite(id);
  }

  get itemCount(): number {
    return this.favorites.length;
  }

  get stickerCount(): number {
    return this.favoritesService.getFavoritesByType('sticker').length;
  }

  get photoCount(): number {
    return this.favoritesService.getFavoritesByType('photo').length;
  }
}

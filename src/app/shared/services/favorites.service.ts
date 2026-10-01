import { Injectable } from '@angular/core';

export interface FavoriteItem {
  id: string;
  type: 'sticker' | 'photo';
  image: string;
  text?: string;
  caption?: string;
  date?: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'ggigeroa_favorites';
  private favorites: FavoriteItem[] = [];

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.favorites = JSON.parse(stored);
      } catch (e) {
        console.error('Error loading favorites from localStorage', e);
        this.favorites = [];
      }
    }
  }

  private saveFavorites(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
    } catch (e) {
      console.error('Error saving favorites to localStorage', e);
    }
  }

  addFavorite(item: FavoriteItem): void {
    if (!this.isFavorite(item.id)) {
      this.favorites.push(item);
      this.saveFavorites();
    }
  }

  removeFavorite(id: string): void {
    this.favorites = this.favorites.filter(f => f.id !== id);
    this.saveFavorites();
  }

  isFavorite(id: string): boolean {
    return this.favorites.some(f => f.id === id);
  }

  getFavorites(): FavoriteItem[] {
    return [...this.favorites];
  }

  getFavoritesByType(type: 'sticker' | 'photo'): FavoriteItem[] {
    return this.favorites.filter(f => f.type === type);
  }

  toggleFavorite(item: FavoriteItem): void {
    if (this.isFavorite(item.id)) {
      this.removeFavorite(item.id);
    } else {
      this.addFavorite(item);
    }
  }

  getFavoritesCount(): number {
    return this.favorites.length;
  }

  clearFavorites(): void {
    this.favorites = [];
    this.saveFavorites();
  }
}

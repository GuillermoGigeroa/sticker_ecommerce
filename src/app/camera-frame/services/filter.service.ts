import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterType } from '../enums/filter-type.enum';
import { FilterConfig } from '../models/filter.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filters: FilterConfig[] = [
    {
      type: FilterType.NORMAL,
      name: 'Natural',
      cssFilter: 'none',
      canvasFilter: 'none'
    },
    {
      type: FilterType.BW,
      name: 'Blanco y Negro',
      cssFilter: 'grayscale(100%) contrast(115%)',
      canvasFilter: 'grayscale(100%) contrast(115%)'
    },
    {
      type: FilterType.SEPIA,
      name: 'Sepia Vintage',
      cssFilter: 'sepia(75%) contrast(105%) brightness(95%)',
      canvasFilter: 'sepia(75%) contrast(105%) brightness(95%)'
    },
    {
      type: FilterType.WARM,
      name: 'Atardecer Cálido',
      cssFilter: 'sepia(30%) saturate(140%) hue-rotate(-15deg)',
      canvasFilter: 'sepia(30%) saturate(140%) hue-rotate(-15deg)'
    },
    {
      type: FilterType.COOL,
      name: 'Cian & Frío',
      cssFilter: 'saturate(110%) hue-rotate(180deg) brightness(105%)',
      canvasFilter: 'saturate(110%) hue-rotate(180deg) brightness(105%)'
    },
    {
      type: FilterType.SOFT,
      name: 'Retrato Suave',
      cssFilter: 'brightness(110%) contrast(90%) saturate(115%)',
      canvasFilter: 'brightness(110%) contrast(90%) saturate(115%)'
    }
  ];

  private currentFilterSubject = new BehaviorSubject<FilterType>(FilterType.NORMAL);
  currentFilter$ = this.currentFilterSubject.asObservable();

  constructor() {}

  getFilters(): FilterConfig[] {
    return this.filters;
  }

  getCurrentFilter(): FilterType {
    return this.currentFilterSubject.value;
  }

  setFilter(filterType: FilterType): void {
    this.currentFilterSubject.next(filterType);
  }

  getFilterConfig(filterType: FilterType): FilterConfig | undefined {
    return this.filters.find(f => f.type === filterType);
  }

  getCssFilter(filterType: FilterType): string {
    const config = this.getFilterConfig(filterType);
    return config ? config.cssFilter : 'none';
  }

  getCanvasFilter(filterType: FilterType): string {
    const config = this.getFilterConfig(filterType);
    return config ? config.canvasFilter : 'none';
  }
}

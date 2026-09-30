import { Component } from '@angular/core';
import { FilterConfig } from '../../models/filter.model';
import { FilterType } from '../../enums/filter-type.enum';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-filter-selector',
  templateUrl: './filter-selector.component.html',
  styleUrls: ['./filter-selector.component.scss'],
  standalone: false
})
export class FilterSelectorComponent {
  filters: FilterConfig[] = [];
  selectedFilter: FilterType = FilterType.NORMAL;

  constructor(private filterService: FilterService) {
    this.filters = this.filterService.getFilters();
    this.selectedFilter = this.filterService.getCurrentFilter();
  }

  selectFilter(filterType: FilterType): void {
    this.selectedFilter = filterType;
    this.filterService.setFilter(filterType);
  }

  isSelected(filterType: FilterType): boolean {
    return this.selectedFilter === filterType;
  }
}

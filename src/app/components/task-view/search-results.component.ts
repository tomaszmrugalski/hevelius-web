import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogObject } from '../../services/catalogs.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SearchResultsComponent {
  @Input() results: CatalogObject[] = [];
  @Output() selected = new EventEmitter<CatalogObject>();

  onSelect(result: CatalogObject) {
    this.selected.emit(result);
  }
}
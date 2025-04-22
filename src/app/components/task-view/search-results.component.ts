import { Component, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogObject } from '../../services/catalogs.service';

@Component({
  selector: 'app-search-results',
  template: `
    <div class="search-results-container">
      <div class="search-result-item" *ngFor="let result of results" (click)="onSelect(result)">
        {{result.name}} ({{result.catalog}}) - RA: {{result.ra}}, Dec: {{result.decl}}
      </div>
    </div>
  `,
  styles: [`
    .search-results-container {
      background: white;
      border-radius: 4px;
      max-height: 200px;
      overflow-y: auto;
    }
    .search-result-item {
      padding: 8px 16px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
    }
    .search-result-item:hover {
      background-color: #f5f5f5;
    }
    .search-result-item:last-child {
      border-bottom: none;
    }
  `],
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
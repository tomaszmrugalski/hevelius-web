import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CatalogsService, CatalogObject } from '../../services/catalogs.service';
import { CoordsFormatterService } from '../../services/coords-formatter.service';
import { MatSort, Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TopBarService } from '../../services/top-bar.service';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.css'],
  animations: [
    trigger('filterExpand', [
      state('collapsed', style({
        height: '0px',
        minHeight: '0',
        padding: '0',
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        padding: '1rem'
      })),
      transition('expanded <=> collapsed', [
        animate('200ms ease-in-out')
      ])
    ])
  ]
})
export class CatalogsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  currentSort: {
    sort_by: string;
    sort_order: 'asc' | 'desc';
  } = {
    sort_by: 'name',
    sort_order: 'asc'
  };

  displayedColumns: string[] = ['name', 'catalog', 'ra', 'decl', 'type', 'const', 'magn'];
  objects: CatalogObject[] = [];
  totalObjects = 0;
  currentPage = 1;
  pageSize = 100;
  private subscriptions: Subscription[] = [];
  filterForm: FormGroup;
  isFilterVisible = false;

  constructor(
    private catalogsService: CatalogsService,
    private coordFormatter: CoordsFormatterService,
    private fb: FormBuilder,
    private topBarService: TopBarService,
    private cdr: ChangeDetectorRef
  ) {
    this.initFilterForm();

    // Set initial state for top bar in constructor
    setTimeout(() => {
      this.topBarService.updateState({
        showFilter: true,
        filterVisible: this.isFilterVisible,
        onFilterToggle: () => this.toggleFilters()
      });
    });
  }

  private initFilterForm() {
    this.filterForm = this.fb.group({
      catalog: [null],
      name: [null]
    });
  }

  ngOnInit() {
    this.subscriptions.push(
      this.catalogsService.getTotalObjects().subscribe(total => {
        // Only update title if we have actual data (not 0)
        if (total > 0) {
          this.totalObjects = total;
          this.updateTitle();
        }
      }),
      this.catalogsService.getCurrentPage().subscribe(page => {
        this.currentPage = page;
      })
    );

    this.loadObjects({
      sort_by: this.currentSort.sort_by,
      sort_order: this.currentSort.sort_order
    });
  }

  private updateTitle() {
    this.topBarService.updateState({
      title: `Catalogs: ${this.totalObjects} objects`
    });
  }

  applyFilters() {
    const filters = this.filterForm.value;
    Object.keys(filters).forEach(key => {
      if (filters[key] === null || filters[key] === '') {
        delete filters[key];
      }
    });

    this.loadObjects({
      ...filters,
      sort_by: this.currentSort.sort_by,
      sort_order: this.currentSort.sort_order
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.loadObjects({
      sort_by: this.currentSort.sort_by,
      sort_order: this.currentSort.sort_order
    });
  }

  loadObjects(params: any = {}) {
    this.catalogsService.listObjects({
      page: this.currentPage,
      per_page: this.pageSize,
      ...params
    }).subscribe(response => {
      this.objects = response.objects;
    });
  }

  formatRA(ra: number): string {
    return this.coordFormatter.formatRA(ra);
  }

  formatDec(dec: number): string {
    return this.coordFormatter.formatDec(dec);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadObjects({
      sort_by: this.currentSort.sort_by,
      sort_order: this.currentSort.sort_order
    });
  }

  onSortChange(sort: Sort) {
    this.currentSort = {
      sort_by: sort.active,
      sort_order: (sort.direction as 'asc' | 'desc') || 'asc'
    };

    this.loadObjects({
      sort_by: this.currentSort.sort_by,
      sort_order: this.currentSort.sort_order
    });
  }

  toggleFilters() {
    this.isFilterVisible = !this.isFilterVisible;
    this.topBarService.updateState({
      filterVisible: this.isFilterVisible
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.topBarService.resetState();
  }
}
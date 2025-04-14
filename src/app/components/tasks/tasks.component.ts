import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../../services/login.service';
import { TasksService } from '../../services/tasks.service';
import { CoordsFormatterService } from '../../services/coords-formatter.service';
import { TaskViewComponent } from '../task-view/task-view.component';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../../models/task';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  currentSort: {
    sort_by: string;
    sort_order: 'asc' | 'desc';  // explicitly type this as union type
  } = {
    sort_by: 'task_id',
    sort_order: 'desc'
  };

  dataSource: TasksService;
  displayedColumns: string[] = ['task_id', 'user_id', 'state', 'object', 'ra', 'decl', 'exposure'];
  totalTasks = 0;
  currentPage = 1;
  pageSize = 50;
  private subscriptions: Subscription[] = [];
  filterForm: FormGroup;

  constructor(
    private loginService: LoginService,
    private http: HttpClient,
    private coordFormatter: CoordsFormatterService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.dataSource = new TasksService(this.http, this.loginService);
    this.initFilterForm();
  }

  private initFilterForm() {
    this.filterForm = this.fb.group({
      ra_min: [null],
      ra_max: [null],
      decl_min: [null],
      decl_max: [null],
      performed_after: [null],
      performed_before: [null]
    });
  }

  applyFilters() {
    const filters = this.filterForm.value;

    // Convert dates to ISO strings if they exist
    if (filters.performed_after) {
      filters.performed_after = filters.performed_after.toISOString();
    }
    if (filters.performed_before) {
      filters.performed_before = filters.performed_before.toISOString();
    }

    // Remove null values
    Object.keys(filters).forEach(key => {
      if (filters[key] === null) {
        delete filters[key];
      }
    });

    // Load tasks with current sort and filters
    this.dataSource.loadTasks({
      ...filters,
      sort_by: this.currentSort.sort_by,
      sort_order: this.currentSort.sort_order
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.dataSource.loadTasks({
      sort_by: this.currentSort.sort_by,
      sort_order: this.currentSort.sort_order
    });
  }

  ngOnInit() {
    // Subscribe to pagination info
    this.subscriptions.push(
      this.dataSource.getTotalTasks().subscribe(total => {
        this.totalTasks = total;
      }),
      this.dataSource.getCurrentPage().subscribe(page => {
        this.currentPage = page;
      })
    );

    // Initial load with default sorting
    this.dataSource.loadTasks({
      sort_by: this.currentSort.sort_by,
      sort_order: this.currentSort.sort_order
    });
  }

  formatRA(ra: number): string {
    return this.coordFormatter.formatRA(ra);
  }

  formatDec(dec: number): string {
    return this.coordFormatter.formatDec(dec);
  }

  onTaskLongPress(task: Task) {
    const user = this.loginService.getUser();
    if (!user || user.user_id !== task.user_id) {
      this.snackBar.open('You can only edit your own tasks', 'Close', { duration: 3000 });
      return;
    }

    if (![0, 1, 2].includes(task.state)) {
      this.snackBar.open('This task cannot be modified in its current state', 'Close', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(TaskViewComponent, {
      width: '800px',
      disableClose: true,
      data: {
        mode: 'edit',
        task: task
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.loadTasks();
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.dataSource.loadTasks({
      page: event.pageIndex + 1,
      per_page: event.pageSize
    });
  }

  onSortChange(sort: Sort) {
    this.currentSort = {
      sort_by: sort.active,
      sort_order: (sort.direction as 'asc' | 'desc') || 'desc'  // explicitly cast the direction
    };

    this.dataSource.loadTasks({
      sort_by: this.currentSort.sort_by,
      sort_order: this.currentSort.sort_order
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskViewComponent } from '../task-view/task-view.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NightPlanService } from '../../services/night-plan.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  headerTitle = 'Hevelius';

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private nightPlanService: NightPlanService
  ) {
    // Subscribe to router events to update the header title
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url === '/night-plan') {
        // Subscribe to task count changes when on night plan page
        this.nightPlanService.getTaskCount().subscribe(count => {
          this.headerTitle = `Night plan: ${count} tasks planned`;
        });
      } else {
        this.headerTitle = 'Hevelius';
      }
    });
  }

  openAddTaskDialog() {
    const dialogRef = this.dialog.open(TaskViewComponent, {
      width: '800px',
      disableClose: true,
      data: {
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle dialog close if needed
    });
  }
}
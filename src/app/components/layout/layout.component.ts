import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskViewComponent } from '../task-view/task-view.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NightPlanService } from '../../services/night-plan.service';
import { LoginService } from '../../services/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnDestroy {
  headerTitle = 'Hevelius';
  private subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private nightPlanService: NightPlanService,
    private loginService: LoginService
  ) {
    this.setupTitleUpdates();
  }

  private setupTitleUpdates() {
    // Subscribe to router events to update the header title
    this.subscriptions.push(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.updateTitle();
      })
    );
  }

  private updateTitle() {
    if (this.router.url === '/night-plan') {
      // Subscribe to task count changes when on night plan page
      const subscription = this.nightPlanService.getTaskCount().subscribe(count => {
        this.headerTitle = `Night plan: ${count} tasks planned`;
      });
      this.subscriptions.push(subscription);
    } else {
      this.headerTitle = 'Hevelius';
    }
  }

  ngOnDestroy() {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  openAddTaskDialog() {
    this.dialog.open(TaskViewComponent, {
      width: '800px',
      disableClose: true,
      data: {
        mode: 'add'
      }
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

}

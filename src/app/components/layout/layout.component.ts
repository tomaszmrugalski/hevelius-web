import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskViewComponent } from '../task-view/task-view.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NightPlanService } from '../../services/night-plan.service';
import { LoginService } from '../../services/login.service';
import { Subscription } from 'rxjs';
import { TopBarService } from '../../services/top-bar.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  title = 'Hevelius';
  showFilter = false;
  filterVisible = false;
  onFilterToggle?: () => void;
  private subscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private nightPlanService: NightPlanService,
    private loginService: LoginService,
    private topBarService: TopBarService
  ) {
    this.subscription = this.topBarService.state$.subscribe(state => {
      this.title = state.title;
      this.showFilter = state.showFilter;
      this.filterVisible = state.filterVisible;
      this.onFilterToggle = state.onFilterToggle;
    });
  }

  ngOnInit() {
    // Reset top bar state when component is initialized
    this.topBarService.resetState();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleFilter() {
    if (this.onFilterToggle) {
      this.onFilterToggle();
    }
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

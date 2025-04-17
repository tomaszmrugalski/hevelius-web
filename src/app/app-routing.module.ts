import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { AuthGuard } from './guards/auth.guard';
import { NightPlanComponent } from './components/night-plan/night-plan.component';
import { TelescopeListComponent } from './components/telescope-list/telescope-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'tasks', component: TasksComponent },
      { path: 'night-plan', component: NightPlanComponent },
      { path: 'scopes', component: TelescopeListComponent },
      { path: '', redirectTo: 'tasks', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

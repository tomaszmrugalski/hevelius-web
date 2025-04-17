import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { TelescopeListComponent } from './components/telescope-list/telescope-list.component';

import { TasksService } from './services/tasks.service';
import { LoginService } from './services/login.service';
import { CoordsFormatterService } from './services/coords-formatter.service';
import { TelescopeService } from './services/telescope.service';

import { MaterialModule } from '../material.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { LongPressDirective } from './directives/long-press.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NightPlanComponent } from './components/night-plan/night-plan.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        LayoutComponent,
        TasksComponent,
        TaskViewComponent,
        LongPressDirective,
        NightPlanComponent,
        TelescopeListComponent
    ],
    bootstrap: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MaterialModule,
        MatSnackBarModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMenuModule,
        MatIconModule,
        MatPaginatorModule,
        MatSortModule,
        MatExpansionModule,
        MatTableModule
    ],
    providers: [
        TasksService,
        LoginService,
        CoordsFormatterService,
        TelescopeService,
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class AppModule { }

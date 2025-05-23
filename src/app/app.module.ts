import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { LayoutComponent } from './components/layout/layout.component';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { NightPlanComponent } from './components/night-plan/night-plan.component';
import { TelescopeListComponent } from './components/telescope-list/telescope-list.component';
import { CatalogsComponent } from './components/catalogs/catalogs.component';

import { TasksService } from './services/tasks.service';
import { LoginService } from './services/login.service';
import { CoordsFormatterService } from './services/coords-formatter.service';
import { TelescopeService } from './services/telescope.service';

import { MaterialModule } from '../material.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent,
        TaskViewComponent,
        NightPlanComponent,
        TelescopeListComponent,
        CatalogsComponent
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
        MatTableModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatToolbarModule,
        MatDividerModule
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

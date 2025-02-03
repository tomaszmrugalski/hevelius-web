import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';

import { TasksService } from './services/tasks.service';
import { LoginService } from './services/login.service';
import { CoordsFormatterService } from './services/coords-formatter.service';

import { MaterialModule } from '../material.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        MainComponent
    ],
    bootstrap: [
        AppComponent
    ], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MaterialModule,
        MatSnackBarModule], providers: [
        TasksService,
        LoginService,
        CoordsFormatterService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }

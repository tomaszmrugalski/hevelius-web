import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        LayoutComponent
    ]
})
export class AppComponent {
  title = 'hevelius';
  version = '0.0.2';
}

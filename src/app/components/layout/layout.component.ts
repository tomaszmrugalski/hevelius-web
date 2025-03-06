import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskViewComponent } from '../task-view/task-view.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  title = 'Hevelius';
  version = '0.1.0';

  constructor(private dialog: MatDialog) {}

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
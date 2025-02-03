import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../services/login.service';
import { TasksService } from '../services/tasks.service';
import { Hevelius } from '../../hevelius';
import { CoordsFormatterService } from '../services/coords-formatter.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent {
    title: string;
    version: string;

    dataSource: TasksService;

    displayedColumns: string[] = ['task_id', 'user_id', 'state', 'object', 'ra', 'decl', 'exposure'];


  constructor(private loginService: LoginService,
              private http: HttpClient,
              private coordFormatter: CoordsFormatterService) {
       this.version = Hevelius.version;
       this.title = Hevelius.title;

       this.dataSource = new TasksService(this.http, this.loginService);

       this.dataSource.loadTasks();
  }

  formatRA(ra: number): string {
    return this.coordFormatter.formatRA(ra);
  }

  formatDec(dec: number): string {
    return this.coordFormatter.formatDec(dec);
  }
}

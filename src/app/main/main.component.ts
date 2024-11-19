import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../services/login.service';
import { TasksService } from '../services/tasks.service';
import { Hevelius } from '../../hevelius';

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
              private http: HttpClient) {
       this.version = Hevelius.version;
       this.title = Hevelius.title;

       console.log('MainComponent::ctor: Instantiating TasksService');
       this.dataSource = new TasksService(this.http, this.loginService);

       this.dataSource.loadTasks();
/*
       x = localStorage.getItem('currentUser');
       const user = this.loginService.getUser();
       if (!user) {
           this.msg.add('User not logged in!');
       }*/
  }
}

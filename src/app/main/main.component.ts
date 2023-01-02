import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../services/login.service';
import { MessagesService } from '../services/messages.service';
import { TasksService } from '../services/tasks.service';
import { Hevelius } from '../../hevelius';
import { User } from '../models/user';
import { Task } from '../models/task';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {
    title: string;
    version: string;

    dataSource: TasksService;

    displayedColumns: string[] = ['task_id', 'user_id', 'state', 'object', 'ra', 'decl', 'exposure'];


  constructor(private msg: MessagesService,
              private loginService: LoginService,
              private http: HttpClient) {
       this.version = Hevelius.version;
       this.title = Hevelius.title;

       console.log('MainComponent::ctor: Instantiating TasksService');
       this.dataSource = new TasksService(this.msg, this.http, this.loginService);

       this.dataSource.loadTasks();
/*
       x = localStorage.getItem('currentUser');
       const user = this.loginService.getUser();
       if (!user) {
           this.msg.add('User not logged in!');
       }*/
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { MessagesService } from '../services/messages.service';
import { Hevelius } from '../../hevelius';
import { User } from '../models/user';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    title: string;
    version: string;


  constructor(private msg: MessagesService,
              private loginService: LoginService,
              private cfg: Hevelius) {
       this.version = this.cfg.version;
       this.title = this.cfg.title;

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

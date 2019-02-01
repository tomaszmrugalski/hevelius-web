import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessagesService } from '../services/messages.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private msg: MessagesService) { }

  login(username, password) {
      this.msg.add("LoginService::login("+ username + ", " + password + ")");
  }
}

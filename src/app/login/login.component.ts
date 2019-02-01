import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MessagesService } from '../services/messages.service';
import { LoginService } from '../services/login.service';
import { Hevelius } from '../../hevelius';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    title: string;
    version: string;

    hide: boolean;

  constructor(private messageService: MessagesService,
              private loginService: LoginService,
              private cfg: Hevelius) {

        this.hide = true;
        this.version = this.cfg.version;
        this.title = this.cfg.title;

/*      this.loginForm = new FormGroup({
          'user': new FormControl(null, Validators.required),
          'pass': new FormControl(null, Validators.minLength(6))
      }); */

 }

  ngOnInit() {
      this.messageService.add('LoginComponent::ngOnInit called');
  }

  onSubmit() {
      this.messageService.add('submit clicked! onSubmit called');
      this.loginService.login('thomson', 'password');
  }

}

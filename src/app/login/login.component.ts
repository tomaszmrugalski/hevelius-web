import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
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

    loginForm: FormGroup;

  constructor(private messageService: MessagesService,
              private loginService: LoginService,
              private cfg: Hevelius,
              private formBuilder: FormBuilder) {

        this.hide = true;
        this.version = this.cfg.version;
        this.title = this.cfg.title;

 }

  ngOnInit() {
      this.messageService.add('LoginComponent::ngOnInit called');

      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });
  }

  onSubmit() {
      this.messageService.add('submit clicked! onSubmit called');
      if (this.loginForm.invalid) {
          this.messageService.add('LoginComponent::onSubmit: form is invalid.');
          return;
      }

      this.loginService.login(this.loginForm.controls.username.value,
                              this.loginForm.controls.password.value);
  }

}

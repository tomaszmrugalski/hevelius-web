import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
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

    loginForm: UntypedFormGroup;

  constructor(private messageService: MessagesService,
              private loginService: LoginService,
              private router: Router,
              private formBuilder: UntypedFormBuilder) {

        this.hide = true;
        this.version = Hevelius.version;
        this.title = Hevelius.title;
 }

  ngOnInit() {

      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });
  }

  // This method is called when Login button is clicked.
  onSubmit() {
      if (this.loginForm.invalid) {
          this.messageService.add('Please fill in all fields.');
          return;
      }

      this.loginService.login(this.loginForm.controls.username.value,
                              this.loginForm.controls.password.value)
        .pipe(first())
        .subscribe(
            data =>  {
                if (data.status === true) {
                    this.messageService.add('Login successful! Welcome, ' + data.firstname);
                    this.router.navigateByUrl('/main');
                } else {
                    this.messageService.add('Login incorrect.');
                }
            }
        );
  }

}

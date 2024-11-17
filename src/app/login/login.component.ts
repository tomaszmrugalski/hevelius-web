import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MessagesService } from '../services/messages.service';
import { LoginService, LoginResponse } from '../services/login.service';
import { Hevelius } from '../../hevelius';
import { MatSnackBar } from '@angular/material/snack-bar';


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
              private snackBar: MatSnackBar,
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
          this.showMessage('Please fill in all fields.');
          return;
      }

      this.loginService.login(this.loginForm.controls.username.value,
                              this.loginForm.controls.password.value)
        .pipe(first())
        .subscribe(
            (data: LoginResponse) =>  {
                if (data.status === true) {
                    this.showMessage('Login successful! Welcome, ' + data.firstname);
                    this.router.navigateByUrl('/main');
                } else {
                    this.showMessage('Login incorrect.');
                }
            }
        );
  }


  showMessage(text: string) {
    this.snackBar.open(text, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });


  }

}


import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MessagesService } from '../services/messages.service';
import { Version } from '../../version';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    version: string;

    hide: boolean;

  constructor(private messageService: MessagesService) {

        this.hide = true;
      const v = new Version;
      this.version = v.version;

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
  }

}

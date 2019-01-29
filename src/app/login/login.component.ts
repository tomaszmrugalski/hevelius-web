import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private messageService: MessagesService) {

 }

  ngOnInit() {
      this.messageService.add('LoginComponent::ngOnInit called');

  }

  onSubmit() {
      this.messageService.add('submit clicked! onSubmit called');
  }

}

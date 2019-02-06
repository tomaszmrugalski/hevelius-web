import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessagesService } from '../services/messages.service';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private msg: MessagesService,
     private http: HttpClient) { }

  // This method is called locally when login form is filled in and submit
  // button is pressed.
  login(username, password) {
      this.msg.add('LoginService::login(' + username + ', ' + password + ')');

      // We need to prepare credentials to be sent. Username is used as is,
      // but the password needs to be passed through md5.
      const md5 = new Md5();
      let credentials = {
          username: username,
          password: md5.appendStr(password).end()
      };

      // This sends a request with specified parameters: username, md5(password)
      this.http.post('/api/login.php', credentials ).subscribe(
          data => {
            this.msg.add('Data received: ' + JSON.stringify(data));
            // This prints the following:
            // Data received: {"username":"thomson","password":"123"}
            //
            // This didn't work:
            //            this.msg.add('username: ' + data.username);
            // this.apps.push(data);
         },
          error => {
              this.msg.add('Error when calling http.post:' + console.error(error));
          }
      );

/*   this.http.get('http://127.0.0.1/api/users/authenticate', { username, password })
        .pipe(map(user => {
           // login successful if there's a jwt token in the response
           if (user && user.token) {
              // store user details and jwt token in local storage to keep user logged
              // in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(user));
               // this.currentUserSubject.next(user);
           }
           return user;
     })); */
  }
}

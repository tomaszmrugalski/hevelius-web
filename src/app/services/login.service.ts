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
    login(username: string, password: string) {
        // We need to prepare credentials to be sent. Username is used as is,
        // but the password needs to be passed through md5.
        const md5 = new Md5();
        const credentials = {
            username: username,
            password: md5.appendStr(password).end()
        };

        this.msg.add('LoginService::login - calling http.post');

        // This sends a request with specified parameters: username, md5(password)
        return this.http.post<any>('http://localhost/api/login.php', credentials )
        .pipe(map(data => {

                this.msg.add('data received');

                // This section is called when data has been returned. We need to check if the
                // credentials sent were accepted or not.
                if (data.result === 0) {
                    // Login success
                   this.loggedIn(data);
                } else {
                    // Login failed.
                }

                return data;
            },
            error => {
              this.msg.add('Error when sending form, (http.post failed, error:' + console.error(error) + ')');
            } ));

    }

    // This method is called when the response has arrived and indicates the credentials are ok
    // and we have received actual user data (i.e. login was successful)
    loggedIn(userData) {
        // Keep the user's data in the local storage.
        localStorage.setItem('currentUser', JSON.stringify(userData));
    }

    // This method is called when the user is logged out.
    logout() {
        localStorage.removeItem('currentUser');
    }
}

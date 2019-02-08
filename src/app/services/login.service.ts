import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MessagesService } from '../services/messages.service';
import { Md5 } from 'ts-md5/dist/md5';
import { User } from '../models/user';

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

        // This sends a request with specified parameters: username, md5(password)
        // This version is for local debugging: return this.http.post<any>('https://localhost/api/login.php', credentials )
        return this.http.post<any>('/api/login.php', credentials )
        .pipe(map(data => {

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

    public get getUser(): User {
        const x = localStorage.getItem('currentUser');
        if (x) {
            return JSON.parse(x);
        }
        return null;
    }

    // This method is called when the user is logged out.
    logout() {
        localStorage.removeItem('currentUser');
    }
}

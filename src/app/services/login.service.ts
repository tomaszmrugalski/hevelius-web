import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';
import { User } from '../models/user';
import { Hevelius } from 'src/hevelius';
import { Observable } from 'rxjs';

export interface LoginResponse {
    status: boolean;
    token?: string;
    user_id?: number;
    firstname?: string;
    lastname?: string;
    share?: string;
    phone?: string;
    email?: string;
    permissions?: string;
    aavso_id?: string;
    ftp_login?: string;
    ftp_pass?: string;
    msg?: string;
}

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    tmp_password: string;

    constructor(private http: HttpClient) { }

    // This method is called locally when login form is filled in and submit
    // button is pressed.
    login(username: string, password: string): Observable<LoginResponse> {
        // We need to prepare credentials to be sent. Username is used as is,
        // but the password needs to be passed through md5.
        const md5 = new Md5();
        const credentials = {
            username: username,
            password: md5.appendStr(password).end()
        };

        this.tmp_password = password;
        console.log('Storing passwd:' + this.tmp_password);

        // This sends a request with specified parameters: username, md5(password)
        // This version is for local debugging: return this.http.post<any>('https://localhost/api/login.php', credentials )
        return this.http.post<LoginResponse>(Hevelius.apiUrl + '/login', credentials )
        .pipe(map(data => {
                // This section is called when data has been returned. We need to check if the
                // credentials sent were accepted or not.
                if (data.status === true && data.token) {
                    // Login success
                    this.loggedIn(data);
                    localStorage.setItem('jwt_token', data.token);
                    // Store user data
                    console.log('Storing user data:', data);
                    localStorage.setItem('currentUser', JSON.stringify(data));
                }
                return data;
            },
            error => {
                if (error.status === 0) {
                    // This typically means the backend is unresponsive.
                    console.error('Backend is unresponsive. Please check the server.');
                } else if (error.status === 500) {
                    console.error('Backend Error: 500 Internal Server Error.');
                } else {
                    console.error('Error when requesting api/tasks data:', error);

              console.log('Error when sending form, (http.post failed, error:' + console.error(error) + ')');
            } ));
    }

    // This method is called when the response has arrived and indicates the credentials are ok
    // and we have received actual user data (i.e. login was successful)
    loggedIn(userData) {
        // Keep the user's data in the local storage.
        localStorage.setItem('currentUser', JSON.stringify(userData));
    }

    public getUser(): User {
        const x = localStorage.getItem('currentUser');
        if (x) {
            return JSON.parse(x);
        }
        return null;
    }

    // This method is called when the user is logged out.
    logout() {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('currentUser');
    }

    getToken(): string | null {
        return localStorage.getItem('jwt_token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}

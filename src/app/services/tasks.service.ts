import { Injectable } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Task } from '../models/task';
import { LoginService } from '../services/login.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Md5 } from 'ts-md5/dist/md5';

export interface TasksParams {
    limit?: number;    // number of tasks to be returned
    user_id?: number;
    password?: string;
}

@Injectable({
  providedIn: 'root'
})

export class TasksService implements DataSource<Task> {

    private tasks = new BehaviorSubject<Task[]>([]);

    constructor(private msg: MessagesService,
                private http: HttpClient,
                private login: LoginService) {

    }

    connect(collectionViewer: CollectionViewer): Observable<Task[]> {
        return this.tasks.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.tasks.complete();
    }

    public loadTasks() {
        // this.loadTasksFake();

        this.loadTasksReal({ limit: 9 });
    }

    private loadTasksFake() {
        console.log('TaskService - loadTasks (faking one task)');
        const t = [{
            task_id: 1,
            user_id: 1,
            object: 'Horsehead',
            ra: 12.3456,
            decl: 56.789,
            exposure: 150,
            state: 6
        }];

        this.tasks.next(t);
    }

    // This method is called when data is returned by backend
    parseTasks(data) {
        console.log('TasksService::parseTasks() - received data!');
        console.log(data);
        if (data.result == 0) {
            console.log("Received %d task(s)", data.tasks.length);
            this.tasks.next(data.tasks);
        }
    }

    // Supported parameters:
    // limit: number (default: 10)
    loadTasksReal(params: TasksParams): void {

        console.log('loadTasksReal #1');
        // If limit of tasks has not been specified, let's return 10.
        if (! params.hasOwnProperty('limit')) {
            params.limit = 10;
        }

        const user = this.login.getUser();
        params.user_id = user.user_id;
        const md5 = new Md5();
        console.log(user.password);
        params.password = String(md5.appendStr(user.password).end());

        // There should be at least 3 parameters:
        // - user_id
        // - password (md5 of the actual passowrd)
        // - limit (number of tasks to be returned)
        console.log('loadTasksReal params:');
        console.log(params);


        this.http.post<any>('http://localhost/api/tasks.php', params )
        .subscribe(
                data => {
                // This section is called when data (presumably having a list of tasks)
                // has been returned.
                console.log("Received data!");
                this.parseTasks(data);
            },

            error => {
                this.msg.add('Error when requesting api/tasks.php data, (http.post failed, error:' + console.error(error) + ')');
            } );

    }

}

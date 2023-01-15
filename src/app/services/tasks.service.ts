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
import { TaskStatesService } from './task-states.service';
import { Hevelius } from 'src/hevelius';

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
	public states = new TaskStatesService();

    constructor(private msg: MessagesService,
                private http: HttpClient,
                private login: LoginService) {

        // TODO: remove this
		console.log("#### Test:");
		console.log(this.states.getState(1));
    }

    connect(collectionViewer: CollectionViewer): Observable<Task[]> {
        return this.tasks.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.tasks.complete();
    }

    public loadTasks() {
        this.loadTasksReal({ limit: 10 });
        //this.loadTasksFake();
    }

    private loadTasksFake() {
        console.log('TaskService - loadTasks (faking one task)');
        const t = [{
            task_id: 1,
			user_id: 1,
			aavso_id: 'MTOA',
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

        // Format of the API data returned:
        // [
        //     134233,
        //     3,
        //     "MTOA",
        //     "B 343",
        //     20.2447,
        //     40.1447,
        //     300,
        //     "",
        //     "HA",
        //     1,
        //     1,
        //     1,
        //     0,
        //     1,
        //     1,
        //     0,
        //     null,
        //     30,
        //     60,
        //     "Wed, 03 Jun 2020 02:54:00 GMT",
        //     "Wed, 03 Jun 2020 04:24:00 GMT",
        //     0,
        //     "2020-06-03 02:54:00 H:58,6 AZ:73 P:87,20 SH:-28,5 SAZ:12",
        //     2,
        //     null,
        //     "Wed, 27 May 2020 21:37:44 GMT",
        //     "Tue, 02 Jun 2020 21:35:00 GMT",
        //     null,
        //     100,
        //     -12,
        //     1,
        //     0,
        //     0,
        //     0
        //   ]
        //
        // What the function expects:
        //
        // const t = [{
        //     task_id: 1,
		// 	user_id: 1,
		// 	aavso_id: 'MTOA',
        //     object: 'Horsehead',
        //     ra: 12.3456,
        //     decl: 56.789,
        //     exposure: 150,
        //     state: 6
        // }];
        //
        if (data) {
            console.log("Received %d task(s)", data.length);
            var tasks_list = []
            for (let i = 0; i < data.length; i++) {
                console.log("Processing item " + i)
                var d = data[i]
                console.log(d);
                console.log(d[0])
                tasks_list.push({
                    task_id: d[0],
                    user_id: d[1],
                    aavso_id: d[2],
                    object: d[3],
                    ra: d[4],
                    decl: d[5],
                    exposure: d[6],
                    state: d[7]
                })
            }
            this.tasks.next(tasks_list);
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


        this.http.post<any>(Hevelius.apiUrl + '/tasks', params )
        .subscribe(
                data => {
                // This section is called when data (presumably having a list of tasks)
                // has been returned.
                console.log("Received data!");
                this.parseTasks(data);
            },

            error => {
                this.msg.add('Error when requesting api/tasks data, (http.post failed, error:' + console.error(error) + ')');
            } );

    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task';
import { LoginService } from '../services/login.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { TaskStatesService } from './task-states.service';
import { Hevelius } from 'src/hevelius';

export interface TasksParams {
    limit?: number;    // number of tasks to be returned
    user_id?: number;
    password?: string;
}

interface TaskResponse {
    tasks: Task[];
}

@Injectable({
  providedIn: 'root'
})

export class TasksService implements DataSource<Task> {

	private tasks = new BehaviorSubject<Task[]>([]);
	public states = new TaskStatesService();

    constructor(private http: HttpClient,
                private login: LoginService) {
    }

    connect(): Observable<Task[]> {
        return this.tasks.asObservable();
    }

    disconnect(): void {
        this.tasks.complete();
    }

    public loadTasks() {
        this.loadTasksReal({ limit: 30 });
        //this.loadTasksFake();
    }

    private loadTasksFake() {
        console.log('TaskService - loadTasks (faking one task)');
        /* const t = [{
            task_id: 1,
			user_id: 1,
			aavso_id: 'MTOA',
            object: 'Horsehead',
            ra: 12.3456,
            decl: 56.789,
            exposure: 150,
            state: 6
        }];

        this.tasks.next(t); */
    }

    // This method is called when data is returned by backend
    parseTasks(data: TaskResponse) {
        if (data && data.tasks) {
            console.log("Received %d task(s)", data.tasks.length);
            // The tasks are already in the correct format, we can use them directly
            this.tasks.next(data.tasks);
        }
    }

    // Supported parameters:
    // limit: number (default: 10)
    loadTasksReal(params: TasksParams): void {
        // If limit of tasks has not been specified, let's return 10.
        if (! Object.prototype.hasOwnProperty.call(params, "limit")) {
            params.limit = 10;
        }

        const user = this.login.getUser();
        if (user == null) {
            console.log('WARNING: Attempt to load tasks failed, no user logged in.');
            return;
        }
        params.user_id = user.user_id;

        // There should be at least 2 parameters:
        // - user_id
        // - limit (number of tasks to be returned)

        this.http.post<TaskResponse>(Hevelius.apiUrl + '/tasks', params)
            .subscribe({
                next: (data) => {
                    // console.log("Received list of tasks, parsing data");
                    this.parseTasks(data);
                },
                error: (error) => {
                    console.log('Error when requesting api/tasks data:', error);
                }
            });
    }
}

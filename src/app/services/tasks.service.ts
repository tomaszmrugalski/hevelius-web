import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Task } from '../models/task';
import { TaskParams } from '../models/task-response';
import { LoginService } from './login.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
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
	private currentParams: TaskParams = {
		page: 1,
		per_page: 50,
		sort_by: 'task_id',
		sort_order: 'desc'
	};

	// Add pagination info
	private totalTasks = new BehaviorSubject<number>(0);
	private currentPage = new BehaviorSubject<number>(1);
	private totalPages = new BehaviorSubject<number>(1);

    constructor(private http: HttpClient,
                private login: LoginService) {
    }

    // Getters for pagination info
    getTotalTasks(): Observable<number> {
        return this.totalTasks.asObservable();
    }

    getCurrentPage(): Observable<number> {
        return this.currentPage.asObservable();
    }

    getTotalPages(): Observable<number> {
        return this.totalPages.asObservable();
    }

    connect(): Observable<Task[]> {
        return this.tasks.asObservable();
    }

    disconnect(): void {
        this.tasks.complete();
    }

    // public loadTasks() {
    //     this.loadTasksReal({ limit: 30 });
    //     //this.loadTasksFake();
    // }

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
    parseTasks(data: import('../models/task-response').TaskResponse) {
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

        this.http.post<import('../models/task-response').TaskResponse>(Hevelius.apiUrl + '/tasks', params)
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

    // Update params and load tasks
    loadTasks(params?: Partial<TaskParams>): void {
        if (params) {
            this.currentParams = { ...this.currentParams, ...params };
        }

        const user = this.login.getUser();
        if (!user) {
            console.log('WARNING: Attempt to load tasks failed, no user logged in.');
            return;
        }

        // Convert params to HttpParams
        let httpParams = new HttpParams();
        Object.entries(this.currentParams).forEach(([key, value]) => {
            if (value !== undefined) {
                httpParams = httpParams.set(key, value.toString());
            }
        });

        this.http.get<import('../models/task-response').TaskResponse>(Hevelius.apiUrl + '/tasks', { params: httpParams })
            .subscribe({
                next: (response) => {
                    this.tasks.next(response.tasks);
                    this.totalTasks.next(response.total);
                    this.currentPage.next(response.page);
                    this.totalPages.next(response.pages);
                },
                error: (error) => {
                    console.log('Error when requesting api/tasks data:', error);
                }
            });
    }
}

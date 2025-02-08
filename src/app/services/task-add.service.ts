import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hevelius } from 'src/hevelius';

export interface TaskAddResponse {
  status: boolean;
  task_id?: number;
  msg?: string;
}

export interface TaskAddRequest {
  user_id: number;
  scope_id: number;
  object?: string;
  ra: number;
  decl: number;
  exposure?: number;
  descr?: string;
  filter?: string;
  binning?: number;
  guiding?: boolean;
  dither?: boolean;
  calibrate?: boolean;
  solve?: boolean;
  other_cmd?: string;
  min_alt?: number;
  moon_distance?: number;
  skip_before?: string;
  skip_after?: string;
  min_interval?: number;
  comment?: string;
  max_moon_phase?: number;
  max_sun_alt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskAddService {
  constructor(private http: HttpClient) { }

  addTask(task: TaskAddRequest): Observable<TaskAddResponse> {
    return this.http.post<TaskAddResponse>(`${Hevelius.apiUrl}/task-add`, task);
  }
}
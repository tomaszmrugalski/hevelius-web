import { Task } from './task';

export interface TaskResponse {
  tasks: Task[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface TaskParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  ra_min?: number;
  ra_max?: number;
  decl_min?: number;
  decl_max?: number;
  performed_after?: string;
  performed_before?: string;
}
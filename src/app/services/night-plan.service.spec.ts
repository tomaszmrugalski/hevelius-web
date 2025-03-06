import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NightPlanService } from './night-plan.service';
import { provideHttpClient } from '@angular/common/http';
import { Hevelius } from 'src/hevelius';
import { Task } from '../models/task';

describe('NightPlanService', () => {
  let service: NightPlanService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(NightPlanService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load night plan with default scope_id', () => {
    const mockTasks = {
      tasks: [
        {
          task_id: 1,
          user_id: 1,
          aavso_id: 'TEST1',
          object: 'Test Object 1',
          ra: 12.34,
          decl: 56.78,
          exposure: 60,
          state: 1
        },
        {
          task_id: 2,
          user_id: 1,
          aavso_id: 'TEST2',
          object: 'Test Object 2',
          ra: 23.45,
          decl: 67.89,
          exposure: 120,
          state: 1
        }
      ] as Task[]
    };

    service.loadNightPlan();

    const req = httpMock.expectOne(`${Hevelius.apiUrl}/night-plan`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ scope_id: 3 }); // Default scope_id

    req.flush(mockTasks);

    service.connect().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks.tasks);
    });

    service.getTaskCount().subscribe(count => {
      expect(count).toBe(2);
    });
  });

  it('should load night plan with custom scope_id', () => {
    service.loadNightPlan({ scope_id: 5 });

    const req = httpMock.expectOne(`${Hevelius.apiUrl}/night-plan`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ scope_id: 5 });
  });

  it('should handle error response', () => {
    service.loadNightPlan();

    const req = httpMock.expectOne(`${Hevelius.apiUrl}/night-plan`);
    req.error(new ErrorEvent('Network error'));

    service.connect().subscribe(tasks => {
      expect(tasks).toEqual([]);
    });

    service.getTaskCount().subscribe(count => {
      expect(count).toBe(0);
    });
  });
});
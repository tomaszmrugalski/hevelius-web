import { TestBed } from '@angular/core/testing';
import { TasksService } from './tasks.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TasksService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: TasksService = TestBed.get(TasksService);
    expect(service).toBeTruthy();
  });
});

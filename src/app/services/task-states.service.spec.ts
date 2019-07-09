import { TestBed } from '@angular/core/testing';

import { TaskStatesService } from './task-states.service';

describe('TaskStatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskStatesService = TestBed.get(TaskStatesService);
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { TaskViewComponent } from './task-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task.service';
import { LoginService } from '../../services/login.service';
import { TelescopeService } from '../../services/telescope.service';
import { CatalogsService } from '../../services/catalogs.service';
import { Overlay } from '@angular/cdk/overlay';
import { BehaviorSubject, of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

describe('TaskViewComponent', () => {
  let component: TaskViewComponent;
  let fixture: ComponentFixture<TaskViewComponent>;
  let catalogsService: jasmine.SpyObj<CatalogsService>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let telescopeSubject: BehaviorSubject<any[]>;

  const mockCatalogObject = {
    object_id: 1,
    name: 'NGC7000',
    ra: 315.7,
    decl: 44.3,
    descr: 'North America Nebula',
    comment: '',
    type: 'Nebula',
    epoch: 'J2000',
    const: 'Cyg',
    magn: 4,
    x: 0,
    y: 0,
    altname: '',
    distance: 0,
    catalog: 'NGC'
  };

  const mockTelescope = {
    scope_id: 'test-scope',
    name: 'Test Telescope',
    active: true
  };

  beforeEach(fakeAsync(() => {
    console.log('Setting up test environment');
    telescopeSubject = new BehaviorSubject([mockTelescope]);
    const catalogsServiceSpy = jasmine.createSpyObj('CatalogsService', ['searchObjects']);
    catalogsServiceSpy.searchObjects.and.returnValue(of([mockCatalogObject]));

    TestBed.configureTestingModule({
      imports: [
        TaskViewComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'add' } },
        { provide: MatSnackBar, useValue: { open: () => {} } },
        { provide: TaskService, useValue: {} },
        { provide: LoginService, useValue: { getAuthHeaders: () => ({}) } },
        {
          provide: TelescopeService,
          useValue: {
            getTelescopes: () => {
              console.log('getTelescopes called');
              return telescopeSubject.asObservable();
            }
          }
        },
        { provide: CatalogsService, useValue: catalogsServiceSpy },
        Overlay
      ]
    });

    console.log('Creating component');
    fixture = TestBed.createComponent(TaskViewComponent);
    component = fixture.componentInstance;
    catalogsService = TestBed.inject(CatalogsService) as jasmine.SpyObj<CatalogsService>;

    // Initialize the component
    console.log('Detecting changes');
    fixture.detectChanges();

    // Wait for the form to be initialized
    console.log('Waiting for form initialization');
    tick();

    // Ensure telescopes are loaded and form is updated
    console.log('Ensuring telescopes are loaded');
    telescopeSubject.next([mockTelescope]);
    tick();

    console.log('Component initialized');
  }));

  afterEach(fakeAsync(() => {
    console.log('Starting cleanup');
    try {
      if (component) {
        console.log('Destroying component');
        if (component.taskForm) {
          // Clean up any form subscriptions
          component.taskForm.reset();
        }
        component.ngOnDestroy();
      }
      if (fixture) {
        console.log('Destroying fixture');
        fixture.destroy();
      }
      // Clean up any remaining async operations
      tick();
      discardPeriodicTasks();
    } catch (e) {
      console.error('Error during cleanup:', e);
    }
    console.log('Cleanup complete');
  }));

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
    expect(component.taskForm).toBeDefined();
    tick();
    discardPeriodicTasks();
  }));

  describe('Object Search', () => {
    beforeEach(fakeAsync(() => {
      console.log('Resetting spy');
      catalogsService.searchObjects.calls.reset();
      // Ensure form is ready
      tick();
      discardPeriodicTasks();
    }));

    afterEach(fakeAsync(() => {
      tick();
      discardPeriodicTasks();
    }));

    it('should not search when input is less than 3 characters', fakeAsync(() => {
      component.onObjectSearch('ng');
      tick(300);
      expect(catalogsService.searchObjects).not.toHaveBeenCalled();
      discardPeriodicTasks();
    }));

    it('should search when input is 3 or more characters', fakeAsync(() => {
      component.onObjectSearch('ngc');
      tick(300);
      expect(catalogsService.searchObjects).toHaveBeenCalledWith('ngc');
      discardPeriodicTasks();
    }));

    it('should update form values when object is selected', fakeAsync(() => {
      component.selectObject(mockCatalogObject);
      tick();
      const formValue = component.taskForm.value;
      expect(formValue.object).toBe('NGC7000');
      expect(formValue.ra).toBe(315.7);
      expect(formValue.decl).toBe(44.3);
      discardPeriodicTasks();
    }));

    it('should debounce search requests', fakeAsync(() => {
      component.onObjectSearch('n');
      component.onObjectSearch('ng');
      component.onObjectSearch('ngc');
      component.onObjectSearch('ngc7');

      tick(100); // Not enough time passed
      expect(catalogsService.searchObjects).not.toHaveBeenCalled();

      tick(200); // Now the debounce time has passed
      expect(catalogsService.searchObjects).toHaveBeenCalledWith('ngc7');
      expect(catalogsService.searchObjects).toHaveBeenCalledTimes(1);
      discardPeriodicTasks();
    }));

    it('should not make duplicate searches for the same term', fakeAsync(() => {
      component.onObjectSearch('ngc7');
      tick(300);
      component.onObjectSearch('ngc7');
      tick(300);

      expect(catalogsService.searchObjects).toHaveBeenCalledTimes(1);
      discardPeriodicTasks();
    }));
  });
});
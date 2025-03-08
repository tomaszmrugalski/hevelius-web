import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { LoginComponent } from './login.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoginService } from '../services/login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Hevelius } from '../../hevelius';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: jasmine.SpyObj<LoginService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    loginService = jasmine.createSpyObj('LoginService', ['login', 'getBackendVersion']);
    // Set up default response for getBackendVersion
    loginService.getBackendVersion.and.returnValue(of('0.1.0'));

    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        MatToolbarModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatTableModule,
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: LoginService, useValue: loginService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title in the toolbar', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const spanElement = compiled.querySelector('span');
    expect(spanElement.textContent).toContain('Hevelius');
  });

  it('should render the version in the span element', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const spanElement = compiled.querySelector('span');
    expect(spanElement.textContent).toContain(Hevelius.version);
  });

  it('should fetch backend version on init', fakeAsync(() => {
    // Arrange
    loginService.getBackendVersion.and.returnValue(of('1.2.3'));

    // Act
    component.ngOnInit();
    tick(); // Wait for async operations

    // Assert
    expect(loginService.getBackendVersion).toHaveBeenCalled();
    expect(component.backendVersion).toBe('1.2.3');
  }));

  it('should handle backend version fetch error', fakeAsync(() => {
    // Arrange
    const error = new HttpErrorResponse({ status: 0 });
    loginService.getBackendVersion.and.returnValue(throwError(() => error));

    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(loginService.getBackendVersion).toHaveBeenCalled();
    expect(component.backendVersion).toBe('Unresponsive');
  }));
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NightPlanService } from '../../services/night-plan.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let nightPlanService: jasmine.SpyObj<NightPlanService>;
  let router: Router;

  beforeEach(async () => {
    nightPlanService = jasmine.createSpyObj('NightPlanService', ['getTaskCount']);
    nightPlanService.getTaskCount.and.returnValue(new BehaviorSubject(0));

    await TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      imports: [
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        MatDialogModule,
        // RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: NightPlanService, useValue: nightPlanService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title in the toolbar', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const spanElement = compiled.querySelector('span');
    expect(spanElement.textContent).toContain('Hevelius');
  });

});
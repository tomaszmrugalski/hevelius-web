import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      imports: [
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        MatDialogModule,
        RouterTestingModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
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

  it('should render the version in the span element', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const spanElement = compiled.querySelector('span');
    expect(spanElement.textContent).toContain('0.1.0');
  });
});
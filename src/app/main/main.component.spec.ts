import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ MainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
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
    expect(spanElement.textContent).toContain('0.0.3');
  });
});

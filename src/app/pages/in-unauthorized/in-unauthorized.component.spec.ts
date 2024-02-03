import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InUnauthorizedComponent } from './in-unauthorized.component';

describe('InUnauthorizedComponent', () => {
  let component: InUnauthorizedComponent;
  let fixture: ComponentFixture<InUnauthorizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InUnauthorizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InUnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

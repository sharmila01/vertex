import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InDashboardComponent } from './in-dashboard.component';

describe('InDashboardComponent', () => {
  let component: InDashboardComponent;
  let fixture: ComponentFixture<InDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

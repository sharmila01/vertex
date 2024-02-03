import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InReportingComponent } from './in-reporting.component';

describe('InReportingComponent', () => {
  let component: InReportingComponent;
  let fixture: ComponentFixture<InReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

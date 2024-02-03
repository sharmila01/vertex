import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplySellingComponent } from './apply-selling.component';

describe('ApplySellingComponent', () => {
  let component: ApplySellingComponent;
  let fixture: ComponentFixture<ApplySellingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplySellingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplySellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

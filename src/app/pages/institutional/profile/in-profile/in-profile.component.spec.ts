import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InProfileComponent } from './in-profile.component';

describe('InProfileComponent', () => {
  let component: InProfileComponent;
  let fixture: ComponentFixture<InProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InViewProjectComponent } from './in-view-project.component';

describe('InViewProjectComponent', () => {
  let component: InViewProjectComponent;
  let fixture: ComponentFixture<InViewProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InViewProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InViewProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

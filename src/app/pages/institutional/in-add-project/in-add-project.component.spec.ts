import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InAddProjectComponent } from './in-add-project.component';

describe('InAddProjectComponent', () => {
  let component: InAddProjectComponent;
  let fixture: ComponentFixture<InAddProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InAddProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InAddProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveGroupFormComponent } from './executive-group-form.component';

describe('ExecutiveGroupFormComponent', () => {
  let component: ExecutiveGroupFormComponent;
  let fixture: ComponentFixture<ExecutiveGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutiveGroupFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

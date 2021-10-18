import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUpdateTaskModalComponent } from './new-update-task-modal.component';

describe('NewUpdateTaskModalComponent', () => {
  let component: NewUpdateTaskModalComponent;
  let fixture: ComponentFixture<NewUpdateTaskModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewUpdateTaskModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUpdateTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

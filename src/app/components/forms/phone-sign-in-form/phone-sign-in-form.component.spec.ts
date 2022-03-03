import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneSignInFormComponent } from './phone-sign-in-form.component';

describe('PhoneSignInFormComponent', () => {
  let component: PhoneSignInFormComponent;
  let fixture: ComponentFixture<PhoneSignInFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneSignInFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneSignInFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypecustomerComponent } from './typecustomer.component';

describe('TypecustomerComponent', () => {
  let component: TypecustomerComponent;
  let fixture: ComponentFixture<TypecustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypecustomerComponent]
    });
    fixture = TestBed.createComponent(TypecustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypedocumentsComponent } from './typedocuments.component';

describe('TypedocumentsComponent', () => {
  let component: TypedocumentsComponent;
  let fixture: ComponentFixture<TypedocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypedocumentsComponent]
    });
    fixture = TestBed.createComponent(TypedocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeevidenceComponent } from './typeevidence.component';

describe('TypeevidenceComponent', () => {
  let component: TypeevidenceComponent;
  let fixture: ComponentFixture<TypeevidenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeevidenceComponent]
    });
    fixture = TestBed.createComponent(TypeevidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

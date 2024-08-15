import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeguideComponent } from './typeguide.component';

describe('TypeguideComponent', () => {
  let component: TypeguideComponent;
  let fixture: ComponentFixture<TypeguideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeguideComponent]
    });
    fixture = TestBed.createComponent(TypeguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConveyorComponent } from './conveyor.component';

describe('ConveyorComponent', () => {
  let component: ConveyorComponent;
  let fixture: ComponentFixture<ConveyorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConveyorComponent]
    });
    fixture = TestBed.createComponent(ConveyorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

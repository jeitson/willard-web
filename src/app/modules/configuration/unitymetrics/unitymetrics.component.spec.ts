import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitymetricsComponent } from './unitymetrics.component';

describe('UnitymetricsComponent', () => {
  let component: UnitymetricsComponent;
  let fixture: ComponentFixture<UnitymetricsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnitymetricsComponent]
    });
    fixture = TestBed.createComponent(UnitymetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

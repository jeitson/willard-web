import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateInformationComponent } from './certificate-information.component';

describe('CertificateInformationComponent', () => {
  let component: CertificateInformationComponent;
  let fixture: ComponentFixture<CertificateInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertificateInformationComponent]
    });
    fixture = TestBed.createComponent(CertificateInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

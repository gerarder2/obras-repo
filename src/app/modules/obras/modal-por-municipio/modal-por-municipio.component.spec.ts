import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPorMunicipioComponent } from './modal-por-municipio.component';

describe('ModalPorMunicipioComponent', () => {
  let component: ModalPorMunicipioComponent;
  let fixture: ComponentFixture<ModalPorMunicipioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPorMunicipioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPorMunicipioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

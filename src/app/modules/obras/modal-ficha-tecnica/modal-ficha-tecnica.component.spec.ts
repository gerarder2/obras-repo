import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFichaTecnicaComponent } from './modal-ficha-tecnica.component';

describe('ModalFichaTecnicaComponent', () => {
  let component: ModalFichaTecnicaComponent;
  let fixture: ComponentFixture<ModalFichaTecnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFichaTecnicaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFichaTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

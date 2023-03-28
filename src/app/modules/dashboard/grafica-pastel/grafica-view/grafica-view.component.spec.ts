import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficaViewComponent } from './grafica-view.component';

describe('GraficaViewComponent', () => {
  let component: GraficaViewComponent;
  let fixture: ComponentFixture<GraficaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraficaViewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GraficaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

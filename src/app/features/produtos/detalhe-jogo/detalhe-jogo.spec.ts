import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheJogo } from './detalhe-jogo';

describe('DetalheJogo', () => {
  let component: DetalheJogo;
  let fixture: ComponentFixture<DetalheJogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheJogo],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheJogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

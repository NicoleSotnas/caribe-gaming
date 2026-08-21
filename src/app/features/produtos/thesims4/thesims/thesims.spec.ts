import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thesims } from './thesims';

describe('Thesims', () => {
  let component: Thesims;
  let fixture: ComponentFixture<Thesims>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Thesims],
    }).compileComponents();

    fixture = TestBed.createComponent(Thesims);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

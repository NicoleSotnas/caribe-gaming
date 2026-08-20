import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarvelRivals } from './marvel-rivals';

describe('MarvelRivals', () => {
  let component: MarvelRivals;
  let fixture: ComponentFixture<MarvelRivals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarvelRivals],
    }).compileComponents();

    fixture = TestBed.createComponent(MarvelRivals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

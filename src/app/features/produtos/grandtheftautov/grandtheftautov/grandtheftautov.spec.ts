import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grandtheftautov } from './grandtheftautov';

describe('Grandtheftautov', () => {
  let component: Grandtheftautov;
  let fixture: ComponentFixture<Grandtheftautov>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Grandtheftautov],
    }).compileComponents();

    fixture = TestBed.createComponent(Grandtheftautov);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

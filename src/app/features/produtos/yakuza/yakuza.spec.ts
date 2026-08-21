import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Yakuza } from './yakuza';

describe('Yakuza', () => {
  let component: Yakuza;
  let fixture: ComponentFixture<Yakuza>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Yakuza],
    }).compileComponents();

    fixture = TestBed.createComponent(Yakuza);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

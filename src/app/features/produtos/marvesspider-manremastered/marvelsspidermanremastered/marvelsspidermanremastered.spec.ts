import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Marvelsspidermanremastered } from './marvelsspidermanremastered';

describe('Marvelsspidermanremastered', () => {
  let component: Marvelsspidermanremastered;
  let fixture: ComponentFixture<Marvelsspidermanremastered>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Marvelsspidermanremastered],
    }).compileComponents();

    fixture = TestBed.createComponent(Marvelsspidermanremastered);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fortnite } from './fortnite';

describe('Fortnite', () => {
  let component: Fortnite;
  let fixture: ComponentFixture<Fortnite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fortnite],
    }).compileComponents();

    fixture = TestBed.createComponent(Fortnite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

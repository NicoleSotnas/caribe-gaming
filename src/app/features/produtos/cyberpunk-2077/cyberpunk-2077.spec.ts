import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cyberpunk2077 } from './cyberpunk-2077';

describe('Cyberpunk2077', () => {
  let component: Cyberpunk2077;
  let fixture: ComponentFixture<Cyberpunk2077>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cyberpunk2077],
    }).compileComponents();

    fixture = TestBed.createComponent(Cyberpunk2077);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

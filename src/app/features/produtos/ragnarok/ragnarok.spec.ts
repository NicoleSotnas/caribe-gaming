import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ragnarok } from './ragnarok';

describe('Ragnarok', () => {
  let component: Ragnarok;
  let fixture: ComponentFixture<Ragnarok>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ragnarok],
    }).compileComponents();

    fixture = TestBed.createComponent(Ragnarok);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

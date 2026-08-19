import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thewitcher } from './thewitcher';

describe('Thewitcher', () => {
  let component: Thewitcher;
  let fixture: ComponentFixture<Thewitcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Thewitcher],
    }).compileComponents();

    fixture = TestBed.createComponent(Thewitcher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

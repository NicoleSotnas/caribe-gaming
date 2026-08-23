import { ComponentFixture, TestBed } from '@angular/core/testing';

import {Edelr}

describe('WatchDogs2', () => {
  let component: WatchDogs2;
  let fixture: ComponentFixture<WatchDogs2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchDogs2],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchDogs2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

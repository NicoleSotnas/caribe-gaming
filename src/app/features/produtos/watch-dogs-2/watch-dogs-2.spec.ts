import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchDogs2 } from './watch-dogs-2';

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

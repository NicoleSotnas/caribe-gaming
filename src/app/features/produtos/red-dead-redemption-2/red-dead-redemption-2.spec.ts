import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedDeadRedemption2 } from './red-dead-redemption-2';

describe('RedDeadRedemption2', () => {
  let component: RedDeadRedemption2;
  let fixture: ComponentFixture<RedDeadRedemption2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedDeadRedemption2],
    }).compileComponents();

    fixture = TestBed.createComponent(RedDeadRedemption2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

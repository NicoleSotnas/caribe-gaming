import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarvelsSpiderManRemastered } from './marvels-spider-man-remastered';

describe('MarvelsSpiderManRemastered', () => {
  let component: MarvelsSpiderManRemastered;
  let fixture: ComponentFixture<MarvelsSpiderManRemastered>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarvelsSpiderManRemastered],
    }).compileComponents();

    fixture = TestBed.createComponent(MarvelsSpiderManRemastered);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

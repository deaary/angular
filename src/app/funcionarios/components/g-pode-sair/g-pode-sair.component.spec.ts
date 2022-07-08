import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GPodeSairComponent } from './g-pode-sair.component';

describe('GPodeSairComponent', () => {
  let component: GPodeSairComponent;
  let fixture: ComponentFixture<GPodeSairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GPodeSairComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GPodeSairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

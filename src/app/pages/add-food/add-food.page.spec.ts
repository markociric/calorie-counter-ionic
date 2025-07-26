import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFoodPage } from './add-food.page';

describe('AddFoodPage', () => {
  let component: AddFoodPage;
  let fixture: ComponentFixture<AddFoodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFoodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

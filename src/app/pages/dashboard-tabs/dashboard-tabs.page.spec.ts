import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardTabsPage } from './dashboard-tabs.page';

describe('DashboardTabsPage', () => {
  let component: DashboardTabsPage;
  let fixture: ComponentFixture<DashboardTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

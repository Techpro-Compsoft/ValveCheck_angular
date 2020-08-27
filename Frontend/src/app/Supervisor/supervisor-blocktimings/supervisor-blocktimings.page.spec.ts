import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SupervisorBlocktimingsPage } from './supervisor-blocktimings.page';

describe('SupervisorBlocktimingsPage', () => {
  let component: SupervisorBlocktimingsPage;
  let fixture: ComponentFixture<SupervisorBlocktimingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorBlocktimingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SupervisorBlocktimingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

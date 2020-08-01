import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OperatorProfilePage } from './operator-profile.page';

describe('OperatorProfilePage', () => {
  let component: OperatorProfilePage;
  let fixture: ComponentFixture<OperatorProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

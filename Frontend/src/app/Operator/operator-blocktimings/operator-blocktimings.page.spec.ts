import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OperatorBlocktimingsPage } from './operator-blocktimings.page';

describe('OperatorBlocktimingsPage', () => {
  let component: OperatorBlocktimingsPage;
  let fixture: ComponentFixture<OperatorBlocktimingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorBlocktimingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorBlocktimingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

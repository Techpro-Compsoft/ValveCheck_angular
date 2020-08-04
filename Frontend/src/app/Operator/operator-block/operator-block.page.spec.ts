import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OperatorBlockPage } from './operator-block.page';

describe('OperatorBlockPage', () => {
  let component: OperatorBlockPage;
  let fixture: ComponentFixture<OperatorBlockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorBlockPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorBlockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

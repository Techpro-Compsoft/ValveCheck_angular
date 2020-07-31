import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FarmoperatorPage } from './farmoperator.page';

describe('FarmoperatorPage', () => {
  let component: FarmoperatorPage;
  let fixture: ComponentFixture<FarmoperatorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmoperatorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FarmoperatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

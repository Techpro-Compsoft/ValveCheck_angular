import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlocktimingsPage } from './blocktimings.page';

describe('BlocktimingsPage', () => {
  let component: BlocktimingsPage;
  let fixture: ComponentFixture<BlocktimingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlocktimingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BlocktimingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

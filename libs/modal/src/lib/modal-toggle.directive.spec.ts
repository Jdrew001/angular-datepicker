import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayModule } from '@angular/cdk/overlay';

import { ModalToggleDirective } from './modal-toggle.directive';
import { ModalComponent } from './modal.component';


@Component({
  template: `
    <button type="button" libModalToggle [modal]="modal"></button>
    <lib-modal #modal></lib-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class ModalToggleHostComponent {
  @ViewChild(ModalToggleDirective) modalToggleDirective!: ModalToggleDirective;
}

describe('ModalToggleDirective', () => {
  let hostComponent: ModalToggleHostComponent;
  let fixture: ComponentFixture<ModalToggleHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule
      ],
      declarations: [
        ModalToggleDirective,
        ModalComponent,
        ModalToggleHostComponent
      ]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ModalToggleHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should create an instance', () => {
    fixture.detectChanges();
    expect(hostComponent).toBeTruthy();
  });
});
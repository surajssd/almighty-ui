import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { FormsModule }  from '@angular/forms';
import { By }           from '@angular/platform-browser';

import { Logger } from '../../shared/logger.service';

import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';

import { WorkItemQuickAddComponent } from './work-item-quick-add.component';

describe('Quick add work item component - ', () => {
  let comp: WorkItemQuickAddComponent;
  let fixture: ComponentFixture<WorkItemQuickAddComponent>;
  let el: DebugElement;
  let fakeWorkItem: WorkItem[];
  let fakeService: any;

  beforeEach(() => {
    fakeWorkItem = [
      {
        'fields': {
          'system.assignee': null,
          'system.creator': 'me',
          'system.description': null,
          'system.state': 'new',
          'system.title': 'test1'
        },
        'id': '1',
        'type': 'system.userstory',
        'version': 0
      },
    ] as WorkItem[];

    fakeService = {
      create: function (workItem: WorkItem) {
        return new Promise((resolve, reject) => {
          resolve(workItem);
          // reject('Title is empty');
        });
      }
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        WorkItemQuickAddComponent
      ],
      providers: [
        Logger,
        {
          provide: WorkItemService,
          useValue: fakeService
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(WorkItemQuickAddComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('Should keep the Add button disabled if title contain only white spaces', () => {
    fixture.detectChanges();
    comp.toggleQuickAdd();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('.workItemQuickAdd_Add'));
    fixture.detectChanges();
    comp.workItem.fields['system.title'] = '  ';
    fixture.detectChanges();
    expect(el.classes['icon-btn-disabled']).toBeTruthy();
  });

  it('Should keep the Add button disabled if title contain empty string', () => {
    fixture.detectChanges();
    comp.toggleQuickAdd();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('.workItemQuickAdd_Add'));
    fixture.detectChanges();
    comp.workItem.fields['system.title'] = '';
    fixture.detectChanges();
    expect(el.classes['icon-btn-disabled']).toBeTruthy();
  });

  it('Should raise an error on save if the title contain only white space', fakeAsync(() => {
    el = fixture.debugElement.query(By.css('.pficon-add-circle-o'));
    fixture.detectChanges();
    comp.workItem.fields['system.title'] = '  ';
    fixture.detectChanges();
    comp.save();
    tick();
    fixture.detectChanges();
    expect(comp.error).not.toBeFalsy();
  }));
});

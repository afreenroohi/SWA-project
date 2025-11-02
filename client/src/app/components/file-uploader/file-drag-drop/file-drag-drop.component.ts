import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as _l from 'lodash';

@Component({
  selector: 'file-drag-drop',
  templateUrl: './file-drag-drop.component.html',
  styleUrls: ['./file-drag-drop.component.scss']
})
export class FileDragDropComponent implements OnInit {


  @Input() emitFromParent = new EventEmitter();
  @Output()
  emitToParent = new EventEmitter();

  // FileList
  files: FileList | undefined;

  // Strings
  error: string | undefined;
  dragAreaClass: string | undefined;

  // Form groups
  masterFormGroup: FormGroup | undefined;

  // bool
  multipleFiles: boolean = false;

  constructor(
    public translate: TranslateService,
    @Optional() private controlContainer: ControlContainer
  ) { }

  ngOnInit(): void {
    this.initMasterFormContainer();
    this.initDocUiRelated();
    this.initSubscribers();
  }

  initMasterFormContainer(): void {
    this.masterFormGroup = <FormGroup>this.controlContainer.control;
    this.masterFormGroup.valueChanges.subscribe((data) => {
      this.updateMultipleFiles();
    });
    this.updateMultipleFiles();
  }

  updateMultipleFiles() {
    this.multipleFiles = _l.get(this.docParamsValue, 'multipleFiles', false);
  }

  initSubscribers() {
    this.emitFromParent.subscribe((res) => {
      this.onRecEmitFromParent(res);
    });
  }

  onRecEmitFromParent(_res: any) {
    if (_l.get(_res, 'updateFiles', '')) {
      this.files = _l.get(_res, 'files', []);
    }
  }

  initDocUiRelated() {
    this.dragAreaClass = 'dragarea';
  }

  onFileChange(event: any) {
    this.files = event.target.files;
    // this.saveFiles(this.files);
    this.updateFilesAndSaveToParent();

    // setTimeout(() => {
    //   event.target.value = '';
    // }, 3000);
  }

  updateFilesAndSaveToParent() {
    let emitObj = {
      updateFiles: true,
      saveFiles: true,
      files: this.files,
    };
    this.emitToParentCall(emitObj);
  }

  emitToParentCall(_emitObj: any) {
    this.emitToParent.emit(_emitObj);
  }

  get docParamsValue() {
    const mFG = this.masterFormGroup as any;
    return mFG?.get('docParams').value;
  }

  @HostListener('dragover', ['$event']) onDragOver(event: any) {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event: any) {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }

  @HostListener('dragend', ['$event']) onDragEnd(event: any) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: any) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }

  @HostListener('drop', ['$event']) onDrop(event: any) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      this.files = event.dataTransfer.files;
      this.updateFilesAndSaveToParent();
    }
  }

}

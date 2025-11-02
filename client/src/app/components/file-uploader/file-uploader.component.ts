import {
  Component,
  OnInit,
  HostListener,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Optional,
} from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

import * as _l from 'lodash';
import { forkJoin, Subscription } from 'rxjs';
import { CommonService } from 'src/app/service/common.service';
import { DocumentHandleService } from 'src/app/service/DocumentHandle/document-handle.service';
// import { IgxDialogComponent } from 'igniteui-angular';
import { TranslateService } from '@ngx-translate/core';
// import { LoanAppCommonService } from '../../services/loan-app-common.service';
import { environment } from 'src/environments/environment';
import { values } from 'lodash';
import { FileDownloadReq, FileUploadReq, SapFileReqBody } from '../filenet/filenet.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/service/RFP/api.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() existingFilesPToC: FileList | undefined;
  @Input() paramsPToC = new EventEmitter();
  @Input() username = '';
  @Output()
  onUploadFile = new EventEmitter();
  @Output()
  emitToDragDrop = new EventEmitter();
  @Output() numberOfFiles = new EventEmitter();
  // @Input()
  // emitFromDragDrop = new EventEmitter();

  // Boolean
  filesEmpty: boolean = true;
  isFilesUploading: boolean = false;
  isFilesGetInProg: boolean = false;

  // FileList
  files!: FileList | any;

  // Strings
  error: string | undefined;
  dragAreaClass: string | undefined;
  displayMode: string = 'view';

  // Objects
  masterDataPToC = {};
  docToDelete = {};

  // Array
  // documentList = [];
  fileListSaveLater: any = [];

  // Form groups
  masterFormGroup: FormGroup | undefined;

  currSubscription: Subscription | undefined;

  valueChangesSubscription: Subscription | undefined;
  valueChangesSubscForDisplayMode: any;
  valueChangesSubscForDoDocsGet: any;
  valueChangesSubscForDocList: Subscription | undefined;
  docDialogVisible: boolean = false;
  currentCheckListUpdateID!: string

  // Viewchild
  // @ViewChild('docDialog', { read: IgxDialogComponent })
  // public docModal: IgxDialogComponent;

  // @ViewChild('deleteDialog', { read: IgxDialogComponent })
  // public deleteDialog: IgxDialogComponent;

  constructor(
    private cdRef: ChangeDetectorRef,
    public translate: TranslateService,
    public commonService: CommonService,
    private documentHandleService: DocumentHandleService,
    @Optional() private controlContainer: ControlContainer,
    private sant: DomSanitizer,
    private api: ApiService
    // public loanAppCommonService: LoanAppCommonService
  ) { }

  ngOnInit() {
    this.initDocUiRelated();
    this.initMasterFormContainer();

    this.initSubscribers();
    this.initDisplayMode();
    this.initFormGroupActions();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {

    if (this.currSubscription) this.currSubscription.unsubscribe();
    if (this.valueChangesSubscForDocList)
      this.valueChangesSubscForDocList.unsubscribe();
    if (this.valueChangesSubscription)
      this.valueChangesSubscription.unsubscribe();

  }

  initFormGroupActions() {
    this.isGetDocumentsCall();
    this.initDisplayMode();
  }

  initDisplayMode(): void {
    // this.displayMode = this.loanAppCommonService.currentLoanAppContext.mode;
    // `````
    // `````
    // Below is hardcoded as 'edit' for DEV purpose. 
    // Need to be changed dynamically
    this.displayMode = 'edit';
    if (_l.get(this.docParamsValue, 'displayMode', false)) {
      this.displayMode = _l.get(this.docParamsValue, 'displayMode', 'view');
    }
  }

  initMasterFormContainer(): void {
    this.masterFormGroup = <FormGroup>this.controlContainer.control;
    // this.masterFormGroup.valueChanges.subscribe((data) => {
    // });
  }

  initDocUiRelated() {
    this.dragAreaClass = 'dragarea';
  }

  initSubscribers() {
    if (this.paramsPToC.observers.length === 0) {

      this.currSubscription = this.paramsPToC.subscribe((res) => {
        console.log(res);
        this.makeDocsListEmptyByFlag(res);
        this.makeForceDocParamsUpdateByFlag(res);

        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
    }
    this.valueChangesSubscription = this.docParams.valueChanges.subscribe(
      (_res) => {
        this.isGetDocumentsCall();
        this.initDisplayMode();
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      }
    );
    this.valueChangesSubscForDocList = this.documentsList.valueChanges.subscribe(
      (res) => {
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      }
    );

    this.onUploadFile.emit({ emitFromParentForUpdate: true });
    this.numberOfFiles.emit({ documentLength: this.documentsList.length });
    this.currentCheckListUpdateID = _l.get(this.docParams.value, 'docParams.DefId', '')
  }



  makeDocsListEmptyByFlag(_res: any) {
    if (_res.makeDocsListEmpty) {
      this.documentsList.clear();
      this.cdRef.detectChanges();
    }
  }

  makeForceDocParamsUpdateByFlag(_res: any) {
    if (_res.forceRefreshDocParams) {
      this.docParams.patchValue(_res);
    }
  }

  isGetDocumentsCall() {
    if (_l.get(this.docParams.value, 'doDocsGet', false)) {
      this.getDocumentsCall();
    }
  }

  getDocumentsCall() {
    let body = {
      HeaderKey: _l.get(this.docParams.value, 'docParams.HeaderKey', ''),
      ItemKey: _l.get(this.docParams.value, 'docParams.ItemKey', ''),
      ItemSecKey: _l.get(this.docParams.value, 'docParams.ItemSecKey', ''),
      EntityId: _l.get(this.docParams.value, 'docParams.EntityId', ''),
      EntityName: _l.get(this.docParams.value, 'docParams.EntityName', ''),
      RelatedEntityId: _l.get(
        this.docParams.value,
        'docParams.RelatedEntityId',
        ''
      ),
      RelatedEntityName: _l.get(
        this.docParams.value,
        'docParams.RelatedEntityName',
        ''
      ),
      DefId: _l.get(this.docParams.value, 'docParams.DefId', ''),
    };
    this.isFilesGetInProg = true;
    this.currentCheckListUpdateID = body.DefId

    // +++TEMPCMT
    forkJoin([this.documentHandleService.getDocDetailsByIds(body)]).subscribe(
      (res: any) => {
        this.handleGetDocsByEntityId(_l.get(res, '[0]', {}));
        this.numberOfFiles.emit({ documentLength: this.documentsList.length });
      
        
      }
    );
    // remove below -----------------------------------------++
    setTimeout(() => {
      this.isFilesGetInProg = false;
      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    }, 2000);

  }

  handleGetDocsByEntityId(_res: any) {
    this.documentsList.clear();
    if (_l.get(_res, 'MessType', null) === 'S') {
      this.updateDocList(_l.get(_res, 'DocumentListSet.results', []));
    } else {
      this.commonService.sendSuccessMsg(false)
      this.commonService.handleErrorResponse(
        _res,
        'MessType',
        'MessText',
        'MessTextAr',
        false
      );
    }
    this.isFilesGetInProg = false;
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  updatePToCData(_res: any) {
    this.masterDataPToC = _res;
  }

  saveFiles(files: FileList | any) {

    if (_l.get(this.docParams.value, 'control', '') === 'full') {
      for(let i=0; i<files.length; i++){
        if(files[i].size /1024 > 42960){
              // window.alert(this.commonService.userLanguage == 'en' ? 'Maximum file size is 40 MB' : 'الحد الأقصى لحجم الملفات هو 40 ميغا بايت');
              this.commonService.createMessage('error', this.commonService.userLanguage == 'en' ? 'Maximum file size is 40 MB' : 'الحد الأقصى لحجم الملفات هو 40 ميغا بايت');
        }else{
          if (files.length === 1) {
            this.uploadFileNet();
          } else if (files.length > 1 && !this.docParams.value.multipleFiles) {
            window.alert('Onlyonefileisallowed');
            this.makeFilesEmptyInDragDrop();
          } else if (
            files.length > 1 &&
            this.docParams.value.multipleFiles === true
          ) {
            this.uploadFileNet();
          }
        }
      }
      // files.forEach((f:any) => {
      //   if(f.size>42960){
      //     window.alert('RFP.Max40');
      //   }else{
      //     if (files.length === 1) {
      //       this.uploadFiles();
      //     } else if (files.length > 1 && !this.docParams.value.multipleFiles) {
      //       window.alert('Onlyonefileisallowed');
      //       this.makeFilesEmptyInDragDrop();
      //     } else if (
      //       files.length > 1 &&
      //       this.docParams.value.multipleFiles === true
      //     ) {
      //       this.uploadFiles();
      //     }
      //   }
      // });
      
    } else {
      this.filesEmpty = false;

      if (files.length > 1) this.error = 'Kindly upload one file';
      else {
        this.error = '';

        this.emitFiles();
      }
    }
  }

  uploadFiles() {

    this.isFilesUploading = true;
    // +++TEMPCMT
    forkJoin([
      this.documentHandleService.uploadDocuments(
        this.files,
        _l.get(this.docParams.value, 'docParams', '')
      ),
    ]).subscribe((res: any) => {
      this.handleUploadFilesRes(_l.get(res, '[0]', {}));
    });
    this.cdRef.detectChanges();
  }

  uploadFileNet() {
    this.isFilesUploading = true;

    for (let i = 0; i < this.files.length; i++) {
      let fileSelected: any = this.files[i];
      if ((fileSelected.size / 1024) > 40960) {
        this.commonService.createMessage('error', `File ${fileSelected.name} size exceeds max limit.`);
        return;
      }
      let imgUrl = this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(fileSelected)) as string;
      let reader = new FileReader();
      reader.readAsDataURL(fileSelected as Blob);
      reader.onload = () => {
        let base64Data = reader.result as string;

        // * Filenet body
        // const req: FileUploadReq = {
        //   'createDocWithContent': {
        //     "file": base64Data.split(',')[1],
        //     "docName": fileSelected.name,
        //     "mimeType": base64Data.split(',')[0],
        //     "url": environment.filenetUrl
        //   }
        // }

        // * Sap file upload body
        const req: SapFileReqBody = {
          Filedata: base64Data.split(',')[1],
          Filesize: `${(fileSelected.size / 1024).toFixed(2)}`,
          Filename: fileSelected.name,
          Fileextension: fileSelected.name.split('.').pop(),
          Filetype: base64Data.split(',')[0].split(";")[0].split(":")[1]
        }

        this.documentHandleService.uploadToFilenet(req).subscribe(res => {
          // this.handleUploadfileNet(res);
          this.handleUploadfileNet(res.d);
          this.onUploadFile.emit({ checkListID: this.currentCheckListUpdateID });
        }, ee => {

        }).add(() => {
          this.isFilesUploading = false;
        })
      }
    }
  }

  handleUploadfileNet(res: any) {
    let body = {
      HeaderKey: _l.get(this.docParams.value, 'docParams.HeaderKey', ''),
      ItemKey: _l.get(this.docParams.value, 'docParams.ItemKey', ''),
      EntityId: _l.get(this.docParams.value, 'docParams.EntityId', ''),
      EntityName: _l.get(this.docParams.value, 'docParams.EntityName', ''),
      RelatedEntityId: _l.get(
        this.docParams.value,
        'docParams.RelatedEntityId',
        ''
      ),
      RelatedEntityName: _l.get(
        this.docParams.value,
        'docParams.RelatedEntityName',
        ''
      ),
      DefId: _l.get(this.docParams.value, 'docParams.DefId', ''),
      // FileNetId: res.createDocWithContentResponse.fileNetCreatedDocument.ID.replace('{', '').replace('}', ''),
      FileNetId: res.Fileid,
      // DocName: res.createDocWithContentResponse.fileNetCreatedDocument.docTitle,
      DocName: res.Filename,
      Operation: "C",

    };

    this.documentHandleService.uploadSingleFileToFilenet(body).subscribe((resp: any) => {
      const req = {
        MessType: "S",
        documentList: [body]
      }

      this.handleUploadFilesRes(req);
    }, (err: any) => {

    }).add(() => {

    })



  }

  handleUploadFilesRes(_res: any) {
    if (_l.get(_res, 'MessType', '') === 'S') {
      this.commonService.handleSuccessResponse(_res);
      this.updateDocList(_l.get(_res, 'documentList', []));
      this.updateCellValInTable();
      this.onUploadFile.emit({ docUploadOver: true });
      this.numberOfFiles.emit({ documentLength: this.documentsList.length });
      this.makeFilesEmptyInDragDrop();
      this.isFilesUploading = false;
    } else {
      this.commonService.handleErrorResponse(_res);

      this.makeFilesEmptyInDragDrop();
      this.isFilesUploading = false;
    }
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  updateCellValInTable() {
    let objToRet = {
      updateNameInTable: true,
      name: ''
    };
    objToRet['name'] = this.returnFileNameTableCase(
      this.documentsList.value
    );
    this.onUploadFile.emit({ checkListID: this.currentCheckListUpdateID });
    this.numberOfFiles.emit({ documentLength: this.documentsList.length });
  }

  updateDocList(docList: any) {
    this.commonService.sendSuccessMsg(true);
    docList.forEach((doc: any) => {
      let docFormControl = this.returnDocObjFgFromDocObj(doc);
      this.documentsList.push(docFormControl);
    });
  }

  deleteDocumentsCall(_doc: any) {
    let body = {
      EntityId: _l.get(_doc, 'EntityId', ''),
      RefId: _l.get(_doc, 'RefId', ''),
      OperationType: '',
      Filename: _l.get(_doc, 'DocName', ''),
      DocumentId: _l.get(_doc, 'DocId', ''),
    };
    forkJoin([
      this.documentHandleService.deleteDocuments(body, _doc),
    ]).subscribe((res: any) => {
      this.handleDeleteDocuments(_l.get(res, '[0]', {}), _doc);
    });
    this.cdRef.detectChanges();
  }

  handleDeleteDocuments(_res: any, _doc: any) {
    // if (_l.get(_res, 'MessType', 'E') === 'S') {

    // }
    // else {
    //   console.warn("File not deleted");
    // }

    this.commonService.sendSuccessMsg(false);
    let indexToRem = this.findIndexFromId(
      this.documentsList.value,
      _l.get(_doc, 'FileNetId', ''),
      'FileNetId'
    );
    this.documentsList.removeAt(indexToRem);
    this.updateCellValInTable();
  }

  removeUploadedDocument(doc: any) {
    this.deleteDocumentsCall(doc);
  }

  downloadDoc(_doc: any) {
    this.downloadDocsCall(_doc);
  }

  downloadDocsCall(_doc: any, id?: number) {
    // this.commonService.createMessage('success',
    //   this.translate.instant('DOC.DownloadingDocument')
    // );

    // window.open(environment.downloadUrl + _doc.DocName)

    // Uncomment and change below to handle download form service--------------+
    // let body = {
    //   EntityId: _l.get(_doc, 'EntityId', ''),
    //   RefId: _l.get(_doc, 'RefId', ''),
    //   OperationType: '',
    //   Filename: _l.get(_doc, 'DocName', ''),
    //   DocumentId: _l.get(_doc, 'DocId', ''),
    // };
    // +++TEMPCMT
    // forkJoin([this.documentHandleService.downloadDoc(body)]).subscribe(
    //   (res: any) => {
    //     this.handleDownloadDoc(_l.get(res, '[0]', {}), _doc);
    //   }
    // );

    // const req: FileDownloadReq = {
    //   'getDocumentWithContent': {
    //     docID: _doc.FileNetId,
    //     "url": environment.filenetUrl
    //   }
    // }

    const req = {
      fileid:_doc.FileNetId
    }
    if (_l.isNumber(id)) {
      this.documentsList.value[id]['downloading'] = true;
    }
    this.api.downloadFromFilenet(req).subscribe((res: any) => {
      console.log(res);
      const fileResp = res.d.results[0];
      var byteString = atob(fileResp.Filedata);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: fileResp.Filetype });
      let fileURL = window.URL.createObjectURL(blob);
      this.downloadFileNet(fileResp.Filename, fileResp.Filetype, fileURL);
    }, (ee: any) => {
      // this.cs.createMessage('error', this.translate.instant('RFP.download error'));
    }).add(() => {
      if (_l.isNumber(id)) {
        this.documentsList.value[id]['downloading'] = false;
        this.cdRef.detectChanges();
      }
    });
    // this.api.downloadFromFilenet(req).subscribe((res: any) => {
    //   console.log(res);
    //   const fileResp = res.getDocumentWithContentResponse.fileNetDocument;
    //   var byteString = atob(fileResp.content);
    //   var ab = new ArrayBuffer(byteString.length);
    //   var ia = new Uint8Array(ab);
    //   for (var i = 0; i < byteString.length; i++) {
    //     ia[i] = byteString.charCodeAt(i);
    //   }
    //   const blob = new Blob([ab], { type: fileResp.mimeType });
    //   let fileURL = window.URL.createObjectURL(blob);

    //   this.downloadFileNet(fileResp.docTitle, fileResp.mimeType, fileURL);
    // }, (ee: any) => {

    // }).add(() => {
    //   if (_l.isNumber(id)) {
    //     this.documentsList.value[id]['downloading'] = false;
    //     this.cdRef.detectChanges();
    //   }
    // });
  }

  downloadFileNet(fileName: string, contentType: string, base64Data: string) {
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = base64Data;
    downloadLink.target = '_blank';
    downloadLink.download = fileName;
    downloadLink.click();
  }

  handleDownloadDoc(_res: any, _doc: any) {
    if (_l.get(_res, 'MessType', 'E') === 'S') {
      var buffer = this.base64ToArrayBuffer(_res.result);
      this.saveByteArray([buffer], _doc.DocName);
    }
  }

  emitFiles(): void {
    this.onUploadFile.emit(this.files);
    this.numberOfFiles.emit({ documentLength: this.documentsList.length });
  }

  removeFile(_file: any) {
    this.makeFilesEmptyInDragDrop();
  }

  onFileChange(event: any) {
    this.files = event.target.files;
    this.cdRef.detectChanges();
    if (_l.get(this.docParams.value, 'saveLater', '')) {
      this.emitToParentFileList();
    } else {
      this.saveFiles(this.files);
    }
  }

  emitFromDragDrop(_event: any) {
    this.updateAndSaveFileListFromDragDrop(_event);
  }

  updateAndSaveFileListFromDragDrop(_event: any) {
    if (
      _l.get(_event, 'updateFiles', false) &&
      _l.get(_event, 'saveFiles', false)
    ) {
      this.files = _l.get(_event, 'files', []);
      if (_l.get(this.docParams.value, 'saveLater', '')) {
        this.emitToParentFileList();
      } else {
        this.saveFiles(this.files);
      }
    }
  }

  emitToParentFileList() {
    if (this.files?.length > 1 && !this.docParams.value.multipleFiles) {
      this.commonService.createMessage('error',
        this.translate.instant('DOC.Onlyonefileisallowed')
      );
      this.makeFilesEmptyInDragDrop();
    } else if (this.files) {
      for (var i = 0; i < this.files.length; i++) {
        this.fileListSaveLater.push(this.files[i]);
      }
      this.onUploadFile.emit({
        operation: 'recFileList',
        fileList: this.fileListSaveLater,
      });
      this.numberOfFiles.emit({ documentLength: this.documentsList.length });
    }
  }

  makeFilesEmptyInDragDrop() {
    this.files = null as any;
    let emitObj = {
      updateFiles: true,
      files: this.files,
    };
    this.emitForDragDrop(emitObj);
  }

  setDocsToDelete(_doc: any) {
    this.docToDelete = _doc;
  }

  emitForDragDrop(_emitObj: { updateFiles: boolean; files: any; }) {
    this.emitToDragDrop.emit(_emitObj);
  }

  deleteFilesInSaveLater(_file: any) {
    let fileIndex = this.fileListSaveLater.findIndex(
      (file: { name: any; }) => file.name == _file.name
    );
    this.fileListSaveLater.splice(fileIndex, 1);
    if (this.fileListSaveLater.length === 0) {
      this.files = null as any;
    } else {
      // this.files = this.fileListSaveLater as unknown as FileList;
    }
    // Update file List
    this.onUploadFile.emit({
      operation: 'recFileList',
      fileList: this.fileListSaveLater,
    });
    this.numberOfFiles.emit({ documentLength: this.documentsList.length });
  }

  get documentsList(): FormArray {
    const mFG = this.masterFormGroup as any;
    return mFG.get('documentsList') as FormArray;
  }

  get docParams(): FormGroup {
    const mFG = this.masterFormGroup as any;
    return mFG.get('docParams') as FormGroup;
  }

  get docParamsValue() {
    const mFG = this.masterFormGroup as any;
    return mFG.get('docParams').value;
  }

  returnFileNameTableCase(docList: any) {
    let valToRet = '';
    if (docList.length === 0) {
      valToRet = this.translate.instant('DOC.Nodocuments');
    } else if (docList.length === 1) {
      // valToRet = _l.get(docList, "[0]['DocName']", '');
      valToRet = this.removeIdFromDocName(_l.get(docList, "[0]", ''));

    } else if (docList.length > 1) {
      valToRet = docList.length + ' files';
    } else {
      valToRet = this.translate.instant('_Val.Error');
    }
    return valToRet;
  }

  removeIdFromDocName(_doc: any) {
    return _doc?.DocName?.replace('--pp' + _doc?.FileNetId, '')
  }

  removeIdFromDocName2(_doc: any) {
    //  console.log(_doc);
    return 'ksjdfkj';
  }

  returnDocObjFgFromDocObj(doc: any) {
    let docFg = new FormGroup({
      HeaderKey: new FormControl(_l.get(doc, 'HeaderKey', '')),
      ItemKey: new FormControl(_l.get(doc, 'ItemKey', '')),
      EntityId: new FormControl(_l.get(doc, 'EntityId', '')),
      EntityName: new FormControl(_l.get(doc, 'EntityName', '')),
      RelatedEntityName: new FormControl(_l.get(doc, 'RelatedEntityName', '')),
      RelatedEntityId: new FormControl(_l.get(doc, 'RelatedEntityId', '')),
      DefId: new FormControl(_l.get(doc, 'DefId', '')),
      DocName: new FormControl(_l.get(doc, 'DocName', '')),
      FileNetId: new FormControl(_l.get(doc, 'FileNetId', '')),
      Origin: new FormControl(_l.get(doc, 'Origin', '')),
      UploadedBy: new FormControl(_l.get(doc, 'UploadedBy', '')),
      UploadedOn: new FormControl(_l.get(doc, 'UploadedOn', '')),
      MimeDocType: new FormControl(_l.get(doc, 'MimeDocType', '')),
      Operation: new FormControl(_l.get(doc, 'Operation', '')),
      GuiId: new FormControl(_l.get(doc, 'GuiId', '')),
      ContentSize: new FormControl(_l.get(doc, 'ContentSize', '')),

    });
    return docFg;
  }

  findIndexFromId(array: any, id: any, idLabel = 'id') {
    if (array && array.length != 0 && id + '' != '') {
      return _l.findIndex(array, function (num: any) {
        return num[idLabel] + '' === id + '';
      });
    } else {
      return -1;
    }
  }

  base64ToArrayBuffer(base64: any) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  saveByteArray(data: any, name: any) {
    var blob = new Blob(data, { type: 'application/octet-stream' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //IE
      window.navigator.msSaveOrOpenBlob(blob, name);
    } else {
      // chrome
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.click();
    }
    this.commonService.createMessage('success',
      this.translate.instant('DOC.DownloadingDocument')
    );
  }

  docDialogOpen() {
    this.docDialogVisible = true;
  }

  docDialogClose() {
    this.docDialogVisible = false;
  }

}

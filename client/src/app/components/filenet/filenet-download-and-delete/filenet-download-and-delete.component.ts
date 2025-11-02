import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
//import { FileDeleteReq, FileDownloadReq } from '../filenet.model';
import { ApiService } from 'src/app/service/api.service';
import * as _l from 'lodash';
//import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/service/common.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-filenet-download-and-delete',
  templateUrl: './filenet-download-and-delete.component.html',
  styleUrls: ['./filenet-download-and-delete.component.scss']
})
export class FilenetDownloadAndDeleteComponent implements OnInit {

  @Input() fileList: any = [];
  @Input() hideDelete: boolean = true
  @Output() deleteFile = new EventEmitter<any>();

  userId: string = '';


  constructor(private api:ApiService, private cs: CommonService, public translate: TranslateService) {
    this.userId = localStorage.getItem('LogdInUsrID') || this.cs.getUserData().userid;
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
   
  }

  // Download File Started
  downloadFile(FilenetID: string, id: number) {
    // * Filenet Request body
    // const req: FileDownloadReq = {
    //   'getDocumentWithContent' : {
    //     docID: FilenetID,
    //     url: environment.filenetUrl
    //   }
    // }

    // * SAP request
    const req = {
      fileid: FilenetID
    }

    if (_l.isNumber(id)) {
      this.fileList[id]['downloading'] = true;
    }

    // * Filenet download
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
    //   this.cs.createMessage('error', this.translate.instant('RFP.download error'));
    // }).add(() => {
    //   if (_l.isNumber(id)) {
    //     this.fileList[id]['downloading'] = false;
    //   }
    // });

    // * SAP Download
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
      this.cs.createMessage('error', this.translate.instant('RFP.download error'));
    }).add(() => {
      if (_l.isNumber(id)) {
        const {downloading, ...fileItem} = this.fileList[id]
        this.fileList[id] = fileItem;
      }
    });
  }

  downloadFileNet(fileName: string, contentType: string, base64Data: string) {
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = base64Data;
    downloadLink.target = '_blank';
    downloadLink.download = fileName;
    downloadLink.click();
  }





  // Delete File Started
  deleteFromFileNet(FilenetID: string) {
    // * Filenet request body
    // const req: FileDeleteReq = {
    //   "deleteDocumentByID": {
    //       "docID": FilenetID,
    //       "url": environment.filenetUrl
    //   }
    // }

    // * SAP request
    const req = {
      fileid: FilenetID
    }
    this.api.deleteFromFilenet(req).subscribe((res: any) => {
      this.deleteFile.emit({
        FilenetID: FilenetID
      })
    }, err => {
      this.cs.createMessage('error', this.translate.instant('RFP.delete error'));
    }).add(() => {

    });

  }

}

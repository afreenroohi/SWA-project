import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ApiService } from 'src/app/service/RFP/api.service';
//import { FileUploadReq } from '../filenet.model';
import { SapFileReqBody } from '../filenet.model';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-filenet-upload',
  templateUrl: './filenet-upload.component.html',
  styleUrls: ['./filenet-upload.component.scss']
})
export class FilenetUploadComponent implements OnInit {

  @Input() multiple: boolean = false;
  @Input() disableUpload: boolean = false;
  @Input() maxLimit: number = Infinity;
  @Input() fileType: string[] = [];
  @Output() uploadSuccess = new EventEmitter<any>();

  fileList: NzUploadFile[] = [];
  uploading: boolean = false;

  constructor(private api:ApiService,
              private sant: DomSanitizer,
              private commonService: CommonService, public translate: TranslateService) { }

  ngOnInit(): void {
  }


  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload() {
      for(let i =0; i<this.fileList.length; i++) {
        let fileSelected: any = this.fileList[i];
        if ((fileSelected.size / 1024) > this.maxLimit) {
          this.commonService.createMessage('error', `File ${fileSelected.name} size exceeds max limit.`);
          return;
        }

        if (this.fileType.length && !this.fileType.find((node:any) => fileSelected.name.indexOf(node) > -1)) {
          this.commonService.createMessage('error', `File ${fileSelected.name} type is not supported.`);
          return;
        }
        this.uploading = true;
        let imgUrl = this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(fileSelected)) as string;
        let reader = new FileReader();
        reader.readAsDataURL(fileSelected as Blob);
        reader.onload = ()=> {
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

          // *  SAP file upload body
          const req: SapFileReqBody = {
            Filedata: base64Data.split(',')[1],
            Filesize: `${(fileSelected.size / 1024).toFixed(2)}`,
            Filename: fileSelected.name,
            Fileextension: fileSelected.name.split('.').pop(),
            Filetype: base64Data.split(',')[0].split(";")[0].split(":")[1]
          }

          this.api.uploadToFilenet(req).subscribe(res => {
            this.fileList = [];
            // * Filenet response
            // this.uploadSuccess.emit(res);
            // * SAP response
            this.uploadSuccess.emit(res.d);
          }, ee => {
            this.commonService.createMessage('error', this.translate.instant('RFP.upload error'));
          }).add(() => {
            this.uploading = false;
          })
        }
      }

    }

}

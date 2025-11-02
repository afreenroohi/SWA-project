import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filenet',
  templateUrl: './filenet.component.html',
  styleUrls: ['./filenet.component.scss']
})
export class FilenetComponent implements OnInit {


  @Input() multiple: boolean = false;
  @Input() showUpload: boolean = true;
  @Input() disableUpload: boolean = false;
  @Input() hideDelete: boolean = false;
  @Input() maxLimit: number = Infinity;
  @Input() fileType: string[] = [];
  @Input() fileList: {FilenetID: string, FileName: string, downloading?: boolean}[] = [];


  @Output() deleteFile = new EventEmitter<any>();
  @Output() uploadSuccess = new EventEmitter<any>();


  constructor() { }

  ngOnInit(): void {
  }


  fileDeleted(evt: any) {
    this.deleteFile.emit(evt);
  }

  fileUploaded(evt: any) {
    this.uploadSuccess.emit(evt);
  }

}

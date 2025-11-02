import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FileDragDropComponent } from './file-uploader/file-drag-drop/file-drag-drop.component';
import { TranslateModule } from '@ngx-translate/core';
import { antModule } from '../shared/ant.module';
import { HttpClientModule } from '@angular/common/http';
import { NgOtpInputModule } from 'ng-otp-input';
import { ApprovalOtpComponent } from './approval-otp/approval-otp.component';
import { HijriDatepickerComponent } from './hijri-datepicker/hijri-datepicker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HijriInputComponent } from './hijri-input/hijri-input.component';
import { NoDataFoundComponent } from './no-data-found/no-data-found.component';
import { IconComponent } from './icon/icon.component';
import { FilenetComponent } from './filenet/filenet.component';
import { FilenetUploadComponent } from './filenet/filenet-upload/filenet-upload.component';
import { FilenetDownloadAndDeleteComponent } from './filenet/filenet-download-and-delete/filenet-download-and-delete.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { ErrorPopupComponent } from '../components/error-popup/error-popup.component';
import { FinalPopupComponent } from './final-popup/final-popup.component';
import { KpiCardComponent } from './kpi-card/kpi-card.component';




@NgModule({
  declarations: [
    NoDataFoundComponent,
    FileUploaderComponent,
    FileDragDropComponent,
    ApprovalOtpComponent,
    HijriDatepickerComponent,
    HijriInputComponent,
    IconComponent,
    FilenetComponent,
    FilenetUploadComponent,
    FilenetDownloadAndDeleteComponent,
    ConfirmComponent,
    ErrorPopupComponent,
    FinalPopupComponent,
    KpiCardComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    antModule,
    HttpClientModule,
    NgOtpInputModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NoDataFoundComponent,
    ApprovalOtpComponent,
    FileUploaderComponent,
    FileDragDropComponent,
    HijriDatepickerComponent,
    HijriInputComponent,
    IconComponent,
    FilenetComponent,
    FilenetUploadComponent,
    FilenetDownloadAndDeleteComponent,
    ConfirmComponent,
    FinalPopupComponent,
    KpiCardComponent
  ]
  // providers: [
  //   { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true }
  // ]
})
export class ComponentsModule { }

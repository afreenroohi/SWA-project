import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzUploadFile } from 'ng-zorro-antd/upload/public-api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';

@Component({
  selector: 'app-signature-upload',
  templateUrl: './signature-upload.component.html',
  styleUrls: ['./signature-upload.component.scss']
})
export class SignatureUploadComponent implements OnInit {

  uploading = false;
  fileList: NzUploadFile[] = [];
  initialList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewInitial: string | undefined = '';
  base64!: string | ArrayBuffer | null;
  otp: any;
  isOTPVisible: boolean = false;
  uploadType : string | undefined = '';
  role = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private spinner: NgxSpinnerService,
    private cs: CommonService,
    private api: ApiService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.role = atob(localStorage.getItem('ContractDep') ?? '');
    this.getSignature();
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file];
    this.attachPreview(file);
    return false;
  };
  
  beforeUploadInitial = (file: NzUploadFile): boolean => {
    this.initialList = [file];
    this.attachPreview(file, 'IN');
    return false;
  };

  submitSignature(): void {
    if (!this.cs.getUserData().userid || !this.base64) {
      return;
    }
    this.sendOTP();
    this.uploadType = 'SR';
  }
  
  submitInitial(): void {
    if (!this.cs.getUserData().userid || !this.base64) {
      return;
    }
    this.sendOTP();
    this.uploadType = 'IN';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  

  uploadSign(): void {
    const postData = {
      "UserId": this.cs.getUserData().userid,
      "IsInitial" : "",
      "UserSignature": this.base64?.toString().replace(/data:.*base64,/, ""),
      "UserInitial": ""
    }
    this.uploading = true;
    this.api.post('CONT_ADD_SIGNATURE_INITIAL', postData).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.uploading = false;
        this.addImage(res.d.UserSignature);
        this.cs.createMessage('success', this.cs.userLanguage === "en" ? res.d.MessageEn : res.d.MessageAr)
      },
      (error) => {
        this.uploading = false;
        this.cs.createMessage('error', error.statusText);
      }
    );
  }
  
  uploadInitial(): void {
    const postData = {
      "UserId": this.cs.getUserData().userid,
      "IsInitial" : "X",
      "UserSignature": "",
      "UserInitial": this.base64?.toString().replace(/data:.*base64,/, ""),
    }
    this.uploading = true;
    this.api.post('CONT_ADD_SIGNATURE_INITIAL', postData).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.uploading = false;
        this.addImage(res.d.UserInitial, 'IN');
        this.cs.createMessage('success', this.cs.userLanguage === "en" ? res.d.MessageEn : res.d.MessageAr)
      },
      (error) => {
        this.uploading = false;
        this.cs.createMessage('error', error.statusText);
      }
    );
  }

  getSignature(): void {
    this.spinner.show();
    const postData = {
      "UserName": this.cs.getUserData().userid,
    }
    this.api.post('CONT_GET_SIGNATURE_INITIAL', postData).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.addImage(res.d.UserSignature);
        if(res.d.UserInitial) {
          this.addImage(res.d.UserInitial, "IN");
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  
  // getInitial(): void {
  //   this.spinner.show();
  //   const postData = {
  //     "UserName": this.cs.getUserData().userid,
  //   }
  //   this.api.post('GET_INITIAL', postData).pipe(takeUntil(this.destroy$)).subscribe(
  //     (res: any) => {
  //       this.addImage(res.d.UserInitial, 'IN');
  //       this.spinner.hide();
  //     },
  //     (error) => {
  //       this.spinner.hide();
  //     }
  //   );
  // }

  addImage(image: string, type?: string): void {
    if (image && image.trim() != '') {
      this.base64 = "data:image/png;base64," + image;
      if (type) {
        this.previewInitial = this.base64.toString();
        this.initialList = [
          {
            uid: '-1',
            name: 'initial',
          },
        ]
      }else {
        this.previewImage = this.base64.toString();
        this.fileList = [
          {
            uid: '-1',
            name: 'signature',
          },
        ]
      }
    }
  }

  removeImage() {
    this.fileList = [];
    this.base64 = null;
    this.previewImage = '';
  }
  
  removeInitial() {
    this.initialList = [];
    this.base64 = null;
    this.previewInitial = '';
  }

  attachPreview = async (file: NzUploadFile, type?: string): Promise<void> => {
    this.base64 = await this.getBase64(file as any);
    if(type) {
      this.previewInitial = this.base64?.toString();
    } else {
      this.previewImage = this.base64?.toString();
    }
  };

  getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  sendOTP() {
    let data = {
      UserId: this.cs.getUserData().userid
    }
    this.api.post("/OTP", data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res.d.results[0].MessageId === "S") {
        this.cs.otpToast(res.d.results[0])
        
        this.otp = res.d.results[0].OtpNo
        this.isOTPVisible = true;
      } else if (res.d.results[0].MessageId === "" || res.d.results[0].MessageId === "E") {
        this.cs.createMessage('error', this.cs.userLanguage === 'en' ? res.d.results[0].MessageEn : res.d.results[0].MessageAr);
      } else {
        this.cs.createMessage("error", this.translate.instant('COM.OTPNotSent'))
      }
    })
  }

  verifyOTP(data: any) {
    if (data.length === 5) {
      if (data === this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.OTPvalidatedSucccessfully"));
        this.uploadType === 'IN' ? this.uploadInitial() : this.uploadSign();
        // this.uploadSignature();
      } else if (data !== this.otp) {
        this.cs.createMessage("error", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }

  // * Getter Methods
  get showSignature() : boolean {
    if(this.role === 'SD') {
      return true;
    }
    return false;
  }

  get showInitial() : boolean {
    if(this.role === 'CH' || this.role === 'PM') {
      return true;
    }
    return false;
  }

  updateOTPVisible(value: any) {
    this.isOTPVisible = value;
  }
}

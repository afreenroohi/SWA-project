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
  previewImage: string | undefined = '';
  base64!: string | ArrayBuffer | null;
  otp: any
  isOTPVisible: boolean = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private spinner: NgxSpinnerService,
    private cs: CommonService,
    private api: ApiService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getSignature();
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file];
    this.attachPreview(file);
    return false;
  };

  /**
   * Submit Signature Method
   * @returns `Null`
   */
  submitSignature(): void {
    if (!this.cs.getUserData().userid || !this.base64) {
      return;
    }
    this.sendOTP();
  }

  /**
   * Uplaod Signature API call method
   */
  uploadSignature(): void {
    const postData = {
      "UserId": this.cs.getUserData().userid,
      "UserSignature": this.base64?.toString().replace(/data:.*base64,/, ""),
    }
    this.uploading = true;
    this.api.post('UPLOAD_SIGNATURE', postData).pipe(takeUntil(this.destroy$)).subscribe(
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

  /**
   * Get the Signature data from API
   * 
   */
  getSignature(): void {
    this.spinner.show();
    const postData = {
      "UserName": this.cs.getUserData().userid,
    }
    this.api.post('GET_SIGNATURE', postData).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.addImage(res.d.UserSignature);
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  /**
   * Convert and Preview the Signaure
   * @param image API response of the Signature
   */
  addImage(image: string): void {
    if (image && image.trim() != '') {
      this.base64 = "data:image/png;base64," + image;
      this.previewImage = this.base64.toString();
      this.fileList = [
        {
          uid: '-1',
          name: 'signature',
        },
      ]
    }
  }

  /**
   * Remove Added Signature
   */
  removeImage() {
    this.fileList = [];
    this.base64 = null;
    this.previewImage = '';
  }

  /**
   * Attached Signature Preview
   * @param file 
   */
  attachPreview = async (file: NzUploadFile): Promise<void> => {
    this.base64 = await this.getBase64(file as any);
    this.previewImage = this.base64?.toString();
  };

  /**
   * Converts the file into base64 string
   * @param file Selected Signature file
   * @returns `Promise`
   */
  getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Send OTP for Signature submit
   */
  sendOTP() {
    const data = {
      UserId: this.cs.getUserData().userid
    }
    this.spinner.show();
    this.api.post("/OTP", data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.spinner.hide();
      if (res.d.results[0].MessageId === "S") {
        this.cs.otpToast(res.d.results[0])

        this.otp = res.d.results[0].OtpNo;
        this.isOTPVisible = true;
      } else if (res.d.results[0].MessageId === "" || res.d.results[0].MessageId === "E") {
        this.cs.createMessage('error', this.cs.userLanguage === 'en' ? res.d.results[0].MessageEn : res.d.results[0].MessageAr);
      } else {
        this.cs.createMessage("error", this.translate.instant('COM.OTPNotSent'))
      }
    }, () => {
      this.spinner.hide();
    });
  }

  /**
   * Validate OTP
   * @param data 
   */
  verifyOTP(userOtp: any) {
    if (userOtp.length === 5) {
      if (userOtp === this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.OTPvalidatedSucccessfully"))
        this.uploadSignature();
      } else if (userOtp !== this.otp) {
        this.cs.createMessage("error", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }

  /**
   * OTP model visibility control
   * @param value 
   */
  updateOTPVisible(value: boolean) {
    this.isOTPVisible = value;
  }

  /**
   * OnDestroy lifecycle hook
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

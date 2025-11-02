import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-approval-otp',
  templateUrl: './approval-otp.component.html',
  styleUrls: ['./approval-otp.component.scss']
})
export class ApprovalOtpComponent implements OnInit {

  @Input() isConfirmLoading: any;
  @Output() otpValue = new EventEmitter;
  @Input() isOTPVisible: any;
  @Output() updateOTPVisible = new EventEmitter;

  OTPvalue: any = ""

  constructor() { }

  ngOnInit(): void {
  }
  onOtpChange(value:any){
   // console.log(value);
    this.OTPvalue = value;
 
  }
  handleCancel(): void {
    this.isOTPVisible = false;
    this.updateOTPVisible.emit(false);
  }
  handleOk(): void {
    this.isConfirmLoading = true;
      this.isOTPVisible = false;
      this.updateOTPVisible.emit(false);
      this.isConfirmLoading = false;
      this.otpValue.emit(this.OTPvalue);
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { MultiLang, VendorDetails } from '../../dashboard.model';
import { take } from 'rxjs/operators';
import { DashboardService } from '../../dashboard.service';
import { CommonService } from 'src/app/service/common.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dashboard-vendor-popup',
  templateUrl: './vendor-popup.component.html',
  styleUrls: ['./vendor-popup.component.scss']
})
export class VendorPopupComponent implements OnInit {

  @Input() vendorID: string = '';
  @Input() year: string = '';
  loader: boolean = false;
  vendorDetails: VendorDetails = {
    vendorID: "",
    vendorName: "",
    email: "",
    city: "",
    country: {
      en: "",
      ar: ""
    },
    postalCode: "",
    phoneNumber: "",
    countryCode: "",
    contractDetails: []
  }

  vendorDetailsKeys: {[key: string]: keyof VendorDetails} = {
    'Dashboard.City': 'city',
    'Dashboard.Country': 'country',
    'Dashboard.Postal Code': 'postalCode',
    'Dashboard.Email': 'email',
    'Dashboard.Phone Number': 'phoneNumber'
  }
  contractTableHeaders: string[] = [
    'Dashboard.Contract Number',
    'Dashboard.Agreement Date',
    'Dashboard.Validity Start Date',
    'Dashboard.Validity End Date',
    'Dashboard.Target Value',
    'Dashboard.PRs',
    'Dashboard.POs'
  ]

  constructor(
    private dashboardService: DashboardService,
    private commonService: CommonService,
    private modal: NzModalRef
  ) {
    this.renderCompleteInsideChart()
  }
  
  // * This component is rendered by an action in the chart, which is intercepted, and this function helps in rendering
  renderCompleteInsideChart(): void {
    const spaceEvent = new KeyboardEvent("keydown", {
      key: " ",         // or "Spacebar" (deprecated but still used in some older browsers)
      code: "Space",
      keyCode: 32,      // deprecated but still needed for some cases
      bubbles: true
    });
    // Dispatch the event on an element
    document.body.dispatchEvent(spaceEvent);
  }

  ngOnInit(): void {
    this.loader = true;
    this.dashboardService.getVendorDetails(this.vendorID, this.year).pipe(take(1)).subscribe((res: VendorDetails) => {
      this.loader = false;
      this.vendorDetails = {...res};
    }, (err) => {
      this.commonService.createMessage('error', err.statusText);
    })
  }

  get vendorKeys(): [string, string][] {
    return Object.entries(this.vendorDetailsKeys) as [string, string][];
  }

  getVendorValues(key: string): string {
    if (key && this.vendorDetails[key as keyof VendorDetails]) {
      const value = this.vendorDetails[key as keyof VendorDetails];
      if (typeof value === 'object') {
        return this.commonService.userLanguage === 'en' ? (value as MultiLang).en : (value as MultiLang).ar;
      } else {
        if (key === 'phoneNumber') {
          if (this.vendorDetails.countryCode) {
            return this.vendorDetails.countryCode + " " + value;
          }
        }
        return value;
      }
    }
    return ''
  }

  concatArray(array: string[]): string {
    return array.join(', ');
  }

  close(): void {
    const escapeEvent = new KeyboardEvent("keydown", {
      key: "Escape",   // Standard key value
      code: "Escape",  // Physical key code
      keyCode: 27,     // Deprecated but used by older APIs
      bubbles: true
    });
    // Dispatch the event on an element (e.g., document body)
    document.body.dispatchEvent(escapeEvent);
  } 

}

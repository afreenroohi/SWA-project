import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/RFP/api.service';

@Injectable()
export class BidOpeningCommitteeService {
    constructor(private api: ApiService) { }

    public fetchAllVendors(TenderId: string) {
        return this.api.post(`/F4_CMT_VENDORS`, {TenderId});
    }
    
}
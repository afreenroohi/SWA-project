import { Injectable } from '@angular/core';


@Injectable()
export class PassFormDataService {

  formData:any;
  status:any;

  constructor() {
  }
  storeLineData(data: any) {
    this.formData = data;
  //  console.log(this.formData);
  }
  setStatus(status:any){
    this.status = status;
  }
  getStatus(){
    return this.status;
  }
  getData(){
    return this.formData;
  }

 

}

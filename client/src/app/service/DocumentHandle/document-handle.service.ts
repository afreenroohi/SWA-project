import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/service/common.service';
import * as _l from 'lodash';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from 'src/app/service/RFP/api.service';


@Injectable({
  providedIn: 'root'
})
export class DocumentHandleService {

  baseurl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private commonService: CommonService,
    private api: ApiService,

  ) { }



  uploadDocuments(files: any, finputJson: any) {
    try {
      const status = this.validateFiles(files, finputJson.operationType);
      const size = finputJson.operationType == 'p' ? 5 : 100;
      if (status) {
        const res = {
          MessType: 'E',
          error: true,
          message:
            'Please upload valid file and the file size must be less than ' +
            size +
            ' mb.',
        };
        return new Promise((resolve, reject) => {
          return resolve(res);
        });
      } else {
        const formdata: FormData = new FormData();
        for (let x = 0; x < files.length; x++) {
          formdata.append('files[]', files[x]);
        }
        formdata.append('HeaderKey', _l.get(finputJson, 'HeaderKey', ''));
        formdata.append('ItemKey', _l.get(finputJson, 'ItemKey', ''));
        formdata.append('EntityId', _l.get(finputJson, 'EntityId', ''));
        formdata.append('EntityName', _l.get(finputJson, 'EntityName', ''));
        formdata.append('RelatedEntityName', _l.get(finputJson, 'RelatedEntityName', ''));
        formdata.append('RelatedEntityId', _l.get(finputJson, 'RelatedEntityId', ''));
        formdata.append('DefId', _l.get(finputJson, 'DefId', ''));
        formdata.append('Origin', _l.get(finputJson, 'Origin', ''));
        formdata.append('UploadedBy', _l.get(finputJson, 'UploadedBy', ''));
        formdata.append('Operation', 'C');
        formdata.append('GuiId', _l.get(finputJson, 'GuiId', ''));
        formdata.append('DocPath', _l.get(finputJson, 'DocPath', ''));

        return new Promise((resolve, reject) => {
          this.http
            .post(this.baseurl + 'api/uploaddoccmt', formdata)
            .subscribe(
              async (res: any) => {
                const promises: any[] = [];
                if (_l.get(res, 'MessType', '') === 'S') {
                  res.documentList.forEach((doc: any) => {
                    const docDetailsDtoI = this.getDocDetailsDtoI(doc);
                    promises.push(
                      this.uploadSingleFileToBackend(docDetailsDtoI)
                    );
                  });

                }
                const outputs = await Promise.all(promises);
                if (
                  this.checkForFailInOutArry(outputs) &&
                  _l.get(finputJson, 'HeaderKey', '') != 'SIGNUP'
                ) {
                  res['MessType'] = 'E';
                }
                return resolve(res);
              },
              (err) => reject(err)
            );
        });
      }
    } catch (err) {
      return this.returnTryCatchErrorForService();
    }
  }

  uploadToFilenet(req: any): Observable<any> {
    // * Filenet Upload URL
    // return this.http.post(this.baseurl + 'api/filenetuploadfile', req)
    // * SAP File upload URL
    return this.http.post(this.baseurl + 'api/sap-file', req);
  }

  async uploadSingleFileToBackend(_body: any) {
    try {
      return new Promise((resolve, reject) => {
        this.api
          .post('documentDetailsPost', _body)
          .subscribe(

            async (res: any) => {
          //    console.log('ODATA Update Res:', res);
              return resolve(res);
            },
            (err) => reject(err)
          );
      });
    } catch (error) {
    //  console.log('error in post:', error);
    }
  }

  uploadSingleFileToFilenet(req: any): Observable<any> {
    return this.http.post(this.baseurl + 'api/documentDetailsPost', req)
  }

  uploadSingleFileParamsToBackend(_body: any) {
    try {
      const docDetailsDtoI = this.getDocDetailsDtoI(_body);
      return this.http.post(this.baseurl +
        'api/documentDetailsPost',
        docDetailsDtoI
      );
    } catch (error) {
      return this.returnTryCatchErrorForService();
    }
  }

  private getDocDetailsDtoI(_file_det: any) {
    const docDetails: any = {
      HeaderKey: _l.get(_file_det, 'HeaderKey', ''),
      ItemKey: _l.get(_file_det, 'ItemKey', ''),
      EntityId: _l.get(_file_det, 'EntityId', ''),
      EntityName: _l.get(_file_det, 'EntityName', ''),
      RelatedEntityName: _l.get(_file_det, 'RelatedEntityName', ''),
      RelatedEntityId: _l.get(_file_det, 'RelatedEntityId', ''),
      DefId: _l.get(_file_det, 'DefId', ''),
      DocName: _l.get(_file_det, 'DocName', ''),
      FileNetId: _l.get(_file_det, 'FileNetId', ''),
      Origin: _l.get(_file_det, 'Origin', ''),
      UploadedBy: _l.get(_file_det, 'UploadedBy', ''),
      UploadedOn: _l.get(_file_det, 'UploadedOn', ''),
      MimeDocType: _l.get(_file_det, 'MimeDocType', ''),
      Operation: _l.get(_file_det, 'Operation', ''),
      GuiId: _l.get(_file_det, 'GuiId', ''),
      ContentSize: _l.get(_file_det, 'ContentSize', ''),
      DocPath: _l.get(_file_det, 'DocPath', ''),
    }
    return docDetails;
  }

  validateFiles(files: any, operationType: any) {
    let status = false;
    const size = operationType == 'p' ? 5 : 100;
    const maxFileSIze = size * 1024 * 1024 * 1024;
    /// go through the list of files
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const sFileName = file.name;
      const sFileExtension = sFileName
        .split('.')
      [sFileName.split('.').length - 1].toLowerCase();
      const iFileSize = file.size;

      if (
        sFileExtension === 'exe' ||
        sFileExtension === 'dll' ||
        sFileExtension === 'js' ||
        iFileSize > maxFileSIze
      ) {
        /// 100 mb
        status = true;
        return status;
      }
    }
    return status;
  }

  getDocsByEntityId(_params: any) {
    let requestObj: any = {
      EntityId: _l.get(_params, 'EntityId', ''),
      RefId: _l.get(_params, 'RefId', ''),
      OperationType: _l.get(_params, 'OperationType', ''),
      Filename: _l.get(_params, 'Filename', ''),
      DocumentId: _l.get(_params, 'DocumentId', ''),
    };

    return this.http.post(this.baseurl +
      'api/getDocumentsByEntityId',
      requestObj
    );
  }

  getDocDetailsByIds(_params: any) {
    return this.http.post(this.baseurl + 'api/documentDetailsGet', _params);
  }

  deleteDocuments(_params: any, doc: any) {
    const body: any = {
      "FileNetId": _l.get(doc, 'FileNetId', ''),
      "Operation": "D"
    };

    return new Promise((resolve, reject) => {
      this.api
        .post('documentDetailsPost', body)
        .subscribe(
          async (res: any) => {
            if (res) {
              if (_l.get(res, 'MessType', 'E') === 'S') {
                // const req = {
                //   "deleteDocumentByID": {
                //     docID: res.FileNetId,
                //     url: environment.filenetUrl
                //   }
                // }
                const req = {
                  fileid: res.FileNetId
                }
                this.http.delete(this.baseurl + `api/sap-file?fileid=${req.fileid}`).subscribe((res) => {
                  resolve(res)
                },(err) => {
                  console.log(err);
                })
                // this.api.post('filenetdeletefile', req).subscribe((resp: any) => {
                //   if (resp) {
                //     resolve(resp);
                //   }
                // });
              }
              else {
                resolve(res);
              }
            }
          },
          (err) => reject(err)

        );
    });
  }

  deleteDocuments2(_params: any) {
    let body: any = {
      EntityId: _l.get(_params, 'EntityId', ''),
      RefId: _l.get(_params, 'RefId', ''),
      OperationType: _l.get(_params, 'OperationType', ''),
      Filename: _l.get(_params, 'Filename', ''),
      DocumentId: _l.get(_params, 'DocumentId', ''),
    };

    return this.http.post(this.baseurl + 'api/deleteDocumentInfo', body);
  }

  downloadDoc(_params: any) {
    let body: any = {
      EntityId: _l.get(_params, 'EntityId', ''),
      RefId: _l.get(_params, 'RefId', ''),
      OperationType: _l.get(_params, 'OperationType', ''),
      Filename: _l.get(_params, 'Filename', ''),
      DocumentId: _l.get(_params, 'DocumentId', ''),
    };

    return this.http.post(this.baseurl + 'api/downloadDocumentInfo', body);
  }

  base64ToArrayBuffer(base64: any) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  saveByteArray(data: any, name: any) {
    var blob = new Blob(data, { type: 'application/octet-stream' });
    if (window.navigator && window.navigator?.msSaveOrOpenBlob) {
      //IE
      window.navigator?.msSaveOrOpenBlob(blob, name);
    } else {
      // chrome
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.click();
    }
    this.commonService.createMessage('success',
      this.translate.instant('DOC.DownloadingDocument')
    );
    // this.commonService.hideSpinner();
  }

  getDocsFromGuiId(_body: any) {
    return new Promise((resolve, reject) => {
      forkJoin([this.getDocDetailsByIds(_body)]).subscribe((res: any) => {
        // this.handleGetDocsByEntityId(_l.get(res, '[0]', {}));
        resolve(_l.get(res, '[0]', {}));
      });
    });
  }

  deleteDocsInDocList(_docsList: any) {
    return new Promise((resolve, reject) => {
      let forkArray: any[] = [];
      _docsList.forEach((doc: any) => {
        let body = {
          EntityId: _l.get(doc, 'EntityId', ''),
          RefId: _l.get(doc, 'RefId', ''),
          OperationType: '',
          Filename: _l.get(doc, 'DocName', ''),
          DocumentId: _l.get(doc, 'DocId', ''),
        };
        forkArray.push(this.deleteDocuments(body, doc));
      });
      forkJoin(forkArray).subscribe((resArr: any) => {
        let flag = 0;
        resArr.forEach((res: any) => {
          if (_l.get(res, 'MessType', 'E') === 'S') {
            flag += 1;
          }
        });
        if (flag === forkArray.length) {
          resolve(this.returnTryCatchSuccessForService());
        } else {
          resolve(this.returnTryCatchErrorForService());
        }
      });
    });
  }

  convertBase64ToBlobData(
    base64Data: string,
    contentType: string = 'application/octet-stream',
    sliceSize = 1024
  ) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  returnTryCatchSuccessForService(indicator = ''): Observable<any> {
    let valToRet = {};

    switch (indicator) {
      default:
        valToRet = {
          MessId: this.getCommonSuccess('MessId'),
          MessType: this.getCommonSuccess('MessType'),
          MessText: this.getCommonSuccess('MessText'),
          MessTextAr: this.getCommonSuccess('MessTextAr'),
        };
        break;
    }
    return valToRet as Observable<any>;
  }

  returnTryCatchErrorForService(indicator = ''): Observable<any> {
    let valToRet = {};

    switch (indicator) {
      default:
        valToRet = {
          MessId: this.getCommonErrors('MessId'),
          MessType: this.getCommonErrors('MessType'),
          MessText: this.getCommonErrors('MessText'),
          MessTextAr: this.getCommonErrors('MessTextAr'),
        };
        break;
    }
    return valToRet as Observable<any>;
  }

  getCommonSuccess(indicator: string, item = '') {
    let valToRet = '';

    switch (item) {
      default:
        switch (indicator) {
          case 'MessText':
            valToRet = 'Success';
            break;

          case 'MessTextAr':
            valToRet = 'النجاح';
            break;

          case 'MessType':
            valToRet = 'S';
            break;

          case 'MessId':
            valToRet = '';
            break;

          default:
            valToRet = '';
            break;
        }
        break;
    }

    return valToRet;
  }

  getCommonErrors(indicator: string, item = '') {
    let valToRet = '';

    switch (item) {
      default:
        switch (indicator) {
          case 'MessText':
            valToRet = 'Service Error.';
            break;

          case 'MessTextAr':
            valToRet = 'خطأ في الخدمة.';
            break;

          case 'MessType':
            valToRet = 'E';
            break;

          case 'MessId':
            valToRet = '';
            break;

          default:
            valToRet = '';
            break;
        }
        break;
    }

    return valToRet;
  }

  checkForFailInOutArry(_list: any[]) {
    let flag = false;
    _list.forEach((obj) => {
      if (_l.get(obj, 'MessType', '') != 'S') {
        flag = true;
      }
    });
    return flag;
  }



}

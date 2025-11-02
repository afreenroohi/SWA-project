import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import *  as XLSX from 'xlsx-js-style';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private translate: TranslateService) { }

  exportToExcel(data: any[], headers: any[], sheetName: string, excelName: string) {
    
    const aoaData = [
      headers.map(header => this.translate.instant(header.title)),
      ...data.map(d => headers.map(header => typeof(d[header.key]) !== 'object' 
                                          ? d[header.key] 
                                          : this.translate.currentLang === 'en' ? d[header.key]?.en : d[header.key]?.ar 

      ))
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(aoaData);

    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4ea72e' } },
      alignment: { horizontal: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };

    headers.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      worksheet[cellAddress].s = headerStyle;
    });

    worksheet['!cols'] = headers.map(h => ({ wch: h.title.length + 5 }));

    const rowStyle = {
      fill: { fgColor: { rgb: 'DAF2D0' } },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };

    const range = XLSX.utils.decode_range(worksheet['!ref'] || '');

    for (let R = 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            ...worksheet[cellAddress].s,
            ...rowStyle
          };
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${excelName}.xlsx`);

  }

}

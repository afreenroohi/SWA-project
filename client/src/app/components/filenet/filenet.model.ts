export interface FileDownloadReq {
  getDocumentWithContent: DocumentWithContent;
}

interface DocumentWithContent {
  docID: string;
  url?: string;
}

export interface FileDeleteReq {
  deleteDocumentByID: DeleteDocumentByID;
}

interface DeleteDocumentByID {
  docID: string;
  url?: string;
}

export interface FileUploadReq {
  createDocWithContent: CreateDocWithContent;
}

interface CreateDocWithContent {
  file: string;
  docName: string;
  mimeType: string;
  url?: string
}

export interface SapFileReqBody {
  Filedata: string,
  Filetype: string,
  Filename: string,
  Filesize: string,
  Fileextension: string
}

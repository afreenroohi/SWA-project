import { userList } from "../pages/COC/coc.model";

export interface IConfig {
    titleText: string;
    bodyText: string;
}

export interface ReturnConfig {
    label: string | undefined,
    placeholder: string | undefined,
    listofUsers: any[] | undefined
}

export interface AssignConfig {
    label: string | undefined;
    placeholder: string | undefined;
    listOfUsers: userList[] | undefined;
}


export enum MessageType {
    Success = 'success',
    Error = 'error',
    Warning = 'warning',
    Info = 'info'
  }
import { NzTableSortOrder, NzTableSortFn } from 'ng-zorro-antd/table';
import { title } from 'process';

export interface DataItem {
  RfpNo: string;
  ProjId: string;
  RfpVersion: string;
  PurchaseReqNo: string;
  ProjName: string;
  RfpName: string;
  RfpStatus: string;
  CreatedBy: string;
  CreatedOn: Date;
  Dept: string;
  Status: string;
  CocNumber: any;
  CocAmount: any;
  CocCreationDate: any;
  CocStatus: any;
  ContractNo: any;
  SesCreationDate: any;
  SesNo: any;
  SlaEndDate: Date;
  SLAEndDate: string;
  SLAen: string;
  SlaDueDays: any;
  UtilizedAmount: any;
  RemainingAmount: any;
  PoNum: any;
  PoItemNum: any;
  PoAmount: any;
  PoRemainAmount: any;
  RFPNumber: any;
  BidOpngDate: any;
  TndrStatus: any;
  TndrID: any;
  PurReqNo: any;
  TndrName: any;
  EtimadNo: any;
  SlaEndTime?: any;
  TndrTypeID: string;
  CompetitionTypeID: string;
  PurTypID: string;
}

export interface ColumnItem {
  title: string;
  CocNumber: any;
  CocAmount: any;
  CocCreationDate: any;
  CocStatus: any;
  ContractNo: any;
  SesCreationDate: any;
  SesNo: any;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<DataItem> | null;

  sortDirections: NzTableSortOrder[];
}


export interface BoqItem {
  RfpNo: string;
  ItemNo: string;
  DocTypeId: string;
  DocTypeText: string;
  MaterialText: string;
  MatGrpText: string;
  PurGrpText: string;
  CostCenter: string;
  Quantity: string;
  Uom: string;
  Price: string;
  DeliveryDate: string;
}

export interface PayItem {
  RfpNo: string;
  ItemNo: string;
  Descr: string;
  EvalComments?: string;
  Category: string;
  Range: string;
  Subcategory: string;
  Percentage: string;
}

export interface Work {
  ItemNo: string;
  Phase: string;
  NameDelv: string;
  Descr: string;
  DeliveryDate: string;
}

export interface Manpower {
  JobTitle: string;
  Amount: string;
  ExpBasicHr: string;
  ExpOvertime: string;
  SpeExp: string;
  SpeDuties: string;
  SpeQualf: string;
}

export interface TechMemberDetail {
  RfpNo: string;
  RfpVersion: string;
  IsManagerSelected: string,
  SrNo: string;
  TecMemId: string;
  TecMemName: string;
  TecMemNameAr: string;
}

export interface BankDetail {
  BankCountryKeys: string;
  Bankkeys: string;
  NameOfBank: string;
}

export interface GlAccount {
  GLAccount: string;
  GLText: string;
}

export type VendorPayload = {
  CrNumber: string;
  PartnerId?: string;
  Id?: string;
  NameOrg: string;
  BuildingNo: string;
  UnitNo?: string;
  AdditionalNo?: string;
  Street: string;
  DistrictArea?: string;
  ZipCode: string;
  CountryId: string;
  PhoneNo: string;
  MobileNo?: string;
  FaxNo?: string;
  Email: string;
  City: string;
  TaxNumber?: string;
  CompanyCode?: string;
  PurchaseOrg?: string;
  ReconciliationAcct?: string;
  ind?: string;
  ValidFrom?: string;
  ValidTo?: string;
  OrderCurrency?: string;
  to_bnkdt?: BankPayload[];
}

export type BankPayload = {
  CrNumber: string;
  PartnerId?: string;
  BankCtry: string;
  BankCtryiso?: string;
  BankKey: string;
  BankAcct: string;
  CtrlKey?: string;
  BankRef?: string;
  Accountholder?: string;
  CollAuth?: string;
  Externalbankid?: string;
  Bankaccountname?: string;
  Iban: string;
  IbanFromDate?: string;
  Bankdetailvalidfrom?: string;
  Bankdetailvalidto?: string;
  Bankdetailmovedate?: string;
  Bankdetailmoveid?: string;
  BankAccountType?: string;
}

export const STATUS_FILTER = [
  { text: 'Approved', value: 'A' },
  { text: 'Cancelled', value: 'C' },
  { text: 'Draft', value: 'D' },
  { text: 'Returned', value: 'R' },
  { text: 'Submitted', value: 'S' },
];

const STATUS_FILTER_AR = [
  { text: 'موافق عليه', value: 'A' },
  { text: 'ألغيت', value: 'C' },
  { text: 'مسودة', value: 'D' },
  { text: 'تمت الإعادة', value: 'R' },
  { text: 'تم التقديم', value: 'S' },
];

const METHOD_OF_SUBMISSION: { text: string, value: string }[] = [
  {
    text: 'One Envelope',
    value: '01'
  },
  {
    text: 'Two Envelope',
    value: '02'
  }
];

const METHOD_OF_SUBMISSION_AR: { text: string, value: string }[] = [
  {
    text: "ملف واحد",
    value: '01'
  },
  {
    text: 'ملفان',
    value: '02'
  }
];

const PURCHASE_METHOD: { text: string, value: string }[] = [
  {
    text: 'Limited',
    value: '01'
  },
  {
    text: 'Public',
    value: '02'
  },
  {
    text: 'Framework Agreement',
    value: '03'
  }
];

const PURCHASE_METHOD_AR: { text: string, value: string }[] = [
  {
    text: 'محدودة',
    value: '01'
  },
  {
    text: 'عامة',
    value: '02'
  },
  {
    text: "اتفاقية اطارية",
    value: '03'
  }
];

const TYPE_OF_PURCHASE: { text: string, value: string }[] = [
  {
    text: 'RFP For Tendering',
    value: 'R'
  },
  {
    text: 'Direct Purchase',
    value: 'D'
  }
];
const TYPE_OF_PURCHASE_AR: { text: string, value: string }[] = [
  {
    text: 'منافسة',
    value: 'R'
  },
  {
    text: "الشراء المباشر",
    value: 'D'
  }
];

export const LegalRest: any = [
  {
    id: 'Pass',
    type: 'Accepted',
    typeAr: 'مقبول',
  },

  {
    id: 'Fail',
    type: 'Not Accepted',
    typeAr: 'مستبعد',
  },
];

export const EnvType: any = [
  {
    id: '01',
    type: 'One Envelope',
    typeAr: 'ملف واحد',
  },

  {
    id: '02',
    type: 'Two Envelope',
    typeAr: 'ملفان',
  },
];

export const PurchaseType: any = [
  {
    PurchaseTypeID: 'D',
    PurchaseTypeDesc: 'Direct Purchase',
    PurchaseTypeDescAr: 'الشراء المباشر',
  },
  {
    PurchaseTypeID: 'R',
    PurchaseTypeDesc: 'RFP for tendering',
    PurchaseTypeDescAr: 'منافسة',
  },
];

export const Indicator: any = [
  {
    id: '1',
    type: 'My RFP',
    typeAr: 'منافساتي',
  },

  {
    id: '3',
    type: 'Change RFP',
    typeAr: 'المسودات',
  },
  {
    id: '4',
    type: 'Return RFP',
    typeAr: 'المنافسات المسترجعة',
  },
  {
    id: '5',
    type: 'Reopen RFP',
    typeAr: 'المنافسات المعاد فتحها',
  },

  //  {
  //   id: '2',
  //   type: 'Search RFP',
  //   typeAr: '',
  // },
  // {
  //   id: '6',
  //   type: 'Review',
  //   typeAr: '',
  // },
  // {
  //   id: '7',
  //   type: 'Approve',
  //   typeAr: '',
  // },
];

export const caseStatus: any = [
  {
    id: 'G',
    value: 'General Supply',
    valueAr: 'توريد عام',
  },
  {
    id: 'P',
    value: 'Public Services',
    valueAr: 'خدمات عامة',
  },
  {
    id: 'I',
    value: 'Information Technology',
    valueAr: 'تقنية معلومات',
  },
  {
    id: 'C',
    value: 'Consulting Services',
    valueAr: 'خدمات إستشارية',
  },

  {
    id: 'M',
    value: 'Operating and Maintenance',
    valueAr: 'التَّشغيل والصيانة',
  },

  {
    id: 'E',
    value: 'Engineering Services - Supervision',
    valueAr: 'الخدمات الهندسية – إشراف',
  },

  {
    id: 'D',
    value: 'Engineering Services - Design',
    valueAr: 'الخدمات الهندسية-تصميم',
  },

  {
    id: 'F',
    value: 'Framework Supply Agreement Template',
    valueAr: 'نموذج اتفاقية توريد إطارية',
  },

  {
    id: 'R',
    value: 'Framework Service Agreement Form  - General',
    valueAr: 'نموذج اتفاقية خدمات إطارية - عام ',
  },

  {
    id: 'T',
    value: 'Framework Consulting Services Agreement Form',
    valueAr: 'نموذج اتفاقية خدمات استشارية إطارية ',
  },
];

export const enum DocumentTypeId {
  'Service' = 'ZSR',
  'Direct Purchase' = 'ZDD'
};

export interface DocumentType {
  id: string,
  value: string,
  valueAr: string
}

export const dtypes: DocumentType[] = [

  {
    id: DocumentTypeId.Service,
    value: 'Service',
    valueAr: 'خدمة',
  },
  {
    id: DocumentTypeId['Direct Purchase'],
    value: 'Direct Purchase',
    valueAr: "الشراء المباشر",
  }
];

export const durationTypes: any = [
  {
    id: 'd',
    value: 'Day',
    valueAr: 'يوم',
  },
  {
    id: 'W',
    value: 'Week',
    valueAr: 'أسبوع',
  },
  {
    id: 'M',
    value: 'Month',
    valueAr: 'شهر',
  },
  {
    id: 'Y',
    value: 'Year',
    valueAr: 'سنة',
  }
];

export const contractTypes: any = [
  {
    id: 'd',
    value: 'Over 25 Million SAR Projects',
    valueAr: 'المشاريع التي تتجاوز 25 مليون ريال سعودي',
  },
  {
    id: 'W',
    value: 'Less than 25 Million SAR Projects',
    valueAr: 'المشاريع التي تقل عن 25 مليون ريال سعودي',
  },
  {
    id: 'M',
    value: 'Agreements Projects',
    valueAr: 'مشاريع الاتفاقيات',
  },
];

export const competitionTypes: any = [
  {
    id: 'G',
    value: 'General Competition',
    valueAr: 'المنافسة العامة',
  },
  {
    id: 'D',
    value: 'Direct Purchase',
    valueAr: 'الشراء المباشر',
  },
  {
    id: 'L',
    value: 'Limited Competition',
    valueAr: 'المنافسة المحدودة',
  },
  {
    id: 'F',
    value: 'Framework Agreement Competition',
    valueAr: 'منافسة اتفاقية إطارية',
  },
  {
    id: 'N',
    value: 'National Transformation Projects',
    valueAr: 'مشاريع التحول الوطني',
  },
  {
    id: 'T',
    value: 'Two-Stage Competition (First Stage)',
    valueAr: 'منافسة على مرحلتين (المرحلة الأولى)',
  },
];

export const sopData: any = [
  {
    id: 'Labor',
    value: 'Labor',
    valueAr: 'العمالة',
    text: `أ. يجب على المقاول القيام بترتيبات خاصة لتوظيف ومعاملة العمال، سواء كانوا مواطنين أو أجانب، وفقًا لأحكام نظام العمل، ونظام التأمينات الاجتماعية، واللوائح ذات الصلة. ويلتزم المقاول بتوفير المتطلبات اللازمة لعماله، بما في ذلك السكن الصحي، والنقل، والرعاية الصحية، ووسائل السلامة.

ب. يجب على المقاول الالتزام بدفع رسوم العمالة ومراقبة حالة العمل، بحيث لا تقل عن ما هو متعارف عليه في القطاع أو نوع الخدمة التي يتم تنفيذ العمل فيها.

ج. يُحظر على المقاول استقطاب أو محاولة استقطاب أي من موظفي الجهة.

د. باستثناء ما قد يُنص عليه في العقد، لا يجوز تنفيذ العمل ليلًا أو يوم الجمعة أو في الإجازات الرسمية الأخرى دون إذن كتابي من الجهة أو ممثلها، ما لم يكن العمل ضروريًا لإنقاذ الأرواح أو الممتلكات أو لضمان سلامة الأعمال. وفي هذه الحالة يجب على المقاول إشعار الجهة أو ممثلها. ويُطبق ذلك في الحالات التي يكون من المعتاد فيها تنفيذ العمل بالتناوب أو على فترتين.

هـ. يجب على المقاول في جميع الأوقات اتخاذ جميع الاحتياطات اللازمة للحفاظ على صحة وسلامة موظفيه. وتعيين مسؤول للسلامة لمنع الحوادث في الموقع، وله سلطة إصدار التعليمات واتخاذ التدابير الوقائية. ويجب على المقاول إرسال تفاصيل أي حادث لممثل الجهة عند وقوعه، والاحتفاظ بالسجلات وتقديم التقارير حول الصحة والسلامة والأضرار. ويجب عليه تنفيذ برامج التوعية بالأمراض واتخاذ التدابير لمنع انتقال العدوى بين العمال.

و. يجب على المقاول تزويد الجهة بسجلات مفصلة لموظفيه مصنفة حسب المهارات. وتُقدم هذه السجلات شهريًا باستخدام النماذج المعتمدة حتى اكتمال الأعمال.

ز. يجب على المقاول التأكد من أن جميع المهندسين والفنيين والعمال في الموقع، بما في ذلك الطاقم الفني التنفيذي، تحت كفالته أو كفالة المقاول الفرعي المتفق عليه. كما يجب وجود عقد عمل رسمي لجميع العمال معتمد لدى الجهة. وللجهة الحق في طلب نقل كفالة العمال (العمال، الفنيين، والمشرفين) إلى مقاول جديد لضمان جودة تنفيذ الأعمال.

ح. يجب على المقاول ترتيب توفير كمية كافية من الغذاء كما هو منصوص عليه في العقد، بالإضافة إلى توفير مياه الشرب وغيرها من المياه لاستخدام العاملين في الموقع.

ط. يجب على المقاول الاحتفاظ بسجلات تفصيلية تتضمن أسماء العمال، أعمارهم، جنسهم، جنسياتهم، عدد ساعات العمل، وأي معلومات أخرى يطلبها ممثل الجهة.

ي. يلتزم المقاول باستخراج تصاريح الإقامة للعاملين وفق الإجراءات القانونية المعمول بها في المملكة.

ك. يلتزم المقاول بتخصيص العمالة النسائية للعمل في الأقسام النسائية أو المواقع التي تتطلب ذلك.

ل. يجب على المقاول توفير الزي الرسمي للعمال في مواقع العمل، ووسائل السلامة اللازمة مثل الخوذ والسترات العاكسة.`
  },

  {
    id: 'Material',
    value: 'Material',
    valueAr: 'المواد',
    text: `١. يجب على المقاول مراجعة المواد المستخدمة في تنفيذ الأعمال لضمان مطابقتها لمواصفات التوريد والمعايير الدولية، ومراجعة نتائج الاختبارات، وإعطاء الموافقة أو عدمها، والاحتفاظ بنسخ منها. ويجب أن تكون المواد مطابقة للمواصفات القياسية السعودية، وإن لم تكن ضمنها، فيجب أن تكون مطابقة لإحدى المواصفات الدولية المعتمدة لدى الجهة أو ممثلها.

٢. يجوز لممثل الجهة أن يطلب من المقاول إعداد بيان واضح ومفصل للمواد المستخدمة، وعلى المقاول تقديم البيان خلال عشرة (١٠) أيام من تاريخ الطلب.

٣. إذا فشل المقاول في إيضاح المواد المستخدمة خلال المدة المحددة، تعتبر المواد مخالفة لما تم الاتفاق عليه، ويجوز لممثل الجهة اتخاذ الإجراءات أو العقوبات اللازمة وفق تقديره.`
  },

  {
    id: 'Equipment',
    value: 'Equipment',
    valueAr: 'المعدات',
    text: `يجب على المقاول فحص واعتماد جميع المعدات المستخدمة إذا كانت مطابقة للمواصفات والمعايير الدولية في جميع الجوانب، وفحص شهادات الاختبار الخاصة بالمعدات في المصنع، ومراقبة واعتماد اختبارات المعدات في الموقع أو مكان التصنيع، والاحتفاظ بجميع الشهادات المتعلقة بذلك.`
  },

  {
    id: 'Quality',
    value: 'Quality Specifications',
    valueAr: 'مواصفات الجودة',
    text: `يلتزم المتعاقد بأداء جميع الخدمات اللازمة للمشروع وتنفيذها من خلال موظفيه وفقا لأعلى مستويات الجودة وبالكيفية والأسلوب المتعارف عليهما مهنيا. يجب على المتعاقد تقديم خطة ضمان الجودة والتي يعتزم تنفيذها في المشروع لمراجعتها واعتمادها من الجهة الحكومية. يجب أن تتضمن الخطة إجراءات وأدوات ضبط الجودة.`
  },

  {
    id: 'Safety',
    value: 'Safety Specifications',
    valueAr: 'مواصفات السلامة',
    text: `يلتزم المتعاقد وخلال جميع مراحل التنفيذ بجميع الأنظمة والقواعد المطبقة في المملكة فيما يخص السلامة والصحة والبيئة، وأي أنظمة وقواعد تحددها الجهة في نطاق عمل المشروع، ويضمن اتخاذ جميع الإجراءات والاحتياطات اللازمة للامتثال لهذه الأنظمة والقواعد.`
  }
];


export const ptypes: any = [
  {
    id: 'ZANB',
    value: 'Asset',
    valueAr: 'أصل',
  },
  {
    id: 'ZCON',
    value: 'Consumable',
    valueAr: 'مستهلك',
  },

  {
    id: 'ZSRV',
    value: 'Service',
    valueAr: 'خدمة',
  },
];

export const certs: any = [
  {
    id: 'O',
    value: 'Service',
    valueAr: 'خدمة',
  },
  {
    id: 'C',
    value: 'Asset',
    valueAr: 'أصل',
  },
  {
    id: 'S',
    value: 'Consumable',
    valueAr: 'مستهلك',
  },
];

export const listOfColumnRFP = [
  {
    id: 1,
    title: 'Project Name',
    titleAr: 'اسم المشروع',
  },
  {
    id: 2,
    title: 'RFP Number',
    titleAr: 'رقم المنافسة',
    sortFn: (a: DataItem, b: DataItem) =>
      a.RfpNo.localeCompare(b.RfpNo),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 9,
    title: 'RFP Version',
    titleAr: `نسخة طلب تقديم العروض`,
    sortFn: (prev: DataItem, next: DataItem) => Number(prev.RfpVersion) - Number(next.RfpVersion),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 3,
    title: 'Purchase Request Number',
    titleAr: 'رقم طلب الشراء',
    sortFn: (a: DataItem, b: DataItem) =>
      a.PurchaseReqNo.localeCompare(b.PurchaseReqNo),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 4,
    title: 'Created On',
    titleAr: 'أنشئ في',
    sortFn: (prev: DataItem, next: DataItem) => {
      const preCreatedOn = prev.CreatedOn.valueOf() || 0, nextCreatedOn = next.CreatedOn.valueOf() || 0;
      return preCreatedOn - nextCreatedOn;
    },
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 42,
    title: 'Pending with User',
    titleAr: 'قيد الانتظار مع المستخدم',
    sortFn: (a: any, b: any) =>
      a.WfPendUsrEn.localeCompare(b.WfPendUsrEn),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 5,
    title: 'Status',
    titleAr: 'الحالة',
    filterMultiple: true,
    listOfFilter: STATUS_FILTER,
    listOfFilterAr: STATUS_FILTER_AR,
    filterFn: (list: string[], item: DataItem) => list.some(name => item.RfpStatus.indexOf(name) !== -1)
  },
  {
    id: 7,
    title: 'SLA',
    titleAr: 'اتفاقية مستوي التشغيل',
    sortFn: (prev: DataItem, next: DataItem) => {
      const preEndDate = prev.SlaEndDate ? Number(prev.SlaEndDate) : 0,
        nextEndDate = next.SlaEndDate ? Number(next.SlaEndDate) : 0;
      if (preEndDate > nextEndDate) {
        return -1;
      } else if (preEndDate < nextEndDate) {
        return 1;
      } else {
        return 0;
      }
    },
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 6,
    title: 'Action',
    titleAr: 'الإجراء',
  },

];

export const listOfColumnRFPAppRej = [
  {
    id: 1,
    title: 'Project Name',
    titleAr: 'اسم المشروع',
  },
  {
    id: 2,
    title: 'RFP Number',
    titleAr: 'رقم المنافسة',
    sortFn: (a: DataItem, b: DataItem) =>
      a.RfpNo.localeCompare(b.RfpNo),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 9,
    title: 'RFP Version',
    titleAr: 'نسخة طلب تقديم العروض',
    sortFn: (prev: DataItem, next: DataItem) => Number(prev.RfpVersion) - Number(next.RfpVersion),
    sortDirections: ['ascend', 'descend', null],
  },

  {
    id: 3,
    title: 'Purchase Request Number',
    titleAr: 'رقم طلب الشراء',
    sortFn: (a: DataItem, b: DataItem) =>
      a.PurchaseReqNo.localeCompare(b.PurchaseReqNo),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 4,
    title: 'Created On',
    titleAr: 'أنشئ في',
    sortFn: (prev: DataItem, next: DataItem) => {
      const preCreatedOn = prev.CreatedOn.valueOf() || 0, nextCreatedOn = next.CreatedOn.valueOf() || 0;
      return preCreatedOn - nextCreatedOn;
    },
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 5,
    title: 'Status',
    titleAr: 'الحالة',
    filterMultiple: true,
    listOfFilter: STATUS_FILTER,
    listOfFilterAr: STATUS_FILTER_AR,
    filterFn: (list: string[], item: DataItem) => list.some(name => item.RfpStatus.indexOf(name) !== -1)
  },
  {
    id: 7,
    title: 'SLA',
    titleAr: 'اتفاقية مستوي التشغيل',
    sortFn: (prev: DataItem, next: DataItem) => {
      const preEndDate = prev.SlaEndDate ? Number(prev.SlaEndDate) : 0,
        nextEndDate = next.SlaEndDate ? Number(next.SlaEndDate) : 0;
      if (preEndDate > nextEndDate) {
        return -1;
      } else if (preEndDate < nextEndDate) {
        return 1;
      } else {
        return 0;
      }
    },
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 6,
    title: 'Action',
  },

];

export const listOfColumnRFPMG = [
  {
    id: 1,
    title: 'Project Name',
    titleAr: 'اسم المشروع',
  },
  {
    id: 2,
    title: 'RFP Number',
    titleAr: 'رقم المنافسة',
    sortFn: (a: DataItem, b: DataItem) =>
      a.RfpNo.localeCompare(b.RfpNo),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 3,
    title: `RFP Version`,
    titleAr: `نسخة طلب تقديم العروض`,
    sortFn: (prev: DataItem, next: DataItem) => Number(prev.RfpVersion) - Number(next.RfpVersion),
    sortDirections: ['ascend', 'descend', null],
  },


  {
    id: 4,
    title: 'Purchase Request Number',
    titleAr: 'رقم طلب الشراء',
    sortFn: (a: DataItem, b: DataItem) =>
      a.PurchaseReqNo.localeCompare(b.PurchaseReqNo),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 5,
    title: 'Created On',
    titleAr: 'أنشئ في',
    sortFn: (prev: DataItem, next: DataItem) => {
      const preCreatedOn = prev.CreatedOn.valueOf() || 0, nextCreatedOn = next.CreatedOn.valueOf() || 0;
      return preCreatedOn - nextCreatedOn;
    },
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 49,
    title: 'Requester Department',
    titleAr: 'الجهة الطالبة',
  },
  {
    id: 41,
    title: 'Pending with Department',
    titleAr: 'قيد الانتظار مع القسم',
  },

  {
    id: 42,
    title: 'Pending with User',
    titleAr: 'قيد الانتظار مع المستخدم',
  },
  // {
  //   id: 6,
  //   title: 'Status',
  //   titleAr: 'الحالة',
  //   filterMultiple: true,
  //   listOfFilter: STATUS_FILTER,
  //   listOfFilterAr: STATUS_FILTER_AR,
  //   filterFn: (list: string[], item: DataItem) => list.some(name => item.RfpStatus.indexOf(name) !== -1)
  // },
  {
    id: 6,
    title: 'SLA',
    titleAr: 'اتفاقية مستوي التشغيل',
    sortFn: (prev: DataItem, next: DataItem) => {
      const preEndDate = prev.SlaEndDate ? Number(prev.SlaEndDate) : 0,
        nextEndDate = next.SlaEndDate ? Number(next.SlaEndDate) : 0;
      if (preEndDate > nextEndDate) {
        return -1;
      } else if (preEndDate < nextEndDate) {
        return 1;
      } else {
        return 0;
      }
    },
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 7,
    title: 'Action',
    titleAr: 'الإجراء',
  },
  // {
  //   id:10,
  //   title:'Has it been re-announced?',
  //   titleAr: 'هل تم الإعلان عنه مرة أخرى؟',

  // }

];

export const listOfColumnBudget = [
  {
    id: 1,
    title: 'Transfer Budget From Project',
    titleAr: 'اسم المشروع',
    sortFn: (a: any, b: any) =>
      a.ProjName.localeCompare(b.ProjName),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 7,
    title: 'Transfer Budget To Project',
    titleAr: 'نقل الميزانية من مشروع',
    sortFn: (a: any, b: any) =>
      a.TrfProjName.localeCompare(b.TrfProjName),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 11,
    title: 'New Project Name',
    titleAr: 'اسم المشروع الجديد',
    sortFn: (a: any, b: any) =>
      a.UpProjName.localeCompare(b.UpProjName),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 8,
    title: 'Transfered Budget Amount',
    titleAr: 'قيمة الميزانية المنقولة',
    sortFn: (a: any, b: any) =>
      a.TrfProjAmt - b.TrfProjAmt,
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 9,
    title: 'Budget Type',
    titleAr: 'نوع الميزانية',
    sortFn: (a: any, b: any) =>
      a.ProjTypeText.localeCompare(b.ProjTypeText),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 10,
    title: 'Amount',
    titleAr: 'القيمة',
    sortFn: (a: any, b: any) =>
      a.ProjTypeAmt - b.ProjTypeAmt,
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 11,
    title: 'Status',
    titleAr: 'الحالة',
    filterMultiple: true,
    listOfFilter: STATUS_FILTER,
    filterFn: (list: string[], item: any) => list.some(name => item.actualStatus.indexOf(name) !== -1)
  },
  {
    id: 6,
    title: 'Action',
    titleAr: 'الإجراء',
  },
];

export const SES = [

  {
    id: 1,
    title: 'CocNumber',
    titleAr: 'رقم شهادة الإنجاز',
    sortFn: (a: DataItem, b: DataItem) =>
      a.CocNumber.localeCompare(b.CocNumber),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 2,
    title: 'CocAmount',
    titleAr: 'المبلغ المستحق حسب الشهادة',
    sortFn: (a: DataItem, b: DataItem) =>
      a.CocAmount.localeCompare(b.CocAmount),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 3,
    title: 'SesNo',
    titleAr: 'رقم صحيفة إدخال الخدمة',
    sortFn: (a: DataItem, b: DataItem) =>
      a.SesNo.localeCompare(b.SesNo),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 4,
    title: 'SesCreationDate',
    titleAr: 'تاريخ الإنشاء',
    sortFn: (a: DataItem, b: DataItem) =>
      a.SesCreationDate.localeCompare(b.SesCreationDate),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 5,
    title: 'ContractNo',
    titleAr: 'رقم العقد',
    sortFn: (a: DataItem, b: DataItem) =>
      a.ContractNo.localeCompare(b.ContractNo),
    sortDirections: ['ascend', 'descend', null],
  },



]

export const SESlIST = [

  {
    id: 1,
    title: 'CocNumber',
    titleAr: 'رقم شهادة الإنجاز',
    sortFn: (a: DataItem, b: DataItem) =>
      a.CocNumber.localeCompare(b.CocNumber),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 2,
    title: 'CocAmount',
    titleAr: 'المبلغ المستحق حسب الشهادة',
    sortFn: (a: DataItem, b: DataItem) =>
      a.CocAmount.localeCompare(b.CocAmount),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 4,
    title: 'COC CreationDate',
    titleAr: 'تاريخ الإنشاء',
    sortFn: (a: DataItem, b: DataItem) =>
      a.CocCreationDate.localeCompare(b.CocCreationDate),
    sortDirections: ['ascend', 'descend', null],
  },

  {
    id: 5,
    title: 'Status',
    titleAr: 'الحالة',
    filterMultiple: true,
    listOfFilter: STATUS_FILTER,
    filterFn: (list: string[], item: DataItem) => list.some(name => item.RfpStatus.indexOf(name) !== -1)
  },

  {
    id: 6,
    title: 'ContractNo',
    titleAr: 'رقم العقد',
    sortFn: (a: DataItem, b: DataItem) =>
      a.ContractNo.localeCompare(b.ContractNo),
    sortDirections: ['ascend', 'descend', null],
  },

  {
    id: 7,
    title: 'SesCreationDate',
    titleAr: 'تاريخ الإنشاء',
    sortFn: (a: DataItem, b: DataItem) =>
      a.SesCreationDate.localeCompare(b.SesCreationDate),
    sortDirections: ['ascend', 'descend', null],
  },

  {
    id: 8,
    title: 'SesNo',
    titleAr: 'صحيفة إدخال الخدمة رقم',
    sortFn: (a: DataItem, b: DataItem) =>
      a.SesNo.localeCompare(b.SesNo),
    sortDirections: ['ascend', 'descend', null],
  },

  {
    id: 9,
    title: 'Action',
    titleAr: 'الإجراء',
  },


]

export const listOfColumnProjOwnDash = [
  {
    id: 1,
    title: 'Table.SI No',
  },
  {
    id: 2,
    title: 'COC.CocNumber',
  },
  {
    id: 4,
    title: 'COC.ProjectName',
  },
  {
    id: 5,
    title: 'COC.VendorName',
  },
  {
    id: 6,
    title: 'COC.ContractNumber',
    filter: true,
  },
  {
    id: 7,
    title: 'COC.PoNumber',
    filter: true,
  },
  {
    id: 8,
    title: 'COC.InvNumber',
  },
  {
    id: 9,
    title: 'RFP.CreatedBy',
  },
  {
    id: 10,
    title: 'RFP.CreatedOn',
  },
  {
    id: 11,
    title: 'RFP.Status',
  },
  {
    id: 12,
    title: 'Pending with',
  },
  {
    id: 13,
    title: 'SLA',
  },
  {
    id: 14,
    title: 'RFP.Action',
  },
];

export const listOfColumnPO = [
  {
    id: 1,
    title: 'SlNo.',
    titleAr: 'الرقم التسلسلي',
  },
  {
    id: 2,
    title: 'PO Number',
    titleAr: 'رقم أمر الشراء',
    sortFn: (a: DataItem, b: DataItem) =>
      a.PoNum.localeCompare(b.PoNum),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 3,
    title: 'PO Item Number',
    titleAr: 'رقم بند أمر الشراء',
    sortFn: (a: DataItem, b: DataItem) =>
      a.PoItemNum.localeCompare(b.PoItemNum),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 4,
    title: 'PO Amount',
    titleAr: 'مبلغ أمر الشراء',
    sortFn: (a: DataItem, b: DataItem) =>
      a.PoAmount.localeCompare(b.PoAmount),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 5,
    title: 'PO Remaining Amount',
    titleAr: 'المبلغ المتبقي من أمر الشراء',
    sortFn: (a: DataItem, b: DataItem) =>
      a.PoRemainAmount.localeCompare(b.PoRemainAmount),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 6,
    title: 'Create COC',
    titleAr: 'إنشاء شهادة إتمام',
  },
];

export const listOfColumnSLA = [
  {
    id: 2,
    title: 'COC Number',
    titleAr: 'رقم شهادة الإنجاز',
    sortFn: (a: DataItem, b: DataItem) =>
      a.CocNumber.localeCompare(b.CocNumber),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 3,
    title: 'Contract Number',
    titleAr: 'رقم العقد',
    sortFn: (a: DataItem, b: DataItem) =>
      a.ContractNo.localeCompare(b.ContractNo),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 4,
    title: 'Project Name',
    titleAr: 'اسم المشروع',
  },
  {
    id: 5,
    title: 'SLA Due Days',
    titleAr: 'اتفاقية مستوي التشغيل',
    sortFn: (a: DataItem, b: DataItem) =>
      a.SlaDueDays.localeCompare(b.SlaDueDays),
    sortDirections: ['ascend', 'descend', null],
  },

  {
    id: 6,
    title: 'Action',
    titleAr: 'الإجراء',
  },
];

export const tendertypes: any = [
  {
    id: 1,
    value: 'Single vendor',
    valueAr: 'مورد وحيد',
  },
  {
    id: 2,
    value: 'Urgent Tender',
    valueAr: 'منافسة عاجلة',
  },
  {
    id: 3,
    value: 'Cancel Tender',
    valueAr: 'إلغاء المنافسة',
  },
  {
    id: 4,
    value: 'General Tender',
    valueAr: 'منافسة',
  },

  {
    id: 5,
    value: 'Direct Purchase',
    valueAr: 'الشراء المباشر',
  },
];

export const listOfColumnBtEvl = [
  {
    id: 1,
    title: 'Tender Name',
    titleAr: 'اسم المنافسة',
  },
  {
    id: 11,
    title: 'RFP Number',
    sortFn: (a: DataItem, b: DataItem) => a.RFPNumber - b.RFPNumber,
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'رقم المنافسة',
  },
  {
    id: 12,
    title: 'Etimad Number',
    sortFn: (a: DataItem, b: DataItem) => a.EtimadNo.localeCompare(b.EtimadNo),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'الرقم المرجعي في منصة اعتماد',
  },
  {
    id: 2,
    title: 'Reference number',
    sortFn: (a: DataItem, b: DataItem) => a.PurReqNo.localeCompare(b.PurReqNo),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'رقم طلب الشراء',
  },
  {
    id: 3,
    title: 'Method of Submission',
    titleAr: 'طريقة تقديم العروض',
  },
  {
    id: 4,
    title: 'Purchase method',
    titleAr: 'أسلوب الشراء',
  },
  {
    id: 4,
    title: 'Tender opening date',
    sortFn: (a: DataItem, b: DataItem) =>
      a.BidOpngDate.localeCompare(b.BidOpngDate),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'تاريخ الفتح',
  },

  {
    id: 7,
    title: 'Status',
    titleAr: 'الحالة',
    filterMultiple: true,
    listOfFilter: STATUS_FILTER,
    filterFn: (list: string[], item: DataItem) => list.some(name => item.TndrStatus.indexOf(name) !== -1)
  },
  {
    id: 13,
    title: 'Pending with',
    titleAr: 'قيد الانتظار مع',
  },

  {
    id: 6,
    title: 'Assigned officer (Evaluation)',
    titleAr: ' اسم سكرتير الفحص ',
  },
  {
    id: 5,
    title: 'Actions',
    titleAr: 'إجراءات',
  },
  {
    id: 8,
    title: 'Download MoM',
    titleAr: 'تحميل المحضر',
  },

  {
    id: 10,
    title: 'SLA',
    titleAr: 'اتفاقية مستوي التشغيل',
    sortFn: (prev: DataItem, next: DataItem) => {
      const preEndDate = prev.SLAEndDate?.valueOf() || 0, nextEndDate = next.SLAEndDate?.valueOf() || 0;
      if (preEndDate > nextEndDate) {
        return 1;
      } else if (preEndDate < nextEndDate) {
        return -1;
      } else {
        return 0;
      }
    },
  },
];

export const listOfColumnDPEval = [
  {
    id: 1,
    title: 'Tender Name',
    titleAr: 'اسم المنافسة',
  },
  {
    id: 11,
    title: 'RFP Number',
    sortFn: (a: DataItem, b: DataItem) => a.RFPNumber - b.RFPNumber,
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'رقم المنافسة',
  },
  {
    id: 12,
    title: 'Etimad Number',
    sortFn: (a: DataItem, b: DataItem) => a.EtimadNo.localeCompare(b.EtimadNo),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'الرقم المرجعي في منصة اعتماد',
  },
  {
    id: 2,
    title: 'Reference number',
    sortFn: (a: DataItem, b: DataItem) => a.PurReqNo.localeCompare(b.PurReqNo),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'رقم طلب الشراء',
  },
  {
    id: 3,
    title: 'Method of Submission',
    titleAr: 'طريقة تقديم العروض',
  },
  {
    id: 4,
    title: 'Tender opening date',
    sortFn: (a: DataItem, b: DataItem) =>
      a.BidOpngDate.localeCompare(b.BidOpngDate),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'تاريخ الفتح',
  },

  {
    id: 7,
    title: 'Status',
    titleAr: 'الحالة',
    filterMultiple: true,
    listOfFilter: STATUS_FILTER,
    filterFn: (list: string[], item: DataItem) => list.some(name => item.TndrStatus.indexOf(name) !== -1)
  },
  {
    id: 13,
    title: 'Pending with',
    titleAr: 'قيد الانتظار مع',
  },

  {
    id: 6,
    title: 'Assigned officer (Evaluation)',
    titleAr: ' اسم سكرتير الفحص ',
  },
  {
    id: 5,
    title: 'Actions',
    titleAr: 'إجراءات',
  },
  {
    id: 8,
    title: 'Download MoM',
    titleAr: 'تحميل المحضر',
  },

  {
    id: 10,
    title: 'SLA',
    titleAr: 'اتفاقية مستوي التشغيل',
    sortFn: (prev: DataItem, next: DataItem) => {
      const preEndDate = prev.SLAEndDate?.valueOf() || 0, nextEndDate = next.SLAEndDate?.valueOf() || 0;
      if (preEndDate > nextEndDate) {
        return 1;
      } else if (preEndDate < nextEndDate) {
        return -1;
      } else {
        return 0;
      }
    },
  },
];


export const listofColumnCEO = [
  {
    id: 1,
    title: 'Tender Name',
    titleAr: 'اسم المنافسة',
  },
  {
    id: 11,
    title: 'RFP Number',
    sortFn: (a: DataItem, b: DataItem) => a.RFPNumber - b.RFPNumber,
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'رقم المنافسة',
  },
  {
    id: 12,
    title: 'Etimad Number',
    sortFn: (a: DataItem, b: DataItem) => a.EtimadNo.localeCompare(b.EtimadNo),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'الرقم المرجعي في منصة اعتماد',
  },
  {
    id: 2,
    title: 'Reference number',
    sortFn: (a: DataItem, b: DataItem) => a.PurReqNo.localeCompare(b.PurReqNo),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'رقم طلب الشراء',
  },
  {
    id: 3,
    title: 'Method of Submission',
    titleAr: 'طريقة تقديم العروض',
  },
  {
    id: 7,
    title: 'Status',
    titleAr: 'الحالة',
    filterMultiple: true,
    listOfFilter: STATUS_FILTER,
    filterFn: (list: string[], item: DataItem) => list.some(name => item.TndrStatus.indexOf(name) !== -1)
  },
  {
    id: 5,
    title: 'Actions',
    titleAr: 'إجراءات',
  },
  {
    id: 8,
    title: 'Download MoM',
    titleAr: 'تحميل المحضر',
  },
  {
    id: 10,
    title: 'SLA',
    titleAr: 'اتفاقية مستوي التشغيل',
    sortFn: (prev: DataItem, next: DataItem) => {
      const preEndDate = prev.SLAEndDate?.valueOf() || 0, nextEndDate = next.SLAEndDate?.valueOf() || 0;
      if (preEndDate > nextEndDate) {
        return 1;
      } else if (preEndDate < nextEndDate) {
        return -1;
      } else {
        return 0;
      }
    },
  },
];

export const listOfColumnVendorList = [
  {
    id: 1,
    title: 'Tender Name',
    titleAr: 'اسم المنافسة',
  },
  {
    id: 11,
    title: 'RFP Number',
    sortFn: (a: DataItem, b: DataItem) => a.RFPNumber - b.RFPNumber,
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'رقم المنافسة',
  },
  {
    id: 12,
    title: 'Etimad Number',
    sortFn: (a: DataItem, b: DataItem) => a.EtimadNo.localeCompare(b.EtimadNo),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'الرقم المرجعي في منصة اعتماد',
  },
  {
    id: 2,
    title: 'Reference number',
    sortFn: (a: DataItem, b: DataItem) => a.PurReqNo.localeCompare(b.PurReqNo),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'رقم طلب الشراء',
  },
  {
    id: 3,
    title: 'Method of Submission',
    titleAr: 'طريقة تقديم العروض',
  },
  {
    id: 4,
    title: 'Purchase method',
    titleAr: 'أسلوب الشراء',
  },
  {
    id: 4,
    title: 'Tender opening date',
    sortFn: (a: DataItem, b: DataItem) =>
      a.BidOpngDate.localeCompare(b.BidOpngDate),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'تاريخ الفتح',
  },

  {
    id: 7,
    title: 'Status',
    titleAr: 'الحالة',
    filterMultiple: true,
    listOfFilter: STATUS_FILTER,
    filterFn: (list: string[], item: DataItem) => list.some(name => item.TndrStatus.indexOf(name) !== -1)
  },
  {
    id: 13,
    title: 'Pending with',
    titleAr: 'قيد الانتظار مع',
  },
  {
    id: 5,
    title: 'Actions',
    titleAr: 'إجراءات',
  }

]

export const listOfColumnBdList = [
  {
    id: 1,
    title: 'RFP Number',
    sortFn: (a: DataItem, b: DataItem) =>
      a.RFPNumber.localeCompare(b.RFPNumber),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'رقم المنافسة',
  },
  {
    id: 2,
    title: 'Tender Name',
    titleAr: 'اسم المنافسة',
  },
  {
    id: 3,
    title: 'Tender Number',
    sortFn: (a: DataItem, b: DataItem) => a.TndrID.localeCompare(b.TndrID),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'رقم المنافسه في اللجان',
  },
  {
    id: 12,
    title: 'Etimad Number',
    sortFn: (a: DataItem, b: DataItem) => a.EtimadNo.localeCompare(b.EtimadNo),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'الرقم المرجعي في منصة اعتماد',
  },
  {
    id: 4,
    title: 'Status',
    titleAr: 'الحالة',
    filterMultiple: true,
    listOfFilter: STATUS_FILTER.map(filter => {
      if (filter.text === `Cancelled`) {
        return { ...filter, text: `Completed` };
      } else {
        return { ...filter };
      }
    }),
    listOfFilterAr: STATUS_FILTER_AR.map(filter => {
      if (filter.text === 'ألغيت') {
        return { ...filter, text: `مكتمل` };
      } else {
        return { ...filter };
      }
    }),
    filterFn: (list: string[], item: DataItem) => list.some(name => item.TndrStatus.indexOf(name) !== -1)
  },
  {
    id: 5,
    title: 'Opening Date',
    sortFn: (a: DataItem, b: DataItem) =>
      a.BidOpngDate.localeCompare(b.BidOpngDate),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'تاريخ الفتح',
  },
  {
    id: 7,
    title: 'Method of Submission',
    titleAr: 'طريقة تقديم العروض',
    listOfFilter: METHOD_OF_SUBMISSION,
    listOfFilterAr: METHOD_OF_SUBMISSION_AR,
    filterFn: (list: string, item: DataItem) => item.TndrTypeID.indexOf(list) !== -1
  },
  {
    id: 7,
    title: 'Purchase method',
    titleAr: 'أسلوب الشراء',
    filterMultiple: true,
    listOfFilter: PURCHASE_METHOD,
    listOfFilterAr: PURCHASE_METHOD_AR,
    filterFn: (list: string[], item: DataItem) => list.some(name => item.CompetitionTypeID.indexOf(name) !== -1)
  },
  {
    id: 8,
    title: 'Type of purchase',
    titleAr: 'نوع الشراء',
    listOfFilter: TYPE_OF_PURCHASE,
    listOfFilterAr: TYPE_OF_PURCHASE_AR,
    filterFn: (list: string, item: DataItem) => {
      return item.PurTypID === list;
    }
  },
  {
    id: 9,
    title: 'Pending with',
    titleAr: 'قيد الانتظار مع',
  },
  {
    id: 10,
    title: 'Download MoM',
    titleAr: 'تحميل المحضر',
  },

  {
    id: 11,
    title: 'SLA',
    titleAr: 'اتفاقية مستوي التشغيل',
    sortFn: (prev: DataItem, next: DataItem) => convertDaysHoursToMinutes(prev, next),
    sortDirections: ['ascend', 'descend', null],
  },
];



// export interface ColumnItem {
//   id: any;
//   sortOrder: NzTableSortOrder | null;
//   sortFn: NzTableSortFn<DataItem> | null;

//   sortDirections: NzTableSortOrder[];
// }

export interface DocParamsLevels {
  firstLevelId: string;
  firstLevelName: string;
  secondLevelId: string;
  secondLevelName: string;
  thirdLevelId: string;
  operation: string;
  editable: boolean;
  VendorGUID?: string;
}
export const listOfColumnCEO = [
  {
    id: 1,
    title: 'Tender Name',
    titleAr: 'اسم المنافسة',
  },
  {
    id: 11,
    title: 'RFP Number',
    sortFn: (a: DataItem, b: DataItem) => a.RFPNumber.localeCompare(b.RFPNumber),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'رقم المنافسة',
  },
  {
    id: 12,
    title: 'Etimad Number',
    sortFn: (a: DataItem, b: DataItem) => a.EtimadNo.localeCompare(b.EtimadNo),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'الرقم المرجعي في منصة اعتماد',
  },
  {
    id: 2,
    title: 'Reference number',
    titleAr: 'رقم طلب الشراء',
    sortFn: (a: DataItem, b: DataItem) => a.PurReqNo.localeCompare(b.PurReqNo),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 3,
    title: 'Method of Submission',
    titleAr: 'طريقة تقديم العروض',
  },
  {
    id: 4,
    title: 'Download MOM',
    titleAr: 'تحميل محضر',
  },
  {
    id: 6,
    title: 'Status',
    titleAr: 'الحالة',
    filterMultiple: true,
    listOfFilter: STATUS_FILTER,
    filterFn: (list: string[], item: DataItem) => list.some(name => item.RfpStatus.indexOf(name) !== -1)
  },

  {
    id: 7,
    title: 'Comments',
    titleAr: 'ملاحظات',
  },
  {
    id: 5,
    title: 'Actions',
    titleAr: 'إجراءات',
  },
  {
    id: 10,
    title: 'SLA',
    titleAr: 'اتفاقية مستوي التشغيل',
    sortFn: (prev: DataItem, next: DataItem) => {
      const preEndDate = prev.SlaEndDate ? Number(prev.SlaEndDate) : 0,
        nextEndDate = next.SlaEndDate ? Number(next.SlaEndDate) : 0;
      if (preEndDate > nextEndDate) {
        return -1;
      } else if (preEndDate < nextEndDate) {
        return 1;
      } else {
        return 0;
      }
    },
  },
];

export const listOfColumnBtQlt = [
  {
    id: 1,
    title: 'Tender Name',
    titleAr: 'اسم المنافسة',
  },
  {
    id: 11,
    title: 'RFP Number',
    sortFn: (a: DataItem, b: DataItem) => a.RFPNumber - b.RFPNumber,
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'رقم المنافسة',
  },
  {
    id: 12,
    title: 'Etimad Number',
    sortFn: (a: DataItem, b: DataItem) => a.EtimadNo.localeCompare(b.EtimadNo),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'الرقم المرجعي في منصة اعتماد',
  },
  {
    id: 2,
    title: 'Reference number',
    titleAr: 'رقم طلب الشراء',
    sortFn: (a: DataItem, b: DataItem) => a.PurReqNo.localeCompare(b.PurReqNo),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 3,
    title: 'Method of Submission',
    titleAr: 'طريقة تقديم العروض',
  },
  {
    id: 4,
    title: 'Purchase method',
    titleAr: 'أسلوب الشراء',
  },
  {
    id: 4,
    title: 'Tender opening date',
    sortFn: (a: DataItem, b: DataItem) =>
      a.BidOpngDate.localeCompare(b.BidOpngDate),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'تاريخ الفتح',
  },
  {
    id: 7,
    title: 'Status',
    titleAr: 'الحالة',
    filterMultiple: true,
    listOfFilter: STATUS_FILTER,
    filterFn: (list: string[], item: DataItem) => list.some(name => item.TndrStatus.indexOf(name) !== -1)
  },
  {
    id: 9,
    title: 'Pending with',
    titleAr: 'قيد الانتظار مع',
  },

  {
    id: 7,
    title: 'Assigned officer (Qualification)',
    titleAr: 'سكرتير لجنة التأهيل',
  },
  {
    id: 5,
    title: 'Actions',
    titleAr: 'إجراءات',
  },
  {
    id: 8,
    title: 'Download MoM',
    titleAr: 'تحميل المحضر',
  },
  {
    id: 10,
    title: 'SLA',
    titleAr: 'اتفاقية مستوي التشغيل',
    sortFn: (prev: DataItem, next: DataItem) => convertDaysHoursToMinutes(prev, next),
    sortDirections: ['ascend', 'descend', null],
  },
];

export const listOfColumnBtOpn = [
  {
    id: 1,
    title: 'Tender Name',
    titleAr: 'اسم المنافسة',
  },
  {
    id: 13,
    title: 'RFP Number',
    sortFn: (a: DataItem, b: DataItem) => a.RFPNumber - b.RFPNumber,
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'رقم المنافسة',
  },
  {
    id: 12,
    title: 'Etimad Number',
    sortFn: (a: DataItem, b: DataItem) => a.EtimadNo.localeCompare(b.EtimadNo),
    sortDirections: ['ascend', 'descend', null],
    titleAr: 'الرقم المرجعي في منصة اعتماد',
  },
  {
    id: 2,
    title: 'Reference number',
    titleAr: 'رقم طلب الشراء',
    sortFn: (a: DataItem, b: DataItem) => a.PurReqNo.localeCompare(b.PurReqNo),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 3,
    title: 'Method of Submission',
    titleAr: 'طريقة تقديم العروض',
  },
  {
    id: 4,
    title: 'Purchase method',
    titleAr: 'أسلوب الشراء',
  },
  {
    id: 4,
    title: 'Tender opening date',
    titleAr: 'تاريخ الفتح',
    sortFn: (a: DataItem, b: DataItem) =>
      a.BidOpngDate.localeCompare(b.BidOpngDate),
    sortDirections: ['ascend', 'descend', null],
  },
  {
    id: 7,
    title: 'Status',
    titleAr: 'الحالة',
    filterMultiple: true,
    listOfFilter: STATUS_FILTER,
    filterFn: (list: string[], item: DataItem) => list.some(name => item.TndrStatus.indexOf(name) !== -1)
  },
  {
    id: 5,
    title: 'Pending with',
    titleAr: 'قيد الانتظار مع',
  },
  {
    id: 6,
    title: 'Assigned officer (Opening)',
    titleAr: 'الموظف المسؤول',
  },
  {
    id: 5,
    title: 'Actions',
    titleAr: 'إجراءات',
  },
  {
    id: 8,
    title: 'Download MoM',
    titleAr: 'تحميل المحضر',
  },
  {
    id: 10,
    title: 'SLA',
    titleAr: 'اتفاقية مستوي التشغيل',
    sortFn: (prev: DataItem, next: DataItem) => {
      const preEndDate = prev.SLAEndDate?.valueOf() || 0, nextEndDate = next.SLAEndDate?.valueOf() || 0;
      if (preEndDate > nextEndDate) {
        return 1;
      } else if (preEndDate < nextEndDate) {
        return -1;
      } else {
        return 0;
      }
    },
  }
];

export const CheckList = [
  {
    CommitteeId: '',
    TenderId: '',
    VendorId: '',
    ChecklistId: '001',
    ChecklistName: 'Financial Offer',
    ChecklistNameAr: 'العرض المالي',
    ChecklistType: '01',
    ChklstTypeDesc: 'Not attached',
    ChklstTypeDesc_ar: 'غير مرفق',
    // to_VndrChkAtt: [],
    IsAttachmentValid: false,
    AttachmentFlag: false,
    //AttachFGChkListId: '10'
  },
  {
    CommitteeId: '',
    TenderId: '',
    VendorId: '',
    ChecklistId: '002',
    ChecklistName: 'Technical Offer',
    ChecklistNameAr: 'العرض الفني',
    ChecklistType: '01',
    ChklstTypeDesc: 'Not attached',
    ChklstTypeDesc_ar: 'غير مرفق',
    // to_VndrChkAtt: [],
    IsAttachmentValid: false,
    AttachmentFlag: false,
    //AttachFGChkListId: '11'
  },
  {
    CommitteeId: '',
    TenderId: '',
    VendorId: '',
    ChecklistId: '003',
    ChecklistName:
      'Proof of the establishments affiliation with the local small and medium enterprises category, if applicable',
    ChecklistNameAr:
      'اثبات انتساب المنشأة لفئة المنشآت الصغيرة والمتوسطة المحلية',
    ChecklistType: '01',
    ChklstTypeDesc: 'Not attached',
    ChklstTypeDesc_ar: 'غير مرفق',
    // to_VndrChkAtt: [],
    IsAttachmentValid: false,
    AttachmentFlag: false,
    //AttachFGChkListId: '08'
  },
  {
    CommitteeId: '',
    TenderId: '',
    VendorId: '',
    ChecklistId: '004',
    ChecklistName: 'Bank Guarantee',
    ChecklistNameAr: 'الضمان البنكي',
    ChecklistType: '01',
    ChklstTypeDesc: 'Not attached',
    ChklstTypeDesc_ar: 'غير مرفق',
    // to_VndrChkAtt: [],
    IsAttachmentValid: false,
    AttachmentFlag: false,
    //AttachFGChkListId: '07'
  },
  {
    CommitteeId: '',
    TenderId: '',
    VendorId: '',
    ChecklistId: '005',
    ChecklistName: 'Commercial register or statutory licenses',
    ChecklistNameAr: 'السجل التجاري أو التراخيص النظامية',
    ChecklistType: '01',
    ChklstTypeDesc: 'Not attached',
    ChklstTypeDesc_ar: 'غير مرفق',
    // to_VndrChkAtt: [],
    IsAttachmentValid: false,
    AttachmentFlag: false,
    //AttachFGChkListId: '01'
  },
  {
    CommitteeId: '',
    TenderId: '',
    VendorId: '',
    ChecklistId: '006',
    ChecklistName: 'Certificate of payment of zakat or tax or both',
    ChecklistNameAr: 'شهادة سداد الزكاة أو الضريبة أو كليهما',
    ChecklistType: '01',
    ChklstTypeDesc: 'Not attached',
    ChklstTypeDesc_ar: 'غير مرفق',
    // to_VndrChkAtt: [],
    IsAttachmentValid: false,
    AttachmentFlag: false,
    //AttachFGChkListId: '02'
  },
  {
    CommitteeId: '',
    TenderId: '',
    VendorId: '',
    ChecklistId: '007',
    ChecklistName: 'Certificate from the General Organization for Insurance',
    ChecklistNameAr: 'شهادة من المؤسسة العامة للتأمينات',
    ChecklistType: '01',
    ChklstTypeDesc: 'Not attached',
    ChklstTypeDesc_ar: 'غير مرفق',
    // to_VndrChkAtt: [],
    IsAttachmentValid: false,
    AttachmentFlag: false,
    //AttachFGChkListId: '03'
  },
  {
    CommitteeId: '',
    TenderId: '',
    VendorId: '',
    ChecklistId: '008',
    ChecklistName: 'Certificate of affiliation with the Chamber of Commerce',
    ChecklistNameAr: 'شهادة الانتساب إلى الغرفة التجارية',
    ChecklistType: '01',
    ChklstTypeDesc: 'Not attached',
    ChklstTypeDesc_ar: 'غير مرفق',
    // to_VndrChkAtt: [],
    IsAttachmentValid: false,
    AttachmentFlag: false,
    //AttachFGChkListId: '04'
  },
  // {
  //   CommitteeId: '',
  //   TenderId: '',
  //   VendorId: '',
  //   ChecklistId: '',
  //   ChecklistName:
  //     'Classification certificate in the field of business for which it is applied',
  //   ChecklistNameAr: 'شهادة تصنيف في مجال الأعمال المتقدم لها',
  //   ChecklistType: '01',
  //   ChklstTypeDesc: 'Not attached',
  //   ChklstTypeDesc_ar: 'غير مرفق',
  //   to_VndrChkAtt: [],
  //   IsAttachmentValid: false,
  //   AttachmentFlag: false,
  //   //AttachFGChkListId: '05'
  // },
  // {
  //   CommitteeId: '',
  //   TenderId: '',
  //   VendorId: '',
  //   ChecklistId: '',
  //   ChecklistName:
  //     'Certificate of affiliation with the Saudi Contractors Authority, if applicable',
  //   ChecklistNameAr: 'شهادة الانتساب إلى الهيئة السعودية للمقاولين',
  //   ChecklistType: '01',
  //   ChklstTypeDesc: 'Not attached',
  //   ChklstTypeDesc_ar: 'غير مرفق',
  //   to_VndrChkAtt: [],
  //   IsAttachmentValid: false,
  //   AttachmentFlag: false,
  //   //AttachFGChkListId: '06'
  // },

  {
    CommitteeId: '',
    TenderId: '',
    VendorId: '',
    ChecklistId: '009',
    ChecklistName:
      'Certificate of achieving the required percentage for Saudization of jobs',
    ChecklistNameAr: 'شهادة تحقيق النسبة المطلوبة لتوطين الوظائف',
    ChecklistType: '01',
    ChklstTypeDesc: 'Not attached',
    ChklstTypeDesc_ar: 'غير مرفق',
    // to_VndrChkAtt: [],
    IsAttachmentValid: false,
    AttachmentFlag: false,
    // AttachFGChkListId: '09'
  },
  {
    CommitteeId: '',
    TenderId: '',
    VendorId: '',
    ChecklistId: '010',
    ChecklistName: 'Others',
    ChecklistNameAr: 'أخرى',
    ChecklistType: '01',
    ChklstTypeDesc: 'Not attached',
    ChklstTypeDesc_ar: 'غير مرفق',
    // to_VndrChkAtt: [],
    IsAttachmentValid: false,
    AttachmentFlag: false,
    //AttachFGChkListId: '11'
  },
];

// export const  to_VndrChkLst = [
//   {
//     "CommitteeId": "01",
//     "TenderId": "0000000016",
//     "VendorId": "",
//     "ChecklistId": "01",
//     "ChecklistName": "Checklist1_ali",
//     "ChecklistNameAr":"ChecklistNameAr",
//     "ChecklistType": "01",
//     "to_VndrChkAtt": [
//         {
//             "CommitteeId": "01",
//             "TenderId": "0000000016",
//             "VendorId": "01",
//             "ChecklistId": "01",
//             "ChecklistAttachment": "XZ"
//         },
//         {
//           "CommitteeId": "01",
//           "TenderId": "0000000016",
//           "VendorId": "01",
//           "ChecklistId": "01",
//           "ChecklistAttachment": "ZzCX"
//       }
//     ]
//   },
//   {
//     "CommitteeId": "01",
//     "TenderId": "0000000016",
//     "VendorId": "",
//     "ChecklistId": "02",
//     "ChecklistName": "Checklist1",
//     "ChecklistType": "02",
//     "to_VndrChkAtt": [
//         {
//             "CommitteeId": "01",
//             "TenderId": "0000000016",
//             "VendorId": "01",
//             "ChecklistId": "02",
//             "ChecklistAttachment": "erreqeqwr"
//         },
//         {
//           "CommitteeId": "01",
//           "TenderId": "0000000016",
//           "VendorId": "01",
//           "ChecklistId": "02",
//           "ChecklistAttachment": "cvxcvdfd"
//       }
//     ]
//   }
// ]

export enum UserActionCode {
  assign = 'ASG',
  assignToBidOpening = 'ABO',
  assignToBidQualificaiton = 'ABQ',
  assignToTechnicalMember = 'ATM',
  assignToDirectPurchase = 'ADP',
  approve = 'APR',
  return = 'RET',
  retrunToTechnical = 'RET',
  returnToLegal = 'RLM',
  returnToFinance = 'RFM',
  draft = 'DFT',
  submit = 'SUB',
  submitToTechnicalMember = 'STM',
  submitToProcurementMember = 'SPM',
  submitToLegalMember = 'SLM',
  returnToProcurementMember = 'RPM',
  submitForFinalProcess = 'SFP',
  reject = 'REJ',
  assignToBidEvalCommittee = 'ABC',
  assignToBidOpeningCommittee = 'ABO',
  returnToSecretary = 'RTS',
  submitToChairman = 'STC',
  asignBacktoMember = 'ABM',
  cancelTender = 'CTR',
  assignToTechCommittee = 'ABT',
  assignFinancemember = 'AFM',
  approveForExternal = 'SFC',
  ceoApproval = 'CAP',
  purchasingManagerReturn = 'RET',
  purchasingManagerApproval = 'APR',
  purchasingUnitHeadApproval = 'APR',
}

export const REGEX = {
  TEN_DIGITS_POSITIVE_WHOLE_NUMBER: /^\d{10}$/,
  COMMERCIAL_NUMBER: /^[1-9]\d{9}$/
};

export const COMMITTEE_ROLE = {
  CHAIRMAN: `CH`,
  SECRETARY: `OF`,
  PROCUREMENT_MEMBER: `PM`,
  FINANCE_MEMBER: `FM`,
  LEGAL_MEMBER: `LM`,
  TECHNICAL_MEMBER: `TM`,
  VICE_PRESIDENT: `VP`,
  CEO: `CO`,
  DIRECTOR: `SS`,
};

export enum PROCESS_TYPES {
  RFP = 'RPF',
  COMMITTEE = 'COM',
  COC = 'COC',
  CONTRACT = 'CON'
}

export const SLA_OPTIONS = [{
  "key": PROCESS_TYPES.RFP,
  "type": "RFP LIST",
  "typeAr": "قائمة RFP"
},
{
  "key": PROCESS_TYPES.COMMITTEE,
  "type": "COMMITTEE LIST",
  "typeAr": "قائمة اللجان"
},
{
  "key": PROCESS_TYPES.COC,
  "type": "COC LIST",
  "typeAr": "قائمة COC"
},
{
  "key": PROCESS_TYPES.CONTRACT,
  "type": "CONTRACT LIST",
  "typeAr": "قائمة العقود"
}];


export enum SMETHRESHOLD {
  VALUE = 25000000
}




function convertDaysHoursToMinutes(prev: any, next: any) {
  let before = prev.SLAen, after = next.SLAen;

  if (prev.SLAen.indexOf("Days") != -1 || prev.SLAen.indexOf("Day") != -1) {

    const [days, hours] = prev?.SLAen.match(/\d+/g).map(Number);

    const totalHours = days * 24;

    const minutes = hours != undefined ? hours * 60 : 0;

    before = `${totalHours} Hours ${minutes} Minutes`;

  }
  if (next.SLAen.indexOf("Days") != -1 || next.SLAen.indexOf("Day") != -1) {
    const [days, hours] = next?.SLAen.match(/\d+/g).map(Number);

    const totalHours = days * 24;

    const minutes = hours != undefined ? hours * 60 : 0;

    after = `${totalHours} Hours ${minutes} Minutes`;

  }
  return before.localeCompare(after, 'en', { numeric: true });

}

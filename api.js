const config = require("config");

const SAP_PL_ALIAS = process.env.SAP_PL_ALIAS ? ";o=" + process.env.SAP_PL_ALIAS : config.SAP_PL_ALIAS ?? '';

const RFP_SRV = "ZMM_RFP_PRCS_SRV" + SAP_PL_ALIAS;
const RFP_LOGIN_SRV = "ZP2P_RFP_SRV" + SAP_PL_ALIAS;
const COC_SRV = "ZMM_COC_PRCS_SRV" + SAP_PL_ALIAS;
const COM_SRV = "ZMM_CMT_PRCS_SRV" + SAP_PL_ALIAS;
const CON_SRV = "ZMM_CONT_PRCS_SRV" + SAP_PL_ALIAS;
const CON_DOWN = "ZMM_P2P_VEND_AGREEMENT_SRV" + SAP_PL_ALIAS;
const OTP_SRV = "ZUNIFIED_OTP_SRV" + SAP_PL_ALIAS;
const ATTACH_SRV = "ZMM_P2P_ATTACHMENTS_SRV" + SAP_PL_ALIAS;
const ADMIN_SRV = "ZMM_P2P_ADMIN_SRV" + SAP_PL_ALIAS;
const FILE_SRV = "ZMM_FILES_PRCS2_SRV"
const CONTRACT_PRLIST = "ZP2P_CONT_CREAT_SRV_SRV" 
const DASHBOARD_SRV = "ZMM_DASHBOARD_PRCS_SRV" + SAP_PL_ALIAS;
const RFP_Standards_SRV="ZP2P_RFP2_SRV_02"+ SAP_PL_ALIAS;


module.exports.apiList = () => {
  let apis = {
    // * Get logged in user details
    GET_USER_DETAILS: config.URL + COM_SRV + "/ZC_P2P_CMT_USER_ROLEACSS",

    // * <--------*********************--------> *//
    // **************** / RFP / ***************** //
    // * <--------*********************--------> *//

    // * Login User Details
    LoginUserDetails: config.URL + RFP_LOGIN_SRV + "/LoginUserDetailsSet",

    // * Crete RFP
    projsGet: config.URL + RFP_SRV + "/F4ProjIdSet",
    budgetTypeGet: config.URL + RFP_SRV + "/ZC_P2P_RFP_F4_BUDGT_TYPE",
    F4DeptSet: config.URL + RFP_SRV + "/F4DeptSet",
    F4UsrListSet: config.URL + RFP_SRV + "/F4UsrListSet",
    F4CostCntrSet: config.URL + RFP_SRV + "/F4CostCntrSet",
    F4EstmSet: config.URL + RFP_SRV + "/F4EstmSet",
    F4UomSet: config.URL + RFP_SRV + "/F4UomSet",
    F4MatGrpSet: config.URL + RFP_SRV + "/F4MatGrpSet",
    F4PurGrpSet: config.URL + RFP_SRV + "/F4PurGrpSet",
    RfpHeaderSet: config.URL + RFP_SRV + "/RfpHeaderSet",
    RfpBudgetingSet: config.URL + RFP_SRV + "/Rfp_budg_srv_itmSet",
    RFPBudgetSplitSet: config.URL + RFP_SRV + "/Rfp_budg_itmSet",
    RFPCreatedBudgetSet: config.URL + RFP_SRV + "/Rfp_budg_srv_itm_finSet",
    RFPCreateBudget: config.URL + RFP_SRV + "/Rfp_budg_srv_itmSet",
    F4FinEvalSet: config.URL + RFP_SRV + "/F4FinEvalSet",
    F4CommitmentItem: config.URL + RFP_SRV + "/ZC_P2P_RFP_F4_COMTMNTITEM_MAP",
    commitmentItems: config.URL + RFP_SRV + "/ZC_P2P_RFP_F4_COMMITMENT_ITEM",
    setCommitmentItem: config.URL + RFP_SRV + "/RfpupdtcomitemSet",
    F4QualSet: config.URL + RFP_SRV + "/ZC_P2P_RFP_F4_QUALIFICATION",
    setProcurementDetails: config.URL + RFP_SRV + "/RFPprqeditSet",
    internalOrders: config.URL + RFP_SRV + "/ZC_P2P_RFP_F4_INTERNAL_ORDER",
    budgetSplitBasedonYears: config.URL + RFP_SRV + '/Rfp_budg_itmSet',
    getRoleAndDeptBasedOnRFP: config.URL + RFP_SRV + '/SrchRfpIndsSet',
    availableBudget: config.URL + RFP_SRV + '/RfpBudChkSet',

    // * Update RFP - Qualification Committee Finance Team
    RfpFinSet: config.URL + RFP_SRV + "/RfpFinSet",

    // * DownloadRFP -  Estimated Price PDF
    RfpEstmPriceSet : config.URL + RFP_SRV + "/RfpEstmPriceSet",

    // * Communication Details List
    CommunicationDetailsSet: config.URL + RFP_LOGIN_SRV + "/CommunicationDetailsSet",

    // * Basic Information Details
    BasicInformationDetailsSet: config.URL + RFP_LOGIN_SRV + "/BasicInformationDetailsSet",
    //Standards
   RFPNoSet:config.URL+RFP_Standards_SRV+"/RFPNoSet",
   //StandardsDetailsSet:config.URL+RFP_Standards_SRV+StandardsDetailsSet",


    // * Delete RFP ITEM TABLES
    RfpBoqSet: config.URL + RFP_SRV + "/RfpBoqSet",
    RfpMpwrSet: config.URL + RFP_SRV + "/RfpMpwrSet",
    RfpPaySet: config.URL + RFP_SRV + "/RfpPaySet",
    RfpQualSet: config.URL + RFP_SRV + "/RfpQualSet",
    RfpTechSet: config.URL + RFP_SRV + "/RfpTechSet",
    RfpTreqSet: config.URL + RFP_SRV + "/RfpTreqSet",
    RfpWorkSet: config.URL + RFP_SRV + "/RfpWorkSet",
    RfpAttchSet: config.URL + RFP_SRV + "/RfpAttchSet",

    // * MYRFP AND LIST RFP
    RfpHeaderSet: config.URL + RFP_SRV + "/RfpHeaderSet",

    // * RFP LIST FOR MANAGERS
    RfpManagerSet: config.URL + RFP_SRV + "/F4DeptMangSet",

    // * RFP Pending with Department List
    rfpPendingWithDept: config.URL + RFP_SRV + "/ZC_P2P_RFP_WFDPTLST",

    // * RFP User List
    rfpCreatorsList: config.URL + RFP_SRV + '/ZC_P2P_RFP_CRT_LST',

    // * RFP User List For Approve
    RfpWfUsrlstSet: config.URL + RFP_SRV + "/RfpWfUsrlstSet",

    // * GET RFP COMMENTS
    RfpCommentsSet: config.URL + RFP_SRV + "/RfpCommentsSet",

    // * Budget Allocation
    RfpBaHdr: config.URL + RFP_SRV + "/RfpBaHdrSet",
    RfpBaHdrSet: config.URL + RFP_SRV + "/RfpBaHdrSet",

    // * User Details
    userDetails: config.URL + COM_SRV + "/GetUserSet",

    // * <--------*********************--------> *//
    // **************** / COC / ***************** //
    // * <--------*********************--------> *//

    // projsGetBud : config.URL + "F4ProjIdSet?$filter=(ProjId eq '')&$format=json",

    // * COC dashboard
    CocLoginSet: config.URL + COC_SRV + "/CocLoginSet",
    CocDashboardSet: config.URL + COC_SRV + "/CocDashboardSet",
    CocProjOwnerPOSet: config.URL + COC_SRV + "/CocProjOwnerPOSet",
    CocProjCordinatorSet: config.URL + COC_SRV + "/CocProjCordinatorSet",

    // * Create COC
    CocFormSet: config.URL + COC_SRV + "/CocFormSet",
    CocCompletionSet: config.URL + COC_SRV + "/CocCompletionSet",
    CocDepartmentSet: config.URL + COC_SRV + "/CocDepartmentSet",
    CocOpenPoAndContractSet: config.URL + COC_SRV + "/CocOpenPoAndContractSet",
    CocOpenContractItemSet: config.URL + COC_SRV + "/CocOpenContractItemSet",
    CocOpenPoItemsSet: config.URL + COC_SRV + "/CocOpenPoItemsSet",
    CocPOList: config.URL + COC_SRV + "/CocOpenPoHeadSet",
    CocCommentsSet: config.URL + COC_SRV + "/CocCommentsSet",
    CocPDFSet: config.URL + COC_SRV + "/CocPDFSet",
    SesPDFSet: config.URL + COC_SRV + "/SesPDFSet",
    CocDashItemSet: config.URL + COC_SRV + "/CocDashItemSet",
    CocAttachSet: config.URL + COC_SRV + "/CocAttachSet",
    CocHistorySet: config.URL + COC_SRV + "/CocProcessHistorySet",
    CocSlaMaintenance : config.URL + ADMIN_SRV + "/ZC_P2P_COC_SLA_MAINT_DTS",
    CocSlaRole : config.URL + ADMIN_SRV + "/ZC_P2P_COC_ROLE_DTS",
    CocSlaUnit : config.URL + ADMIN_SRV + "/ZC_P2P_SLAUNIT_DTS",
    CocFormList: config.URL  + "/ZMM_COC_PRCS_SRV" + "/ZI_P2P_COC_FORM_EN",
    CocFormDownload: config.URL + COC_SRV ,
    CocuserList: config.URL + COC_SRV + '/ZC_P2P_COC_ACT_CUERS' ,
    CocFilteredUserList: config.URL + "/ZMM_COC_PRCS_SRV" + "/ZC_P2P_COC_USERS",

// * <--------*********************--------> *//
    // ************* / COMMITTEE / ************** //
    // * <--------*********************--------> *//

    // * Committee F4help
    F4_MEMBERS: config.URL + COM_SRV + "/ZC_P2P_CMT_F4_MEMBERS",
    F4_MEMBERS_COM: config.URL + COM_SRV + "/ZI_P2P_CMT_REQ_MEMBERS",
    F4_MEMBERS_SECRETARY: config.URL + COM_SRV + "/ZC_P2P_CMT_F4_MEMBERS",

    QUAL_CHKLST:  config.URL + COM_SRV + "/ZC_P2P_CMT_QUAL_CHKLST",
    PASSING_RATE: config.URL + COM_SRV + "/ZI_P2P_CMT_QUAL_PASSING_RATE",

    F4_CHKLST_TYPE: config.URL + COM_SRV + "/ZC_P2P_CMT_F4_CHKLST_TYPE",
    F4_CMTYPE: config.URL + COM_SRV + "/ZC_P2P_CMT_F4_CMTYPE",
    F4_RFPREAD: config.URL + COM_SRV + "/ZC_P2P_CMT_F4_RFPREAD",
    F4_TNDRTYPE: config.URL + COM_SRV + "/ZC_P2P_CMT_F4_TNDRTYPE",
    F4_CMT_CONST: config.URL + COM_SRV + "/ZC_P2P_CMT_CONSTANTS",
    F4_CMT_VENDORS: config.URL + COM_SRV + `/ZC_P2P_CMT_REQ_VNDRS`,
    F4_CMT_TECH_REQ_STS: config.URL + COM_SRV + "/ZC_P2P_CMT_TECH_REQ_STATUS",
    F4_CMT_USER_ROLE: config.URL + ADMIN_SRV + "/ZC_P2P_CMT_USER_ROLE_DTS",
    F4_CMT_USER_DTS: config.URL + ADMIN_SRV + "/ZC_P2P_CMT_F4_USERS",

    // * Committee  CREATE/UPDATE POST
    CrtUp_REQUEST: config.URL + COM_SRV + "/ZC_P2P_CMT_REQUEST",

    // * Comittee Dashboard
    Dash_List: config.URL + COM_SRV + "/ZC_P2P_CMT_RQST_LIST",

    // ZC_P2P_CMT_REQUEST: config.URL + COM_SRV+"/",
    // : config.URL + COM_SRV+"/",
    // : config.URL + COM_SRV+"/",
    // : config.URL + COM_SRV+"/",
    // : config.URL + COM_SRV+"/",

    //* Open committee
    OCOM_List: config.URL + COM_SRV + "/ZC_P2P_CMT_RQST_LIST",
    CMPTN_TYPE: config.URL + COM_SRV + "/ZC_P2P_CMT_F4_CMPTN_TYPE",
    CMPTN_FINSTMNT_TYPE: config.URL + COM_SRV + "/ZC_P2P_CMT_F4_FINSTMNT_CRT",
    ADMIN_List: config.URL + COM_SRV + "/ZC_P2P_CMT_SUBSTITUTE_USR_LIST",
    ADMIN_USERS_LIST: config.URL + COM_SRV + "/ZC_P2P_CMT_USERS_LIST",
    ADMIN_ROLES_LIST: config.URL + COM_SRV + "/ZC_P2P_CMT_USERS_LIST",
    RFP_IT_CHECKLIST: config.URL + RFP_SRV + "/ZC_P2P_RFP_F4_CHECKLIST",
    SLA_LIST: config.URL + ADMIN_SRV + "/Rfp_sla_dts1Set?",
    SLA_UPDATE: config.URL + ADMIN_SRV + "/Rfp_sla_dts1Set?",
    COMMITTEE_SLA_LIST: config.URL + ADMIN_SRV + "/cmt_sla_dtsSet?",
    COMMITTEE_SLA_UPDATE: config.URL + ADMIN_SRV + "/cmt_sla_dtsSet?",
    CONTRACT_SLA_LIST: config.URL + ADMIN_SRV + "/cont_sla_dtsSet?",
    CONTRACT_SLA_UPDATE: config.URL + ADMIN_SRV + "/cont_sla_dtsSet?",


    // * Evaluation Committee
    getEvaluationWeightage: config.URL + COM_SRV + "/CMtgetweightageSet",
    getMOMTypes: config.URL + COM_SRV + '/ZI_P2P_CMT_MOMTYPE',
    getfinalApprovalList: config.URL + COM_SRV + '/ZI_P2P_CMT_FINAL_APP',
    getLocalContentList:  config.URL + COM_SRV + '/ZI_P2P_CMT_LOCAL_CONTENT',

    //* Admin api routes
    ADMIN_ROLE: config.URL + ADMIN_SRV + "/ZC_P2P_ADMN_USER_ROLEACSS",
    ADMIN_TASK_LIST: config.URL + ADMIN_SRV + "/ZC_P2P_ADMN_RFP_TASKLIST",
    ADMIN_USER_LIST: config.URL + ADMIN_SRV + "/ZC_P2P_ADMN_RFP_USRLST",
    ADMIN_COM_MEMBER_MAINT: config.URL + ADMIN_SRV + "/ZC_P2P_CMT_USERS_DTS",

    // * Read tender details and create and update bids
    TEND_DETAIL: config.URL + COM_SRV + "/ZC_P2P_CMT_REQUEST",
    GET_GUID: config.URL + COM_SRV + "/CommitteeGUID",

    // * Committee MOM service download
    GET_MOM: config.URL + COM_SRV + "/CmtMOMDownload",

    // * Signature
    SIGNATURE_ENDPOINT: config.URL + COM_SRV + "/UserSignature",

    // * GET COMMENTS
    GET_CMTS: config.URL + COM_SRV + "/ZI_P2P_CMT_REQ_CMNTS",

    // * Post comment
    POST_CMTS: config.URL + COM_SRV + "/ZI_P2P_CMT_REQ_CMNTS",

    // *OTP
    GET_OTP: config.URL + OTP_SRV + "/ReqstSet",

    // * Delete Vendor API
    DELET_VENDOR: config.URL + COM_SRV + "/ZC_P2P_CMT_REQ_VNDRS",


    // * Vendor
    vendorDetails: config.URL + COM_SRV + '/ZC_P2P_CMT_BP_DTS',

    // * GL Account
    glAccount: config.URL + COM_SRV + '/ZC_P2P_CMT_GL_LST',

    // * Doc operations
    uploadDocumentByDocumentId: config.URL + ATTACH_SRV + "/DocumentListSet",
    documentDetailsGet:
      config.URL +
      ATTACH_SRV +
      "/DocHeaderSet(HeaderKey='$HeaderKey',ItemKey='$ItemKey',EntityId='$EntityId',EntityName='$EntityName',RelatedEntityName='$RelatedEntityName',RelatedEntityId='$RelatedEntityId',DefId='$DefId')?&$format=json&$expand=DocumentListSet",

    // contract

    // Contract Login
    contractLogin: config.URL + CON_SRV + "/UserLoginSet",

    //Get List of Contract
    CONT_GETLIST: config.URL + CON_SRV,
    CONT_DOWNLOAD: config.URL + CON_DOWN,
    CONTRACT_PRLIST_FETCH: config.URL + CONTRACT_PRLIST + '/F4_PR_RFPSet' ,
    DETAILS_FOR_CONTRACT_CREATION: config.URL + 'ZP2P_CONT_CREAT_SRV_SRV',
    CREATE_CONTRACT: config.URL + 'ZP2P_CONT_CREAT_SRV_SRV',

    //Contract signature and initial

    CONT_GET_SIGNATURE_INITIAL: config.URL + CON_SRV + "/UserSignaturesSet",
    CONT_ADD_SIGNATURE_INITIAL: config.URL + CON_SRV + "/UserSignaturesSet",

    // Bank list
    bankList: config.URL + CON_SRV + "/ZC_P2P_CONT_F4_BANK_LIST",

    // SAP File System
    SAP_FILE: config.URL + FILE_SRV + "/FilesSet",


    // * Dashboard
    getCardVisibility: config.URL + DASHBOARD_SRV + "/DashVisibilitySet",
    getDashboardDetails: config.URL + DASHBOARD_SRV + "/Dashboard_DetailsSet",
    getDashboardRfpDetails: config.URL + DASHBOARD_SRV + "/Dashboard_Rfp_Details_v1Set",
    getDashboardTenderDetails: config.URL + DASHBOARD_SRV + "/TotTndrCardSet",
    getDashboardContractDetails: config.URL + DASHBOARD_SRV + "/P2PContDetailsSet",
    getDashboardContracSAPDetails: config.URL + DASHBOARD_SRV + "/TotContCardSet",
    getDashboardCocDetails: config.URL + DASHBOARD_SRV + "/TotCocDtsSet",
    getVendorList: config.URL + DASHBOARD_SRV + "/VendorLookupSet",
    getVendorDetails: config.URL + DASHBOARD_SRV + "/VndrDtsSet",
    committeeLookup: config.URL + DASHBOARD_SRV + "/CommitteeListLookupSet",
    contractStatusLookup: config.URL + DASHBOARD_SRV + "/ContStatusLookupSet"

  };
  return JSON.stringify(apis);
};

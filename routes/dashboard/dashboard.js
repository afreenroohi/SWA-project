const express = require("express");
const router = express.Router();
const axios = require("axios");
const utility = require("../../utilities/utility");
const api = require("../../api");

let apisJson = {};
apisJson = JSON.parse(api.apiList());

const expandFields = {
    TotRfpByDpt: "RfpByDptChrt/RfpByDptChrtVal",
    TotRfpByMonth: "RfpByMonthChrt/RfpByMonthChrtVal",
    TotTndrByMonth: "TndrByMonthChrt/TndrByMonthChrtVal",
    TotTndrByCmt: "TndrByCmtChrt/TndrByCmtChrtVal",
    TopVndrs: "TopVndrChrt/TopVndrChrtVal",
    TotContByMonth: "ContByMonthChrt/ContByMonthChrtVal",
    TotAmtByMonth: "TotAmtByMonthChrt/TotAmtByMonthChrtVal"
}

router.get("/dashboard/card-list", (req, res) => {
    axios({
        method: "get",
        url: apisJson.getCardVisibility + 
        `(Lgdinusr='${req.query.userid ?? ''}')?$format=json`,
        headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
        },
    }).then(async (response) => {
        const cardVisibility = await utility.deleteMeta(response.data.d)
        res.status(200).send(cardVisibility);
    }
    ).catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.stackText || error.message || 'Internal Server Error' });
    });
});

router.get("/dashboard/cards", (req, res) => {
    const userId = req.query.userid ?? '';
    const year = req.query.year ?? '';
    const cards = req.query.cards ?? '';
    if (!userId || !year || !cards) {
        return res.status(400).json({ message: "Missing required query parameters." });
    }
    const filter = `(userId eq '${userId}' and year eq '${year}' and ${cards})`;
    const expand = `$expand=rfpDetails`;
    const url = `${apisJson.getDashboardDetails}?${expand}&$filter=${filter}&$format=json`;
    axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
        }
    }).then(async (response) => {
        const cards = await utility.deleteMeta(response.data.d.results);
        const dashboardCards = await utility.transform(cards[0], 
            ['TotalRfpCount', 'TotalPrCount', 'TotalTndrCount', 'TotalContSapCount', 'TotalContP2pCount', 
                'TotalContaprP2pCount', 'TotalCocCount']);
        res.status(200).send(dashboardCards);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.stackText || error.message || 'Internal Server Error' });
    });
});

router.get("/dashboard/rfp", (req, res) => {

    const username = req.query.userid ?? '';
    const year = req.query.year ?? '';
    const page = req.query.page ?? '';
    const count = req.query.count ?? '';
    const filter = req.query.filter ?? '';
    const filterSet = filter !== '' ? `and ${filter}` : '';
    const sort = req.query.sort ?? '';
    const sortBy = sort !== '' ? `and ${sort}` : '';
    const search = req.query.search ?? '';

    if (!username || !year) {
        return res.status(400).json({ message: "Missing required query parameters." });
    }


    let url = apisJson.getDashboardRfpDetails + `?$filter=userId eq '${username}' and year eq '${year}' and SearchField eq '${encodeURIComponent(search)}'${filterSet}${sortBy}`

    if (page && count) {
        url += `&$skip=${(page-1)*count}&$top=${count}`
    }

    url += '&$inlinecount=allpages&$format=json'

    axios({
        method: "get",
        url: url,
        headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
        },
    }).then(async (response) => {

        const list = await utility.transform(utility.deleteMeta(response.data.d.results), 
        ['rfpNo', 'PurchaseReqNo', 'rfpAmount', 'DeptText', 'projName', 'CreatedOn', 
            'CreatedByNameEn', 'CreatedByNameAr', 'CwfDeptEn', 'CwfDeptAr', 'CwfUserNameEn', 'CwfUserNameAr'])
        const transformedList = list.map((rfp) => {
            return {
                projectName: rfp.projName,
                rfpNumber: rfp.rfpNo,
                prNumber: rfp.PurchaseReqNo,
                department: rfp.DeptText,
                createdBy: {
                    en: rfp.CreatedByNameEn,
                    ar: rfp.CreatedByNameAr
                },
                pendingWithUser: {
                    en: rfp.CwfUserNameEn,
                    ar: rfp.CwfUserNameAr
                },
                pendingWithDept: {
                    en: rfp.CwfDeptEn,
                    ar: rfp.CwfDeptAr
                },
                createdOn: rfp.CreatedOn
            }
        })
        res.status(200).json({
            count: Number(response.data.d.__count),
            list: transformedList
        });

    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.stackText || error.message || 'Internal Server Error' });
    })

})


router.get("/dashboard/tender", (req, res) => {

    const username = req.query.userid ?? '';
    const year = req.query.year ?? '';
    const page = req.query.page ?? '';
    const count = req.query.count ?? '';
    const filter = req.query.filter ?? '';
    const filterSet = filter !== '' ? `and ${filter}` : '';
    const sort = req.query.sort ?? '';
    const sortBy = sort !== '' ? `and ${sort}` : '';
    const search = req.query.search ?? '';

    if (!username || !year) {
        return res.status(400).json({ message: "Missing required query parameters." });
    }


    let url = apisJson.getDashboardTenderDetails + `?$filter=UserId eq '${username}' and Year eq '${year}' and SearchField eq '${encodeURIComponent(search)}'${filterSet}${sortBy}`

    if (page && count) {
        url += `&$skip=${(page-1)*count}&$top=${count}`
    }

    url += '&$inlinecount=allpages&$format=json'

    axios({
        method: "get",
        url: url,
        headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
        },
    }).then(async (response) => {

        const list = await utility.transform(utility.deleteMeta(response.data.d.results), 
        [
            'TenderName', 'TenderId', 'RfpNo', 'PurchaseType', 'PurchaseTypeAr', 'PrNum', 'OpeningDate', 
            'Status', 'StatusAr', 'PendingWithCommitteeEn', 'PendingWithCommitteeAr',
            'PendingWithUserEn', 'PendingWithUserAr', 'TndrTypeDescEn',
            'TndrTypeDescAr', 'CompetitionTypeDescEn', 'CompetitionTypeDescAr'
        ])
        const transformedList = list.map((tender) => {
            return {
                projectName: tender.TenderName,
                tenderId: tender.TenderId,
                rfpNumber: tender.RfpNo,
                prNumber: tender.PrNum,
                typeofTender: {
                    en: tender.PurchaseType,
                    ar: tender.PurchaseTypeAr
                },
                openingDate: tender.OpeningDate,
                status: {
                    en: tender.Status,
                    ar: tender.StatusAr
                },
                pendingWithCommittee: {
                    en: tender.PendingWithCommitteeEn,
                    ar: tender.PendingWithCommitteeAr
                },
                pendingWithUser: {
                    en: tender.PendingWithUserEn,
                    ar: tender.PendingWithUserAr
                },
                tenderType: {
                    en: tender.TndrTypeDescEn,
                    ar: tender.TndrTypeDescAr
                },
                competitionType: {
                    en: tender.CompetitionTypeDescEn,
                    ar: tender.CompetitionTypeDescAr
                }
            }
        })
        res.status(200).json({
            count: Number(response.data.d.__count),
            list: transformedList
        });

    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.stackText || error.message || 'Internal Server Error' });
    })

})

router.get("/dashboard/contract", (req, res) => {

    const username = req.query.userid ?? '';
    const year = req.query.year ?? '';
    const page = req.query.page ?? '';
    const count = req.query.count ?? '';
    const filter = req.query.filter ?? '';
    const filterSet = filter !== '' ? ` and ${filter}` : '';
    const sort = req.query.sort ?? '';
    const sortBy = sort !== '' ? ` and ${sort}` : '';
    const search = req.query.search ?? '';

    if (!username || !year) {
        return res.status(400).json({ message: "Missing required query parameters." });
    }


    let url = apisJson.getDashboardContractDetails + `?$filter=UserId eq '${username}' and Year eq '${year}' and SearchField eq '${encodeURIComponent(search)}'${filterSet}${sortBy}`

    if (page && count) {
        url += `&$skip=${(page-1)*count}&$top=${count}`
    }

    url += '&$inlinecount=allpages&$format=json'

    axios({
        method: "get",
        url: url,
        headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
        },
    }).then(async (response) => {

        const list = await utility.transform(utility.deleteMeta(response.data.d.results), 
        [
            'ProjName', 'AwardNum', 'PurreqNum', 'TotalValue', 'VendorName', 'ProjTypeEn', 'ProjTypeAr',
            'PendingWithNameEn', 'PendingWithNameAr', 'PendingWithRoleAr', 'PendingWithRoleEn', 
            'StatusDecEn', 'StatusDecAr'
        ])
        const transformedList = list.map((contract) => {
            return {
                contractName: contract.ProjName,
                contractNumber: contract.AwardNum,
                prNumber: contract.PurreqNum,
                contractAmount: contract.TotalValue,
                vendorName: contract.VendorName,
                projectType: {
                    en: contract.ProjTypeEn,
                    ar: contract.ProjTypeAr
                },
                pendingWithUser: {
                    en: contract.PendingWithNameEn,
                    ar: contract.PendingWithNameAr
                },
                pendingWithRole: {
                    en: contract.PendingWithRoleEn,
                    ar: contract.PendingWithRoleAr
                },
                status: {
                    en: contract.StatusDecEn,
                    ar: contract.StatusDecAr
                }
            }
        })
        res.status(200).json({
            count: Number(response.data.d.__count),
            list: transformedList
        });

    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.stackText || error.message || 'Internal Server Error' });
    })

})

router.get("/dashboard/contractSAP", (req, res) => {

    const username = req.query.userid ?? '';
    const year = req.query.year ?? '';
    const page = req.query.page ?? '';
    const count = req.query.count ?? '';
    const filter = req.query.filter ?? '';
    const filterSet = filter !== '' ? `and ${filter}` : '';
    const sort = req.query.sort ?? '';
    const sortBy = sort !== '' ? `and ${sort}` : '';
    const search = req.query.search ?? '';

    if (!username || !year) {
        return res.status(400).json({ message: "Missing required query parameters." });
    }


    let url = apisJson.getDashboardContracSAPDetails + `?$filter=UserId eq '${username}' and Year eq '${year}' and SearchField eq '${encodeURIComponent(search)}'${filterSet}${sortBy}`

    if (page && count) {
        url += `&$skip=${(page-1)*count}&$top=${count}`
    }

    url += '&$inlinecount=allpages&$format=json'

    axios({
        method: "get",
        url: url,
        headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
        },
    }).then(async (response) => {

        const list = await utility.transform(utility.deleteMeta(response.data.d.results), 
        ['ContNumber', 'TargetVal', 'VndrName', 'PrNum', 'CreatedOn', 'ValidityStartDt', 'ValidityEndDt'])
        const transformedList = list.map((contract) => {
            return {
                contractNumber: contract.ContNumber,
                vendorName: contract.VndrName,
                prNumber: contract.PrNum,
                targetValue: contract.TargetVal,
                createdOn: contract.CreatedOn,
                valStartDate: contract.ValidityStartDt,
                valEndDate: contract.ValidityEndDt
            }
        })
        res.status(200).json({
            count: Number(response.data.d.__count),
            list: transformedList
        });

    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.stackText || error.message || 'Internal Server Error' });
    })    

})

router.get("/dashboard/coc", (req, res) => {

    const username = req.query.userid ?? '';
    const year = req.query.year ?? '';
    const page = req.query.page ?? '';
    const count = req.query.count ?? '';
    const filter = req.query.filter ?? '';
    const filterSet = filter !== '' ? `and ${filter}` : '';
    const sort = req.query.sort ?? '';
    const sortBy = sort !== '' ? `and ${sort}` : '';
    const search = req.query.search ?? '';

    if (!username || !year) {
        return res.status(400).json({ message: "Missing required query parameters." });
    }


    let url = apisJson.getDashboardCocDetails + `?$filter=UserId eq '${username}' and Year eq '${year}' and SearchField eq '${encodeURIComponent(search)}'${filterSet}${sortBy}`

    if (page && count) {
        url += `&$skip=${(page-1)*count}&$top=${count}`
    }

    url += '&$inlinecount=allpages&$format=json'

    axios({
        method: "get",
        url: url,
        headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
        },
    }).then(async (response) => {

        const list = await utility.transform(utility.deleteMeta(response.data.d.results), 
        [
            'Phase', 'CocNum', 'PoNum', 'SesNum', 'CocAmount', 'CreatedOn', 'StatusDecEn',
            'StatusDecAr', 'PendingWithNameEn', 'PendingWithNameAr'
        ])
        const transformedList = list.map((coc) => {
            return {
                phaseName: coc.Phase,
                cocNumber: coc.CocNum,
                poNumber: coc.PoNum,
                sesNumber: coc.SesNum,
                cocAmount: coc.CocAmount,
                createdOn: coc.CreatedOn,
                status: {
                    en: coc.StatusDecEn,
                    ar: coc.StatusDecAr
                },
                pendingWithUser: {
                    en: coc.PendingWithNameEn,
                    ar: coc.PendingWithNameAr
                }
            }
        })
        res.status(200).json({
            count: Number(response.data.d.__count),
            list: transformedList
        });

    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.stackText || error.message || 'Internal Server Error' });
    })


});

router.get("/dashboard/vendor-list", (req, res) => {

    axios({
        method: "get",
        url: apisJson.getVendorList + "?$format=json",
        headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
        }
    }).then((response) => {
        const vendorList = utility.deleteMeta(response.data.d.results);
        res.status(200).json(vendorList)
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.stackText || error.message || 'Internal Server Error' });
    })

});

router.get("/dashboard/vendor-details", (req, res) => {

    const vendorId = req.query.vendorID;
    const year = req.query.year;

    if (!vendorId || !year) {
        return res.status(400).json({ message: "Missing required query parameters." });
    }

    axios({
        method: "get",
        url: apisJson.getVendorDetails + '?$expand=ToVndrConDts/ToVndrPoDts,ToVndrConDts/ToVndrPrDts' + 
        `&$filter=(VendorId eq '${vendorId}' and Year eq '${year}')` + '&$format=json',
        headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
        }
    }).then(async (response) => {
        const vendorDetails = await utility.deleteMeta(response.data.d.results[0]);
        const contractDetails = await utility.deleteMeta(vendorDetails.ToVndrConDts.results);
        const transformedData = {
            vendorID: vendorDetails.VendorId,
            vendorName: vendorDetails.VendorName,
            city: vendorDetails.CityName,
            country: {
                en: vendorDetails.CountryNameEn,
                ar: vendorDetails.CountryNameAr
            },
            postalCode: vendorDetails.PostalCode,
            email: vendorDetails.EmailAddress,
            phoneNumber: vendorDetails.MobilePhoneNumber,
            countryCode: vendorDetails.MobilePhoneCountry,
            contractDetails: contractDetails.map((contract) => {
                return {
                    contractNumber: contract.ContractNumber,
                    agreementDate: contract.AgreementDate,
                    startDate: contract.ValidityStartDate,
                    endDate: contract.ValidityEndDate,
                    targetValue: contract.TargetValue,
                    po: contract.ToVndrPoDts.results.filter(po => po.PoNumber).map(po => po.PoNumber),
                    pr: contract.ToVndrPrDts.results.filter(pr => pr.PrNumber).map(pr => pr.PrNumber)
                }
            })
        }
        res.status(200).json(transformedData);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.stackText || error.message || 'Internal Server Error' });
    })    

})

router.get("/dashboard/committee-lookup", (req, res) => {

    axios({
        method: "get",
        url: apisJson.committeeLookup + "?$format=json",
        headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
        }
    }).then((response) => {
        const committeeList = utility.deleteMeta(response.data.d.results);
        const transformedList = committeeList.map((committee) => {
            return {
                value: committee.CommitteeId,
                label: {
                    en: committee.CommitteeDesEn,
                    ar: committee.CommitteeDesAr
                }
            }
        })
        res.status(200).json(transformedList)
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.stackText || error.message || 'Internal Server Error' });
    }) 

});

router.get("/dashboard/contract-status-lookup", (req, res) => {

    axios({
        method: "get",
        url: apisJson.contractStatusLookup + "?$format=json",
        headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
        }
    }).then((response) => {
        const statusList = utility.deleteMeta(response.data.d.results);
        const transformedList = statusList.map((status) => {
            return {
                value: status.Status,
                label: {
                    en: status.StatusDecEn,
                    ar: status.StatusDecAr
                }
            }
        })
        res.status(200).json(transformedList)
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.stackText || error.message || 'Internal Server Error' });
    }) 

});

router.get("/dashboard/:chartName", async (req, res) => {
    const userId = req.query.userid ?? '';
    const year = req.query.year ?? '';
    const filterSet = req.query.filter ?? ''
    const chartName = req.params.chartName;

    // Basic validation
    if (!userId || !year || !chartName) {
        return res.status(400).json({ message: "Missing required query parameters." });
    }
  
    const filter = filterSet !== '' ? 
    `(userId eq '${userId}' and year eq '${year}' and ${chartName} eq 'X' and ${filterSet})` 
    : `(userId eq '${userId}' and year eq '${year}' and ${chartName} eq 'X')`;
    const expand = `$expand=${expandFields[chartName]}`;
    const url = `${apisJson.getDashboardDetails}?${expand}&$filter=${filter}&$format=json`;

    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: req.headers.authorization,
            }
        });

        const [key1, key2] = expandFields[chartName].split('/')
        const details = await getChartData(response.data.d.results[0][key1]['results'][0], key2)
        res.status(200).send(details);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.stackText || error.message || 'Internal Server Error' });
    }
});


const getChartData = async (data, field) => {

    const getValues = (array) => {
        const xValues = [];
        const yValues = [];
        const xIds = [];
        if (array && array.length > 0) {
            array.forEach((value)=> {
                xValues.push({en: value.Xvalues ?? '', ar: value.XvaluesAr ?? ''})
                yValues.push({en: value.Yvalues ?? '', ar: value.YvaluesAr ?? ''})
                xIds.push(value.XvaluesId)
            })
        }
        return {
            xValues,
            yValues,
            xIds
        }
    }
    if (data) {
        const details = await utility.deleteMeta(data)
        const xAxis = {
            en: details.Xaxis,
            ar: details.XaxisAr
        }
        const yAxis = {
            en: details.Yaxis,
            ar: details.YaxisAr
        }
        const { xValues, yValues, xIds } = getValues(details[field]['results']); 
        return {
            xAxis: xAxis,
            yAxis: yAxis,
            xValues: xValues,
            yValues: yValues,
            xIds: xIds
        };
    }
    return {
        xAxis: {
            en: "",
            ar: ""
        },
        yAxis: {
            en: "",
            ar: ""
        },
        xValues: [],
        yValues: [],
        xIds: []
    }
}

module.exports = router;
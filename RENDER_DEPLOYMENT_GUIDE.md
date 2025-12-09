# Render Deployment Guide - SAP Connection Fix

## Problem
API calls fail on Render with error: `getaddrinfo ENOTFOUND dxbktlds4cp.kcloud.com`

Reason: Internal SAP server (`dxbktlds4cp.KCLOUD.COM`) is not accessible from Render's servers.

## Solutions

### Solution 1: Use Public SAP Gateway (Recommended if available)

1. **Render Dashboard** pe jao → Your Service → Environment
2. Add these environment variables:

```
NODE_ENV=production
PORT=10000
SAP_HOST=<your-public-sap-gateway-url>
SAP_PORT=443
SAP_PROTOCOL=https
```

3. Update `config/prd.json`:
```json
{
    "PORT": "10000",
    "HOSTNAME": "0.0.0.0",
    "URL": "https://<your-public-sap-gateway>/sap/opu/odata/sap/",
    "SAP_PL_ALIAS": ";o=FIORI"   
}
```

### Solution 2: VPN/Tunnel Setup

Agar SAP server sirf internal network pe hai:

1. **AWS VPN** ya **Cloudflare Tunnel** setup karo
2. SAP server ko public endpoint se expose karo (securely)
3. Render environment variables me public URL add karo

### Solution 3: Mock API for Testing

Testing ke liye mock API use karo:

1. Render Environment Variables:
```
USE_MOCK_API=true
```

2. Code me condition add karo (already implemented below)

### Solution 4: Hybrid Architecture

- Frontend: Render pe deploy karo
- Backend: On-premise server pe rakho (jo SAP access kar sake)
- Frontend se on-premise backend ko call karo

## Quick Fix - Mock API Implementation

Agar abhi test karna hai, to yeh changes karo:


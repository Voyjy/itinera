# Digital Asset Links Setup Guide

This guide explains how to set up Digital Asset Links for the Itinera TWA app **without modifying your web repository**.

## What is Digital Asset Links?

Digital Asset Links (DAL) is a way to verify the association between your Android app and your website. Once verified, the TWA will launch in **full-screen mode** without any browser UI.

## The assetlinks.json File

You need to host a file at exactly this URL:
```
https://your-domain.com/.well-known/assetlinks.json
```

### File Content Template

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.itinera.app",
    "sha256_cert_fingerprints": [
      "REPLACE_WITH_YOUR_SHA256_FINGERPRINT"
    ]
  }
}]
```

### Getting Your SHA-256 Fingerprint

**For Debug Builds:**
```bash
# Windows
keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android

# macOS/Linux
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android
```

**For Release Builds:**
```bash
keytool -list -v -keystore keystore/itinera-release.keystore -alias itinera
```

Copy the `SHA256:` fingerprint (format: `AB:CD:12:34:56:...`).

---

## Hosting Options (NO Web Code Changes)

### Option 1: Vercel Static File Configuration

If your website is hosted on **Vercel**, create a `vercel.json` in your deployment:

1. In your Vercel dashboard, go to **Project Settings → Environment Variables**
2. Or use the Vercel CLI to deploy a static config

**Option A - Add file via Vercel Dashboard:**
- Go to your project in Vercel
- Navigate to **Settings → Headers**
- Add a rewrite/static file rule

**Option B - Create a separate public folder deployment:**

Create a new folder (NOT in your web repo):
```
assetlinks-host/
├── .well-known/
│   └── assetlinks.json
└── vercel.json
```

`vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/$1" }
  ],
  "headers": [
    {
      "source": "/.well-known/assetlinks.json",
      "headers": [
        { "key": "Content-Type", "value": "application/json" },
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

**Note:** This must be deployed to the SAME domain as your website.

---

### Option 2: Netlify \_headers File

If using **Netlify**, you can add files to the `public/` folder or use Netlify's redirect rules.

**Using Netlify Functions or Edge:**

1. Create a Netlify Edge Function to serve the file:

```javascript
// netlify/edge-functions/assetlinks.js
export default async (request, context) => {
  const assetlinks = [{
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.itinera.app",
      "sha256_cert_fingerprints": [
        "YOUR_SHA256_FINGERPRINT"
      ]
    }
  }];
  
  return new Response(JSON.stringify(assetlinks), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
};

export const config = {
  path: "/.well-known/assetlinks.json"
};
```

2. Deploy via Netlify dashboard without touching the main web repo.

---

### Option 3: Cloudflare Pages

**Using Cloudflare Workers:**

1. Go to Cloudflare Dashboard → Workers & Pages → Create Worker
2. Create a worker for your domain that serves the assetlinks.json:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/.well-known/assetlinks.json') {
      const assetlinks = [{
        "relation": ["delegate_permission/common.handle_all_urls"],
        "target": {
          "namespace": "android_app",
          "package_name": "com.itinera.app",
          "sha256_cert_fingerprints": [
            "YOUR_SHA256_FINGERPRINT"
          ]
        }
      }];
      
      return new Response(JSON.stringify(assetlinks), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
    // Pass through other requests
    return fetch(request);
  }
}
```

3. Add a route to trigger this worker for `/.well-known/*`

---

### Option 4: Hosting Provider's File Upload

Many hostsing providers allow uploading static files via their dashboard:

- **Firebase Hosting**: Add to `firebase.json` rewrites
- **AWS S3 + CloudFront**: Upload file to `.well-known/` in S3 bucket
- **GitHub Pages**: Add file to `.well-known/` folder in gh-pages branch

---

### Option 5: DNS TXT Record (Alternative Verification)

Google also supports verification via DNS TXT records as an alternative to `.well-known`:

1. Add a TXT record to your DNS:
   ```
   _assetlinks.your-domain.com TXT "android:...your-fingerprint..."
   ```

**However, this is less common and the file-based method is recommended.**

---

## Important Notes

### Same Origin Requirement

The `assetlinks.json` file **MUST** be served from the **exact same origin** as your website. For example:

- Website: `https://itinera.vercel.app`
- assetlinks.json: `https://itinera.vercel.app/.well-known/assetlinks.json`

You **cannot** host it on a different domain or subdomain.

### Why Same Origin?

Chrome verifies the TWA by fetching:
```
https://[your-twa-host]/.well-known/assetlinks.json
```

If your TWA points to `https://itinera.vercel.app`, Chrome will ONLY accept the assetlinks.json from that exact domain.

### Verification Headers

The file should be served with:
- Content-Type: `application/json`
- Status: `200 OK`

### Testing the File

```bash
# Test if the file is accessible
curl -I https://your-domain.com/.well-known/assetlinks.json

# Fetch and display content
curl https://your-domain.com/.well-known/assetlinks.json
```

### Using Google's Asset Link Tool

Verify your configuration:
https://developers.google.com/digital-asset-links/tools/generator

---

## Troubleshooting

### "Not verified" in Play Console

1. Ensure the fingerprint matches your **upload key** (not app signing key if using Play App Signing)
2. Wait for propagation (can take a few minutes)
3. Check for typos in package name

### Browser UI Still Showing

1. Clear Chrome data on the device
2. Ensure Chrome is updated to v72+
3. Verify the file URL returns 200 OK
4. Check JSON syntax is valid

### Testing in Debug Mode

Debug fingerprints are different from release. Add BOTH fingerprints for easier testing:

```json
{
  "sha256_cert_fingerprints": [
    "DEBUG_FINGERPRINT_HERE",
    "RELEASE_FINGERPRINT_HERE"
  ]
}
```

---

## Summary

| Method | Difficulty | Notes |
|--------|------------|-------|
| Vercel Headers/Rewrites | Easy | Dashboard only |
| Netlify Edge Functions | Medium | Requires edge function |
| Cloudflare Workers | Medium | Most flexible |
| Direct File Upload | Easy | If hosting supports it |
| DNS TXT Records | Hard | Least common |

Choose the method that works best with your current hosting setup!

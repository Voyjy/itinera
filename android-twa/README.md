# Itinera TWA - Android Trusted Web Activity

A production-style Android application that wraps your deployed Itinera website using **Trusted Web Activity (TWA)**. This provides a native app experience while keeping your UI in sync with the web version automatically.

## 📁 Project Structure

```
android-twa/
├── build.gradle                 # Root Gradle build file
├── settings.gradle              # Gradle settings
├── gradle.properties            # Gradle configuration
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties
├── app/
│   ├── build.gradle            # App module build config
│   ├── proguard-rules.pro      # ProGuard rules for release
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           ├── java/
│           │   └── com/itinera/app/
│           │       └── LauncherActivity.java
│           └── res/
│               ├── drawable/
│               │   ├── splash_background.xml
│               │   └── ic_launcher_foreground.xml
│               ├── mipmap-anydpi-v26/
│               │   ├── ic_launcher.xml
│               │   └── ic_launcher_round.xml
│               └── values/
│                   ├── colors.xml
│                   ├── strings.xml
│                   └── themes.xml
├── keystore/                    # (Created by you - DO NOT COMMIT)
│   └── itinera-release.keystore
├── docs/
│   └── assetlinks-setup.md     # Digital Asset Links instructions
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- **Android Studio** Arctic Fox or later (or command-line SDK tools)
- **Java 17** or later
- **Android SDK** with API level 34
- **Chrome** (90+) on the test device/emulator

### 1. Configure Your Deployed URL

Edit **two files** to set your website URL:

#### `app/build.gradle` (lines 17-18):
```gradle
resValue "string", "twa_host", "your-domain.com"
resValue "string", "twa_url", "https://your-domain.com"
```

#### `app/src/main/res/values/strings.xml`:
```xml
<string name="twa_host">your-domain.com</string>
<string name="twa_url">https://your-domain.com</string>
```

#### `app/src/main/java/com/itinera/app/LauncherActivity.java` (line 27):
```java
private static final String DEFAULT_URL = "https://your-domain.com";
```

### 2. Build Debug APK

```bash
cd android-twa

# Windows
.\gradlew.bat assembleDebug

# macOS/Linux
./gradlew assembleDebug
```

**Output:** `app/build/outputs/apk/debug/app-debug.apk`

### 3. Install on Device

```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔐 Digital Asset Links Setup

For a **full-screen TWA experience** (no browser UI), you must host an `assetlinks.json` file on your web server.

### Step 1: Generate Release Keystore

```bash
# Create keystore directory
mkdir keystore
cd keystore

# Generate keystore
keytool -genkey -v -keystore itinera-release.keystore -alias itinera -keyalg RSA -keysize 2048 -validity 10000

# You'll be prompted for:
# - Keystore password
# - Key password (can be same as keystore password)
# - Your name, organization, etc.
```

### Step 2: Extract SHA-256 Fingerprint

```bash
keytool -list -v -keystore keystore/itinera-release.keystore -alias itinera
```

Look for the line starting with `SHA256:` - copy the fingerprint (like `AB:CD:12:34:...`).

### Step 3: Create assetlinks.json

Create this file content (replace placeholders):

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.itinera.app",
    "sha256_cert_fingerprints": [
      "YOUR_SHA256_FINGERPRINT_HERE"
    ]
  }
}]
```

### Step 4: Host assetlinks.json

The file **MUST** be accessible at:
```
https://your-domain.com/.well-known/assetlinks.json
```

**See `docs/assetlinks-setup.md` for hosting instructions (Vercel, Netlify, etc.)**

---

## 📦 Release Build

### Option A: Signed APK

```bash
# Set environment variables for signing
set KEYSTORE_PASSWORD=your_keystore_password
set KEY_PASSWORD=your_key_password

# Build release APK
.\gradlew.bat assembleRelease
```

Or use manual signing:

```bash
# Build unsigned APK
.\gradlew.bat assembleRelease

# Sign with jarsigner
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 ^
  -keystore keystore/itinera-release.keystore ^
  app/build/outputs/apk/release/app-release-unsigned.apk itinera

# Align the APK
zipalign -v 4 app/build/outputs/apk/release/app-release-unsigned.apk ^
  app/build/outputs/apk/release/app-release.apk
```

**Output:** `app/build/outputs/apk/release/app-release.apk`

### Option B: Android App Bundle (AAB) for Play Store

```bash
.\gradlew.bat bundleRelease
```

**Output:** `app/build/outputs/bundle/release/app-release.aab`

---

## ✅ Test Checklist

| Test | Expected Result |
|------|-----------------|
| App opens | Shows deployed website URL |
| Navigation | Links within the same domain work normally |
| Login/Auth | Works like Chrome (cookies/sessions shared) |
| Deep links | `https://your-domain.com/any-path` opens in-app |
| TWA verification | After assetlinks.json is hosted, no browser chrome visible |
| Back button | Works correctly within site navigation |
| Orientation | Rotates properly |

### Testing Deep Links

```bash
adb shell am start -a android.intent.action.VIEW -d "https://your-domain.com/some-page"
```

### Verifying Asset Links

```bash
adb shell pm get-app-links com.itinera.app
```

---

## 🎨 Customization

### App Icon

Replace the launcher icon by creating new icons in:
- `app/src/main/res/mipmap-mdpi/` (48x48)
- `app/src/main/res/mipmap-hdpi/` (72x72)
- `app/src/main/res/mipmap-xhdpi/` (96x96)
- `app/src/main/res/mipmap-xxhdpi/` (144x144)
- `app/src/main/res/mipmap-xxxhdpi/` (192x192)

Or use Android Studio's **Image Asset Studio**: Right-click `res` → New → Image Asset

### Theme Colors

Edit `app/src/main/res/values/colors.xml` to match your brand:

```xml
<color name="primary">#YOUR_PRIMARY_COLOR</color>
<color name="primary_dark">#YOUR_DARK_COLOR</color>
<color name="accent">#YOUR_ACCENT_COLOR</color>
```

### Splash Screen

Edit `app/src/main/res/values/colors.xml`:
```xml
<color name="splash_background">#YOUR_SPLASH_COLOR</color>
```

---

## 🔧 Troubleshooting

### "Custom Tab" instead of TWA

If the app shows browser UI (URL bar), check:
1. `assetlinks.json` is correctly hosted at `/.well-known/assetlinks.json`
2. SHA-256 fingerprint matches your signing key
3. Package name matches exactly: `com.itinera.app`
4. Clear Chrome data: Settings → Apps → Chrome → Storage → Clear Data

### "No browser supports TWA"

Install or update Chrome on the device. Minimum Chrome version: 72

### Build Errors

```bash
# Clean and rebuild
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

---

## 📱 Requirements

| Requirement | Value |
|-------------|-------|
| Min SDK | API 23 (Android 6.0) |
| Target SDK | API 34 (Android 14) |
| Java Version | 17 |
| Gradle | 8.2 |
| AGP | 8.2.0 |

---

## 📄 License

This Android wrapper is provided for the Itinera project.

---

## 📞 Support

For issues with:
- **The website content** → Contact the web team
- **The Android TWA wrapper** → Check this README and troubleshooting section
- **Play Store submission** → Review Google Play Console documentation

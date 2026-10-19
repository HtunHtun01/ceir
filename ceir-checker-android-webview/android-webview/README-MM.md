# CEIR Checker Android GeckoView APK

ဒီ source က `.exe` ရဲ့ flow ကို Mozilla GeckoView browser engine နဲ့ Android app အဖြစ် ပြောင်းထားတာပါ။ App စဖွင့်တာနဲ့ `https://ceir.gov.mm/` ကို auto ဖွင့်ပါတယ်။ `app/src/main/assets/ceir-checker/manifest.json` မှာ bundled WebExtension အဖြစ် ထည့်ထားတဲ့ `ceir-checker.user.js` က **official `https://ceir.gov.mm/*` page ပေါ်မှာသာ** auto-run လုပ်ပါတယ်။ အဲဒါကြောင့် userscript ထဲက CEIR checker UI နဲ့ Single/Batch/Registration/Status flow ကို GeckoView ထဲမှာ တွေ့ရပါမယ်။ အပေါ် toolbar မှာ back/forward/reload ပါပါတယ်။

Mozilla ရဲ့ GeckoView guidance အတိုင်း `GeckoRuntime` တစ်ခု၊ `GeckoSession` တစ်ခုနဲ့ `GeckoView` ကို initialize လုပ်ပြီး `WebExtensionController.ensureBuiltIn()` နဲ့ extension ကို install လုပ်ထားပါတယ်။ WebExtension က page ထဲ script ထည့်သည့်နည်းဖြစ်သောကြောင့် WebView `evaluateJavascript` ထက် browser-engine နဲ့ ပိုကိုက်ညီပါတယ်။

## အခမဲ့ APK build နည်း

1. `android-webview` folder ကို GitHub repository ထဲ upload/push လုပ်ပါ။
2. GitHub → Actions → **Build CEIR Checker APK** → **Run workflow** ကိုနှိပ်ပါ။
3. Workflow ပြီးလျှင် Artifacts ထဲက `ceir-checker-debug-apk` ကို download လုပ်ပြီး Android ဖုန်းမှာ install လုပ်ပါ။
4. Install မလုပ်ခင် Android Settings → Security → Install unknown apps ကို သင်အသုံးပြုမည့် browser/file manager အတွက် ခွင့်ပြုပါ။

Java 17၊ Android SDK နှင့် Mozilla Maven dependency ကို GitHub Actions က အခမဲ့ ပြင်ဆင်ပေးပါမယ်။ Paid cloud server မလိုပါ။

## အရေးကြီးချက်

GeckoView က official site ကို online ဖြင့်သုံးရတာဖြစ်လို့ internet လိုပါတယ်။ GeckoView သုံးထားတာက WebView block ပြဿနာကို လျော့စေနိုင်ပေမယ့် Cloudflare policy က engine၊ IP၊ cookies၊ verification အပေါ် မူတည်တာကြောင့် access ကို အာမမခံနိုင်ပါ။ Turnstile/CAPTCHA ကို user ကိုယ်တိုင် ဖြေရှင်းရပါမယ်။ Code က token ဖန်တီးခြင်း၊ CAPTCHA ကျော်ခြင်း၊ server validation bypass လုပ်ခြင်း မပါပါ။ CEIR site မဖွင့်နိုင်ပါက Firefox/Chrome နဲ့ တိုက်ရိုက်စမ်းပြီး official site block message ကို လိုက်နာပါ။

`ceir-checker.user.js` ထဲက third-party authorization/license behavior ကို မပြောင်းထားပါ။ User ပိုင်/ခွင့်ပြုထားသော script ကိုသာ asset အဖြစ် ထည့်သုံးပါ။

"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Droplets,
  ShieldAlert,
  Calendar,
  Check,
  Smile,
  Pill,
  HelpCircle,
  Activity,
  ArrowDown,
  ArrowUp,
  Languages,
} from "lucide-react";

interface PatientSimpleExplainerProps {
  patientName?: string;
}

export function PatientSimpleExplainer({
  patientName = "Rajesh",
}: PatientSimpleExplainerProps) {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSupported, setAudioSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setAudioSupported(true);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const spokenScriptEn = `
Hello ${patientName}. Let's look at your health like a friendly story.
You are managing Diabetes, Blood Pressure, and Cholesterol.
First, the great news: Your sugar and heart numbers are winning. Your 3-month sugar average, HbA1c, dropped from 8.4% to 7.1%. Your fasting morning sugar dropped from 168 to 122. Bad cholesterol fell from 142 down to a healthy 92. Your daily diet and medicines have protected your heart and blood vessels.
Next, what needs gentle attention: Your kidneys act as your body's natural water filter. A waste product called Creatinine rose from 1.0 to 1.7, meaning your kidney filter is working under extra load and running slower.
Do not panic. This is often temporary due to mild dehydration or your blood pressure tablet Telmisartan.
To protect your kidneys, Dr. Aarav Mehta immediately paused high-dose Metformin and stopped Telmisartan. This gives your kidney filters time to rest and recover.
Here are your 4 golden rules for the next 3 weeks:
First: Drink 2.5 to 3 liters of plain water daily.
Second: Never take over-the-counter painkillers like Brufen, Combiflam, or Diclofenac.
Third: Take only your updated prescription.
Fourth: Repeat a simple kidney blood test in 3 weeks.
  `.trim();

  const spokenScriptHi = `
नमस्ते ${patientName} जी। आपकी रिपोर्ट को बिल्कुल आसान भाषा में समझें।
आप डायबिटीज़, ब्लड प्रेशर और कोलेस्ट्रॉल का इलाज करवा रहे हैं।
सबसे पहले अच्छी खबर: आपकी शुगर और दिल की सेहत में बहुत बड़ा सुधार आया है। आपकी 3 महीने की शुगर, यानी HbA1c, 8.4 से घटकर 7.1 हो गई है। खाली पेट की शुगर 168 से घटकर 122 हो गई। आपका खराब कोलेस्ट्रॉल 142 से घटकर 92 के सुरक्षित स्तर पर आ गया है।
अब ध्यान देने वाली बात: आपकी किडनी शरीर के वाटर फ़िल्टर की तरह काम करती है। इसमें क्रिएटिनिन 1.0 से बढ़कर 1.7 हो गया है, जिसका मतलब है कि किडनी फ़िल्टर पर थोड़ा दबाव है और वह धीरे काम कर रहा है।
घबराएं नहीं। पानी कम पीने या बीपी की दवा के कारण यह अक्सर अस्थाई होता है। आपकी किडनी को सुरक्षित रखने के लिए डॉक्टर आरव मेहता ने मेटफ़ॉर्मिन और टेल्मिसार्टन को तुरंत रोक दिया है ताकि किडनी को आराम मिल सके।
अगले 3 हफ़्तों के लिए आपके 4 नियम:
पहला: दिन भर में 2.5 से 3 लीटर पानी पिएं।
दूसरा: ब्रूफेन या कॉम्बिफ़्लाम जैसी दर्दनिवारक दवाएं बिल्कुल न लें।
तीसरा: डॉक्टर द्वारा दी गई नई दवाएं ही लें।
चौथा: 3 हफ़्तों बाद दोबारा किडनी टेस्ट कराएं।
  `.trim();

  function toggleSpeech() {
    if (!audioSupported) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = lang === "hi" ? spokenScriptHi : spokenScriptEn;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-slate-900 shadow-xs space-y-4">
      
      {/* 1. COMPACT TOP HEADER WITH AUDIO & LANGUAGE TOGGLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
            <Smile className="w-3 h-3 text-teal-700" />
            <span>{lang === "en" ? "Simply Explained For You (No Medical Jargon)" : "आसान भाषा में आपका स्वास्थ्य विश्लेषण"}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            {lang === "en" ? "What Is Really Happening in Your Body?" : "आपके शरीर और सेहत में क्या बदलाव आया है?"}
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            {lang === "en"
              ? "We translated your laboratory numbers into plain everyday language, with simple real-life analogies."
              : "हमने आपकी प्रयोगशाला रिपोर्ट के जटिल नंबरों को रोजमर्रा की आसान भाषा में समझाया है।"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl text-xs font-bold border border-slate-200">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                lang === "en" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("hi")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                lang === "hi" ? "bg-white text-teal-800 shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Audio Speech */}
          {audioSupported && (
            <button
              onClick={toggleSpeech}
              type="button"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                isPlayingAudio
                  ? "bg-rose-500 hover:bg-rose-600 text-white animate-pulse"
                  : "bg-teal-600 hover:bg-teal-500 text-white"
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-white" />
                  <span>{lang === "en" ? "Pause" : "रोकें"}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-white" />
                  <span>{lang === "en" ? "🔊 Listen" : "🔊 सुनें"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2. THREE COMPACT ORGAN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Card 1: Sugar & Diabetes (Good News) */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900 border border-emerald-300">
              🟢 {lang === "en" ? "GREAT PROGRESS" : "बहुत बढ़िया सुधार"}
            </span>
            <span className="text-[11px] font-bold text-emerald-800">
              HbA1c: 8.4% ➔ 7.1%
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            {lang === "en" ? "Blood Sugar is Back Under Control!" : "खून में शुगर का स्तर नियंत्रण में आ गया है!"}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === "en" ? (
              <>
                Think of <strong>HbA1c</strong> as your 3-month sugar score card. Anything over 8.0% stresses eyes and nerves. In Jan it was <strong>8.4%</strong>; now in July it dropped to <strong>7.1%</strong>! Fasting morning sugar also improved from 168 to 122 mg/dL.
              </>
            ) : (
              <>
                <strong>HbA1c</strong> को पिछले 3 महीनों का शुगर स्कोर समझें। जनवरी में यह <strong>8.4%</strong> था, जो घटकर <strong>7.1%</strong> पर आ गया है! खाली पेट शुगर भी 168 से घटकर 122 हो गई है।
              </>
            )}
          </p>

          <div className="p-2 rounded-lg bg-white/90 border border-emerald-200 text-[11px] font-medium text-emerald-950 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{lang === "en" ? "Diet & daily medicines worked effectively." : "खान-पान और दवाएं असरदार साबित हुईं।"}</span>
          </div>
        </div>

        {/* Card 2: Heart & Arteries (Good News) */}
        <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-200 text-teal-900 border border-teal-300">
              🟢 {lang === "en" ? "ARTERIES PROTECTED" : "दिल और नसें सुरक्षित"}
            </span>
            <span className="text-[11px] font-bold text-teal-800">
              LDL: 142 ➔ 92 mg/dL
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            {lang === "en" ? "Bad Cholesterol & BP Dropped to Safe Levels" : "खराब कोलेस्ट्रॉल और ब्लड प्रेशर सामान्य हुआ"}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === "en" ? (
              <>
                Think of blood vessels like water pipes. <strong>Bad Cholesterol (LDL)</strong> is grease clogging pipes. Your LDL dropped from <strong>142 down to 92 mg/dL</strong> (&lt;100 target). Blood pressure settled from 148/92 to a normal 126/80.
              </>
            ) : (
              <>
                खून की नसों को पानी के पाइप की तरह समझें। आपका LDL <strong>142 से घटकर 92 mg/dL</strong> पर आ गया है (100 से कम सुरक्षित होता है)। बीपी भी सामान्य 126/80 हो गया है।
              </>
            )}
          </p>

          <div className="p-2 rounded-lg bg-white/90 border border-teal-200 text-[11px] font-medium text-teal-950 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{lang === "en" ? "Risk of heart blockage greatly reduced." : "हार्ट ब्लॉकेज का खतरा काफी कम हो गया है।"}</span>
          </div>
        </div>

        {/* Card 3: Kidneys (Attention Required) */}
        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
              🟠 {lang === "en" ? "ATTENTION REQUIRED" : "सावधानी ज़रूरी"}
            </span>
            <span className="text-[11px] font-bold text-amber-800">
              Creatinine: 1.0 ➔ 1.7
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            {lang === "en" ? "Kidney Natural Filter is Moving Slower" : "किडनी फ़िल्टर पर अस्थाई दबाव आया है"}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === "en" ? (
              <>
                Think of kidneys as your body's water filter. <strong>Creatinine</strong> rose from <strong>1.0 to 1.7</strong>, and speed dropped to 46. <em>Do not worry:</em> this is usually reversible with hydration and dosage tweaks!
              </>
            ) : (
              <>
                किडनी को शरीर की छलनी समझें। खून में <strong>क्रिएटिनिन 1.0 से बढ़कर 1.7</strong> हो गया है। <em>घबराएं नहीं:</em> पानी की कमी से अक्सर ऐसा होता है और यह ठीक हो जाता है।
              </>
            )}
          </p>

          <div className="p-2 rounded-lg bg-white/90 border border-amber-200 text-[11px] font-medium text-amber-950 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{lang === "en" ? "Doctor adjusted medicines to give kidneys rest." : "डॉक्टर ने किडनी को आराम देने के लिए दवाएं बदल दी हैं।"}</span>
          </div>
        </div>

      </div>

      {/* 3. COMPACT DOCTOR'S INSIGHT FAQ (PHOTO 4) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 text-white space-y-1.5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <HelpCircle className="w-3.5 h-3.5 text-slate-950" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-white">
            {lang === "en"
              ? "Patient FAQ: Why did Dr. Aarav Mehta pause my Metformin and Telmisartan?"
              : "मरीज़ का सवाल: डॉक्टर साहब ने मेरी मेटफ़ॉर्मिन और टेल्मिसार्टन दवाएं क्यों रोकीं?"}
          </h4>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pl-8">
          {lang === "en" ? (
            <>
              <em>"Did my condition worsen because doctor stopped my pills?"</em> — <strong>The answer is NO!</strong> When kidney filters slow down, medicines can accumulate. Pausing them is a <strong>protective shield action</strong> to give your kidneys time to recover and restore normal filtration.
            </>
          ) : (
            <>
              <em>"क्या मेरी बीमारी बढ़ गई जो दवाएं बंद कर दीं?"</em> — <strong>जवाब: बिल्कुल नहीं!</strong> जब किडनी की फ़िल्टर गति धीमी होती है, तो दवाएं शरीर में जमा हो सकती हैं। किडनी को आराम देने और रिकवरी के लिए यह सुरक्षात्मक कदम उठाया गया है।
            </>
          )}
        </p>
      </div>

      {/* 4. COMPACT 4 GOLDEN RULES FOR THE PATIENT (PHOTO 4) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
        <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{lang === "en" ? "Your 4 Golden Rules for the Next 3 Weeks:" : "अगले 3 हफ़्तों के लिए आपके 4 ज़रूरी नियम:"}</span>
        </div>

        {/* Space-efficient 4-column compact grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-white border border-emerald-100 shadow-2xs space-y-0.5">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-[11px]">
              <Droplets className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{lang === "en" ? "1. 2.5–3L Water Daily" : "1. 2.5–3L पानी पिएं"}</span>
            </div>
            <p className="text-slate-500 text-[10.5px] leading-tight">
              {lang === "en"
                ? "Keeps kidney filters flushed and prevents waste concentration."
                : "किडनी फ़िल्टर साफ़ रहते हैं और वेस्ट बाहर निकलता है।"}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-rose-100 shadow-2xs space-y-0.5">
            <div className="flex items-center gap-1.5 text-rose-900 font-bold text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{lang === "en" ? "2. Zero OTC Painkillers" : "2. पेनकिलर न लें"}</span>
            </div>
            <p className="text-slate-500 text-[10.5px] leading-tight">
              {lang === "en"
                ? "Avoid Combiflam or Brufen—they heavily strain kidneys."
                : "कॉम्बिफ़्लाम या ब्रूफेन न लें—यह किडनी पर दबाव डालती हैं।"}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-emerald-100 shadow-2xs space-y-0.5">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-[11px]">
              <Pill className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{lang === "en" ? "3. Updated Rx Only" : "3. नई दवाएं ही लें"}</span>
            </div>
            <p className="text-slate-500 text-[10.5px] leading-tight">
              {lang === "en"
                ? "Take bedtime Atorvastatin; keep paused pills aside."
                : "रात को एटोरवास्टेटिन लें और पुरानी बंद दवाएं अलग रख दें।"}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-emerald-100 shadow-2xs space-y-0.5">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{lang === "en" ? "4. Retest in 3 Weeks" : "4. 3 हफ़्ते बाद टेस्ट"}</span>
            </div>
            <p className="text-slate-500 text-[10.5px] leading-tight">
              {lang === "en"
                ? "Repeat Creatinine & eGFR to verify return to normal baseline."
                : "क्रिएटिनिन का दोबारा टेस्ट कराएं ताकि रिकवरी की पुष्टि हो।"}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

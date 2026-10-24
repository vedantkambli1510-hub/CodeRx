"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export type SupportedLanguage =
  | "en"
  | "hi"
  | "mr"
  | "gu"
  | "bn"
  | "ta"
  | "te"
  | "kn"
  | "ml"
  | "pa";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Top Navigation & General
    doctorStation: "Doctor Station",
    patientHealthVault: "Patient Health Vault",
    dashboard: "Dashboard",
    patients: "Patients",
    clinicalTools: "Clinical Tools",
    whatChangedAi: "WHAT CHANGED? (AI)",
    longitudinalDiff: "Longitudinal differential engine",
    appointmentsSchedule: "Appointments & Schedule",
    opdBookings: "OPD bookings and time slots",
    prescriptions1mg: "Prescriptions & Tata 1mg",
    digitalRxDispatch: "Digital Rx & pharmacy dispatch",
    visitingHospitalsSlots: "Visiting Hospitals & Slots",
    configureOtherHospitals: "Configure other hospital OPDs",
    myHealth: "My Health",
    uploadRecords: "Upload Records",
    bookSlot: "Book Slot",
    notifications: "Notifications",
    unread: "Unread",
    viewAllNotifications: "View All Notifications →",
    noNotifications: "No notifications at this time.",
    seniorConsultant: "Senior Consultant",
    verifiedPatient: "Verified Patient",
    patientWorkspace: "Patient Workspace",
    whatChangedReview: "WHAT CHANGED? Review",
    editDesignationHospitals: "Edit Designation & Hospitals",
    myHealthVault: "My Health Vault",
    medicalTimeline: "Medical Timeline",
    myAppointments: "My Appointments",
    logout: "Sign Out",
    loggingOut: "Signing Out...",
    login: "Sign In",
    joinCodeRx: "Join CodeRx",
    enterWorkspace: "Enter Workspace →",

    // Patient Directory & Workspace Headers
    patientDirectory: "Patient Directory",
    workspace: "Workspace",
    itemsRequiringReview: "⚠️ Items Requiring Review",
    yrs: "yrs",
    male: "Male",
    female: "Female",
    lastVisit: "Last Visit",
    reviewLatestChanges: "Review Latest Changes",
    more: "More",
    uploadRecord: "Upload Record",
    createPrescription: "Create Prescription",
    scheduleAppointment: "Schedule Appointment",
    addClinicalNote: "Add Clinical Note",

    // Workspace Tabs
    overview: "Overview",
    timeline: "Timeline",
    records: "Records",
    whatChanged: "WHAT CHANGED?",
    medicines: "Medicines",
    prescriptions: "Prescriptions",
    appointments: "Appointments",
    aiDoctorBrief: "AI Doctor Brief",
    alerts: "Alerts",
    verified: "Verified",

    // Overview Tab Content
    patientSummaryTitle: "PATIENT SUMMARY",
    currentMedicines: "Current Medicines",
    active: "Active",
    viewFullHistory: "View Full History",
    latestAiReview: "Latest AI Review",
    changesDetected: "3 changes detected",
    viewWhatChanged: "View What Changed",
    nextAppointment: "Next Appointment",
    confirmed: "Confirmed",
    recentRecords: "Recent Records",
    viewAll: "View All",
    extractedStructured: "Extracted & Structured",
    view: "View",
    followupConsultation: "Follow-up Consultation • Dr. Aarav Mehta",
    noActiveMedications: "No active medications currently prescribed.",
    patientConsultationAppointments: "Patient Consultation Appointments",
    scheduleNextAppointment: "Schedule Next Appointment",
    noAppointmentsScheduled: "No appointments scheduled for this patient.",

    // Doctor Sidebar
    main: "MAIN",
    clinical: "CLINICAL",
    practice: "PRACTICE",
    medicalRecords: "Medical Records",
    aiDifferentialReview: "AI Differential Review",
    pharmacotherapy: "Pharmacotherapy",
    slotAvailabilityHospitals: "Slot Availability & Hospitals",
    consultationFees: "Consultation Fees",
    visiting: "Visiting:",
    aiClinicalEngine: "AI Clinical Engine",
    abdmReady: "ABDM Ready",

    // Appointments & Slots
    scheduleConsultation: "Schedule a Consultation",
    bookAppointment: "Book Appointment",
    availableSlots: "Available Slots",
    morningOpd: "Morning OPD",
    afternoonOpd: "Afternoon OPD",
    eveningOpd: "Evening OPD",
    selectedSlot: "Selected Slot",
    confirmBooking: "Confirm Booking",
    consultationFee: "Consultation Fee",
    duration: "Duration",
    mins: "mins",
    acceptingPatients: "Accepting Patients",
    noSlots: "No appointment slots are currently available.",

    // Google Pay & Payment
    paymentWithGPay: "Link Payment with Google Pay",
    payWithGooglePay: "Pay with Google Pay",
    demoQrCode: "Demo Payment QR Code",
    scanAndPay: "Scan with Google Pay or any UPI app",
    instantUpiSettlement: "Instant UPI Verification",
    simulateSuccess: "Simulate GPay Payment Success",
    paymentCompleted: "Payment Successful",
    transactionId: "Transaction ID",
    amountPaid: "Amount Paid",

    // Pre-patient intake questions
    prePatientQuestions: "Pre-Patient Intake Questions",
    basicReport: "Basic Pre-Consult Report",
    viewBasicReportEarlier: "View Basic Intake Report Earlier",
    primaryConcern: "Primary Health Concern",
    symptoms: "Reported Symptoms",
    severity: "Severity Score",
    painLevel: "Pain Rating (0-10)",
    allergies: "Known Allergies",
    medicalHistory: "Past Medical History",
    startIntakeNow: "Start Pre-Visit Intake Now",
    intakeCompleted: "Intake Questionnaire Submitted",
    doctorReviewNotice: "Doctor can view this basic report before consultation begins",

    // Medicines on/off crazy dropdown
    medicineStatus: "Medication Status",
    activeOn: "Active / Taking (ON)",
    stoppedOff: "Turned OFF / Stopped",
    pausedOnHold: "Paused / On-Hold",
    tapering: "Tapering Dose",
    turnOffMedicine: "Turn OFF Medicine",
    resumeMedicine: "Resume Medicine",
    contraindicationReason: "Clinical Deprescribing Reason",
    renalRisk: "Renal Risk / Elevated Creatinine",
    hypoglycemiaRisk: "Hypoglycemia Risk",
    allergicReaction: "Allergic Reaction Reported",
    goalAchieved: "Therapeutic Target Achieved",
  },
  hi: {
    // Top Navigation & General
    doctorStation: "डॉक्टर स्टेशन",
    patientHealthVault: "मरीज़ हेल्थ वॉल्ट",
    dashboard: "डैशबोर्ड",
    patients: "मरीज़",
    clinicalTools: "क्लिनिकल टूल्स",
    whatChangedAi: "क्या बदला? (AI)",
    longitudinalDiff: "अनुदैर्ध्य विभेदक विश्लेषण इंजन",
    appointmentsSchedule: "अपॉइंटमेंट्स और शेड्यूल",
    opdBookings: "ओपीडी बुकिंग और समय स्लॉट",
    prescriptions1mg: "प्रिस्क्रिप्शन और टाटा 1mg",
    digitalRxDispatch: "डिजिटल पर्चा और फ़ार्मेसी डिस्पैच",
    visitingHospitalsSlots: "विज़िटिंग अस्पताल और स्लॉट्स",
    configureOtherHospitals: "अन्य अस्पताल ओपीडी कॉन्फ़िगर करें",
    myHealth: "मेरा स्वास्थ्य",
    uploadRecords: "रिकॉर्ड्स अपलोड करें",
    bookSlot: "स्लॉट बुक करें",
    notifications: "सूचनाएं",
    unread: "अपठित",
    viewAllNotifications: "सभी सूचनाएं देखें →",
    noNotifications: "फिलहाल कोई सूचना नहीं है।",
    seniorConsultant: "वरिष्ठ सलाहकार",
    verifiedPatient: "सत्यापित मरीज़",
    patientWorkspace: "मरीज़ वर्कस्पेस",
    whatChangedReview: "क्या बदला? समीक्षा",
    editDesignationHospitals: "पदनाम और अस्पताल बदलें",
    myHealthVault: "मेरी स्वास्थ्य तिजोरी",
    medicalTimeline: "मेडिकल टाइमलाइन",
    myAppointments: "मेरे अपॉइंटमेंट्स",
    logout: "लॉग आउट",
    loggingOut: "लॉग आउट हो रहा है...",
    login: "लॉग इन",
    joinCodeRx: "CodeRx से जुड़ें",
    enterWorkspace: "वर्कस्पेस में जाएं →",

    // Patient Directory & Workspace Headers
    patientDirectory: "मरीज़ डायरेक्टरी",
    workspace: "वर्कस्पेस",
    itemsRequiringReview: "⚠️ समीक्षा आवश्यक मदें",
    yrs: "वर्ष",
    male: "पुरुष",
    female: "महिला",
    lastVisit: "अंतिम विज़िट",
    reviewLatestChanges: "नवीनतम बदलाव देखें",
    more: "अधिक",
    uploadRecord: "रिकॉर्ड अपलोड करें",
    createPrescription: "प्रिस्क्रिप्शन बनाएं",
    scheduleAppointment: "अपॉइंटमेंट तय करें",
    addClinicalNote: "क्लिनिकल नोट जोड़ें",

    // Workspace Tabs
    overview: "अवलोकन",
    timeline: "टाइमलाइन",
    records: "रिकॉर्ड्स",
    whatChanged: "क्या बदला?",
    medicines: "दवाइयाँ",
    prescriptions: "प्रिस्क्रिप्शन",
    appointments: "अपॉइंटमेंट्स",
    aiDoctorBrief: "एआई डॉक्टर ब्रीफ",
    alerts: "अलर्ट्स",
    verified: "सत्यापित",

    // Overview Tab Content
    patientSummaryTitle: "मरीज़ सारांश",
    currentMedicines: "वर्तमान दवाइयाँ",
    active: "सक्रिय",
    viewFullHistory: "पूरा इतिहास देखें",
    latestAiReview: "नवीनतम एआई समीक्षा",
    changesDetected: "3 बदलाव पाए गए",
    viewWhatChanged: "देखें क्या बदला",
    nextAppointment: "अगला अपॉइंटमेंट",
    confirmed: "पुष्टि की गई",
    recentRecords: "हालिया रिकॉर्ड्स",
    viewAll: "सभी देखें",
    extractedStructured: "निकाला गया व संरचित",
    view: "देखें",
    followupConsultation: "फॉलो-अप परामर्श • डॉ. आरव मेहता",
    noActiveMedications: "वर्तमान में कोई सक्रिय दवा निर्धारित नहीं है।",
    patientConsultationAppointments: "मरीज़ परामर्श अपॉइंटमेंट्स",
    scheduleNextAppointment: "अगला अपॉइंटमेंट शेड्यूल करें",
    noAppointmentsScheduled: "इस मरीज़ के लिए कोई अपॉइंटमेंट निर्धारित नहीं है।",

    // Doctor Sidebar
    main: "मुख्य",
    clinical: "क्लिनिकल",
    practice: "प्रैक्टिस",
    medicalRecords: "चिकित्सा रिकॉर्ड्स",
    aiDifferentialReview: "एआई विभेदक समीक्षा",
    pharmacotherapy: "औषधोपचार",
    slotAvailabilityHospitals: "स्लॉट उपलब्धता और अस्पताल",
    consultationFees: "परामर्श शुल्क",
    visiting: "अस्पताल विज़िट:",
    aiClinicalEngine: "एआई क्लिनिकल इंजन",
    abdmReady: "ABDM सक्षम",

    // Appointments & Slots
    scheduleConsultation: "डॉक्टर परामर्श बुक करें",
    bookAppointment: "अपॉइंटमेंट बुक करें",
    availableSlots: "उपलब्ध स्लॉट्स",
    morningOpd: "सुबह की ओपीडी (Morning)",
    afternoonOpd: "दोपहर की ओपीडी (Afternoon)",
    eveningOpd: "शाम की ओपीडी (Evening)",
    selectedSlot: "चुना गया समय",
    confirmBooking: "बुकिंग कन्फर्म करें",
    consultationFee: "परामर्श शुल्क",
    duration: "अवधि",
    mins: "मिनट",
    acceptingPatients: "मरीज़ स्वीकार्य हैं",
    noSlots: "फ़िलहाल कोई स्लॉट उपलब्ध नहीं है।",

    // Google Pay & Payment
    paymentWithGPay: "गूगल पे (Google Pay) से पेमेंट लिंक करें",
    payWithGooglePay: "Google Pay से भुगतान करें",
    demoQrCode: "डेमो भुगतान क्यूआर कोड (Demo QR)",
    scanAndPay: "गूगल पे या किसी भी यूपीआई ऐप से स्कैन करें",
    instantUpiSettlement: "तुरंत यूपीआई सत्यापन",
    simulateSuccess: "Google Pay भुगतान सफल सिमुलेट करें",
    paymentCompleted: "भुगतान सफलतापूर्वक पूरा हुआ",
    transactionId: "ट्रांजेक्शन आईडी",
    amountPaid: "भुगतान की गई राशि",

    // Pre-patient intake questions
    prePatientQuestions: "मरीज़ से पहले पूछे जाने वाले सवाल (प्री-पेशेंट)",
    basicReport: "प्राथमिक प्री-कंसल्ट रिपोर्ट",
    viewBasicReportEarlier: "डॉक्टर पहले ही बेसिक रिपोर्ट देख सकते हैं",
    primaryConcern: "मुख्य स्वास्थ्य समस्या",
    symptoms: "महसूस हो रहे लक्षण",
    severity: "गंभीरता स्कोर",
    painLevel: "दर्द का पैमाना (0-10)",
    allergies: "एलर्जी विवरण",
    medicalHistory: "पिछला मेडिकल इतिहास",
    startIntakeNow: "प्री-विज़िट सवाल अभी भरें",
    intakeCompleted: "प्रश्नावली सफलतापूर्वक जमा की गई",
    doctorReviewNotice: "डॉक्टर परामर्श शुरू होने से पहले ही यह बुनियादी रिपोर्ट देख सकते हैं",

    // Medicines on/off crazy dropdown
    medicineStatus: "दवा की स्थिति (Status)",
    activeOn: "सक्रिय / चालू (ON)",
    stoppedOff: "बंद कर दिया गया (Turn OFF)",
    pausedOnHold: "अस्थायी रूप से रुका हुआ (Paused)",
    tapering: "खुराक कम करना (Tapering)",
    turnOffMedicine: "दवा बंद करें (Turn OFF)",
    resumeMedicine: "दवा दोबारा चालू करें",
    contraindicationReason: "दवा रोकने का डॉक्टरी कारण",
    renalRisk: "किडनी जोखिम / सीरम क्रिएटिनिन बढ़ा हुआ",
    hypoglycemiaRisk: "लो शुगर (हाइपोग्लाइसीमिया) जोखिम",
    allergicReaction: "एलर्जी या प्रतिकूल प्रभाव",
    goalAchieved: "उपचार लक्ष्य पूरा हुआ",
  },
  mr: {
    dashboard: "डॅशबोर्ड",
    appointments: "भेटींची वेळ (अपॉइंटमेंट्स)",
    prescriptions: "औषधोपचार चिठ्ठी",
    medicines: "औषधे",
    records: "वैद्यकीय अहवाल",
    timeline: "आरोग्य टाइमलाइन",
    settings: "सेटिंग्ज",
    logout: "लॉग आउट",
    login: "लॉग इन",
    scheduleConsultation: "तपासणीसाठी वेळ निश्चित करा",
    bookAppointment: "अपॉइंटमेंट बुक करा",
    availableSlots: "उपलब्ध वेळा (Slots)",
    morningOpd: "सकाळचे सत्र (Morning OPD)",
    afternoonOpd: "दुपारचे सत्र (Afternoon OPD)",
    eveningOpd: "संध्याकाळचे सत्र (Evening OPD)",
    selectedSlot: "निवडलेली वेळ",
    confirmBooking: "बुकिंग पक्के करा",
    consultationFee: "तपासणी फी",
    duration: "कालावधी",
    mins: "मि",
    acceptingPatients: "रुग्ण तपासणी सुरू",
    noSlots: "सध्या कोणतीही वेळ उपलब्ध नाही.",
    paymentWithGPay: "गुगल पे (Google Pay) द्वारे पेमेंट लिंक",
    payWithGooglePay: "Google Pay ने पैसे भरा",
    demoQrCode: "डेमो पेमेंट QR कोड",
    scanAndPay: "Google Pay किंवा कोणत्याही UPI ॲपद्वारे स्कॅन करा",
    instantUpiSettlement: "त्वरित UPI पडताळणी",
    simulateSuccess: "Google Pay पेमेंट यशस्वी करा",
    paymentCompleted: "पेमेंट यशस्वी झाले",
    transactionId: "व्यवहार क्रमांक (ID)",
    amountPaid: "भरलेली रक्कम",
    prePatientQuestions: "तपासणीपूर्व रुग्णाचे प्रश्न",
    basicReport: "प्राथमिक प्री-कन्सल्ट रिपोर्ट",
    viewBasicReportEarlier: "डॉक्टर सुरुवातीलाच प्राथमिक अहवाल पाहू शकतात",
    primaryConcern: "मुख्य त्रास / तक्रार",
    symptoms: "जाणवणारी लक्षणे",
    severity: "त्रासाची तीव्रता",
    painLevel: "वेदनांचे प्रमाण (0-10)",
    allergies: "माहित असलेली ॲलर्जी",
    medicalHistory: "मागील आजारांचा इतिहास",
    startIntakeNow: "तपासणीपूर्व माहिती आताच भरा",
    intakeCompleted: "माहिती यशस्वीपणे पाठवली",
    doctorReviewNotice: "डॉक्टर प्रत्यक्ष भेटण्यापूर्वी हा मूलभूत अहवाल तपासू शकतात",
    medicineStatus: "औषधाची स्थिती",
    activeOn: "चालू ठेवा (ON)",
    stoppedOff: "बंद करा (Turn OFF)",
    pausedOnHold: "काही काळासाठी थांबवले (Paused)",
    tapering: "डोस कमी करणे (Tapering)",
    turnOffMedicine: "औषध बंद करा",
    resumeMedicine: "औषध पुन्हा सुरू करा",
    contraindicationReason: "औषध बंद करण्याचे वैद्यकीय कारण",
    renalRisk: "मूत्रपिंड (किडनी) धोका / क्रिएटिनिन वाढले",
    hypoglycemiaRisk: "साखर कमी होण्याचा धोका",
    allergicReaction: "औषधाची ॲलर्जी",
    goalAchieved: "उपचार पूर्ण झाले",
  },
  gu: {
    dashboard: "ડેશબોર્ડ",
    appointments: "એપોઇન્ટમેન્ટ્સ",
    prescriptions: "દવાનું પ્રિસ્ક્રિપ્શન",
    medicines: "દવાઓ",
    records: "મેડિકલ રેકોર્ડ્સ",
    timeline: "હેલ્થ ટાઈમલાઇન",
    settings: "સેટિંગ્સ",
    logout: "લૉગ આઉટ",
    login: "લૉગ ઇન",
    scheduleConsultation: "ડૉક્ટર સાથે પરામર્શ બુક કરો",
    bookAppointment: "એપોઇન્ટમેન્ટ બુક કરો",
    availableSlots: "ઉપલબ્ધ સ્લોટ",
    morningOpd: "સવારની ઓપીડી (Morning)",
    afternoonOpd: "બપોરની ઓપીડી (Afternoon)",
    eveningOpd: "સાંજની ઓપીડી (Evening)",
    selectedSlot: "પસંદ કરેલ સ્લોટ",
    confirmBooking: "બુકિંગ કન્ફર્મ કરો",
    consultationFee: "પરામર્શ ફી",
    duration: "સમયગાળો",
    mins: "મિનિટ",
    acceptingPatients: "દર્દીઓ સ્વીકારે છે",
    noSlots: "હાલમાં કોઈ સ્લોટ ઉપલબ્ધ નથી.",
    paymentWithGPay: "ગૂગલ પે (Google Pay) સાથે પેમેન્ટ લિંક",
    payWithGooglePay: "Google Pay વડે ચૂકવો",
    demoQrCode: "ડેમો પેમેન્ટ ક્યુઆર કોડ (QR Code)",
    scanAndPay: "Google Pay કે કોઈપણ UPI એપ વડે સ્કેન કરો",
    instantUpiSettlement: "ત્વરિત UPI ચકાસણી",
    simulateSuccess: "Google Pay ચુકવણી સફળ સિમ્યુલેટ કરો",
    paymentCompleted: "ચુકવણી સફળ રહી",
    transactionId: "ટ્રાન્ઝેક્શન આઈડી",
    amountPaid: "ચૂકવેલ રકમ",
    prePatientQuestions: "દર્દી પૂર્વ પ્રશ્નાવલી",
    basicReport: "પ્રાથમિક પ્રી-કન્સલ્ટ રિપોર્ટ",
    viewBasicReportEarlier: "ડૉક્ટર વહેલા મૂળભૂત રિપોર્ટ જોઈ શકે છે",
    primaryConcern: "મુખ્ય આરોગ્ય સમસ્યા",
    symptoms: "અનુભવાતા લક્ષણો",
    severity: "ગંભીરતા સ્કોર",
    painLevel: "દુખાવાનું પ્રમાણ (0-10)",
    allergies: "એલર્જી વિગતો",
    medicalHistory: "અગાઉનો તબીબી ઇતિહાસ",
    startIntakeNow: "પ્રી-વિઝિટ પ્રશ્નો અત્યારે જ ભરો",
    intakeCompleted: "પ્રશ્નાવલી સબમિટ થઈ ગઈ છે",
    doctorReviewNotice: "ડૉક્ટર મુલાકાત શરૂ થાય તે પહેલાં આ બેઝિક રિપોર્ટ ચકાસી શકે છે",
    medicineStatus: "દવાની સ્થિતિ (Status)",
    activeOn: "ચાલુ (ON)",
    stoppedOff: "બંધ કરેલ (Turn OFF)",
    pausedOnHold: "થોડા સમય માટે અટકાવેલ",
    tapering: "ડોઝ ઘટાડવો (Tapering)",
    turnOffMedicine: "દવા બંધ કરો",
    resumeMedicine: "દવા ફરીથી ચાલુ કરો",
    contraindicationReason: "દવા બંધ કરવાનું તબીબી કારણ",
    renalRisk: "કિડની જોખમ / સીરમ ક્રિએટીનાઇન વધ્યું",
    hypoglycemiaRisk: "સુગર ઓછી થવાનું જોખમ",
    allergicReaction: "એલર્જીની અસર",
    goalAchieved: "સારવાર પૂર્ણ થઈ",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড",
    appointments: "অ্যাপয়েন্টমেন্ট",
    prescriptions: "প্রেসক্রিপশন",
    medicines: "ওষুধসমূহ",
    records: "মেডিকেল রেকর্ড",
    timeline: "স্বাস্থ্য টাইমলাইন",
    settings: "সেটিংস",
    logout: "লগ আউট",
    login: "লগ ইন",
    scheduleConsultation: "ডাক্তার পরামর্শ বুক করুন",
    bookAppointment: "অ্যাপয়েন্টমেন্ট বুক করুন",
    availableSlots: "উপলব্ধ সময় (Slots)",
    morningOpd: "সকালের ওপিডি (Morning)",
    afternoonOpd: "দুপুরের ওপিডি (Afternoon)",
    eveningOpd: "সন্ধ্যার ওপিডি (Evening)",
    selectedSlot: "নির্বাচিত সময়",
    confirmBooking: "বুকিং নিশ্চিত করুন",
    consultationFee: "পরামর্শ ফি",
    duration: "সময়সীমা",
    mins: "মিনিট",
    acceptingPatients: "রোগী দেখা হচ্ছে",
    noSlots: "বর্তমানে কোনো স্লট উপলব্ধ নেই।",
    paymentWithGPay: "গুগল পে (Google Pay) দিয়ে পেমেন্ট লিঙ্ক",
    payWithGooglePay: "Google Pay দিয়ে পরিশোধ করুন",
    demoQrCode: "ডেমো পেমেন্ট কিউআর কোড (QR Code)",
    scanAndPay: "Google Pay বা যেকোনো UPI অ্যাপ দিয়ে স্ক্যান করুন",
    instantUpiSettlement: "তাৎক্ষণিক UPI যাচাইকরণ",
    simulateSuccess: "Google Pay পেমেন্ট সফল সিমুলেট করুন",
    paymentCompleted: "পেমেন্ট সফল হয়েছে",
    transactionId: "লেনদেন আইডি",
    amountPaid: "পরিশোধিত অর্থ",
    prePatientQuestions: "রোগী দেখার পূর্বের প্রশ্নাবলী",
    basicReport: "প্রাথমিক প্রি-কনসাল্ট রিপোর্ট",
    viewBasicReportEarlier: "ডাক্তার আগেই প্রাথমিক রিপোর্ট দেখতে পারেন",
    primaryConcern: "প্রধান স্বাস্থ্য সমস্যা",
    symptoms: "উপসর্গসমূহ",
    severity: "তীব্রতার মাত্রা",
    painLevel: "ব্যথার স্কেল (0-10)",
    allergies: "জানা অ্যালার্জি",
    medicalHistory: "পূর্ববর্তী চিকিৎসা ইতিহাস",
    startIntakeNow: "প্রশ্নাবলী এখনই পূরণ করুন",
    intakeCompleted: "প্রশ্নাবলী সফলভাবে জমা দেওয়া হয়েছে",
    doctorReviewNotice: "পরামর্শ শুরু হওয়ার আগেই ডাক্তার এই রিপোর্ট পর্যালোচনা করতে পারেন",
    medicineStatus: "ওষুধের স্থিতি",
    activeOn: "চালু রয়েছে (ON)",
    stoppedOff: "বন্ধ করা হয়েছে (Turn OFF)",
    pausedOnHold: "সাময়িক স্থগিত (Paused)",
    tapering: "মাত্রা হ্রাস (Tapering)",
    turnOffMedicine: "ওষুধ বন্ধ করুন",
    resumeMedicine: "ওষুধ পুনরায় চালু করুন",
    contraindicationReason: "ওষুধ বন্ধ করার ক্লিনিক্যাল কারণ",
    renalRisk: "কিডনি ঝুঁকি / সিরাম ক্রিয়েটিনিন বৃদ্ধি",
    hypoglycemiaRisk: "রক্তে শর্করা হ্রাসের ঝুঁকি",
    allergicReaction: "প্রতিকূল অ্যালার্জি প্রতিক্রিয়া",
    goalAchieved: "চিকিৎসা লক্ষ্য অর্জিত",
  },
  ta: {
    dashboard: "முகப்பு (Dashboard)",
    appointments: "முன்பதிவுகள்",
    prescriptions: "மருந்து சீட்டு",
    medicines: "மருந்துகள்",
    records: "மருத்துவ ஆவணங்கள்",
    timeline: "சுகாதார காலவரிசை",
    settings: "அமைப்புகள்",
    logout: "வெளியேறு",
    login: "உள்நுழை",
    scheduleConsultation: "மருத்துவர் ஆலோசனை முன்பதிவு",
    bookAppointment: "நேரத்தை முன்பதிவு செய்க",
    availableSlots: "கிடைக்கும் நேரங்கள்",
    morningOpd: "காலை நேரம் (Morning OPD)",
    afternoonOpd: "மதிய நேரம் (Afternoon OPD)",
    eveningOpd: "மாலை நேரம் (Evening OPD)",
    selectedSlot: "தேர்ந்தெடுக்கப்பட்ட நேரம்",
    confirmBooking: "முன்பதிவை உறுதிசெய்க",
    consultationFee: "ஆலோசனை கட்டணம்",
    duration: "கால அளவு",
    mins: "நிமிடங்கள்",
    acceptingPatients: "நோயாளிகள் அனுமதிக்கப்படுகிறார்கள்",
    noSlots: "தற்போது முன்பதிவு இடங்கள் இல்லை.",
    paymentWithGPay: "கூகிள் பே (Google Pay) கட்டண இணைப்பு",
    payWithGooglePay: "Google Pay மூலம் செலுத்தவும்",
    demoQrCode: "மாதிரி கட்டண QR குறியீடு",
    scanAndPay: "Google Pay அல்லது எந்த UPI செயலியிலும் ஸ்கேன் செய்யவும்",
    instantUpiSettlement: "உடனடி UPI சரிபார்ப்பு",
    simulateSuccess: "Google Pay கட்டணம் வெற்றிகரமாக உருவகப்படுத்தப்பட்டது",
    paymentCompleted: "கட்டணம் செலுத்தப்பட்டது",
    transactionId: "பரிவர்த்தனை எண்",
    amountPaid: "செலுத்தப்பட்ட தொகை",
    prePatientQuestions: "நோயாளி முன்கூட்டிய கேள்விகள்",
    basicReport: "அடிப்படை முன்கூட்டிய அறிக்கை",
    viewBasicReportEarlier: "மருத்துவர் இந்த அறிக்கையை முன்கூட்டியே பார்க்கலாம்",
    primaryConcern: "முக்கிய உடல்நலப் பிரச்சனை",
    symptoms: "அறிகுறிகள்",
    severity: "தீவிரத்தன்மை",
    painLevel: "வலி மதிப்பீடு (0-10)",
    allergies: "ஒவ்வாமைகள் (Allergies)",
    medicalHistory: "முந்தைய மருத்துவ வரலாறு",
    startIntakeNow: "கேள்விகளுக்கு இப்போதே பதிலளிக்கவும்",
    intakeCompleted: "படிவம் சமர்ப்பிக்கப்பட்டது",
    doctorReviewNotice: "ஆலோசனை தொடங்கும் முன்பே மருத்துவர் இதை மதிப்பாய்வு செய்ய முடியும்",
    medicineStatus: "மருந்து நிலை",
    activeOn: "செயலில் உள்ளது (ON)",
    stoppedOff: "நிறுத்தப்பட்டது (Turn OFF)",
    pausedOnHold: "தற்காலிகமாக நிறுத்தி வைக்கப்பட்டுள்ளது",
    tapering: "அளவைக் குறைத்தல் (Tapering)",
    turnOffMedicine: "மருந்தை நிறுத்துங்கள்",
    resumeMedicine: "மருந்தை மீண்டும் தொடங்குங்கள்",
    contraindicationReason: "மருந்தை நிறுத்த மருத்துவக் காரணம்",
    renalRisk: "சிறுநீரக பாதிப்பு அபாயம்",
    hypoglycemiaRisk: "சர்க்கரை குறைவு அபாயம்",
    allergicReaction: "ஒவ்வாமை எதிர்வினை",
    goalAchieved: "சிகிச்சை நோக்கம் நிறைவடைந்தது",
  },
  te: {
    dashboard: "డ్యాష్‌బోర్డ్",
    appointments: "అపాయింట్‌మెంట్లు",
    prescriptions: "మందుల చీటీ (ప్రిస్క్రిప్షన్)",
    medicines: "మందులు",
    records: "వైద్య రికార్డులు",
    timeline: "ఆరోగ్య కాలక్రమం",
    settings: "సెట్టింగ్‌లు",
    logout: "లాగ్ అవుట్",
    login: "లాగిన్",
    scheduleConsultation: "డాక్టర్ సంప్రదింపు బుక్ చేయండి",
    bookAppointment: "అపాయింట్‌మెంట్ బుక్ చేసుకోండి",
    availableSlots: "అందుబాటులో ఉన్న సమయాలు (Slots)",
    morningOpd: "ఉదయం సమయం (Morning)",
    afternoonOpd: "మధ్యాహ్నం సమయం (Afternoon)",
    eveningOpd: "సాయంత్రం సమయం (Evening)",
    selectedSlot: "ఎంచుకున్న సమయం",
    confirmBooking: "బుకింగ్ నిర్ధారించండి",
    consultationFee: "సంప్రదింపు రుసుము",
    duration: "వ్యవధి",
    mins: "నిమిషాలు",
    acceptingPatients: "రోగులను స్వీకరిస్తున్నారు",
    noSlots: "ప్రస్తుతం ఏ స్లాట్‌లూ అందుబాటులో లేవు.",
    paymentWithGPay: "గూగుల్ పే (Google Pay) తో చెల్లింపు లింక్",
    payWithGooglePay: "Google Pay తో చెల్లించండి",
    demoQrCode: "డెమో చెల్లింపు QR కోడ్",
    scanAndPay: "Google Pay లేదా ఏదైనా UPI యాప్‌తో స్కాన్ చేయండి",
    instantUpiSettlement: "తక్షణ UPI ధృవీకరణ",
    simulateSuccess: "Google Pay చెల్లింపు విజయవంతమైనదిగా చూపించు",
    paymentCompleted: "చెల్లింపు పూర్తయింది",
    transactionId: "లావాదేవీ ID",
    amountPaid: "చెల్లించిన మొత్తం",
    prePatientQuestions: "రోగి ప్రాథమిక ప్రశ్నలు (Pre-intake)",
    basicReport: "ప్రాథమిక ముందస్తు నివేదిక",
    viewBasicReportEarlier: "డాక్టర్ ఈ ప్రాథమిక నివేదికను ముందే చూడవచ్చు",
    primaryConcern: "ప్రధాన ఆరోగ్య సమస్య",
    symptoms: "కనిపిస్తున్న లక్షణాలు",
    severity: "తీవ్రత స్కోరు",
    painLevel: "నొప్పి తీవ్రత (0-10)",
    allergies: "తెలిసిన అలెర్జీలు",
    medicalHistory: "గత వైద్య చరిత్ర",
    startIntakeNow: "ప్రశ్నలకు ఇప్పుడే సమాధానమివ్వండి",
    intakeCompleted: "ప్రశ్నావళి విజయవంతంగా సమర్పించబడింది",
    doctorReviewNotice: "కన్సల్టేషన్ ప్రారంభానికి ముందే డాక్టర్ ఈ ప్రాథమిక నివేదికను చూడగలరు",
    medicineStatus: "మందు స్థితి (Status)",
    activeOn: "వాడుకలో ఉంది (ON)",
    stoppedOff: "నిలిపివేయబడింది (Turn OFF)",
    pausedOnHold: "తాత్కాలికంగా ఆపబడింది (Paused)",
    tapering: "మోతాదు తగ్గించడం (Tapering)",
    turnOffMedicine: "మందు ఆపివేయండి (Turn OFF)",
    resumeMedicine: "మందును తిరిగి ప్రారంభించండి",
    contraindicationReason: "మందు ఆపడానికి వైద్యపరమైన కారణం",
    renalRisk: "కిడ్నీ రిస్క్ / పెరిగిన సీరం క్రియాటినిన్",
    hypoglycemiaRisk: "షుగర్ తగ్గే ప్రమాదం",
    allergicReaction: "అలెర్జీ ప్రతిచర్య",
    goalAchieved: "చికిత్స లక్ష్యం పూర్తయింది",
  },
  kn: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    appointments: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು",
    prescriptions: "ಔಷಧಿ ಚೀಟಿ",
    medicines: "ಔಷಧಿಗಳು",
    records: "ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು",
    timeline: "ಆರೋಗ್ಯ ಟೈಮ್‌ಲೈನ್",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    logout: "ಸೈನ್ ಔಟ್",
    login: "ಲಾಗಿನ್",
    scheduleConsultation: "ವೈದ್ಯರ ಸಮಾಲೋಚನೆ ಬುಕ್ ಮಾಡಿ",
    bookAppointment: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ",
    availableSlots: "ಲಭ್ಯವಿರುವ ಸಮಯಗಳು (Slots)",
    morningOpd: "ಬೆಳಗಿನ ಅವಧಿ (Morning)",
    afternoonOpd: "ಮಧ್ಯಾಹ್ನದ ಅವಧಿ (Afternoon)",
    eveningOpd: "ಸಂಜೆಯ ಅವಧಿ (Evening)",
    selectedSlot: "ಆಯ್ಕೆಮಾಡಿದ ಸಮಯ",
    confirmBooking: "ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಿ",
    consultationFee: "ಸಮಾಲೋಚನೆ ಶುಲ್ಕ",
    duration: "ಅವಧಿ",
    mins: "ನಿಮಿಷಗಳು",
    acceptingPatients: "ರೋಗಿಗಳನ್ನು ಸ್ವೀಕರಿಸಲಾಗುತ್ತಿದೆ",
    noSlots: "ಪ್ರಸ್ತುತ ಯಾವುದೇ ಸಮಯ ಲಭ್ಯವಿಲ್ಲ.",
    paymentWithGPay: "ಗೂಗಲ್ ಪೇ (Google Pay) ಪಾವತಿ ಲಿಂಕ್",
    payWithGooglePay: "Google Pay ಮೂಲಕ ಪಾವತಿಸಿ",
    demoQrCode: "ಡೆಮೊ ಪಾವತಿ QR ಕೋಡ್",
    scanAndPay: "Google Pay ಅಥವಾ ಯಾವುದೇ UPI ಆ್ಯಪ್‌ನಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    instantUpiSettlement: "ತ್ವರಿತ UPI ಪರಿಶೀಲನೆ",
    simulateSuccess: "Google Pay ಪಾವತಿ ಯಶಸ್ವಿ ಸಿಮ್ಯುಲೇಶನ್",
    paymentCompleted: "ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ",
    transactionId: "ವಹಿವಾಟು ಐಡಿ",
    amountPaid: "ಪಾವತಿಸಿದ ಮೊತ್ತ",
    prePatientQuestions: "ರೋಗಿಯ ಮುಂಚಿನ ಪ್ರಶ್ನೆಗಳು",
    basicReport: "ಪ್ರಾಥಮಿಕ ಮುನ್ನೋಟ ವರದಿ",
    viewBasicReportEarlier: "ವೈದ್ಯರು ಈ ವರದಿಯನ್ನು ಮುಂಚಿತವಾಗಿಯೇ ನೋಡಬಹುದು",
    primaryConcern: "ಮುಖ್ಯ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ",
    symptoms: "ಕಂಡುಬರುವ ಲಕ್ಷಣಗಳು",
    severity: "ತೀವ್ರತೆಯ ಸ್ಕೋರ್",
    painLevel: "ನೋವಿನ ಪ್ರಮಾಣ (0-10)",
    allergies: "ಅಲರ್ಜಿಗಳ ವಿವರ",
    medicalHistory: "ಹಿಂದಿನ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ",
    startIntakeNow: "ಪ್ರಶ್ನೆಗಳನ್ನು ಈಗಲೇ ಭರ್ತಿ ಮಾಡಿ",
    intakeCompleted: "ಪ್ರಶ್ನೆಗಳನ್ನು ಸಲ್ಲಿಸಲಾಗಿದೆ",
    doctorReviewNotice: "ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭವಾಗುವ ಮೊದಲು ವೈದ್ಯರು ಇದನ್ನು ಪರಿಶೀಲಿಸಬಹುದು",
    medicineStatus: "ಔಷಧಿಯ ಸ್ಥಿತಿ",
    activeOn: "ಚಾಲ್ತಿಯಲ್ಲಿದೆ (ON)",
    stoppedOff: "ನಿಲ್ಲಿಸಲಾಗಿದೆ (Turn OFF)",
    pausedOnHold: "ತಾತ್ಕಾಲಿಕವಾಗಿ ತಡೆಹಿಡಿಯಲಾಗಿದೆ",
    tapering: "ಡೋಸ್ ಕಡಿಮೆ ಮಾಡುವುದು",
    turnOffMedicine: "ಔಷಧಿ ನಿಲ್ಲಿಸಿ",
    resumeMedicine: "ಔಷಧಿ ಪುನರಾರಂಭಿಸಿ",
    contraindicationReason: "ಔಷಧಿ ನಿಲ್ಲಿಸಲು ವೈದ್ಯಕೀಯ ಕಾರಣ",
    renalRisk: "ಮೂತ್ರಪಿಂಡದ ಅಪಾಯ / ಕ್ರಿಯೇಟಿನೈನ್ ಹೆಚ್ಚಳ",
    hypoglycemiaRisk: "ಸಕ್ಕರೆ ಮಟ್ಟ ಕುಸಿಯುವ ಅಪಾಯ",
    allergicReaction: "ಅಲರ್ಜಿ ಪ್ರತಿಕ್ರಿಯೆ",
    goalAchieved: "ಚಿಕಿತ್ಸೆಯ ಗುರಿ ಪೂರ್ಣಗೊಂಡಿದೆ",
  },
  ml: {
    dashboard: "ഡാഷ്‌ബോർഡ്",
    appointments: "അപ്പോയിന്റ്മെന്റുകൾ",
    prescriptions: "മരുന്ന് കുറിപ്പടി",
    medicines: "മരുന്നുകൾ",
    records: "മെഡിക്കൽ രേഖകൾ",
    timeline: "ആരോഗ്യ ടൈംലൈൻ",
    settings: "ക്രമീകരണങ്ങൾ",
    logout: "പുറത്തുകടക്കുക",
    login: "ലോഗിൻ",
    scheduleConsultation: "ഡോക്ടർ കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക",
    bookAppointment: "അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക",
    availableSlots: "ലഭ്യമായ സമയം (Slots)",
    morningOpd: "രാവിലത്തെ സമയം (Morning)",
    afternoonOpd: "ഉച്ചകഴിഞ്ഞുള്ള സമയം (Afternoon)",
    eveningOpd: "വൈകുന്നേരത്തെ സമയം (Evening)",
    selectedSlot: "തിരഞ്ഞെടുത്ത സമയം",
    confirmBooking: "ബുക്കിംഗ് സ്ഥിരീകരിക്കുക",
    consultationFee: "കൺസൾട്ടേഷൻ ഫീസ്",
    duration: "ദൈർഘ്യം",
    mins: "മിനിറ്റ്",
    acceptingPatients: "രോഗികളെ സ്വീകരിക്കുന്നു",
    noSlots: "ഇപ്പോൾ സ്ലോട്ടുകൾ ലഭ്യമല്ല.",
    paymentWithGPay: "ഗൂഗിൾ പേ (Google Pay) പേയ്മെന്റ് ലിങ്ക്",
    payWithGooglePay: "Google Pay വഴി പണമടയ്ക്കുക",
    demoQrCode: "ഡെമോ പേയ്മെന്റ് ക്യുആർ കോഡ് (QR Code)",
    scanAndPay: "Google Pay അല്ലെങ്കിൽ ഏതെങ്കിലും UPI ആപ്പ് വഴി സ്കാൻ ചെയ്യുക",
    instantUpiSettlement: "തത്സമയ UPI പരിശോധന",
    simulateSuccess: "Google Pay പേയ്മെന്റ് വിജയകരമായി കാണിക്കുക",
    paymentCompleted: "പേയ്മെന്റ് വിജയകരമായി പൂർത്തിയായി",
    transactionId: "ഇടപാട് ഐഡി",
    amountPaid: "അടച്ച തുക",
    prePatientQuestions: "കൺസൾട്ടേഷന് മുൻപുള്ള ചോദ്യാവലി",
    basicReport: "പ്രാഥമിക റിപ്പോർട്ട്",
    viewBasicReportEarlier: "ഡോക്ടർക്ക് ഈ റിപ്പോർട്ട് മുൻകൂട്ടി കാണാൻ കഴിയും",
    primaryConcern: "പ്രധാന ആരോഗ്യ പ്രശ്നം",
    symptoms: "ലക്ഷണങ്ങൾ",
    severity: "തീവ്രത",
    painLevel: "വേദനയുടെ തോത് (0-10)",
    allergies: "അലർജികൾ",
    medicalHistory: "മുൻകാല മെഡിക്കൽ ചരിത്രം",
    startIntakeNow: "ചോദ്യങ്ങൾക്ക് ഇപ്പോൾ ഉത്തരം നൽകുക",
    intakeCompleted: "വിവരങ്ങൾ വിജയകരമായി സമർപ്പിച്ചു",
    doctorReviewNotice: "കൺസൾട്ടേഷൻ തുടങ്ങുന്നതിന് മുൻപ് ഡോക്ടർക്ക് ഇത് കാണാം",
    medicineStatus: "മരുന്നിന്റെ അവസ്ഥ",
    activeOn: "തുടരുക (ON)",
    stoppedOff: "നിർത്തുക (Turn OFF)",
    pausedOnHold: "താൽക്കാലികമായി നിർത്തിവെച്ചു",
    tapering: "അളവ് കുറയ്ക്കൽ (Tapering)",
    turnOffMedicine: "മരുന്ന് നിർത്തുക",
    resumeMedicine: "മരുന്ന് പുനരാരംഭിക്കുക",
    contraindicationReason: "മരുന്ന് നിർത്താനുള്ള കാരണം",
    renalRisk: "വൃക്ക തകരാർ സാധ്യത",
    hypoglycemiaRisk: "ഷുഗർ കുറയാനുള്ള സാധ്യത",
    allergicReaction: "അലർജി പ്രശ്നം",
    goalAchieved: "ചികിത്സാ ലക്ഷ്യം പൂർത്തിയായി",
  },
  pa: {
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    appointments: "ਮੁਲਾਕਾਤਾਂ (Appointments)",
    prescriptions: "ਦਵਾਈਆਂ ਦੀ ਪਰਚੀ",
    medicines: "ਦਵਾਈਆਂ",
    records: "ਮੈਡੀਕਲ ਰਿਕਾਰਡ",
    timeline: "ਸਿਹਤ ਟਾਈਮਲਾਈਨ",
    settings: "ਸੈਟਿੰਗਾਂ",
    logout: "ਲਾਗ ਆਉਟ",
    login: "ਲਾਗ ਇਨ",
    scheduleConsultation: "ਡਾਕਟਰ ਨਾਲ ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ",
    bookAppointment: "ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ",
    availableSlots: "ਉਪਲਬਧ ਸਮਾਂ (Slots)",
    morningOpd: "ਸਵੇਰ ਦਾ ਸਮਾਂ (Morning)",
    afternoonOpd: "ਦੁਪਹਿਰ ਦਾ ਸਮਾਂ (Afternoon)",
    eveningOpd: "ਸ਼ਾਮ ਦਾ ਸਮਾਂ (Evening)",
    selectedSlot: "ਚੁਣਿਆ ਸਮਾਂ",
    confirmBooking: "ਬੁਕਿੰਗ ਪੱਕੀ ਕਰੋ",
    consultationFee: "ਸਲਾਹ ਫੀਸ",
    duration: "ਮਿਆਦ",
    mins: "ਮਿੰਟ",
    acceptingPatients: "ਮਰੀਜ਼ ਸਵੀਕਾਰ ਹਨ",
    noSlots: "ਕੋਈ ਸਲਾਟ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
    paymentWithGPay: "ਗੂਗਲ ਪੇ (Google Pay) ਨਾਲ ਭੁਗਤਾਨ ਲਿੰਕ",
    payWithGooglePay: "Google Pay ਨਾਲ ਭੁਗਤਾਨ ਕਰੋ",
    demoQrCode: "ਡੈਮੋ ਭੁਗਤਾਨ QR ਕੋਡ",
    scanAndPay: "Google Pay ਜਾਂ ਕਿਸੇ ਵੀ UPI ਐਪ ਨਾਲ ਸਕੈਨ ਕਰੋ",
    instantUpiSettlement: "ਤੁਰੰਤ UPI ਪੁਸ਼ਟੀ",
    simulateSuccess: "Google Pay ਭੁਗਤਾਨ ਸਫਲ ਦਿਖਾਓ",
    paymentCompleted: "ਭੁਗਤਾਨ ਸਫਲ ਰਿਹਾ",
    transactionId: "ਲੈਣ-ਦੇਣ ਨੰਬਰ (ID)",
    amountPaid: "ਅਦਾ ਕੀਤੀ ਰਕਮ",
    prePatientQuestions: "ਮਰੀਜ਼ ਪੂਰਵ ਸਵਾਲ (Pre-intake)",
    basicReport: "ਮੁੱਢਲੀ ਰਿਪੋਰਟ",
    viewBasicReportEarlier: "ਡਾਕਟਰ ਪਹਿਲਾਂ ਹੀ ਇਹ ਰਿਪੋਰਟ ਦੇਖ ਸਕਦੇ ਹਨ",
    primaryConcern: "ਮੁੱਖ ਸਿਹਤ ਸਮੱਸਿਆ",
    symptoms: "ਲੱਛਣ",
    severity: "ਗੰਭੀਰਤਾ ਸਕੋਰ",
    painLevel: "ਦਰਦ ਦਾ ਪੈਮਾਨਾ (0-10)",
    allergies: "ਐਲਰਜੀ ਵੇਰਵਾ",
    medicalHistory: "ਪਿਛਲਾ ਮੈਡੀਕਲ ਇਤਿਹਾਸ",
    startIntakeNow: "ਸਵਾਲ ਹੁਣੇ ਭਰੋ",
    intakeCompleted: "ਸਵਾਲ ਸਫਲਤਾਪੂਰਵਕ ਜਮ੍ਹਾਂ ਹੋਏ",
    doctorReviewNotice: "ਡਾਕਟਰ ਮੁਲਾਕਾਤ ਤੋਂ ਪਹਿਲਾਂ ਇਹ ਰਿਪੋਰਟ ਵੇਖ ਸਕਦੇ ਹਨ",
    medicineStatus: "ਦਵਾਈ ਦੀ ਸਥਿਤੀ",
    activeOn: "ਚਾਲੂ (ON)",
    stoppedOff: "ਬੰਦ ਕੀਤੀ (Turn OFF)",
    pausedOnHold: "ਕੁਝ ਸਮੇਂ ਲਈ ਰੋਕੀ ਗਈ",
    tapering: "ਖ਼ੁਰਾਕ ਘਟਾਉਣਾ",
    turnOffMedicine: "ਦਵਾਈ ਬੰਦ ਕਰੋ",
    resumeMedicine: "ਦਵਾਈ ਮੁੜ ਸ਼ੁਰੂ ਕਰੋ",
    contraindicationReason: "ਦਵਾਈ ਬੰਦ ਕਰਨ ਦਾ ਕਲੀਨਿਕਲ ਕਾਰਨ",
    renalRisk: "ਗੁਰਦੇ ਦਾ ਜੋਖਮ",
    hypoglycemiaRisk: "ਸ਼ੂਗਰ ਘਟਣ ਦਾ ਜੋਖਮ",
    allergicReaction: "ਐਲਰਜੀ ਪ੍ਰਤੀਕਿਰਿਆ",
    goalAchieved: "ਇਲਾਜ ਪੂਰਾ ਹੋਇਆ",
  },
};

// Comprehensive list of DOM phrases for instant in-memory translation (longest to shortest)
export const DOM_TRANSLATION_MAP_HI: [string, string][] = [
  // Full summaries & long clinical texts
  [
    "Rajesh Sharma is a known patient with Type 2 Diabetes Mellitus (diagnosed 2021), Essential Hypertension, Stage 2 Chronic Kidney Disease under longitudinal follow-up. Glycemic control is improving (HbA1c 7.1%), but recent metabolic testing shows an acute jump in serum creatinine from 1.0 to 1.7 mg/dL with eGFR 46 mL/min requiring medication review.",
    "राजेश शर्मा टाइप 2 डायबिटीज मेलिटस (2021 में निदान), प्राथमिक उच्च रक्तचाप, स्टेज 2 क्रोनिक किडनी रोग के ज्ञात मरीज़ हैं जो निरंतर अनुवर्ती जांच में हैं। रक्त शर्करा नियंत्रण में सुधार हो रहा है (HbA1c 7.1%), लेकिन हालिया मेटाबॉलिक जांच में सीरम क्रिएटिनिन 1.0 से बढ़कर 1.7 mg/dL (eGFR 46 mL/min) पाया गया है, जिसके लिए दवाओं की समीक्षा आवश्यक है।"
  ],
  [
    "Comparison between 15 Jan 2024 (Baseline) and 18 Jul 2024 (Follow-up) shows: HbA1c improved (-1.3%), Creatinine elevated (+70%), and persistent Albuminuria.",
    "15 जनवरी 2024 (आधारभूत) और 18 जुलाई 2024 (फॉलो-अप) की तुलना में: HbA1c में सुधार (-1.3%), क्रिएटिनिन में वृद्धि (+70%), और लगातार एल्बुमिनुरिया देखा गया।"
  ],
  [
    "Follow-up Consultation • Dr. Aarav Mehta",
    "फॉलो-अप परामर्श • डॉ. आरव मेहता"
  ],
  [
    "No appointments scheduled for this patient.",
    "इस मरीज़ के लिए कोई अपॉइंटमेंट निर्धारित नहीं है।"
  ],
  [
    "No active medications currently prescribed.",
    "वर्तमान में कोई सक्रिय दवा निर्धारित नहीं है।"
  ],
  [
    "No notifications at this time.",
    "फिलहाल कोई सूचना नहीं है।"
  ],
  [
    "Patient Consultation Appointments",
    "मरीज़ परामर्श अपॉइंटमेंट्स"
  ],
  [
    "Schedule Next Appointment",
    "अगला अपॉइंटमेंट शेड्यूल करें"
  ],
  [
    "Review Latest Changes",
    "नवीनतम बदलाव देखें"
  ],
  [
    "Items Requiring Review",
    "समीक्षा आवश्यक मदें"
  ],
  [
    "⚠️ Items Requiring Review",
    "⚠️ समीक्षा आवश्यक मदें"
  ],
  [
    "Patient Directory",
    "मरीज़ डायरेक्टरी"
  ],
  [
    "Patient Summary",
    "मरीज़ सारांश"
  ],
  [
    "PATIENT SUMMARY",
    "मरीज़ सारांश"
  ],
  [
    "Doctor Station",
    "डॉक्टर स्टेशन"
  ],
  [
    "Patient Health Vault",
    "मरीज़ हेल्थ वॉल्ट"
  ],
  [
    "Clinical Tools",
    "क्लिनिकल टूल्स"
  ],
  [
    "WHAT CHANGED? (AI)",
    "क्या बदला? (AI)"
  ],
  [
    "WHAT CHANGED?",
    "क्या बदला?"
  ],
  [
    "What Changed",
    "क्या बदला"
  ],
  [
    "AI Doctor Brief",
    "एआई डॉक्टर ब्रीफ"
  ],
  [
    "Current Medicines",
    "वर्तमान दवाइयाँ"
  ],
  [
    "Latest AI Review",
    "नवीनतम एआई समीक्षा"
  ],
  [
    "Next Appointment",
    "अगला अपॉइंटमेंट"
  ],
  [
    "Recent Records",
    "हालिया रिकॉर्ड्स"
  ],
  [
    "View Full History",
    "पूरा इतिहास देखें"
  ],
  [
    "View What Changed",
    "देखें क्या बदला"
  ],
  [
    "View All Notifications",
    "सभी सूचनाएं देखें →"
  ],
  [
    "View All",
    "सभी देखें"
  ],
  [
    "Upload Record",
    "रिकॉर्ड अपलोड करें"
  ],
  [
    "Upload Records",
    "रिकॉर्ड्स अपलोड करें"
  ],
  [
    "Create Prescription",
    "प्रिस्क्रिप्शन बनाएं"
  ],
  [
    "Schedule Appointment",
    "अपॉइंटमेंट तय करें"
  ],
  [
    "Add Clinical Note",
    "क्लिनिकल नोट जोड़ें"
  ],
  [
    "Appointments & Schedule",
    "अपॉइंटमेंट्स और शेड्यूल"
  ],
  [
    "Prescriptions & Tata 1mg",
    "प्रिस्क्रिप्शन और टाटा 1mg"
  ],
  [
    "Prescriptions & 1mg",
    "प्रिस्क्रिप्शन और 1mg"
  ],
  [
    "Visiting Hospitals & Slots",
    "विज़िटिंग अस्पताल और स्लॉट्स"
  ],
  [
    "Slot Availability & Hospitals",
    "स्लॉट उपलब्धता और अस्पताल"
  ],
  [
    "Consultation Fees",
    "परामर्श शुल्क"
  ],
  [
    "Medical Records",
    "चिकित्सा रिकॉर्ड्स"
  ],
  [
    "AI Differential Review",
    "एआई विभेदक समीक्षा"
  ],
  [
    "Pharmacotherapy",
    "औषधोपचार"
  ],
  [
    "AI Clinical Engine",
    "एआई क्लिनिकल इंजन"
  ],
  [
    "Senior Consultant",
    "वरिष्ठ सलाहकार"
  ],
  [
    "Verified Patient",
    "सत्यापित मरीज़"
  ],
  [
    "Enter Workspace",
    "वर्कस्पेस में जाएं"
  ],
  [
    "Enter Workspace →",
    "वर्कस्पेस में जाएं →"
  ],
  [
    "Patient Workspace",
    "मरीज़ वर्कस्पेस"
  ],
  [
    "Longitudinal differential engine",
    "अनुदैर्ध्य विभेदक विश्लेषण इंजन"
  ],
  [
    "OPD bookings and time slots",
    "ओपीडी बुकिंग और समय स्लॉट"
  ],
  [
    "Digital Rx & pharmacy dispatch",
    "डिजिटल पर्चा और फ़ार्मेसी डिस्पैच"
  ],
  [
    "Configure other hospital OPDs",
    "अन्य अस्पताल ओपीडी कॉन्फ़िगर करें"
  ],
  [
    "Edit Designation & Hospitals",
    "पदनाम और अस्पताल संपादित करें"
  ],
  [
    "Edit Doctor Clinical Credentials",
    "डॉक्टर विवरण संपादित करें"
  ],
  [
    "Update your designation and other hospitals visited",
    "अपना पदनाम और अन्य अस्पताल अपडेट करें"
  ],
  [
    "Other Hospitals Visited / Visiting Affiliations:",
    "अन्य संबद्ध अस्पताल:"
  ],
  [
    "Clinical Designation:",
    "क्लिनिकल पदनाम:"
  ],
  [
    "Physician Full Name:",
    "डॉक्टर का पूरा नाम:"
  ],
  [
    "Specialization:",
    "विशेषज्ञता:"
  ],
  [
    "Consultation Fee (₹):",
    "परामर्श शुल्क (₹):"
  ],
  [
    "Save Changes",
    "बदलाव सहेजें"
  ],
  [
    "Cancel",
    "रद्द करें"
  ],
  [
    "Saving...",
    "सहेजा जा रहा है..."
  ],
  [
    "Signing Out...",
    "साइन आउट हो रहा है..."
  ],
  [
    "Sign Out",
    "लॉग आउट"
  ],
  [
    "Sign In",
    "लॉग इन"
  ],
  [
    "Join CodeRx",
    "CodeRx से जुड़ें"
  ],
  [
    "Notifications",
    "सूचनाएं"
  ],
  [
    "Unread",
    "अपठित"
  ],
  [
    "3 changes detected",
    "3 बदलाव पाए गए"
  ],
  [
    "Extracted & Structured",
    "निकाला गया व संरचित"
  ],
  [
    "Payment Successful",
    "भुगतान सफल"
  ],
  [
    "Link Payment with Google Pay",
    "Google Pay से पेमेंट लिंक करें"
  ],
  [
    "Pay with Google Pay",
    "Google Pay से भुगतान करें"
  ],
  [
    "Demo Payment QR Code",
    "डेमो भुगतान QR कोड"
  ],
  [
    "Scan with Google Pay or any UPI app",
    "Google Pay या किसी भी UPI ऐप से स्कैन करें"
  ],
  [
    "Instant UPI Verification",
    "तुरंत UPI सत्यापन"
  ],
  [
    "Simulate GPay Payment Success",
    "Google Pay भुगतान सफल सिमुलेट करें"
  ],
  [
    "Pre-Patient Intake Questions",
    "मरीज़ पूर्व-परामर्श प्रश्नावली"
  ],
  [
    "Basic Pre-Consult Report",
    "प्राथमिक प्री-कंसल्ट रिपोर्ट"
  ],
  [
    "View Basic Intake Report Earlier",
    "डॉक्टर पहले ही बेसिक रिपोर्ट देख सकते हैं"
  ],
  [
    "Schedule a Consultation",
    "डॉक्टर परामर्श बुक करें"
  ],
  [
    "Book Appointment",
    "अपॉइंटमेंट बुक करें"
  ],
  [
    "Available Slots",
    "उपलब्ध स्लॉट्स"
  ],
  [
    "Morning OPD",
    "सुबह की ओपीडी (Morning)"
  ],
  [
    "Afternoon OPD",
    "दोपहर की ओपीडी (Afternoon)"
  ],
  [
    "Evening OPD",
    "शाम की ओपीडी (Evening)"
  ],
  [
    "Selected Slot",
    "चुना गया समय"
  ],
  [
    "Confirm Booking",
    "बुकिंग कन्फर्म करें"
  ],
  [
    "Consultation Fee",
    "परामर्श शुल्क"
  ],
  [
    "Accepting Patients",
    "मरीज़ स्वीकार्य हैं"
  ],
  [
    "My Health",
    "मेरा स्वास्थ्य"
  ],
  [
    "Book Slot",
    "स्लॉट बुक करें"
  ],
  [
    "Workspace",
    "वर्कस्पेस"
  ],
  [
    "Overview",
    "अवलोकन"
  ],
  [
    "Timeline",
    "टाइमलाइन"
  ],
  [
    "Records",
    "रिकॉर्ड्स"
  ],
  [
    "Medicines",
    "दवाइयाँ"
  ],
  [
    "Prescriptions",
    "प्रिस्क्रिप्शन"
  ],
  [
    "Appointments",
    "अपॉइंटमेंट्स"
  ],
  [
    "Dashboard",
    "डैशबोर्ड"
  ],
  [
    "Patients",
    "मरीज़"
  ],
  [
    "Settings",
    "सेटिंग्स"
  ],
  [
    "Confirmed",
    "कन्फर्म"
  ],
  [
    "Verified",
    "सत्यापित"
  ],
  [
    "Alerts",
    "अलर्ट्स"
  ],
  [
    "Active",
    "सक्रिय"
  ],
  [
    "View",
    "देखें"
  ],
  [
    "More",
    "अधिक"
  ],
  [
    "yrs",
    "वर्ष"
  ],
  [
    "Male",
    "पुरुष"
  ],
  [
    "Female",
    "महिला"
  ],
  [
    "Last Visit:",
    "अंतिम विज़िट:"
  ],
  [
    "Last Visit",
    "अंतिम विज़िट"
  ],
  [
    "Today",
    "आज"
  ],
  [
    "Visiting:",
    "अस्पताल विज़िट:"
  ],
  [
    "MAIN",
    "मुख्य"
  ],
  [
    "CLINICAL",
    "क्लिनिकल"
  ],
  [
    "PRACTICE",
    "प्रैक्टिस"
  ],
  [
    "ABDM Ready",
    "ABDM सक्षम"
  ],
  [
    "Type 2 Diabetes & Hypertension",
    "टाइप 2 डायबिटीज और हाइपरटेंशन"
  ],
  [
    "Type 2 Diabetes",
    "टाइप 2 डायबिटीज"
  ],
  [
    "Hypertension",
    "उच्च रक्तचाप (हाइपरटेंशन)"
  ],
  [
    "Chronic Kidney Disease",
    "क्रोनिक किडनी रोग"
  ],
];

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

// WeakMap to safely remember original English strings of text nodes
const originalTextMap = new WeakMap<Node, string>();

function translateTextNode(node: Text, lang: SupportedLanguage) {
  if (!node.nodeValue || !node.nodeValue.trim()) return;

  const parent = node.parentElement;
  if (!parent) return;

  // Skip scripts, styles, code, and user input elements
  const tag = parent.tagName;
  if (
    tag === "SCRIPT" ||
    tag === "STYLE" ||
    tag === "TEXTAREA" ||
    tag === "INPUT" ||
    parent.isContentEditable ||
    parent.classList.contains("notranslate")
  ) {
    return;
  }

  // Remember original English text
  if (!originalTextMap.has(node)) {
    originalTextMap.set(node, node.nodeValue);
  }

  const orig = originalTextMap.get(node) || node.nodeValue;

  if (lang === "en") {
    if (node.nodeValue !== orig) {
      node.nodeValue = orig;
    }
    return;
  }

  if (lang === "hi") {
    let replaced = orig;
    for (const [english, hindi] of DOM_TRANSLATION_MAP_HI) {
      if (replaced.includes(english)) {
        replaced = replaced.split(english).join(hindi);
      }
    }
    if (replaced !== node.nodeValue) {
      node.nodeValue = replaced;
    }
  }
}

function walkAndTranslate(root: Node, lang: SupportedLanguage) {
  if (typeof document === "undefined") return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let currentNode = walker.nextNode();
  while (currentNode) {
    translateTextNode(currentNode as Text, lang);
    currentNode = walker.nextNode();
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");
  const observerRef = useRef<MutationObserver | null>(null);

  // Apply Google Translate cookie & sync with Google combo
  const triggerGoogleTranslate = (lang: SupportedLanguage) => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    try {
      const hostname = window.location.hostname;
      // Set root and domain cookie
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      document.cookie = `googtrans=/en/${lang}; domain=${hostname}; path=/;`;

      // Dispatch to Google Translate dropdown if loaded
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event("change"));
      }
    } catch {}
  };

  const applyDomTranslation = (lang: SupportedLanguage) => {
    if (typeof document === "undefined") return;

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Run TreeWalker over the body
    walkAndTranslate(document.body, lang);

    // Watch for dynamically rendered content (client-side routing, tabs, modals)
    if (lang !== "en") {
      const observer = new MutationObserver((mutations) => {
        for (const mut of mutations) {
          if (mut.type === "childList") {
            mut.addedNodes.forEach((node) => {
              walkAndTranslate(node, lang);
            });
          } else if (mut.type === "characterData" && mut.target) {
            translateTextNode(mut.target as Text, lang);
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      observerRef.current = observer;
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("triageai_lang") as SupportedLanguage;
      if (saved && TRANSLATIONS[saved]) {
        setLanguageState(saved);
        triggerGoogleTranslate(saved);
        setTimeout(() => applyDomTranslation(saved), 50);
      }
    } catch {}

    // Cleanup observer on unmount
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("triageai_lang", lang);
    } catch {}

    triggerGoogleTranslate(lang);
    applyDomTranslation(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = TRANSLATIONS.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

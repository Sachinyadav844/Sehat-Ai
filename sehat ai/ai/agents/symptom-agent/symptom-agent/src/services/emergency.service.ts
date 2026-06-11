const emergencyKeywords = [
  'chest pain',
  'breathing difficulty',
  'shortness of breath',
  'severe bleeding',
  'unconscious',
  'passed out',
  'stroke',
  'suicidal',
  'burn',
  'heart attack',
  'dizziness',
  'fainting',
];

export function detectEmergencySignals(message: string) {
  const normalized = message.toLowerCase();
  return emergencyKeywords.some((phrase) => normalized.includes(phrase));
}

export function emergencyEscalationText(language: string) {
  const escalationMap: Record<string, string> = {
    en: 'This sounds urgent. Please seek medical help immediately or contact emergency services right away.',
    hi: 'यह गंभीर हो सकता है। कृपया तुरंत चिकित्सकीय सहायता लें या इमरजेंसी सर्विस से संपर्क करें।',
    ur: 'یہ سنگین ہو سکتا ہے۔ براہ کرم فوری طور پر طبی مدد حاصل کریں یا ایمرجنسی سروس سے رابطہ کریں۔',
    bn: 'এটি জরুরি হতে পারে। অনুগ্রহ করে দ্রুত চিকিৎসা সহায়তা নিন বা জরুরি সেবা যোগাযোগ করুন।',
    ta: 'இது அவசரமாக இருக்கலாம். உடனடியாக மருத்துவ உதவியை அணுகவும் அல்லது அவசர சேவையை தொடர்பு கொள்ளவும்.',
    te: 'ఇది అత్యవసరంగా ఉండవచ్చు. వెంటనే వైద్య సహాయం కోరండి లేదా అత్యవసర సేవలను సంప్రదించండి.',
  };

  return escalationMap[language] || escalationMap.en;
}

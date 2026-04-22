import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "Profile": "Profile",
      "ID Card": "ID Card",
      "Timetable": "Timetable",
      "Academic Calendar": "Academic Calendar",
      "Academics & Study": "Academics & Study",
      "Examinations": "Examinations",
      "Placements & Career": "Placements & Career",
      "Fees & Finance": "Fees & Finance",
      "Hostel & Mess": "Hostel & Mess",
      "Transport": "Transport",
      "Helpdesk & Ops": "Helpdesk & Ops",
      "Admin Dashboard": "Admin Dashboard",
      "Student Directory": "Student Directory",
      "Attendance Panel": "Attendance Panel",
      "Manage Courses": "Manage Courses",
      "Grievance Inbox": "Grievance Inbox",
      "Audit Logs": "Audit Logs",
      "Change Language": "Change Language",
      "English": "English",
      "Hindi": "हिंदी",
      "Gujarati": "ગુજરાતી"
    }
  },
  hi: {
    translation: {
      "Dashboard": "डैशबोर्ड",
      "Profile": "प्रोफ़ाइल",
      "ID Card": "आईडी कार्ड",
      "Timetable": "समय सारिणी",
      "Academic Calendar": "शैक्षणिक कैलेंडर",
      "Academics & Study": "शिक्षा और अध्ययन",
      "Examinations": "परीक्षा",
      "Placements & Career": "प्लेसमेंट और करियर",
      "Fees & Finance": "फीस और वित्त",
      "Hostel & Mess": "हॉस्टल और मेस",
      "Transport": "परिवહન",
      "Helpdesk & Ops": "हेल्पडेस्क और ऑप्स",
      "Admin Dashboard": "एडमिन डैशबोर्ड",
      "Student Directory": "छात्र निर्देशिका",
      "Attendance Panel": "उपस्थिति पैनल",
      "Manage Courses": "पाठ्यक्रम प्रबंधित करें",
      "Grievance Inbox": "शिकायत इनबॉक्स",
      "Audit Logs": "ऑडिट लॉग",
      "Change Language": "भाषा बदलें",
      "English": "English",
      "Hindi": "हिंदी",
      "Gujarati": "ગુજરાતી"
    }
  },
  gu: {
    translation: {
      "Dashboard": "ડેશબોર્ડ",
      "Profile": "પ્રોફાઇલ",
      "ID Card": "આઈડી કાર્ડ",
      "Timetable": "સમયપત્રક",
      "Academic Calendar": "શૈક્ષણિક કેલેન્ડર",
      "Academics & Study": "શિક્ષણ અને અભ્યાસ",
      "Examinations": "પરીક્ષાઓ",
      "Placements & Career": "પ્લેસમેન્ટ અને કારકિર્દી",
      "Fees & Finance": "ફી અને ફાઇનાન્સ",
      "Hostel & Mess": "હોસ્ટેલ અને મેસ",
      "Transport": "પરિવહન",
      "Helpdesk & Ops": "હેલ્પડેસ્ક અને ઓપ્સ",
      "Admin Dashboard": "એડમિન ડેશબોર્ડ",
      "Student Directory": "વિદ્યાર્થી ડિરેક્ટરી",
      "Attendance Panel": "હાજરી પેનલ",
      "Manage Courses": "અભ્યાસક્રમો સંચાલિત કરો",
      "Grievance Inbox": "ફરિયાદ ઇનબોક્સ",
      "Audit Logs": "ઓડિટ લોગ્સ",
      "Change Language": "ભાષા બદલો",
      "English": "English",
      "Hindi": "हिंदी",
      "Gujarati": "ગુજરાતી"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;

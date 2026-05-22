import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, QueryDocumentSnapshot } from "firebase/firestore";

// Define the survey response structure
export interface SurveyResponse {
  id?: string;
  submittedAt: string;
  language: "en" | "fr";
  employeeName: string;
  
  // Section 1
  currentScheduleSatisfaction: number;
  hoursWorkedPerWeekRange: string;
  section1Comments?: string;
  
  // Section 2
  workdayPreference: string; // 'fewer_longer' | 'more_spread'
  willingToReduceHoursForLessPay: string; // 'Yes' | 'No'
  preferredShift: string; // 'morning' | 'afternoon' | 'full_day' | 'no_preference'
  rotatingScheduleOpinion: string; // 'fixed' | 'variable'
  teamSizePreference: string; // '2_people' | '3_people'
  section2Comments?: string;
  
  // Section 3
  unavailableDays: string[];
  daysOffNeededForRecovery: string; // '1' | '2' | '3' | '4+'
  section3Comments?: string;
  
  // Section 4
  salarySatisfaction: number;
  preferredCompensationImprovement: string; // 'salary' | 'bonus' | 'benefits' | 'off_days'
  desiredPercentageIncreaseRange: string; // '0-5%', '5-10%', '10-15%', '15-20%', '20%+'
  section4Comments?: string;
  
  // Section 5
  overallJobSatisfaction: number;
  mostImpactfulChangeDesired: string; // 'schedule' | 'salary' | 'communication' | 'physical' | 'other'
  section5Comments?: string;
}

// Check if Firebase configuration keys are present in Vite env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if we should run in demo mode (fallback)
export const isDemoMode = 
  !firebaseConfig.apiKey || 
  firebaseConfig.apiKey === "sua-api-key" || 
  firebaseConfig.apiKey.trim() === "";

let db: any = null;

if (!isDemoMode) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log("Firebase initialized successfully in production cloud mode.");
  } catch (error) {
    console.error("Failed to initialize Firebase, falling back to local demo mode:", error);
    (window as any).isDemoModeOverride = true;
  }
} else {
  console.warn(
    "Vite environment keys not found or default. Running ERSVoix in Local Demo Mode.\n" +
    "All responses will be saved in LocalStorage."
  );
}

// Realistic employee names for Rudolf Steiner School of Montreal (Waldorf style)
const MOCK_NAMES = [
  "Clara Tremblay", "Jean-François Mercier", "Amélie Dubois", "Lucas Bouchard", 
  "Chloé Villeneuve", "Gabriel Gauthier", "Sophie Roy", "Mathieu Lévesque", 
  "Elodie Côté", "Olivier Gagnon", "Camille Harvey", "Thomas Pelletier"
];

// Generate realistic mock responses to populate the charts initially in demo mode
const generateMockResponses = (): SurveyResponse[] => {
  const responses: SurveyResponse[] = [];
  const now = new Date();
  
  for (let i = 0; i < MOCK_NAMES.length; i++) {
    const name = MOCK_NAMES[i];
    const isFr = Math.random() > 0.3; // 70% French, 30% English (typical in Montreal)
    const dateOffset = Math.floor(Math.random() * 5); // 0 to 4 days ago
    const submissionDate = new Date(now.getTime() - dateOffset * 24 * 60 * 60 * 1000);
    
    // Core profile determinants to make the data logical and correlated:
    // Some employees are satisfied and want to keep fixed, some work too many hours and are burnt out.
    const isPartTime = Math.random() > 0.6;
    const hoursRange = isPartTime 
      ? (Math.random() > 0.5 ? "< 20h" : "20h - 30h") 
      : (Math.random() > 0.8 ? "> 40h" : (Math.random() > 0.4 ? "30h - 35h" : "35h - 40h"));
      
    const scheduleSat = isPartTime 
      ? Math.floor(Math.random() * 2) + 4 // 4-5 satisfaction
      : Math.floor(Math.random() * 3) + 2; // 2-4 satisfaction

    const workdayPref = Math.random() > 0.45 ? "fewer_longer" : "more_spread";
    const shiftPref = isPartTime 
      ? (Math.random() > 0.5 ? "morning" : "afternoon")
      : (Math.random() > 0.4 ? "full_day" : "no_preference");

    const salarySat = Math.floor(Math.random() * 3) + 2; // 2-4 satisfaction
    const overallSat = Math.min(5, Math.max(1, Math.round((scheduleSat + salarySat) / 2 + (Math.random() * 1 - 0.5))));
    
    // Choose unavailable days based on preferences
    const unavailable: string[] = [];
    if (Math.random() > 0.5) unavailable.push("Wednesday"); // Common for school meetings/half-days
    if (Math.random() > 0.7) unavailable.push("Friday");
    if (Math.random() > 0.9) unavailable.push("Monday");

    responses.push({
      id: `mock-${i + 1}`,
      submittedAt: submissionDate.toISOString(),
      language: isFr ? "fr" : "en",
      employeeName: name,
      
      // Section 1
      currentScheduleSatisfaction: scheduleSat,
      hoursWorkedPerWeekRange: hoursRange,
      section1Comments: scheduleSat <= 3 
        ? (isFr ? "J'aimerais avoir plus de prévisibilité sur les ateliers." : "I would like to have more regular hours in the mornings.")
        : undefined,
        
      // Section 2
      workdayPreference: workdayPref,
      willingToReduceHoursForLessPay: isPartTime ? "No" : (Math.random() > 0.7 ? "Yes" : "No"),
      preferredShift: shiftPref,
      rotatingScheduleOpinion: Math.random() > 0.75 ? "variable" : "fixed",
      teamSizePreference: Math.random() > 0.5 ? "2_people" : "3_people",
      section2Comments: shiftPref === "morning" && isFr 
        ? "Le matin convient mieux avec l'école de mes enfants." 
        : undefined,
        
      // Section 3
      unavailableDays: unavailable,
      daysOffNeededForRecovery: Math.random() > 0.4 ? "2" : (Math.random() > 0.3 ? "3" : "4+"),
      section3Comments: unavailable.length > 0 && isFr
        ? "Difficile de travailler les mercredis après-midi."
        : undefined,
        
      // Section 4
      salarySatisfaction: salarySat,
      preferredCompensationImprovement: salarySat <= 3
        ? (Math.random() > 0.4 ? "salary" : "benefits")
        : (Math.random() > 0.5 ? "off_days" : "bonus"),
      desiredPercentageIncreaseRange: salarySat <= 2 
        ? "15% - 20%" 
        : (salarySat === 3 ? "10% - 15%" : "5% - 10%"),
      section4Comments: salarySat <= 2 && isFr
        ? "Le coût de la vie augmente et nos salaires ne suivent pas la même courbe."
        : undefined,
        
      // Section 5
      overallJobSatisfaction: overallSat,
      mostImpactfulChangeDesired: overallSat <= 3 
        ? "salary" 
        : (Math.random() > 0.5 ? "schedule" : "communication"),
      section5Comments: isFr 
        ? "J'adore l'équipe pédagogique et le contact Waldorf, merci pour ce sondage !"
        : "I love the warm environment at Rudolf Steiner school."
    });
  }
  
  return responses;
};

// Add survey response
export const addSurveyResponse = async (response: SurveyResponse): Promise<string> => {
  if (isDemoMode) {
    const responses = await getSurveyResponses();
    const newId = `res-${Date.now()}`;
    const newResponse = { ...response, id: newId };
    responses.push(newResponse);
    localStorage.setItem("ersm_survey_responses", JSON.stringify(responses));
    return newId;
  } else {
    try {
      const docRef = await addDoc(collection(db, "survey_responses"), response);
      return docRef.id;
    } catch (error) {
      console.error("Error writing response to Firebase:", error);
      // Fallback to LocalStorage dynamically if network fails
      const responses = JSON.parse(localStorage.getItem("ersm_survey_responses") || "[]");
      const newId = `res-err-${Date.now()}`;
      responses.push({ ...response, id: newId });
      localStorage.setItem("ersm_survey_responses", JSON.stringify(responses));
      return newId;
    }
  }
};

// Retrieve all survey responses
export const getSurveyResponses = async (): Promise<SurveyResponse[]> => {
  if (isDemoMode) {
    const stored = localStorage.getItem("ersm_survey_responses");
    if (stored) {
      return JSON.parse(stored);
    } else {
      const mockData = generateMockResponses();
      localStorage.setItem("ersm_survey_responses", JSON.stringify(mockData));
      return mockData;
    }
  } else {
    try {
      const querySnapshot = await getDocs(collection(db, "survey_responses"));
      const responses: SurveyResponse[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        responses.push({ id: doc.id, ...doc.data() } as SurveyResponse);
      });
      return responses;
    } catch (error) {
      console.error("Error fetching survey responses from Firebase:", error);
      // Try local storage recovery
      const stored = localStorage.getItem("ersm_survey_responses");
      if (stored) return JSON.parse(stored);
      return generateMockResponses();
    }
  }
};

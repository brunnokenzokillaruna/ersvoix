export interface Translation {
  title: string;
  subtitle: string;
  languageSelect: string;
  nameLabel: string;
  namePlaceholder: string;
  startButton: string;
  prevButton: string;
  nextButton: string;
  submitButton: string;
  optionalLabel: string;
  commentsPlaceholder: string;
  questionIndicator: string;
  successTitle: string;
  successMessage: string;
  newSurveyButton: string;
  adminLink: string;
  formLink: string;

  // Section 1
  s1Title: string;
  q1Label: string;
  q1Min: string;
  q1Max: string;
  q2Label: string;
  s1CommentsLabel: string;

  // Section 2
  s2Title: string;
  q3Label: string;
  q3Opt1: string;
  q3Opt2: string;
  q4Label: string;
  q4Opt1: string;
  q4Opt2: string;
  q5Label: string;
  q5Morning: string;
  q5Afternoon: string;
  q5FullDay: string;
  q5NoPref: string;
  q6Label: string;
  q6Fixed: string;
  q6Variable: string;
  qTeamSizeLabel: string;
  qTeamSizeOpt2: string;
  qTeamSizeOpt3: string;
  s2CommentsLabel: string;

  // Section 3
  s3Title: string;
  q7Label: string;
  q7Sub: string;
  q8Label: string;
  s3CommentsLabel: string;

  // Section 4
  s4Title: string;
  q9Label: string;
  q9Min: string;
  q9Max: string;
  q10Label: string;
  q10Salary: string;
  q10Bonus: string;
  q10Benefits: string;
  q10Off: string;
  q11Label: string;
  s4CommentsLabel: string;

  // Section 5
  s5Title: string;
  q12Label: string;
  q12Min: string;
  q12Max: string;
  q13Label: string;
  q13Schedule: string;
  q13Salary: string;
  q13Communication: string;
  q13Physical: string;
  q13Other: string;
  s5CommentsLabel: string;

  // Admin Portal
  adminTitle: string;
  passcodePrompt: string;
  passcodePlaceholder: string;
  passcodeError: string;
  loginButton: string;
  tabDashboard: string;
  tabResponses: string;
  totalResponses: string;
  avgSatisfaction: string;
  avgSalarySatisfaction: string;
  avgJobSatisfaction: string;
  heatmapTitle: string;
  shiftDistribution: string;
  benefitDistribution: string;
  teamSizeDistribution: string;
  viewDetails: string;
  close: string;
  unavailabilityCount: string;
  demoModeAlert: string;
  daysList: { [key: string]: string };
}

export const locales: { fr: Translation; en: Translation } = {
  fr: {
    title: "Horaires du personnel & satisfaction",
    subtitle: "École Rudolf Steiner de Montréal",
    languageSelect: "Langue préférée / Preferred language",
    nameLabel: "Nom",
    namePlaceholder: "Entrez votre nom",
    startButton: "Commencer le sondage",
    prevButton: "Retour",
    nextButton: "Suivant",
    submitButton: "Soumettre mes réponses",
    optionalLabel: "(Optionnel)",
    commentsPlaceholder: "Ajoutez vos commentaires ou remarques ici...",
    questionIndicator: "Question {current} sur {total}",
    successTitle: "Merci pour votre participation !",
    successMessage: "Vos réponses ont été enregistrées avec succès. Vos commentaires précieux aideront la direction à réviser et à améliorer l'organisation des horaires de travail.",
    newSurveyButton: "Remplir à nouveau",
    adminLink: "Accès Admin",
    formLink: "Retour au Sondage",

    // Section 1
    s1Title: "1. Horaires actuels & satisfaction",
    q1Label: "Comment évaluez-vous votre satisfaction générale à l'égard de vos horaires de travail actuels ?",
    q1Min: "Très insatisfait",
    q1Max: "Très satisfait",
    q2Label: "En moyenne, combien d'heures travaillez-vous par semaine à l'école ?",
    s1CommentsLabel: "Commentaires additionnels sur vos horaires actuels (ex. changements souhaités) :",

    // Section 2
    s2Title: "2. Préférences d'horaires et de jours",
    q3Label: "Quel format de journée de travail préférez-vous ?",
    q3Opt1: "Moins de jours de travail, mais des journées plus longues",
    q3Opt2: "Plus de jours de travail, mais des journées plus courtes",
    q4Label: "Seriez-vous disposé(e) à réduire vos heures de travail (avec ajustement salarial proportionnel) pour obtenir plus de temps libre ?",
    q4Opt1: "Oui, je serais ouvert(e) à cette option",
    q4Opt2: "Non, je préfère conserver mon horaire et mon salaire actuels",
    q5Label: "Quel est votre quart de travail préféré ?",
    q5Morning: "Matin (Avant-midi)",
    q5Afternoon: "Après-midi",
    q5FullDay: "Journée complète",
    q5NoPref: "Sans préférence",
    q6Label: "Quelle est votre opinion sur les horaires variables (rotatifs) vs fixes ?",
    q6Fixed: "Je préfère un horaire 100% fixe",
    q6Variable: "J'ai de la flexibilité pour des horaires variables",
    qTeamSizeLabel: "Préférez-vous travailler au sein d'une équipe de...",
    qTeamSizeOpt2: "2 personnes (Une titulaire et une assistante)",
    qTeamSizeOpt3: "3 personnes (Une titulaire et deux assistantes)",
    s2CommentsLabel: "Difficultés particulières avec les horaires variables ou précisions sur vos préférences :",

    // Section 3
    s3Title: "3. Disponibilité & jours de repos",
    q7Label: "Quels jours de la semaine êtes-vous indisponible pour travailler ?",
    q7Sub: "Sélectionnez tous les jours concernés",
    q8Label: "De combien de jours de repos par semaine avez-vous besoin pour votre bien-être et récupération ?",
    s3CommentsLabel: "Commentaires ou précisions sur vos disponibilités ou jours de repos :",

    // Section 4
    s4Title: "4. Rémunération & reconnaissance",
    q9Label: "Quel évaluez-vous votre niveau de satisfaction quant à votre rémunération actuelle en relation avec vos responsabilités ?",
    q9Min: "Très insatisfait",
    q9Max: "Très satisfait",
    q10Label: "Quel type d'amélioration des avantages ou de la rémunération aurait le plus de valeur pour vous ?",
    q10Salary: "Augmentation salariale directe",
    q10Bonus: "Primes de performance / Bonis",
    q10Benefits: "Avantages sociaux (Santé, assurances, etc.)",
    q10Off: "Jours de congé payés supplémentaires",
    q11Label: "Quel pourcentage d'augmentation salariale estimez-vous nécessaire pour améliorer significativement votre satisfaction ?",
    s4CommentsLabel: "Commentaires additionnels sur la rémunération, les avantages ou la reconnaissance :",

    // Section 5
    s5Title: "5. Feedback général & bien-être",
    q12Label: "Globalement, quel est votre niveau de satisfaction et de bien-être au travail à l'école ?",
    q12Min: "Très insatisfait",
    q12Max: "Très satisfait",
    q13Label: "Quel changement concret dans l'école aurait le plus grand impact positif sur votre qualité de vie au travail ?",
    q13Schedule: "Amélioration des horaires",
    q13Salary: "Revalorisation salariale",
    q13Communication: "Ambiance & communication interne",
    q13Physical: "Environnement physique de travail",
    q13Other: "Autre changement",
    s5CommentsLabel: "Commentaires additionnels, suggestions ou préoccupations que vous aimeriez partager :",

    // Admin Portal
    adminTitle: "Portail Administratif",
    passcodePrompt: "Veuillez entrer le mot de passe administrateur :",
    passcodePlaceholder: "Mot de passe (ex. admin123)",
    passcodeError: "Mot de passe incorrect. Veuillez réessayer.",
    loginButton: "Se connecter",
    tabDashboard: "Tableau de Bord",
    tabResponses: "Réponses Individuelles",
    totalResponses: "Réponses totales",
    avgSatisfaction: "Satisfaction horaires (Moyenne)",
    avgSalarySatisfaction: "Satisfaction salaire (Moyenne)",
    avgJobSatisfaction: "Satisfaction générale (Moyenne)",
    heatmapTitle: "Carte thermique d'indisponibilité (Employés)",
    shiftDistribution: "Distribution des préférences de quart",
    benefitDistribution: "Avantages prioritaires demandés",
    teamSizeDistribution: "Structure d'équipe préférée (Distribution)",
    viewDetails: "Consulter la fiche",
    close: "Fermer",
    unavailabilityCount: "indisponible(s)",
    demoModeAlert: "Application en mode Démo (Stockage local). Pour sauvegarder en ligne, configurez le fichier .env.local avec vos clés Firebase.",
    daysList: {
      Monday: "Lundi",
      Tuesday: "Mardi",
      Wednesday: "Mercredi",
      Thursday: "Jeudi",
      Friday: "Vendredi"
    }
  },
  en: {
    title: "Staff schedules & satisfaction survey",
    subtitle: "Rudolf Steiner School of Montreal",
    languageSelect: "Language préférée / Preferred language",
    nameLabel: "Name",
    namePlaceholder: "Enter your name",
    startButton: "Start the Survey",
    prevButton: "Back",
    nextButton: "Next",
    submitButton: "Submit My Answers",
    optionalLabel: "(Optional)",
    commentsPlaceholder: "Add your comments or notes here...",
    questionIndicator: "Question {current} of {total}",
    successTitle: "Thank you for your participation!",
    successMessage: "Your responses have been successfully recorded. Your valuable feedback will help management revise and improve the organization of work schedules.",
    newSurveyButton: "Fill out again",
    adminLink: "Admin Access",
    formLink: "Back to Survey",

    // Section 1
    s1Title: "1. Current schedule & satisfaction",
    q1Label: "How would you rate your overall satisfaction with your current working hours?",
    q1Min: "Very unsatisfied",
    q1Max: "Very satisfied",
    q2Label: "On average, how many hours do you work per week at the school?",
    s1CommentsLabel: "Additional comments about your current hours (e.g. priority changes):",

    // Section 2
    s2Title: "2. Scheduling preferences",
    q3Label: "Which workday format do you prefer?",
    q3Opt1: "Fewer workdays, but longer days",
    q3Opt2: "More workdays, but shorter days",
    q4Label: "Would you be willing to reduce your working hours (with a proportional salary adjustment) for more free time?",
    q4Opt1: "Yes, I would be open to this option",
    q4Opt2: "No, I prefer to keep my current hours and salary",
    q5Label: "What is your preferred shift?",
    q5Morning: "Morning",
    q5Afternoon: "Afternoon",
    q5FullDay: "Full Day",
    q5NoPref: "No preference",
    q6Label: "What is your opinion on variable (rotating) vs. fixed schedules?",
    q6Fixed: "I prefer a 100% fixed schedule",
    q6Variable: "I have flexibility for variable schedules",
    qTeamSizeLabel: "Do you prefer to work in a staffing structure of...",
    qTeamSizeOpt2: "2 people (One lead teacher and one assistant)",
    qTeamSizeOpt3: "3 people (One lead teacher and two assistants)",
    s2CommentsLabel: "Any specific difficulties with variable schedules or details about your preferences:",

    // Section 3
    s3Title: "3. Availability & days off",
    q7Label: "Which days of the week are you unavailable to work?",
    q7Sub: "Select all days that apply",
    q8Label: "How many days off per week do you need for your well-being and recovery?",
    s3CommentsLabel: "Comments or details about your availability or days off:",

    // Section 4
    s4Title: "4. Compensation & recognition",
    q9Label: "How satisfied are you with your current salary in relation to your responsibilities?",
    q9Min: "Very unsatisfied",
    q9Max: "Very satisfied",
    q10Label: "What type of improvement in benefits or compensation would be most valuable to you?",
    q10Salary: "Direct salary increase",
    q10Bonus: "Performance bonuses / Incentives",
    q10Benefits: "Benefits (Health, insurance, etc.)",
    q10Off: "Additional paid days off",
    q11Label: "What percentage of salary increase do you estimate is needed to significantly improve your satisfaction?",
    s4CommentsLabel: "Additional comments about compensation, benefits, or recognition:",

    // Section 5
    s5Title: "5. General feedback & well-being",
    q12Label: "Overall, how satisfied are you with your job and well-being at the school?",
    q12Min: "Very unsatisfied",
    q12Max: "Very satisfied",
    q13Label: "What concrete change in the school would have the greatest positive impact on your quality of life at work?",
    q13Schedule: "Schedule improvement",
    q13Salary: "Salary increase",
    q13Communication: "Atmosphere & internal communication",
    q13Physical: "Physical work environment",
    q13Other: "Other change",
    s5CommentsLabel: "Additional comments, suggestions, or concerns you would like to share:",

    // Admin Portal
    adminTitle: "Administrative Portal",
    passcodePrompt: "Please enter the administrator passcode:",
    passcodePlaceholder: "Passcode (e.g. admin123)",
    passcodeError: "Incorrect passcode. Please try again.",
    loginButton: "Log In",
    tabDashboard: "Dashboard",
    tabResponses: "Individual Responses",
    totalResponses: "Total responses",
    avgSatisfaction: "Schedule satisfaction (Average)",
    avgSalarySatisfaction: "Salary satisfaction (Average)",
    avgJobSatisfaction: "Overall satisfaction (Average)",
    heatmapTitle: "Unavailability Heatmap (Employees)",
    shiftDistribution: "Shift Preference Distribution",
    benefitDistribution: "Top Requested Benefits",
    teamSizeDistribution: "Preferred Staffing Structure Distribution",
    viewDetails: "View Details",
    close: "Close",
    unavailabilityCount: "unavailable",
    demoModeAlert: "Demo mode active (Local storage). To save online, configure the .env.local file with your Firebase keys.",
    daysList: {
      Monday: "Monday",
      Tuesday: "Tuesday",
      Wednesday: "Wednesday",
      Thursday: "Thursday",
      Friday: "Friday"
    }
  }
};

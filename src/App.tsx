import { useState, useEffect } from "react";
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Unlock, 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock, 
  X,
  Sparkles
} from "lucide-react";
import { locales, type Translation } from "./locales";
import { 
  addSurveyResponse, 
  getSurveyResponses, 
  type SurveyResponse 
} from "./firebase";
import "./App.css";

function App() {
  // Localization state
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const t: Translation = locales[lang];

  // Navigation states
  // -1: Welcome / Identification Screen
  // 0 to 4: The 5 Sections
  // 5: Success screen
  const [step, setStep] = useState<number>(-1);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(false);
  const [adminPasscode, setAdminPasscode] = useState<string>("");
  const [adminAuthError, setAdminAuthError] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<"dashboard" | "responses">("dashboard");

  // Hidden admin access triggers
  const [, setCopyrightClickCount] = useState<number>(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") {
      setIsAdminMode(true);
      setAdminPasscode("");
      setIsAdminAuthed(false);
    }
  }, []);

  const handleCopyrightClick = () => {
    setCopyrightClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAdminMode(true);
        setAdminPasscode("");
        setIsAdminAuthed(false);
        return 0;
      }
      return next;
    });
  };

  // Survey data states
  const [employeeName, setEmployeeName] = useState<string>("");
  
  // Section 1: Schedule & Satisfaction
  const [currentScheduleSatisfaction, setCurrentScheduleSatisfaction] = useState<number>(0);
  const [hoursWorkedPerWeekRange, setHoursWorkedPerWeekRange] = useState<string>("");
  const [section1Comments, setSection1Comments] = useState<string>("");

  // Section 2: Scheduling Preferences
  const [workdayPreference, setWorkdayPreference] = useState<string>("");
  const [willingToReduceHoursForLessPay, setWillingToReduceHoursForLessPay] = useState<string>("");
  const [preferredShift, setPreferredShift] = useState<string>("");
  const [rotatingScheduleOpinion, setRotatingScheduleOpinion] = useState<string>("");
  const [teamSizePreference, setTeamSizePreference] = useState<string>("");
  const [section2Comments, setSection2Comments] = useState<string>("");

  // Section 3: Availability & Days Off
  const [unavailableDays, setUnavailableDays] = useState<string[]>([]);
  const [daysOffNeededForRecovery, setDaysOffNeededForRecovery] = useState<string>("");
  const [section3Comments, setSection3Comments] = useState<string>("");

  // Section 4: Compensation & Recognition
  const [salarySatisfaction, setSalarySatisfaction] = useState<number>(0);
  const [preferredCompensationImprovement, setPreferredCompensationImprovement] = useState<string>("");
  const [desiredPercentageIncreaseRange, setDesiredPercentageIncreaseRange] = useState<string>("");
  const [section4Comments, setSection4Comments] = useState<string>("");

  // Section 5: General Feedback
  const [overallJobSatisfaction, setOverallJobSatisfaction] = useState<number>(0);
  const [mostImpactfulChangeDesired, setMostImpactfulChangeDesired] = useState<string>("");
  const [section5Comments, setSection5Comments] = useState<string>("");

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  // Admin Data states
  const [adminResponses, setAdminResponses] = useState<SurveyResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  // Load admin responses when admin logs in
  useEffect(() => {
    if (isAdminAuthed) {
      loadAdminResponses();
    }
  }, [isAdminAuthed]);

  const loadAdminResponses = async () => {
    try {
      const data = await getSurveyResponses();
      // Sort responses by submission date (newest first)
      data.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setAdminResponses(data);
    } catch (error) {
      console.error("Failed to load survey responses:", error);
    }
  };

  // Helper validation for each step to enable/disable NEXT button
  const isStepValid = (): boolean => {
    switch (step) {
      case -1:
        return employeeName.trim().length >= 2;
      case 0:
        return currentScheduleSatisfaction > 0 && hoursWorkedPerWeekRange !== "";
      case 1:
        return workdayPreference !== "" && 
               willingToReduceHoursForLessPay !== "" && 
               preferredShift !== "" && 
               rotatingScheduleOpinion !== "" &&
               teamSizePreference !== "";
      case 2:
        return daysOffNeededForRecovery !== "";
      case 3:
        return salarySatisfaction > 0 && 
               preferredCompensationImprovement !== "" && 
               desiredPercentageIncreaseRange !== "";
      case 4:
        return overallJobSatisfaction > 0 && mostImpactfulChangeDesired !== "";
      default:
        return false;
    }
  };

  // Navigate forward
  const handleNext = () => {
    if (isStepValid()) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  // Navigate backward
  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  // Handle Day Toggle in Section 3
  const handleDayToggle = (day: string) => {
    setUnavailableDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Submit survey responses
  const handleSubmit = async () => {
    if (!isStepValid()) return;
    
    setIsSubmitting(true);
    setSubmitError("");

    const surveyResponse: SurveyResponse = {
      submittedAt: new Date().toISOString(),
      language: lang,
      employeeName: employeeName.trim(),
      
      currentScheduleSatisfaction,
      hoursWorkedPerWeekRange,
      section1Comments: section1Comments.trim() || undefined,

      workdayPreference,
      willingToReduceHoursForLessPay,
      preferredShift,
      rotatingScheduleOpinion,
      teamSizePreference,
      section2Comments: section2Comments.trim() || undefined,

      unavailableDays,
      daysOffNeededForRecovery,
      section3Comments: section3Comments.trim() || undefined,

      salarySatisfaction,
      preferredCompensationImprovement,
      desiredPercentageIncreaseRange,
      section4Comments: section4Comments.trim() || undefined,

      overallJobSatisfaction,
      mostImpactfulChangeDesired,
      section5Comments: section5Comments.trim() || undefined
    };

    try {
      await addSurveyResponse(surveyResponse);
      setStep(5); // Go to success screen
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error submitting survey:", error);
      setSubmitError(lang === "fr" ? "Une erreur est survenue lors de l'envoi." : "An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Admin Passcode Authentication
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode.trim() === "admin123") {
      setIsAdminAuthed(true);
      setAdminAuthError(false);
    } else {
      setAdminAuthError(true);
    }
  };

  // Reset survey states to fill out again
  const handleResetSurvey = () => {
    setStep(-1);
    setEmployeeName("");
    setCurrentScheduleSatisfaction(0);
    setHoursWorkedPerWeekRange("");
    setSection1Comments("");
    setWorkdayPreference("");
    setWillingToReduceHoursForLessPay("");
    setPreferredShift("");
    setRotatingScheduleOpinion("");
    setTeamSizePreference("");
    setSection2Comments("");
    setUnavailableDays([]);
    setDaysOffNeededForRecovery("");
    setSection3Comments("");
    setSalarySatisfaction(0);
    setPreferredCompensationImprovement("");
    setDesiredPercentageIncreaseRange("");
    setSection4Comments("");
    setOverallJobSatisfaction(0);
    setMostImpactfulChangeDesired("");
    setSection5Comments("");
  };

  // Admin aggregates calculations
  const totalSubmissions = adminResponses.length;
  
  const getAverage = (key: keyof SurveyResponse): number => {
    if (totalSubmissions === 0) return 0;
    const sum = adminResponses.reduce((acc, curr) => {
      const val = curr[key];
      return acc + (typeof val === "number" ? val : 0);
    }, 0);
    return Math.round((sum / totalSubmissions) * 10) / 10;
  };

  const avgSchedSat = getAverage("currentScheduleSatisfaction");
  const avgSalarySat = getAverage("salarySatisfaction");
  const avgOverallSat = getAverage("overallJobSatisfaction");

  // Calculate day-of-week unavailability counts for heatmap
  const getDayUnavailabilityCount = (day: string): number => {
    return adminResponses.filter(r => r.unavailableDays.includes(day)).length;
  };

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Calculate shift preferences counts
  const getShiftCount = (shiftKey: string): number => {
    return adminResponses.filter(r => r.preferredShift === shiftKey).length;
  };

  // Calculate benefit preference counts
  const getBenefitCount = (benefitKey: string): number => {
    return adminResponses.filter(r => r.preferredCompensationImprovement === benefitKey).length;
  };

  // Calculate team size preference counts
  const getTeamSizeCount = (sizeKey: string): number => {
    return adminResponses.filter(r => r.teamSizePreference === sizeKey).length;
  };

  // RENDER ADMIN PORTAL
  if (isAdminMode) {
    return (
      <div className="app-container wide-layout">
        <header className="app-header">
          <div className="school-logo-container">
            <Unlock size={24} />
          </div>
          <h1 className="app-title">{t.adminTitle}</h1>
          <p className="app-subtitle">{t.subtitle}</p>
        </header>

        {!isAdminAuthed ? (
          <div className="wizard-card admin-login-card">
            <h2 className="section-title" style={{ textAlign: "center" }}>
              {t.adminLink}
            </h2>
            <form onSubmit={handleAdminAuth} className="text-input-wrapper">
              <label className="question-label" style={{ textAlign: "left" }}>
                {t.passcodePrompt}
              </label>
              <input
                type="password"
                className="text-input"
                placeholder={t.passcodePlaceholder}
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                autoFocus
              />
              {adminAuthError && (
                <p style={{ color: "var(--color-accent)", fontSize: "0.8rem", fontWeight: "bold", marginTop: "4px" }}>
                  {t.passcodeError}
                </p>
              )}
              <button type="submit" className="btn btn-primary" style={{ marginTop: "12px", width: "100%" }}>
                {t.loginButton}
              </button>
            </form>
            <button className="btn btn-text" onClick={() => setIsAdminMode(false)}>
              {t.formLink}
            </button>
          </div>
        ) : (
          <main>
            {/* Header Tabs */}
            <div className="admin-title-row">
              <div className="admin-header-tabs">
                <button 
                  className={`admin-tab-btn ${adminTab === "dashboard" ? "active" : ""}`}
                  onClick={() => setAdminTab("dashboard")}
                >
                  {t.tabDashboard}
                </button>
                <button 
                  className={`admin-tab-btn ${adminTab === "responses" ? "active" : ""}`}
                  onClick={() => setAdminTab("responses")}
                >
                  {t.tabResponses}
                </button>
              </div>
              <button className="btn btn-secondary" onClick={() => setIsAdminMode(false)}>
                {t.formLink}
              </button>
            </div>

            {adminTab === "dashboard" ? (
              <div>
                {/* KPI metrics row */}
                <div className="kpi-grid">
                  <div className="kpi-card">
                    <span className="kpi-label">{t.totalResponses}</span>
                    <span className="kpi-value">{totalSubmissions}</span>
                  </div>
                  <div className="kpi-card">
                    <span className="kpi-label">{t.avgSatisfaction}</span>
                    <span className="kpi-value">{totalSubmissions > 0 ? `${avgSchedSat}/5` : "—"}</span>
                  </div>
                  <div className="kpi-card">
                    <span className="kpi-label">{t.avgSalarySatisfaction}</span>
                    <span className="kpi-value">{totalSubmissions > 0 ? `${avgSalarySat}/5` : "—"}</span>
                  </div>
                  <div className="kpi-card">
                    <span className="kpi-label">{t.avgJobSatisfaction}</span>
                    <span className="kpi-value">{totalSubmissions > 0 ? `${avgOverallSat}/5` : "—"}</span>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="charts-grid">
                  {/* Heatmap of Unavailability */}
                  <div className="chart-card">
                    <h3 className="chart-title">
                      <Calendar size={18} />
                      {t.heatmapTitle}
                    </h3>
                    <div className="heatmap-row">
                      {DAYS.map((day) => {
                        const count = getDayUnavailabilityCount(day);
                        const percent = totalSubmissions > 0 ? count / totalSubmissions : 0;
                        // Color depth based on intensity percentage
                        let bgColor = "var(--bg-cream)";
                        let textColor = "var(--text-primary)";
                        let borderCol = "var(--border-light)";
                        
                        if (count > 0) {
                          if (percent < 0.25) {
                            bgColor = "#f7e9e5"; // Very light accent
                            textColor = "var(--color-accent-dark)";
                            borderCol = "rgba(191, 86, 56, 0.2)";
                          } else if (percent < 0.5) {
                            bgColor = "#f0d4cc";
                            textColor = "var(--color-accent-dark)";
                            borderCol = "rgba(191, 86, 56, 0.4)";
                          } else {
                            bgColor = "var(--color-accent)";
                            textColor = "#ffffff";
                            borderCol = "var(--color-accent-dark)";
                          }
                        }

                        return (
                          <div 
                            key={day} 
                            className="heatmap-day-block"
                            style={{ backgroundColor: bgColor, color: textColor, borderColor: borderCol }}
                          >
                            <span className="heatmap-day-label">
                              {t.daysList[day]?.substring(0, 3) || day.substring(0, 3)}
                            </span>
                            <span className="heatmap-day-value">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="question-helper" style={{ textAlign: "center", marginTop: "8px" }}>
                      {lang === "fr" 
                        ? "Les blocs de couleur foncée indiquent une plus grande indisponibilité." 
                        : "Darker colored blocks indicate greater unavailability."}
                    </p>
                  </div>

                  {/* Shift preference distribution chart */}
                  <div className="chart-card">
                    <h3 className="chart-title">
                      <Clock size={18} />
                      {t.shiftDistribution}
                    </h3>
                    <div className="svg-chart-container">
                      {totalSubmissions === 0 ? (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                          Aucune donnée / No data
                        </div>
                      ) : (
                        <svg viewBox="0 0 400 200">
                          {(() => {
                            const shifts = [
                              { label: t.q5Morning, count: getShiftCount("morning") },
                              { label: t.q5Afternoon, count: getShiftCount("afternoon") },
                              { label: t.q5FullDay, count: getShiftCount("full_day") },
                              { label: t.q5NoPref, count: getShiftCount("no_preference") },
                            ];
                            
                            return shifts.map((shift, idx) => {
                              const pct = (shift.count / totalSubmissions) * 100;
                              const y = 20 + idx * 45;
                              const barWidth = Math.max(5, pct * 2.5); // Scaled width
                              
                              return (
                                <g key={idx}>
                                  {/* Labels */}
                                  <text x="10" y={y + 16} fill="var(--text-primary)" fontSize="11" fontWeight="700">
                                    {shift.label}
                                  </text>
                                  {/* Counts */}
                                  <text x="360" y={y + 16} fill="var(--color-forest)" fontSize="11" fontWeight="800" textAnchor="end">
                                    {shift.count} ({Math.round(pct)}%)
                                  </text>
                                  {/* Base track */}
                                  <rect x="10" y={y + 24} width="350" height="8" rx="4" fill="var(--border-light)" />
                                  {/* Color filled track */}
                                  <rect x="10" y={y + 24} width={barWidth} height="8" rx="4" fill="var(--color-forest)" />
                                </g>
                              );
                            });
                          })()}
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Compensation improvement preferences chart */}
                  <div className="chart-card">
                    <h3 className="chart-title">
                      <TrendingUp size={18} />
                      {t.benefitDistribution}
                    </h3>
                    <div className="svg-chart-container">
                      {totalSubmissions === 0 ? (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                          Aucune donnée / No data
                        </div>
                      ) : (
                        <svg viewBox="0 0 400 200">
                          {(() => {
                            const benefits = [
                              { label: t.q10Salary, count: getBenefitCount("salary") },
                              { label: t.q10Bonus, count: getBenefitCount("bonus") },
                              { label: t.q10Benefits, count: getBenefitCount("benefits") },
                              { label: t.q10Off, count: getBenefitCount("off_days") },
                            ];
                            
                            return benefits.map((benefit, idx) => {
                              const pct = (benefit.count / totalSubmissions) * 100;
                              const y = 20 + idx * 45;
                              const barWidth = Math.max(5, pct * 2.5);
                              
                              return (
                                <g key={idx}>
                                  {/* Label */}
                                  <text x="10" y={y + 16} fill="var(--text-primary)" fontSize="11" fontWeight="700">
                                    {benefit.label.length > 35 ? `${benefit.label.substring(0, 32)}...` : benefit.label}
                                  </text>
                                  {/* Percentage */}
                                  <text x="360" y={y + 16} fill="var(--color-accent)" fontSize="11" fontWeight="800" textAnchor="end">
                                    {benefit.count} ({Math.round(pct)}%)
                                  </text>
                                  {/* Track base */}
                                  <rect x="10" y={y + 24} width="350" height="8" rx="4" fill="var(--border-light)" />
                                  {/* Colored bar */}
                                  <rect x="10" y={y + 24} width={barWidth} height="8" rx="4" fill="var(--color-accent)" />
                                </g>
                              );
                            });
                          })()}
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Team size preference distribution chart */}
                  <div className="chart-card">
                    <h3 className="chart-title">
                      <Users size={18} />
                      {t.teamSizeDistribution}
                    </h3>
                    <div className="svg-chart-container">
                      {totalSubmissions === 0 ? (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                          Aucune donnée / No data
                        </div>
                      ) : (
                        <svg viewBox="0 0 400 200">
                          {(() => {
                            const options = [
                              { label: t.qTeamSizeOpt2, count: getTeamSizeCount("2_people") },
                              { label: t.qTeamSizeOpt3, count: getTeamSizeCount("3_people") },
                            ];
                            
                            return options.map((opt, idx) => {
                              const pct = (opt.count / totalSubmissions) * 100;
                              const y = 35 + idx * 65;
                              const barWidth = Math.max(5, pct * 2.5);
                              
                              return (
                                <g key={idx}>
                                  {/* Label */}
                                  <text x="10" y={y + 16} fill="var(--text-primary)" fontSize="11" fontWeight="700">
                                    {opt.label.length > 40 ? `${opt.label.substring(0, 37)}...` : opt.label}
                                  </text>
                                  {/* Percentage */}
                                  <text x="360" y={y + 16} fill="var(--color-forest)" fontSize="11" fontWeight="800" textAnchor="end">
                                    {opt.count} ({Math.round(pct)}%)
                                  </text>
                                  {/* Track base */}
                                  <rect x="10" y={y + 24} width="350" height="8" rx="4" fill="var(--border-light)" />
                                  {/* Colored bar */}
                                  <rect x="10" y={y + 24} width={barWidth} height="8" rx="4" fill="var(--color-forest)" />
                                </g>
                              );
                            });
                          })()}
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Hourly satisfaction bar charts */}
                  <div className="chart-card">
                    <h3 className="chart-title">
                      <Users size={18} />
                      {lang === "fr" ? "Distribution de la Satisfaction Générale" : "Overall Satisfaction Distribution"}
                    </h3>
                    <div className="svg-chart-container">
                      {totalSubmissions === 0 ? (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                          Aucune donnée / No data
                        </div>
                      ) : (
                        <svg viewBox="0 0 400 200">
                          {(() => {
                            const scores = [5, 4, 3, 2, 1];
                            return scores.map((score, idx) => {
                              const count = adminResponses.filter(r => r.overallJobSatisfaction === score).length;
                              const pct = (count / totalSubmissions) * 100;
                              const y = 15 + idx * 36;
                              const barWidth = Math.max(5, pct * 2.5);
                              
                              return (
                                <g key={score}>
                                  <text x="10" y={y + 16} fill="var(--text-primary)" fontSize="11" fontWeight="800">
                                    ★ {score}
                                  </text>
                                  <text x="360" y={y + 16} fill="var(--text-secondary)" fontSize="11" fontWeight="700" textAnchor="end">
                                    {count} ({Math.round(pct)}%)
                                  </text>
                                  <rect x="40" y={y + 6} width="310" height="12" rx="6" fill="var(--border-light)" />
                                  <rect x="40" y={y + 6} width={barWidth * 3.1 / 2.5} height="12" rx="6" fill="var(--color-forest-medium)" />
                                </g>
                              );
                            });
                          })()}
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* INDIVIDUAL RESPONSES VIEW */
              <div className="responses-list">
                {totalSubmissions === 0 ? (
                  <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                    Aucune réponse enregistrée pour le moment. / No responses recorded yet.
                  </p>
                ) : (
                  adminResponses.map((response) => (
                    <div 
                      key={response.id} 
                      className="response-row-card"
                      onClick={() => setSelectedResponse(response)}
                    >
                      <div className="response-info-left">
                        <span className="response-employee-name">{response.employeeName}</span>
                        <span className="response-meta">
                          {new Date(response.submittedAt).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-US")} à{" "}
                          {new Date(response.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({response.language.toUpperCase()})
                        </span>
                      </div>
                      <div className="response-scores">
                        <div className="score-badge">
                          <span className="score-badge-label">Hor</span>
                          <span className="score-badge-value">{response.currentScheduleSatisfaction}</span>
                        </div>
                        <div className="score-badge">
                          <span className="score-badge-label">Rem</span>
                          <span className="score-badge-value">{response.salarySatisfaction}</span>
                        </div>
                        <div className="score-badge" style={{ borderColor: "var(--color-accent)" }}>
                          <span className="score-badge-label" style={{ color: "var(--color-accent)" }}>Glo</span>
                          <span className="score-badge-value" style={{ color: "var(--color-accent)" }}>{response.overallJobSatisfaction}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </main>
        )}

        {/* Modal: Individual response detailed sheet */}
        {selectedResponse && (
          <div className="modal-overlay" onClick={() => setSelectedResponse(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{selectedResponse.employeeName}</h3>
                <button className="modal-close-btn" onClick={() => setSelectedResponse(null)}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Section 1 */}
                <div className="detail-section">
                  <span className="detail-section-title">{t.s1Title}</span>
                  <div className="detail-item">
                    <span className="detail-question">{t.q1Label}</span>
                    <span className="detail-answer">{selectedResponse.currentScheduleSatisfaction} / 5</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-question">{t.q2Label}</span>
                    <span className="detail-answer">{selectedResponse.hoursWorkedPerWeekRange}</span>
                  </div>
                  {selectedResponse.section1Comments && (
                    <div className="detail-item">
                      <span className="detail-question">{t.optionalLabel} Comments</span>
                      <p className="detail-comments">"{selectedResponse.section1Comments}"</p>
                    </div>
                  )}
                </div>

                {/* Section 2 */}
                <div className="detail-section">
                  <span className="detail-section-title">{t.s2Title}</span>
                  <div className="detail-item">
                    <span className="detail-question">{t.q3Label}</span>
                    <span className="detail-answer">
                      {selectedResponse.workdayPreference === "fewer_longer" ? t.q3Opt1 : t.q3Opt2}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-question">{t.q4Label}</span>
                    <span className="detail-answer">
                      {selectedResponse.willingToReduceHoursForLessPay === "Yes" ? "Oui / Yes" : "Non / No"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-question">{t.q5Label}</span>
                    <span className="detail-answer">
                      {selectedResponse.preferredShift === "morning" && t.q5Morning}
                      {selectedResponse.preferredShift === "afternoon" && t.q5Afternoon}
                      {selectedResponse.preferredShift === "full_day" && t.q5FullDay}
                      {selectedResponse.preferredShift === "no_preference" && t.q5NoPref}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-question">{t.q6Label}</span>
                    <span className="detail-answer">
                      {selectedResponse.rotatingScheduleOpinion === "fixed" ? t.q6Fixed : t.q6Variable}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-question">{t.qTeamSizeLabel}</span>
                    <span className="detail-answer">
                      {selectedResponse.teamSizePreference === "2_people" ? t.qTeamSizeOpt2 : t.qTeamSizeOpt3}
                    </span>
                  </div>
                  {selectedResponse.section2Comments && (
                    <div className="detail-item">
                      <span className="detail-question">{t.optionalLabel} Comments</span>
                      <p className="detail-comments">"{selectedResponse.section2Comments}"</p>
                    </div>
                  )}
                </div>

                {/* Section 3 */}
                <div className="detail-section">
                  <span className="detail-section-title">{t.s3Title}</span>
                  <div className="detail-item">
                    <span className="detail-question">{t.q7Label}</span>
                    <span className="detail-answer">
                      {selectedResponse.unavailableDays.length === 0 
                        ? (lang === "fr" ? "Disponible tous les jours" : "Available all days")
                        : selectedResponse.unavailableDays.map(d => t.daysList[d] || d).join(", ")}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-question">{t.q8Label}</span>
                    <span className="detail-answer">{selectedResponse.daysOffNeededForRecovery}</span>
                  </div>
                  {selectedResponse.section3Comments && (
                    <div className="detail-item">
                      <span className="detail-question">{t.optionalLabel} Comments</span>
                      <p className="detail-comments">"{selectedResponse.section3Comments}"</p>
                    </div>
                  )}
                </div>

                {/* Section 4 */}
                <div className="detail-section">
                  <span className="detail-section-title">{t.s4Title}</span>
                  <div className="detail-item">
                    <span className="detail-question">{t.q9Label}</span>
                    <span className="detail-answer">{selectedResponse.salarySatisfaction} / 5</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-question">{t.q10Label}</span>
                    <span className="detail-answer">
                      {selectedResponse.preferredCompensationImprovement === "salary" && t.q10Salary}
                      {selectedResponse.preferredCompensationImprovement === "bonus" && t.q10Bonus}
                      {selectedResponse.preferredCompensationImprovement === "benefits" && t.q10Benefits}
                      {selectedResponse.preferredCompensationImprovement === "off_days" && t.q10Off}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-question">{t.q11Label}</span>
                    <span className="detail-answer">{selectedResponse.desiredPercentageIncreaseRange}</span>
                  </div>
                  {selectedResponse.section4Comments && (
                    <div className="detail-item">
                      <span className="detail-question">{t.optionalLabel} Comments</span>
                      <p className="detail-comments">"{selectedResponse.section4Comments}"</p>
                    </div>
                  )}
                </div>

                {/* Section 5 */}
                <div className="detail-section">
                  <span className="detail-section-title">{t.s5Title}</span>
                  <div className="detail-item">
                    <span className="detail-question">{t.q12Label}</span>
                    <span className="detail-answer">{selectedResponse.overallJobSatisfaction} / 5</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-question">{t.q13Label}</span>
                    <span className="detail-answer">
                      {selectedResponse.mostImpactfulChangeDesired === "schedule" && t.q13Schedule}
                      {selectedResponse.mostImpactfulChangeDesired === "salary" && t.q13Salary}
                      {selectedResponse.mostImpactfulChangeDesired === "communication" && t.q13Communication}
                      {selectedResponse.mostImpactfulChangeDesired === "physical" && t.q13Physical}
                      {selectedResponse.mostImpactfulChangeDesired === "other" && t.q13Other}
                    </span>
                  </div>
                  {selectedResponse.section5Comments && (
                    <div className="detail-item">
                      <span className="detail-question">{t.optionalLabel} Comments</span>
                      <p className="detail-comments">"{selectedResponse.section5Comments}"</p>
                    </div>
                  )}
                </div>
              </div>

              <button className="btn btn-secondary" onClick={() => setSelectedResponse(null)}>
                {t.close}
              </button>
            </div>
          </div>
        )}

        <footer className="survey-footer admin-footer">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} {t.subtitle}
          </p>
        </footer>
      </div>
    );
  }

  // RENDER SURVEY FORM WIZARD
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="school-logo-container">
          <Sparkles size={24} />
        </div>
        <h1 className="app-title">{t.title}</h1>
        <p className="app-subtitle">{t.subtitle}</p>
      </header>

      {/* Progress Bar (Only visible inside sections 0 to 4) */}
      {step >= 0 && step <= 4 && (
        <div className="progress-container">
          <div className="progress-text">
            <span>{t.questionIndicator.replace("{current}", (step + 1).toString()).replace("{total}", "5")}</span>
            <span>{Math.round(((step + 1) / 5) * 100)}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-bar" style={{ width: `${((step + 1) / 5) * 100}%` }}></div>
          </div>
        </div>
      )}

      {/* STEP -1: WELCOME SCREEN */}
      {step === -1 && (
        <main className="wizard-card welcome-screen">
          <div className="question-block" style={{ marginTop: "8px" }}>
            <label className="question-label">{t.languageSelect}</label>
            <div className="tiles-grid language-grid">
              <button 
                type="button"
                className={`tile-option ${lang === "fr" ? "selected" : ""}`}
                onClick={() => setLang("fr")}
              >
                <span>Français</span>
                <span className="tile-check">
                  {lang === "fr" && <Check size={12} />}
                </span>
              </button>
              <button 
                type="button"
                className={`tile-option ${lang === "en" ? "selected" : ""}`}
                onClick={() => setLang("en")}
              >
                <span>English</span>
                <span className="tile-check">
                  {lang === "en" && <Check size={12} />}
                </span>
              </button>
            </div>
          </div>

          <div className="question-block">
            <label className="question-label" htmlFor="employee-name-input">
              {t.nameLabel}
            </label>
            <input
              id="employee-name-input"
              type="text"
              className="text-input"
              placeholder={t.namePlaceholder}
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
          </div>

          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isStepValid()}
            style={{ width: "100%", marginTop: "12px" }}
          >
            {t.startButton}
            <ChevronRight size={18} />
          </button>
        </main>
      )}

      {/* STEP 0: SECTION 1 - CURRENT SCHEDULE & SATISFACTION */}
      {step === 0 && (
        <main className="wizard-card">
          <h2 className="section-title">{t.s1Title}</h2>
          
          {/* Q1 */}
          <div className="question-block">
            <label className="question-label">{t.q1Label}</label>
            <div className="rating-row">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`rating-button ${currentScheduleSatisfaction === num ? "selected" : ""}`}
                  onClick={() => setCurrentScheduleSatisfaction(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="rating-labels">
              <span>{t.q1Min}</span>
              <span>{t.q1Max}</span>
            </div>
          </div>

          {/* Q2 */}
          <div className="question-block" style={{ marginTop: "12px" }}>
            <label className="question-label">{t.q2Label}</label>
            <div className="tiles-grid">
              {["< 20h", "20h - 30h", "30h - 35h", "35h - 40h", "> 40h"].map((range) => (
                <button
                  key={range}
                  type="button"
                  className={`tile-option ${hoursWorkedPerWeekRange === range ? "selected" : ""}`}
                  onClick={() => setHoursWorkedPerWeekRange(range)}
                >
                  <span>{range}</span>
                  <span className="tile-check">
                    {hoursWorkedPerWeekRange === range && <Check size={12} />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Section Comments */}
          <div className="comment-box-wrapper">
            <label className="question-label">
              {t.s1CommentsLabel} <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "normal" }}>{t.optionalLabel}</span>
            </label>
            <textarea
              className="comment-textarea"
              placeholder={t.commentsPlaceholder}
              value={section1Comments}
              onChange={(e) => setSection1Comments(e.target.value)}
            />
          </div>

          <div className="buttons-row">
            <button type="button" className="btn btn-secondary" onClick={handleBack}>
              <ChevronLeft size={18} />
              {t.prevButton}
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {t.nextButton}
              <ChevronRight size={18} />
            </button>
          </div>
        </main>
      )}

      {/* STEP 1: SECTION 2 - SCHEDULING PREFERENCES */}
      {step === 1 && (
        <main className="wizard-card">
          <h2 className="section-title">{t.s2Title}</h2>

          {/* Q3 */}
          <div className="question-block">
            <label className="question-label">{t.q3Label}</label>
            <div className="tiles-grid">
              <button
                type="button"
                className={`tile-option ${workdayPreference === "fewer_longer" ? "selected" : ""}`}
                onClick={() => setWorkdayPreference("fewer_longer")}
              >
                <span style={{ fontSize: "0.85rem", lineHeight: "1.3" }}>{t.q3Opt1}</span>
                <span className="tile-check" style={{ flexShrink: 0, marginLeft: "10px" }}>
                  {workdayPreference === "fewer_longer" && <Check size={12} />}
                </span>
              </button>
              <button
                type="button"
                className={`tile-option ${workdayPreference === "more_spread" ? "selected" : ""}`}
                onClick={() => setWorkdayPreference("more_spread")}
              >
                <span style={{ fontSize: "0.85rem", lineHeight: "1.3" }}>{t.q3Opt2}</span>
                <span className="tile-check" style={{ flexShrink: 0, marginLeft: "10px" }}>
                  {workdayPreference === "more_spread" && <Check size={12} />}
                </span>
              </button>
            </div>
          </div>

          {/* Q4 */}
          <div className="question-block">
            <label className="question-label">{t.q4Label}</label>
            <div className="tiles-grid">
              <button
                type="button"
                className={`tile-option ${willingToReduceHoursForLessPay === "Yes" ? "selected" : ""}`}
                onClick={() => setWillingToReduceHoursForLessPay("Yes")}
              >
                <span>{t.q4Opt1}</span>
                <span className="tile-check">
                  {willingToReduceHoursForLessPay === "Yes" && <Check size={12} />}
                </span>
              </button>
              <button
                type="button"
                className={`tile-option ${willingToReduceHoursForLessPay === "No" ? "selected" : ""}`}
                onClick={() => setWillingToReduceHoursForLessPay("No")}
              >
                <span>{t.q4Opt2}</span>
                <span className="tile-check">
                  {willingToReduceHoursForLessPay === "No" && <Check size={12} />}
                </span>
              </button>
            </div>
          </div>

          {/* Q5 */}
          <div className="question-block">
            <label className="question-label">{t.q5Label}</label>
            <div className="tiles-grid">
              {[
                { key: "morning", val: t.q5Morning },
                { key: "afternoon", val: t.q5Afternoon },
                { key: "full_day", val: t.q5FullDay },
                { key: "no_preference", val: t.q5NoPref },
              ].map((shift) => (
                <button
                  key={shift.key}
                  type="button"
                  className={`tile-option ${preferredShift === shift.key ? "selected" : ""}`}
                  onClick={() => setPreferredShift(shift.key)}
                >
                  <span>{shift.val}</span>
                  <span className="tile-check">
                    {preferredShift === shift.key && <Check size={12} />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Q6 */}
          <div className="question-block">
            <label className="question-label">{t.q6Label}</label>
            <div className="tiles-grid">
              <button
                type="button"
                className={`tile-option ${rotatingScheduleOpinion === "fixed" ? "selected" : ""}`}
                onClick={() => setRotatingScheduleOpinion("fixed")}
              >
                <span>{t.q6Fixed}</span>
                <span className="tile-check">
                  {rotatingScheduleOpinion === "fixed" && <Check size={12} />}
                </span>
              </button>
              <button
                type="button"
                className={`tile-option ${rotatingScheduleOpinion === "variable" ? "selected" : ""}`}
                onClick={() => setRotatingScheduleOpinion("variable")}
              >
                <span>{t.q6Variable}</span>
                <span className="tile-check">
                  {rotatingScheduleOpinion === "variable" && <Check size={12} />}
                </span>
              </button>
            </div>
          </div>

          {/* QTeamSize */}
          <div className="question-block">
            <label className="question-label">{t.qTeamSizeLabel}</label>
            <div className="tiles-grid">
              <button
                type="button"
                className={`tile-option ${teamSizePreference === "2_people" ? "selected" : ""}`}
                onClick={() => setTeamSizePreference("2_people")}
              >
                <span>{t.qTeamSizeOpt2}</span>
                <span className="tile-check">
                  {teamSizePreference === "2_people" && <Check size={12} />}
                </span>
              </button>
              <button
                type="button"
                className={`tile-option ${teamSizePreference === "3_people" ? "selected" : ""}`}
                onClick={() => setTeamSizePreference("3_people")}
              >
                <span>{t.qTeamSizeOpt3}</span>
                <span className="tile-check">
                  {teamSizePreference === "3_people" && <Check size={12} />}
                </span>
              </button>
            </div>
          </div>

          {/* Optional Section Comments */}
          <div className="comment-box-wrapper">
            <label className="question-label">
              {t.s2CommentsLabel} <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "normal" }}>{t.optionalLabel}</span>
            </label>
            <textarea
              className="comment-textarea"
              placeholder={t.commentsPlaceholder}
              value={section2Comments}
              onChange={(e) => setSection2Comments(e.target.value)}
            />
          </div>

          <div className="buttons-row">
            <button type="button" className="btn btn-secondary" onClick={handleBack}>
              <ChevronLeft size={18} />
              {t.prevButton}
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {t.nextButton}
              <ChevronRight size={18} />
            </button>
          </div>
        </main>
      )}

      {/* STEP 2: SECTION 3 - AVAILABILITY & DAYS OFF */}
      {step === 2 && (
        <main className="wizard-card">
          <h2 className="section-title">{t.s3Title}</h2>

          {/* Q7 */}
          <div className="question-block">
            <label className="question-label">{t.q7Label}</label>
            <span className="question-helper">{t.q7Sub}</span>
            <div className="days-grid">
              {[
                { key: "Monday", abbrev: lang === "fr" ? "Lun" : "Mon" },
                { key: "Tuesday", abbrev: lang === "fr" ? "Mar" : "Tue" },
                { key: "Wednesday", abbrev: lang === "fr" ? "Mer" : "Wed" },
                { key: "Thursday", abbrev: lang === "fr" ? "Jeu" : "Thu" },
                { key: "Friday", abbrev: lang === "fr" ? "Ven" : "Fri" },
              ].map((day) => (
                <button
                  key={day.key}
                  type="button"
                  className={`day-tile ${unavailableDays.includes(day.key) ? "selected" : ""}`}
                  onClick={() => handleDayToggle(day.key)}
                >
                  <span className="day-tile-indicator">{day.abbrev}</span>
                  {unavailableDays.includes(day.key) ? (
                    <span style={{ fontSize: "0.6rem", fontWeight: "bold" }}>OFF</span>
                  ) : (
                    <span style={{ fontSize: "0.6rem", opacity: 0.6 }}>OK</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Q8 */}
          <div className="question-block" style={{ marginTop: "12px" }}>
            <label className="question-label">{t.q8Label}</label>
            <div className="tiles-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {["1", "2", "3", "4+"].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`tile-option ${daysOffNeededForRecovery === num ? "selected" : ""}`}
                  onClick={() => setDaysOffNeededForRecovery(num)}
                  style={{ justifyContent: "center", minHeight: "48px", padding: "10px" }}
                >
                  <span>{num}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Section Comments */}
          <div className="comment-box-wrapper">
            <label className="question-label">
              {t.s3CommentsLabel} <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "normal" }}>{t.optionalLabel}</span>
            </label>
            <textarea
              className="comment-textarea"
              placeholder={t.commentsPlaceholder}
              value={section3Comments}
              onChange={(e) => setSection3Comments(e.target.value)}
            />
          </div>

          <div className="buttons-row">
            <button type="button" className="btn btn-secondary" onClick={handleBack}>
              <ChevronLeft size={18} />
              {t.prevButton}
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {t.nextButton}
              <ChevronRight size={18} />
            </button>
          </div>
        </main>
      )}

      {/* STEP 3: SECTION 4 - COMPENSATION & RECOGNITION */}
      {step === 3 && (
        <main className="wizard-card">
          <h2 className="section-title">{t.s4Title}</h2>

          {/* Q9 */}
          <div className="question-block">
            <label className="question-label">{t.q9Label}</label>
            <div className="rating-row">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`rating-button ${salarySatisfaction === num ? "selected" : ""}`}
                  onClick={() => setSalarySatisfaction(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="rating-labels">
              <span>{t.q9Min}</span>
              <span>{t.q9Max}</span>
            </div>
          </div>

          {/* Q10 */}
          <div className="question-block" style={{ marginTop: "12px" }}>
            <label className="question-label">{t.q10Label}</label>
            <div className="tiles-grid">
              {[
                { key: "salary", val: t.q10Salary },
                { key: "bonus", val: t.q10Bonus },
                { key: "benefits", val: t.q10Benefits },
                { key: "off_days", val: t.q10Off },
              ].map((benefit) => (
                <button
                  key={benefit.key}
                  type="button"
                  className={`tile-option ${preferredCompensationImprovement === benefit.key ? "selected" : ""}`}
                  onClick={() => setPreferredCompensationImprovement(benefit.key)}
                >
                  <span>{benefit.val}</span>
                  <span className="tile-check">
                    {preferredCompensationImprovement === benefit.key && <Check size={12} />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Q11 */}
          <div className="question-block">
            <label className="question-label">{t.q11Label}</label>
            <div className="tiles-grid">
              {["0% - 5%", "5% - 10%", "10% - 15%", "15% - 20%", "20%+"].map((range) => (
                <button
                  key={range}
                  type="button"
                  className={`tile-option ${desiredPercentageIncreaseRange === range ? "selected" : ""}`}
                  onClick={() => setDesiredPercentageIncreaseRange(range)}
                >
                  <span>{range}</span>
                  <span className="tile-check">
                    {desiredPercentageIncreaseRange === range && <Check size={12} />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Section Comments */}
          <div className="comment-box-wrapper">
            <label className="question-label">
              {t.s4CommentsLabel} <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "normal" }}>{t.optionalLabel}</span>
            </label>
            <textarea
              className="comment-textarea"
              placeholder={t.commentsPlaceholder}
              value={section4Comments}
              onChange={(e) => setSection4Comments(e.target.value)}
            />
          </div>

          <div className="buttons-row">
            <button type="button" className="btn btn-secondary" onClick={handleBack}>
              <ChevronLeft size={18} />
              {t.prevButton}
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {t.nextButton}
              <ChevronRight size={18} />
            </button>
          </div>
        </main>
      )}

      {/* STEP 4: SECTION 5 - GENERAL FEEDBACK & BIEN-ÊTRE */}
      {step === 4 && (
        <main className="wizard-card">
          <h2 className="section-title">{t.s5Title}</h2>

          {/* Q12 */}
          <div className="question-block">
            <label className="question-label">{t.q12Label}</label>
            <div className="rating-row">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`rating-button ${overallJobSatisfaction === num ? "selected" : ""}`}
                  onClick={() => setOverallJobSatisfaction(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="rating-labels">
              <span>{t.q12Min}</span>
              <span>{t.q12Max}</span>
            </div>
          </div>

          {/* Q13 */}
          <div className="question-block" style={{ marginTop: "12px" }}>
            <label className="question-label">{t.q13Label}</label>
            <div className="tiles-grid">
              {[
                { key: "schedule", val: t.q13Schedule },
                { key: "salary", val: t.q13Salary },
                { key: "communication", val: t.q13Communication },
                { key: "physical", val: t.q13Physical },
                { key: "other", val: t.q13Other },
              ].map((change) => (
                <button
                  key={change.key}
                  type="button"
                  className={`tile-option ${mostImpactfulChangeDesired === change.key ? "selected" : ""}`}
                  onClick={() => setMostImpactfulChangeDesired(change.key)}
                >
                  <span>{change.val}</span>
                  <span className="tile-check">
                    {mostImpactfulChangeDesired === change.key && <Check size={12} />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Section Comments */}
          <div className="comment-box-wrapper">
            <label className="question-label">
              {t.s5CommentsLabel} <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "normal" }}>{t.optionalLabel}</span>
            </label>
            <textarea
              className="comment-textarea"
              placeholder={t.commentsPlaceholder}
              value={section5Comments}
              onChange={(e) => setSection5Comments(e.target.value)}
            />
          </div>

          {submitError && (
            <p style={{ color: "var(--color-accent)", fontSize: "0.85rem", fontWeight: "bold", textAlign: "center" }}>
              {submitError}
            </p>
          )}

          <div className="buttons-row">
            <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={isSubmitting}>
              <ChevronLeft size={18} />
              {t.prevButton}
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
            >
              {isSubmitting ? (
                <span>...</span>
              ) : (
                <>
                  {t.submitButton}
                  <Check size={18} />
                </>
              )}
            </button>
          </div>
        </main>
      )}

      {/* STEP 5: SUCCESS PAGE */}
      {step === 5 && (
        <main className="wizard-card success-screen">
          <div className="success-icon-container">
            <Check size={36} />
          </div>
          <h2 className="section-title" style={{ border: "none", padding: "0", margin: "0" }}>
            {t.successTitle}
          </h2>
          <p className="success-message">
            {t.successMessage}
          </p>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleResetSurvey}
            style={{ width: "100%", marginTop: "12px" }}
          >
            {t.newSurveyButton}
          </button>
        </main>
      )}

      <footer className="survey-footer">
        <p 
          className="copyright-text"
          onClick={handleCopyrightClick}
        >
          &copy; {new Date().getFullYear()} {t.subtitle}
        </p>
      </footer>
    </div>
  );
}

export default App;

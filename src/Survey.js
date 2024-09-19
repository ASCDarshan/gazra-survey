import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  LinearProgress,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

// Survey Questions Array
const surveyQuestions = [
  // Demographic Information
  {
    section: "Demographic Information (Optional but Helpful for Analysis):",
    questions: [
      {
        question: "Age Group:",
        options: [
          "Under 18",
          "18–24",
          "25–34",
          "35–44",
          "45–54",
          "55–64",
          "65 and above",
        ],
        key: "AgeGroup",
      },
      {
        question: "Gender:",
        options: ["Female", "Male", "Prefer not to say"],
        key: "Gender",
      },
      {
        question: "Location:",
        options: ["Urban", "Semi-Urban", "Rural"],
        key: "Location",
      },
      {
        question: "State/Union Territory: (Please specify)",
        key: "StateOrUT",
        isTextInput: true,
      },
      {
        question: "Education Level:",
        options: [
          "No Formal Education",
          "Primary Education",
          "Secondary Education",
          "Higher Secondary Education",
          "Bachelor's Degree",
          "Master's Degree or Higher",
        ],
        key: "EducationLevel",
      },
    ],
  },
  // Section A: Girl Child Discrimination
  {
    section: "Section A: Girl Child Discrimination",
    questions: [
      {
        question:
          "Do you believe that girls and boys are given equal opportunities in education in India?",
        options: ["Yes", "No", "Not Sure"],
        key: "EqualEducationOpportunities",
      },
      {
        question:
          "In your community, is there a preference for male children over female children?",
        options: [
          "Strong preference for males",
          "Slight preference for males",
          "No preference",
          "Slight preference for females",
          "Strong preference for females",
        ],
        key: "ChildGenderPreference",
      },
      {
        question:
          "Have you observed or experienced discrimination against girl children in your family or community?",
        options: ["Yes, frequently", "Yes, occasionally", "No"],
        key: "ObservedGirlChildDiscrimination",
      },
      {
        question:
          "Do you think dowry practices contribute to discrimination against the girl child?",
        options: ["Yes", "No", "Not Sure"],
        key: "DowryContributesToDiscrimination",
      },
      {
        question:
          "Are you aware of government schemes like Beti Bachao Beti Padhao aimed at improving the status of the girl child?",
        options: ["Yes", "No"],
        key: "AwareOfGirlChildSchemes",
      },
    ],
  },
  // Section B: Women's Safety
  {
    section: "Section B: Women's Safety",
    questions: [
      {
        question:
          "How safe do you feel walking alone in your neighborhood after dark?",
        options: [
          "Very Safe",
          "Somewhat Safe",
          "Neutral",
          "Somewhat Unsafe",
          "Very Unsafe",
        ],
        key: "SafetyWalkingAloneAtNight",
      },
      {
        question:
          "Have you ever altered your daily routine due to safety concerns (e.g., changed routes, avoided certain areas)?",
        options: ["Yes, frequently", "Yes, occasionally", "No"],
        key: "AlteredRoutineDueToSafety",
      },
      {
        question:
          "Do you believe that public transportation in your area is safe for women?",
        options: ["Yes", "No", "Not Sure"],
        key: "PublicTransportSafety",
      },
      {
        question:
          "Have you experienced any form of harassment in public places (e.g., eve teasing, pinching, inappropriate touching)?",
        options: ["Yes", "No", "Prefer not to say"],
        key: "ExperiencedPublicHarassment",
      },
      {
        question:
          "Are you aware of helpline numbers or resources available for women's safety in India (e.g., 1091, 181)?",
        options: ["Yes", "No"],
        key: "AwareOfSafetyHelplines",
      },
    ],
  },
  // Section C: Women's Rights and Discrimination
  {
    section: "Section C: Women's Rights and Discrimination",
    questions: [
      {
        question:
          "Do you believe that women have equal employment opportunities compared to men in India?",
        options: ["Yes", "No", "Not Sure"],
        key: "EqualEmploymentOpportunities",
      },
      {
        question:
          "Have you ever faced discrimination at the workplace due to your gender?",
        options: ["Yes", "No", "Not Applicable"],
        key: "FacedWorkplaceDiscrimination",
      },
      {
        question:
          "Do you agree that societal expectations limit women’s choices in career and personal life?",
        options: [
          "Strongly Agree",
          "Agree",
          "Neutral",
          "Disagree",
          "Strongly Disagree",
        ],
        key: "SocietalExpectationsLimitWomen",
      },
      {
        question:
          "In your opinion, is domestic violence a serious issue affecting women in India?",
        options: ["Yes", "No", "Not Sure"],
        key: "DomesticViolenceSeriousIssue",
      },
      {
        question:
          "Are you aware of legal provisions like the Protection of Women from Domestic Violence Act, 2005?",
        options: ["Yes", "No"],
        key: "AwareOfDomesticViolenceAct",
      },
    ],
  },
  // Section D: General Facilities for Women by the Government
  {
    section: "Section D: General Facilities for Women by the Government",
    questions: [
      {
        question:
          "Do you think the government provides sufficient healthcare facilities specifically for women (e.g., maternal health services)?",
        options: ["Yes", "No", "Not Sure"],
        key: "SufficientHealthcareFacilities",
      },
      {
        question:
          "Have you or someone you know benefited from government schemes aimed at women’s welfare (e.g., Janani Suraksha Yojana, Sukanya Samriddhi Yojana)?",
        options: ["Yes", "No", "Not Sure"],
        key: "BenefitedFromWelfareSchemes",
      },
      {
        question:
          "Are you satisfied with the availability of public sanitation facilities (e.g., toilets) for women in your area?",
        options: [
          "Very Satisfied",
          "Satisfied",
          "Neutral",
          "Dissatisfied",
          "Very Dissatisfied",
        ],
        key: "SatisfactionWithSanitationFacilities",
      },
      {
        question:
          "Do you believe that government initiatives have improved the status of women in society over the past decade?",
        options: ["Yes", "No", "Not Sure"],
        key: "GovtInitiativesImprovedStatus",
      },
      {
        question:
          "Are you aware of any government programs promoting women’s education and empowerment?",
        options: ["Yes", "No"],
        key: "AwareOfEducationEmpowermentPrograms",
      },
    ],
  },
  // Section E: Impact of the Legal System on Women's Lives
  {
    section: "Section E: Impact of the Legal System on Women's Lives",
    questions: [
      {
        question:
          "Do you feel that the legal system in India adequately protects women’s rights?",
        options: ["Yes", "No", "Not Sure"],
        key: "LegalSystemProtectsRights",
      },
      {
        question:
          "Are you confident in the police’s ability to handle cases related to crimes against women?",
        options: [
          "Very Confident",
          "Somewhat Confident",
          "Neutral",
          "Somewhat Unconfident",
          "Not Confident at All",
        ],
        key: "ConfidenceInPolice",
      },
      {
        question:
          "Do you believe that legal processes (e.g., courts, legal aid) are accessible to women who seek justice?",
        options: ["Yes", "No", "Not Sure"],
        key: "LegalProcessesAccessible",
      },
      {
        question:
          "Have laws like the Criminal Law (Amendment) Act, 2013 (following the Nirbhaya case) made you feel safer?",
        options: ["Yes", "No", "Not Aware of the Act"],
        key: "AmendmentActEffect",
      },
      {
        question:
          "Do you think more legal reforms are needed to improve women’s safety and rights in India?",
        options: ["Yes", "No", "Not Sure"],
        key: "NeedMoreLegalReforms",
      },
    ],
  },
];

// Flatten questions and assign step numbers
let allQuestions = [];
let surveySteps = [];
let step = 0;
surveyQuestions.forEach((section) => {
  surveySteps.push({
    title: section.section,
    questionKeys: [],
  });
  section.questions.forEach((q) => {
    allQuestions.push(q);
    surveySteps[step].questionKeys.push(q.key);
  });
  step++;
});

// Survey Component
function Survey() {
  const [responses, setResponses] = useState({});
  const [textInputs, setTextInputs] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showInitialPopup, setShowInitialPopup] = useState(true);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [logoSize, setLogoSize] = useState(100);
  const [loading, setLoading] = useState(false);
  // Initial logo size in sticky header
  const totalSteps = surveySteps.length;

  // Map questions by key for easy access
  const questionMap = allQuestions.reduce((acc, q) => {
    acc[q.key] = q;
    return acc;
  }, {});

  // Handle single selection
  const handleSelect = (questionKey, optionValue) => {
    setResponses({
      ...responses,
      [questionKey]: optionValue,
    });
  };

  // Handle multiple selection
  const handleSelectMultiple = (questionKey, optionValue) => {
    const selectedOptions = responses[questionKey] || [];
    const index = selectedOptions.indexOf(optionValue);
    if (index > -1) {
      // Deselect the option
      selectedOptions.splice(index, 1);
    } else {
      // Select the option
      const question = questionMap[questionKey];
      if (question.maxSelection) {
        if (selectedOptions.length >= question.maxSelection) {
          return; // Do not allow more than maxSelection
        }
      }
      selectedOptions.push(optionValue);
    }
    setResponses({
      ...responses,
      [questionKey]: [...selectedOptions],
    });
  };

  // Handle text input changes
  const handleTextInputChange = (questionKey, value) => {
    setTextInputs({
      ...textInputs,
      [questionKey]: value,
    });
  };

  // Determine if a question should be visible based on conditional logic
  const isQuestionVisible = (question) => {
    if (!question.conditional) {
      return true;
    }
    const { key, value } = question.conditional;
    return responses[key] === value;
  };

  // Handle survey submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {};

    allQuestions.forEach((q) => {
      if (!isQuestionVisible(q)) {
        return;
      }
      const response = responses[q.key];
      if (response !== undefined) {
        if (Array.isArray(response)) {
          data[q.key] = response.join(", ");
        } else {
          data[q.key] = response;
        }
      } else if (q.isTextInput) {
        data[q.key] = textInputs[q.key] || "";
      } else {
        data[q.key] = "";
      }
    });

    // Include text inputs for 'Other (Please specify)'
    Object.keys(textInputs).forEach((key) => {
      if (!data[key] || data[key] === "Other (Please specify)") {
        data[key] = textInputs[key];
      }
    });

    const formData = new FormData();

    formData.append("AgeGroup", data.AgeGroup);
    formData.append(
      "AlteredRoutineDueToSafety",
      data.AlteredRoutineDueToSafety
    );
    formData.append("AmendmentActEffect", data.AmendmentActEffect);
    formData.append(
      "AwareOfDomesticViolenceAct",
      data.AwareOfDomesticViolenceAct
    );
    formData.append(
      "AwareOfEducationEmpowermentPrograms",
      data.AwareOfEducationEmpowermentPrograms
    );
    formData.append("AwareOfGirlChildSchemes", data.AwareOfGirlChildSchemes);
    formData.append("AwareOfSafetyHelplines", data.AwareOfSafetyHelplines);
    formData.append("AwareOfGirlChildSchemes", data.AwareOfGirlChildSchemes);
    formData.append(
      "BenefitedFromWelfareSchemes",
      data.BenefitedFromWelfareSchemes
    );
    formData.append("ChildGenderPreference", data.ChildGenderPreference);
    formData.append("ConfidenceInPolice", data.ConfidenceInPolice);
    formData.append(
      "DomesticViolenceSeriousIssue",
      data.DomesticViolenceSeriousIssue
    );
    formData.append(
      "DowryContributesToDiscrimination",
      data.DowryContributesToDiscrimination
    );
    formData.append("EducationLevel", data.EducationLevel);
    formData.append(
      "EqualEducationOpportunities",
      data.EqualEducationOpportunities
    );
    formData.append(
      "EqualEmploymentOpportunities",
      data.EqualEmploymentOpportunities
    );
    formData.append(
      "ExperiencedPublicHarassment",
      data.ExperiencedPublicHarassment
    );
    formData.append(
      "FacedWorkplaceDiscrimination",
      data.FacedWorkplaceDiscrimination
    );
    formData.append("Gender", data.Gender);
    formData.append(
      "GovtInitiativesImprovedStatus",
      data.GovtInitiativesImprovedStatus
    );
    formData.append("LegalProcessesAccessible", data.LegalProcessesAccessible);
    formData.append(
      "LegalSystemProtectsRights",
      data.LegalSystemProtectsRights
    );
    formData.append("Location", data.Location);
    formData.append("NeedMoreLegalReforms", data.NeedMoreLegalReforms);
    formData.append(
      "ObservedGirlChildDiscrimination",
      data.ObservedGirlChildDiscrimination
    );
    formData.append("PublicTransportSafety ", data.PublicTransportSafety);
    formData.append(
      "SafetyWalkingAloneAtNight",
      data.SafetyWalkingAloneAtNight
    );
    formData.append(
      "SatisfactionWithSanitationFacilities",
      data.SatisfactionWithSanitationFacilities
    );
    formData.append(
      "SocietalExpectationsLimitWomen",
      data.SocietalExpectationsLimitWomen
    );
    formData.append("StateOrUT", data.StateOrUT);
    formData.append(
      "SufficientHealthcareFacilities",
      data.SufficientHealthcareFacilities
    );

    // Send data to Google Apps Script
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxgCVlFZu3G6EWY_djyLnKvVm0Bm-mBYMTd3O75YBCjyDMUgg-kTaHfA-17MXSV3Cdp6A/exec",
        {
          method: "POST",
          body: formData,
          muteHttpExceptions: true,
        }
      );
      if (response.ok) {
        setShowThankYouPopup(true);
      } else {
        throw new Error("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get current questions based on the current step
  const currentQuestions = surveySteps[currentStep].questionKeys
    .map((key) => questionMap[key])
    .filter((q) => isQuestionVisible(q));

  // Handle scroll to adjust logo size
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const minLogoSize = 50;
      const maxLogoSize = 100;
      const newLogoSize = Math.max(
        minLogoSize,
        maxLogoSize - scrollY * 0.2 // Adjust the multiplier for desired effect
      );
      setLogoSize(newLogoSize);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Initial Popup */}
      <Dialog open={showInitialPopup} onClose={() => {}}>
        <DialogContent>
          {/* Logo in Popup */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <img
              src="https://gazra.org/static/img/logo.png"
              alt="Logo"
              style={{ maxWidth: "200px", width: "100%", height: "auto" }}
            />
          </Box>
          <Typography variant="h6" gutterBottom>
            Welcome to the Survey on Women's Status and Safety in India
          </Typography>
          <Typography variant="body1">
            This survey aims to gather information about women's status and
            safety in India. Your responses are confidential and anonymous. You
            may skip any questions you're not comfortable answering.
          </Typography>
        </DialogContent>
        <Grid item container justifyContent="center">
          <DialogActions>
            <Button
              onClick={() => setShowInitialPopup(false)}
              color="primary"
              variant="contained"
            >
              Start Survey
            </Button>
          </DialogActions>
        </Grid>
      </Dialog>
      {/* Thank-You Popup */}
      <Dialog
        open={showThankYouPopup}
        onClose={() => setShowThankYouPopup(false)}
      >
        <DialogContent>
          {/* Logo in Popup */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <img
              src="https://gazra.org/static/img/logo.png"
              alt="Logo"
              style={{ maxWidth: "200px", width: "100%", height: "auto" }}
            />
          </Box>
          <Typography variant="h6" gutterBottom>
            Thank You!
          </Typography>
          <Typography variant="body1">
            Thank you for participating in this survey. Your responses are
            valuable and will contribute to understanding and improving the
            status of women in India.
          </Typography>
        </DialogContent>
      </Dialog>
      {/* Survey Content */}
      {!showInitialPopup && !showThankYouPopup && (
        <>
          {/* Sticky Progress Bar */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "#f5f5f5", // Light shade background color
              pb: 1,
              pt: 1,
              transition: "all 0.3s ease",
              borderBottom: "1px solid #ddd",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: { xs: 1, md: 2 },
              }}
            >
              {/* Logo in Sticky Header */}
              <img
                src="https://gazra.org/static/img/logo.png"
                alt="Logo"
                style={{
                  width: `${logoSize}px`,
                  height: "auto",
                  transition: "width 0.3s ease",
                }}
              />
              <Box sx={{ ml: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Survey on Women's Status and Safety in India
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {surveySteps[currentStep].title}
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={((currentStep + 1) / totalSteps) * 100}
              sx={{ mt: 1 }}
            />
          </Box>
          {/* Survey Questions */}
          {currentQuestions.map((q) => (
            <Card key={q.key} sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {q.question}
                </Typography>
                {q.isTextInput ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    value={textInputs[q.key] || ""}
                    onChange={(e) =>
                      handleTextInputChange(q.key, e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                ) : q.allowMultiple ? (
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {q.options.map((option) => (
                      <Grid item xs={6} sm={4} md={3} key={option}>
                        <Button
                          variant={
                            responses[q.key] &&
                            responses[q.key].includes(option)
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() => handleSelectMultiple(q.key, option)}
                          sx={{
                            width: "100%",
                            height: 80,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            p: 1,
                            m: 0,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            minHeight: 80,
                          }}
                        >
                          {option}
                        </Button>
                        {option === "Other (Please specify)" &&
                          responses[q.key] &&
                          responses[q.key].includes(option) && (
                            <TextField
                              fullWidth
                              variant="outlined"
                              value={textInputs[q.key] || ""}
                              onChange={(e) =>
                                handleTextInputChange(q.key, e.target.value)
                              }
                              sx={{ mt: 1 }}
                            />
                          )}
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {q.options.map((option) => (
                      <Grid item xs={6} sm={4} md={3} key={option}>
                        <Button
                          variant={
                            responses[q.key] === option
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() => handleSelect(q.key, option)}
                          sx={{
                            width: "100%",
                            height: 80,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            p: 1,
                            m: 0,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            minHeight: 80,
                          }}
                        >
                          {option}
                        </Button>
                        {option === "Other (Please specify)" &&
                          responses[q.key] === option && (
                            <TextField
                              fullWidth
                              variant="outlined"
                              value={textInputs[q.key] || ""}
                              onChange={(e) =>
                                handleTextInputChange(q.key, e.target.value)
                              }
                              sx={{ mt: 1 }}
                            />
                          )}
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          ))}
          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            {currentStep > 0 && (
              <Button
                variant="contained"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            )}
            {currentStep < totalSteps - 1 ? (
              <Button
                variant="contained"
                onClick={() => setCurrentStep(currentStep + 1)}
                sx={{ ml: "auto" }}
              >
                Next
              </Button>
            ) : loading ? (
              <CircularProgress sx={{ ml: "auto" }} />
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                sx={{ ml: "auto" }}
              >
                Submit Survey
              </Button>
            )}
          </Box>
          ;
        </>
      )}
    </Box>
  );
}
export default Survey;

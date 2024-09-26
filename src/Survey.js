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
          "Do you believe that the birth of a girl child is still considered a burden in many Indian families?",
        options: ["Yes, widely", "Yes, in some cases", "No", "Not Sure"],
        key: "BirthOfGirlChild",
      },
      {
        question:
          "Is the dowry system a form of institutionalized abuse against women?",
        options: ["Yes", "No", "Not Sure"],
        key: "DowryAbuse",
      },
      {
        question:
          "Should parents who deny education to their daughters face legal consequences?",
        options: ["Yes", "No", "Not Sure"],
        key: "DenyEducationLegalConsequences",
      },
    ],
  },
  // Section B: Women's Safety
  {
    section: "Section B: Women's Safety",
    questions: [
      {
        question:
          "Have you ever experienced any of the following forms of harassment in public spaces? (Select all that apply)",
        options: [
          "Eve teasing (catcalling, whistling, lewd remarks)",
          "Pinching",
          "Inappropriate touching",
          "Groping",
          "Staring or leering",
          "Following or stalking",
          "Unwanted comments on appearance",
          "None of the above",
        ],
        key: "PublicHarassment",
        allowMultiple: true,
      },
      {
        question:
          "Do you feel that the fear of sexual assault restricts women’s freedom more than any law ever could?",
        options: [
          "Strongly Agree",
          "Agree",
          "Neutral",
          "Disagree",
          "Strongly Disagree",
        ],
        key: "FearOfSexualAssault",
      },
      {
        question:
          "Is society's tendency to blame victims for their attire or behavior an outrage?",
        options: ["Yes, absolutely", "No", "Not Sure"],
        key: "VictimBlamingOutrage",
      },
    ],
  },
  // Section C: Women's Rights and Discrimination
  {
    section: "Section C: Women's Rights and Discrimination",
    questions: [
      {
        question:
          "Are you angered by the gender pay gap that still exists in many industries?",
        options: ["Yes, very much", "Somewhat", "No", "Not Aware"],
        key: "GenderPayGapAnger",
      },
      {
        question:
          "Should employers who discriminate against women in hiring and promotions face severe penalties?",
        options: ["Yes", "No", "Not Sure"],
        key: "DiscriminationPenalties",
      },
      {
        question:
          "Do you believe that cultural traditions are often used as excuses to oppress women?",
        options: ["Yes, frequently", "Yes, sometimes", "No", "Not Sure"],
        key: "CulturalTraditionsOppress",
      },
    ],
  },
  // Section D: General Facilities for Women by the Government
  {
    section: "Section D: General Facilities for Women by the Government",
    questions: [
      {
        question:
          "Are you frustrated by the lack of proper sanitation facilities for women in public places?",
        options: [
          "Yes, very frustrated",
          "Somewhat frustrated",
          "No",
          "Not Aware",
        ],
        key: "SanitationFacilitiesFrustration",
      },
      {
        question:
          "Should the government be held accountable for failing to provide basic safety measures for women?",
        options: ["Yes", "No", "Not Sure"],
        key: "GovernmentAccountableSafety",
      },
      {
        question:
          "Do you believe that government programs for women are more about publicity than actual impact?",
        options: ["Yes", "No", "Not Sure"],
        key: "GovernmentProgramsPublicity",
      },
    ],
  },
  // Section E: Impact of the Legal System on Women's Lives
  {
    section: "Section E: Impact of the Legal System on Women's Lives",
    questions: [
      {
        question:
          "Do you think the legal system in India favors men over women?",
        options: ["Yes, significantly", "Yes, slightly", "No", "Not Sure"],
        key: "LegalSystemFavorsMen",
      },
      {
        question:
          "Are you outraged by the delays in legal proceedings related to crimes against women?",
        options: ["Yes, extremely", "Somewhat", "No", "Not Aware"],
        key: "LegalProceedingsDelays",
      },
      {
        question:
          "Do you believe that the low conviction rates in rape cases discourage victims from seeking justice?",
        options: ["Yes", "No", "Not Sure"],
        key: "LowConvictionRates",
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

  const handleNextClick = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    formData.append("Location", data.Location);
    formData.append("StateOrUT", data.StateOrUT);
    formData.append("EducationLevel", data.EducationLevel);
    formData.append("BirthOfGirlChild", data.BirthOfGirlChild);
    formData.append("DowryAbuse", data.DowryAbuse);
    formData.append(
      "DenyEducationLegalConsequences",
      data.DenyEducationLegalConsequences
    );
    formData.append("PublicHarassment", data.PublicHarassment);
    formData.append("FearOfSexualAssault", data.FearOfSexualAssault);
    formData.append("VictimBlamingOutrage", data.VictimBlamingOutrage);
    formData.append("GenderPayGapAnger", data.GenderPayGapAnger);
    formData.append("DiscriminationPenalties", data.DiscriminationPenalties);
    formData.append(
      "CulturalTraditionsOppress",
      data.CulturalTraditionsOppress
    );
    formData.append(
      "SanitationFacilitiesFrustration",
      data.SanitationFacilitiesFrustration
    );
    formData.append(
      "GovernmentAccountableSafety",
      data.GovernmentAccountableSafety
    );
    formData.append(
      "GovernmentProgramsPublicity",
      data.GovernmentProgramsPublicity
    );
    formData.append("LegalSystemFavorsMen", data.LegalSystemFavorsMen);
    formData.append("LegalProceedingsDelays", data.LegalProceedingsDelays);
    formData.append("LowConvictionRates", data.LowConvictionRates);

    // Send data to Google Apps Script
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbx_kpkgxSwUL7b32jhk71rjhTsDuhrJ6MBixJGCqfSlEf7oT2zeJAi8gWWA1hN06BkpXA/exec",
        {
          method: "POST",
          body: formData,
          muteHttpExceptions: true,
        }
      );
      if (response.ok) {
        setShowThankYouPopup(true);

        setTimeout(() => {
          setShowThankYouPopup(false);
          setShowInitialPopup(true);
          setResponses({});
          setTextInputs({});
          setCurrentStep(0);
        }, 5000);
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
              backgroundColor: "#f5f5f5",
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
            <Card
              key={q.key}
              sx={{
                mb: 4,
                borderRadius: "10px",
                background: "#e0e0e057",
                boxShadow: "5px 5px 10px #d3d3d3 -5px -5px 10px #ededed",
              }}
            >
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
                            transition:
                              "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                            color:
                              responses[q.key] === option ? "white" : "black",
                            borderColor:
                              responses[q.key] === option
                                ? (theme) => theme.palette.primary.main
                                : "black",
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
                            transition:
                              "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                            color:
                              responses[q.key] === option ? "white" : "black",
                            borderColor:
                              responses[q.key] === option
                                ? (theme) => theme.palette.primary.main
                                : "black",
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
                onClick={handleNextClick}
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
        </>
      )}
    </Box>
  );
}
export default Survey;

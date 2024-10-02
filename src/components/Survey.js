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
import logo from "../images/MCSLogo.png";
import backgroundImage from "../images/BG-Main.jpg";

// Survey Questions
const surveyQuestions = [
  // Demographic Information
  {
    section: "A",
    questions: [
      {
        question: "Age Group : ",
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
        question: "Location : ",
        options: ["Urban", "Semi-Urban", "Rural"],
        key: "Location",
      },
      {
        question:
          "Which of the following best describes your gender identity? Please select all that apply.",
        options: ["Male", "Female", "Other"],
        key: "Gender",
      },
      {
        question: "State/Union Territory :  (Please specify)",
        key: "StateOrUT",
        isTextInput: true,
      },
      {
        question: "Education Level : ",
        options: [
          "No Formal Education",
          "Primary Education",
          "Secondary Education",
          "Higher Secondary Education",
          "Bachelor's Degree",
          "Master's Degree or Higher",
        ],
        key: "Education",
      },
    ],
  },
  {
    section: "B",
    questions: [
      {
        question: "Are you familiar with the term violence against women?",
        options: [
          "Very familiar",
          "Somewhat familiar",
          "Not very familiar",
          "Not at all familiar",
        ],
        key: "ViolenceFamiliarity",
      },
      {
        question:
          "Have you ever witnessed or experienced any form of violence against women?",
        options: ["Yes", "No", "Prefer not to say"],
        key: "ViolenceAgainstWomen",
      },
      {
        question:
          "Which of the following do you consider to be forms of violence against women? (Pick any or all that match your experience)",
        options: [
          "Physical assault (e.g., hitting, kicking, pushing)",
          "Sexual assault or rape",
          "Verbal abuse or name-calling",
          "Isolating from friends/family, controlling finances",
          "Stalking or persistent unwanted attention",
          "Online harassment or cyberbullying",
          "Emotional manipulation or gaslighting",
          "Forced marriage or honor-based violence",
          "Reproductive coercion (forcing pregnancy or abortion)",
          "Denial of education or employment opportunities",
        ],
        key: "ViolenceAgainstWomenTypes",
        allowMultiple: true,
      },
    ],
  },
  {
    section: "C",
    questions: [
      {
        question:
          "In your opinion, how common is physical violence against women in your community?",
        options: [
          "Very common",
          "Somewhat common",
          "Not very common",
          "Not at all common",
          "Unsure",
        ],
        key: "PhysicalViolence",
      },
      {
        question:
          "Where do you think physical violence against women most commonly occurs? (Pick any or all that match your experience)",
        options: [
          "At home",
          "In public spaces",
          "At work",
          "In educational institutions",
        ],
        key: "PhysicalViolenceLocation",
        allowMultiple: true,
      },
      {
        question:
          "How would you rate the prevalence of sexual violence against women in your community?",
        options: ["Very high", "High", "Moderate", "Low", "Very low", "Unsure"],
        key: "SexualViolence",
      },
      {
        question:
          "Which form of sexual violence do you think is most underreported? (Pick any or all that match your experience)",
        options: [
          "Rape",
          "Sexual assault",
          "Unwanted touching or groping",
          "Forced kissing",
          "Sharing intimate images without consent",
          "Coercion into sexual acts",
        ],
        key: "SexualViolenceType",
        allowMultiple: true,
      },
    ],
  },
  {
    section: "D",
    questions: [
      {
        question:
          "In your opinion, what is the biggest barrier to reporting sexual violence? (Pick any or all that match your experience)",
        options: [
          "Fear of retaliation",
          "Shame or stigma",
          "Lack of trust in authorities",
          "Fear of not being believed",
          "Lack of awareness of rights and resources",
        ],
        key: "SexualViolenceBarrier",
        allowMultiple: true,
      },
      {
        question:
          "Do you think emotional/psychological abuse is taken as seriously as physical violence?",
        options: ["Yes", "No", "Unsure"],
        key: "EmotionalPsychologicalAbuse",
      },
      {
        question:
          "Which form of emotional/psychological abuse do you think is most common?",
        options: [
          "Name-calling or insulting",
          "Constant criticism",
          "Humiliation in public or private",
          "Gaslighting",
          "Threats",
          "Isolation from friends and family",
        ],
        key: "EmotionalPsychologicalAbuseType",
      },
      {
        question: "How prevalent do you think cyber violence is against women? (Pick any or all that match your experience)",
        options: [
          "Very prevalent",
          "Somewhat prevalent",
          "Not very prevalent",
          "Not at all prevalent",
          "Unsure",
        ],
        key: "CyberViolence",
        allowMultiple: true,
      },
    ],
  },
  {
    section: "D",
    questions: [
      {
        question: "Which form of cyber violence do you think is most harmful?",
        options: [
          "Online harassment or bullying",
          "Impersonation on social media",
          "Revenge porn",
          "Doxxing",
        ],
        key: "CyberViolenceType",
      },
      {
        question:
          "If you witnessed violence against a woman, what would you most likely do?",
        options: [
          "Intervene directly",
          "Call the authorities",
          "Offer support to the victim afterwards",
          "Nothing, out of fear or uncertainty",
        ],
        key: "CyberViolenceAction",
      },
      {
        question:
          "Are you aware of any local resources or organizations that support women experiencing violence?",
        options: ["Yes", "No"],
        key: "CyberViolenceAwareness",
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

const Survey = () => {
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
    formData.append("Gender", data.Gender);
    formData.append("StateOrUT", data.StateOrUT);
    formData.append("Education", data.Education);
    formData.append("ViolenceFamiliarity", data.ViolenceFamiliarity);
    formData.append("ViolenceAgainstWomen", data.ViolenceAgainstWomen);
    formData.append(
      "ViolenceAgainstWomenTypes",
      data.ViolenceAgainstWomenTypes
    );
    formData.append("PhysicalViolence", data.PhysicalViolence);
    formData.append("PhysicalViolenceLocation", data.PhysicalViolenceLocation);
    formData.append("SexualViolence", data.SexualViolence);
    formData.append("SexualViolenceType", data.SexualViolenceType);
    formData.append("SexualViolenceBarrier", data.SexualViolenceBarrier);
    formData.append(
      "EmotionalPsychologicalAbuse",
      data.EmotionalPsychologicalAbuse
    );
    formData.append(
      "EmotionalPsychologicalAbuseType",
      data.EmotionalPsychologicalAbuseType
    );
    formData.append("CyberViolence", data.CyberViolence);
    formData.append("CyberViolenceType", data.CyberViolenceType);
    formData.append("CyberViolenceAction", data.CyberViolenceAction);
    formData.append("CyberViolenceAwareness", data.CyberViolenceAwareness);

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
    <Box
      sx={{ p: { xs: 2, md: 4 }, backgroundImage: `url(${backgroundImage})` }}
    >
      <Dialog open={showInitialPopup} onClose={() => {}}>
        <DialogContent>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <img
              src={logo}
              alt="SHRI MAHARANI CHIMNABAI STREE UDYOGALAYA"
              style={{ maxWidth: "200px", width: "100%", height: "auto" }}
            />
          </Box>
          <Typography variant="h6" gutterBottom fontFamily={"Halant"}>
            Welcome to the Survey on Women's Status and Safety in India
          </Typography>
          <Typography variant="body1" fontFamily={"Halant"}>
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
              sx={{ fontFamily: "Halant" }}
            >
              Start Survey
            </Button>
          </DialogActions>
        </Grid>
      </Dialog>

      <Dialog
        open={showThankYouPopup}
        onClose={() => setShowThankYouPopup(false)}
      >
        <DialogContent>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <img
              src={logo}
              alt="SHRI MAHARANI CHIMNABAI STREE UDYOGALAYA"
              style={{ maxWidth: "200px", width: "100%", height: "auto" }}
            />
          </Box>
          <Typography variant="h6" gutterBottom fontFamily={"Halant"}>
            Thank You!
          </Typography>
          <Typography variant="body1" fontFamily={"Halant"}>
            Thank you for participating in this survey. Your responses are
            valuable and will contribute to understanding and improving the
            status of women in India.
          </Typography>
        </DialogContent>
      </Dialog>

      {!showInitialPopup && !showThankYouPopup && (
        <>
          <Box
            sx={{
              pb: 1,
              pt: 1,
              top: 0,
              zIndex: 1000,
              position: "sticky",
              borderRadius: "10px",
              backgroundColor: "#f5f5f5",
              transition: "all 0.3s ease",
              borderBottom: "1px solid #ddd",
            }}
          >
            <Box
              sx={{
                p: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={logo}
                alt="SHRI MAHARANI CHIMNABAI STREE UDYOGALAYA"
                style={{
                  width: `${logoSize}px`,
                  height: "auto",
                  transition: "width 0.3s ease",
                }}
              />
              <Box>
                <Typography variant="h5" gutterBottom fontFamily={"Halant"}>
                  Survey on Women's Status and Safety in India
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={((currentStep + 1) / totalSteps) * 100}
              sx={{ mt: 1 }}
            />
          </Box>

          {currentQuestions.map((q) => (
            <Card
              key={q.key}
              sx={{
                my: 4,
                borderRadius: "10px",
                backgroundColor: "#f5f5f5",
                boxShadow: "5px 5px 10px #d3d3d3 -5px -5px 10px #ededed",
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  fontWeight={"bold"}
                  fontFamily={"Halant"}
                >
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
                  />
                ) : q.allowMultiple ? (
                  <Grid container spacing={1}>
                    {q.options.map((option) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={option}>
                        <Button
                          variant={
                            responses[q.key] &&
                            responses[q.key].includes(option)
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() => handleSelectMultiple(q.key, option)}
                          sx={{
                            height: { xs: 60, sm: 80 },
                            width: "100%",
                            display: "flex",
                            fontWeight: "bold",
                            alignItems: "center",
                            justifyContent: "start",
                            textAlign: "left",
                            transition:
                              "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                            color:
                              responses[q.key] &&
                              responses[q.key].includes(option)
                                ? "white"
                                : "#50352c",
                            borderColor:
                              responses[q.key] &&
                              responses[q.key].includes(option)
                                ? (theme) => theme.palette.primary.main
                                : "#50352c",
                            fontFamily: "Halant",
                            fontSize: {
                              xs: "12px", // extra small screens
                              sm: "14px", // Small screens
                              md: "14px", // Medium screens
                              lg: "14px", // Large screens
                            },
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
                            />
                          )}
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Grid container spacing={1}>
                    {q.options.map((option) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={option}>
                        <Button
                          variant={
                            responses[q.key] === option
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() => handleSelect(q.key, option)}
                          sx={{
                            height: { xs: 60, sm: 80 },
                            width: "100%",
                            display: "flex",
                            fontWeight: "bold",
                            alignItems: "center",
                            justifyContent: "start",
                            textAlign: "left",
                            transition:
                              "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                            color:
                              responses[q.key] === option ? "white" : "#50352c",
                            borderColor:
                              responses[q.key] === option
                                ? (theme) => theme.palette.primary.main
                                : "#50352c",
                            fontFamily: "Halant",
                            fontSize: {
                              xs: "12px", // extra small screens
                              sm: "14px", // Small screens
                              md: "14px", // Medium screens
                              lg: "14px", // Large screens
                            },
                          }}
                        >
                          {option}
                        </Button>
                        {option === "Other (Please specify)" &&
                          responses[q.key] === option && (
                            <TextField
                              fullWidth
                              sx={{ mt: 1 }}
                              variant="outlined"
                              value={textInputs[q.key] || ""}
                              onChange={(e) =>
                                handleTextInputChange(q.key, e.target.value)
                              }
                            />
                          )}
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          ))}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            {currentStep > 0 && (
              <Button
                variant="contained"
                onClick={() => setCurrentStep(currentStep - 1)}
                sx={{ fontFamily: "Halant" }}
              >
                Back
              </Button>
            )}
            {currentStep < totalSteps - 1 ? (
              <Button
                variant="contained"
                onClick={handleNextClick}
                sx={{ ml: "auto", fontFamily: "Halant" }}
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
                sx={{ ml: "auto", fontFamily: "Halant" }}
              >
                Submit Survey
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};
export default Survey;

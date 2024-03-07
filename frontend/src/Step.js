import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {useNavigate} from "react-router-dom";

const StepperPage = () => {
  const navigate = useNavigate();
    const steps = [
  {
    label: 'Completion of the questionnaire',
    description: `Please complete all the surveys and upload the video and th video format is limited to mp4.`,
  },
  {
    label: 'Voice Page',
    description:
      ' Users can view the pitch and intensity of speech over time and display the average intensity and pitch.With intuitive graphical and numerical representations, users can easily understand how voice characteristics change over time.',
  },
  {
    label: 'Text Page',
    description: `This comprehensive analysis tool provides in-depth insights into speaking habits by offering average speaking rate, sentence length, transcription, 
    frequency of word usage, accompanied by a graph illustrating the progression of words spoken per minute over time.`,
  },
        {
    label: 'Comparison with past video uploads',
    description: `To ensure the best experience, particularly if you plan to engage in the Compare step, it's crucial that you have previously accessed both the text and voice pages.`,
  },
];
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

   const handleReset = () => {
    setActiveStep(0);
  };

  const handleStart = () => {
    navigate('/questionnaire');
  };

  return (
    <Box sx={{
        maxWidth: 800,
        margin: 'auto',
        marginTop: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 3 ? (
                  <Typography variant="caption" sx={{fontSize: '15px'}}>Last step</Typography>
                ) : null
              }
            >
                <Typography sx={{fontSize: '28px'}}>{step.label}</Typography>
            </StepLabel>
            <StepContent>
              <Typography sx={{fontSize: '18px'}}>{step.description}</Typography>
              <Box sx={{ mb: 4 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, mr: 3 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 3, mr: 3 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography sx={{fontSize:'20px'}}>You want to
              <Button onClick={handleReset} sx={{fontSize:'20px'}}><strong>Reread</strong></Button>, or you understand
              all the steps&nbsp;
              <Button variant="contained" onClick={handleStart} sx={{ mt: 0, mr: 0 , fontSize:'15px'}}>
                  <strong>Start</strong>
              </Button>
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
export default StepperPage;

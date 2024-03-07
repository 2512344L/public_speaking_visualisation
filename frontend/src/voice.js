import  './voice.css';
import {useContext, useEffect, useState} from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import Box from "@mui/material/Box";
import {Divider, Tooltip} from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import {useNavigate} from "react-router-dom";
import VideoContext from "./VideoContext";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Voice = () => {
    const {videoUUID} = useContext(VideoContext);
    const auth = JSON.parse(sessionStorage.getItem('auth'));

    const [pitchImage, setPitchImage] = useState('');
    const[intensityImage, setIntensityImage] = useState('');
    const[score, setScore] = useState('');
    const[title, setTitle] = useState('');
    const[time_h, setTimeh] = useState('');
    const[time_m, setTimem] = useState('');
    const[pitch, setPitch] = useState('');
    const[intensity, setIntensity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [alertVisible, setAlertVisible] = useState(true);



    useEffect(() => {
          if (videoUUID) {
            setIsLoading(true);
            axios(`http://127.0.0.1:5000/voice?uuid=${videoUUID}&email=${auth?.email || ''}`,
                {
                    withCredentials: true,
            })
                .then(response =>{
                    setPitchImage(response.data.pitch_image);
                    setIntensityImage(response.data.intensity_image);
                    setScore(response.data.score);
                    setTitle(response.data.title);
                    setTimeh(response.data.time_h);
                    setTimem(response.data.time_m);
                    setPitch(response.data.average_p);
                    setIntensity(response.data.average_i);
                })
                .catch(error => {
                    console.error('Error:', error);
                    navigate('/reload');
                })
             .finally(() => {
                    setIsLoading(false);
                });
        }
           else{
               console.log("no uuid");
                navigate('/reload');
              }
    }, [navigate, videoUUID]);


     if (isLoading) {
        return (
            <Box sx={{display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw'}}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Usually takes <strong>30s to 2 minutes</strong> to load (Related to the length of the video)</Typography>
            </Box>
  );
    }
     const homepage = () =>{
         navigate('/');
     };

     const text = () =>{
         navigate(`/text?uuid=${videoUUID}&email=${auth?.email || ''}`);
     };


  return (
      <>
          <Stack sx={{ width: '100%' }} spacing={5}>
              {alertVisible &&(
              <Alert severity="warning"
                     onClose={() => {setAlertVisible(false)}}>
                  Notice: The video will only be saved for <strong>2 hours</strong>, please check it out as soon as possible! </Alert>
                  )}

          </Stack>
          <div>
              <div className="video-card">
                  <Card sx={{ maxWidth: '80%', marginTop: 5, width: 'auto'}}>
                      <CardContent>
                          <video width="100%" controls>
                              {title &&<source src={`/static/${title}`} type="video/mp4" />}
                              Your browser does not support the video tag.
                          </video>
                      </CardContent>
                  </Card>
              </div>
              <Accordion defaultExpanded style={{marginTop: 15}}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                      <Typography variant={'h5'}>Summary</Typography>
                  </AccordionSummary>
                  <Divider style={{ margin: '10px 18px' }} />
                  <AccordionDetails width = '40%' style={{display: 'flex'}}>
                      <div style={{ textAlign: 'center'}}>
                          <Typography width='400px'>
                              {score && <img src={`data:image/png;base64,${score}`} alt="Generated Plot" className="responsiveImage"/>}
                          </Typography>
                      </div>

                      <div style={{ textAlign: 'center', marginRight: '60px', alignItems: "center", justifyContent: "center", marginTop: '100px'}}>
                          <Typography variant="subtitle1" color="textSecondary">
                              Time
                          </Typography>
                          <Typography variant="h6">
                              {time_h} mins {time_m} s
                          </Typography>
                      </div>

                      <div style={{ textAlign: 'center', marginRight: '60px', alignItems: "center", justifyContent: "center", marginTop: '100px'}}>
                          <Typography variant="subtitle1" color="textSecondary">
                              Average Pitch(Hz)
                          </Typography>
                          <Typography variant="h6">
                              {pitch} Hz
                          </Typography>
                      </div>

                      <div style={{ textAlign: 'center', marginRight: '60px', alignItems: "center", justifyContent: "center", marginTop: '100px'}}>
                          <Typography color="textSecondary">
                              Average Volume(dB)
                          </Typography>
                          <Typography variant="h6">
                              {intensity} dB
                          </Typography>
                      </div>
                      <Divider style={{ margin: '10px 18px' }} />

                  </AccordionDetails>
              </Accordion>
              <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                      <Typography variant={'h5'}>Pitch
                         <Tooltip title={
                             <Typography style={{ fontSize: '1rem' }}>
                                  If your pitch is too low, which might make your speech less engaging,
                                 work on elevating it by practicing vocal exercises and experimenting with higher pitch levels in your delivery. For a pitch that's too high,
                                 possibly causing discomfort or difficulty in understanding,
                                 practice lowering it slightly and incorporating a wider range of tones to ensure clarity and maintain interest without straining your audience's ears.
                             </Typography>} arrow
                                  sx={{
                                      '.MuiTooltip-tooltip': {
                                          backgroundColor: 'gray',
                                          color: 'white',
                                          fontSize: '1rem',
                                          padding: '16px 20px',
                                      }
                         }}
                         >
                              <IconButton aria-label="help">
                                  <HelpOutlineIcon />
                              </IconButton>
                          </Tooltip>
                      </Typography>
                  </AccordionSummary>
                  <Divider style={{ margin: '10px 18px' }} />
                  <AccordionDetails>
                       <Typography variant="body1" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center'}}>
                           <svg width="80" height="10" style={{ marginRight: '10px' }}>
                               <line x1="30" y1="5" x2="80" y2="5" stroke="orange" strokeDasharray="5, 5" strokeWidth={2}/>
                           </svg>
                          Recommended Average
                           <svg width="80" height="10" style={{ marginRight: '10px' }}>
                               <line x1="30" y1="5" x2="80" y2="5" stroke="green" strokeDasharray="5, 5" strokeWidth={2}/>
                           </svg>
                           Your Average
                            <div style={{
                                width: '50px',
                                height: '25px',
                                backgroundColor: '#d2e3f0',
                                marginLeft: '30px',
                                marginRight:'10px'
                                }}>
                            </div>
                           Recommended Range
                       </Typography>
                      <Divider style={{ margin: '10px 10px' }} />
                      <Typography>
                          {pitchImage && <img src={`data:image/png;base64,${pitchImage}`} alt="Generated Plot" className="responsiveImage"/>}
                      </Typography>
                  </AccordionDetails>
              </Accordion>
              <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                      <Typography variant={'h5'}>Intensity
                          <Tooltip title={
                             <Typography style={{ fontSize: '1rem' }}>
                                If your intensity is too low, indicating potential lack of confidence,
                                 boost it by practicing and becoming more familiar with your content.
                                 For too high intensity, suggesting aggression, try to practice pacing and use pauses to moderate it
                             </Typography>} arrow
                                  sx={{
                                      '.MuiTooltip-tooltip': {
                                          backgroundColor: 'gray',
                                          color: 'white',
                                          fontSize: '1rem',
                                          padding: '16px 20px',
                                      }
                         }}
                         >
                              <IconButton aria-label="help">
                                  <HelpOutlineIcon />
                              </IconButton>
                          </Tooltip>
                      </Typography>
                  </AccordionSummary>
                  <Divider style={{ margin: '10px 18px' }} />
                  <AccordionDetails>
                       <Typography variant="body1" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center'}}>
                           <svg width="80" height="10" style={{ marginRight: '10px' }}>
                               <line x1="30" y1="5" x2="80" y2="5" stroke="orange" strokeDasharray="5, 5" strokeWidth={2}/>
                           </svg>
                           Recommended Average
                           <svg width="80" height="10" style={{ marginRight: '10px' }}>
                               <line x1="30" y1="5" x2="80" y2="5" stroke="green" strokeDasharray="5, 5" strokeWidth={2}/>
                           </svg>
                           Your Average
                            <div style={{
                                width: '50px',
                                height: '25px',
                                backgroundColor: '#d2e3f0',
                                marginLeft: '30px',
                                marginRight:'10px'
                                }}>
                            </div>
                           Recommended Range
                       </Typography>
                      <Divider style={{ margin: '10px 10px' }} />
                      <Typography>
                          {intensityImage && <img src={`data:image/png;base64,${intensityImage}`} alt="Generated Plot" className="responsiveImage"/>}
                      </Typography>
                  </AccordionDetails>
              </Accordion>
              <div style={{ marginTop: '40px', width: '100%', bottom: 0, display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                   <Button variant="contained" onClick={homepage} style={{marginLeft: '10px'}}>Go back to Home</Button>
                  <Button variant="contained" onClick={text} style={{marginRight: '10px'}}>Go to Text page</Button>
              </div>
          </div>
      </>
  );
}
export default Voice;
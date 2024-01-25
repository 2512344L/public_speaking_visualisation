import {TopBar} from "./App";
import  './voice.css';
import {useEffect, useState} from "react";
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
import {Divider} from "@mui/material";


const Voice = () => {
    const [imageBase64, setImageBase64] = useState('');
    const[imageBase64_2, setImageBase64_2] = useState('');
    const[score, setScore] = useState('');
    const[title, setTitle] = useState('');
    const[time_h, setTimeh] = useState('');
    const[time_m, setTimem] = useState('');
    const[pitch, setPitch] = useState('');
    const[intensity, setIntensity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVideoUploaded, setIsVideoUploaded] = useState(true);

   useEffect(() => {
        let uuid = new URLSearchParams(window.location.search).get('uuid');
        if (uuid) {
            setIsLoading(true);
            axios(`http://127.0.0.1:5000/voice?uuid=${uuid}`)
                .then(response =>{
                    setImageBase64(response.data.pitch_image);
                    setImageBase64_2(response.data.intensity_image);
                    setScore(response.data.score);
                    setTitle(response.data.title);
                    setTimeh(response.data.time_h);
                    setTimem(response.data.time_m);
                    setPitch(response.data.average_p);
                    setIntensity(response.data.average_i);
                })
                .catch(error => {
                    console.error('Error:', error);
                })
             .finally(() => {
                    setIsLoading(false);
                });
        }
    }, []);

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

  return (
      <>
          <TopBar isVideoUploaded={isVideoUploaded}/>
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
                  </AccordionDetails>
              </Accordion>
              <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                      <Typography variant={'h5'}>Pitch</Typography>
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
                          {imageBase64 && <img src={`data:image/png;base64,${imageBase64}`} alt="Generated Plot" className="responsiveImage" />}
                      </Typography>
                  </AccordionDetails>
              </Accordion>
              <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                      <Typography variant={'h5'}>Intensity</Typography>
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
                          {imageBase64_2 && <img src={`data:image/png;base64,${imageBase64_2}`} alt="Generated Plot" className="responsiveImage" />}
                      </Typography>
                  </AccordionDetails>
              </Accordion>
          </div>
      </>
  );
}
export default Voice;
import {TopBar} from "./App";
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
import {Divider, ListItem, ListItemText} from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import {useNavigate} from "react-router-dom";
import VideoContext from "./VideoContext";
import WordCloud from "./WordCloud";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import './text.css'
import Slider from "./Slider";
// import TranscriptContext from "./TranscriptContext";


const Text = () => {
    const {videoUUID } = useContext(VideoContext);

    const[title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVideoUploaded] = useState(true);
    const[transcript, setTranscript] = useState('');
    const[simple, setSimple] = useState([]);
    const[diff, setDiff] = useState([]);
    const[simpleShow, setSimpleShow] = useState([]);
    const[diffShow, setDiffShow] = useState([]);
    const[wordPlot, setWordPlot] = useState('');
    const[speedPlot, setSpeedPlot] = useState('');
    const[sentenceLength, setSentenceLength] = useState('');
    const[length, setLength] = useState('');
    const[aSpeed, setaSpeed] = useState('');

    const [alertVisible, setAlertVisible] = useState(true);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);


   useEffect(() => {
        if (videoUUID) {
            setIsLoading(true);
            axios(`http://127.0.0.1:5000/text?uuid=${videoUUID}`)
                .then(response =>{
                   setTitle(response.data.title);
                   setTranscript(response.data.transcript);
                   const simpleArray = typeof response.data.simple === 'string' ? response.data.simple.split(" ") : Array.isArray(response.data.simple) ? response.data.simple : [];
                   setSimple(simpleArray);
                   const diffArray = typeof response.data.difficult === 'string' ? response.data.difficult.split(" ") : Array.isArray(response.data.difficult) ? response.data.difficult : [];
                   setDiff(diffArray);
                   setSimpleShow(response.data.simple_show);
                   setDiffShow(response.data.diff_show);
                   setWordPlot(response.data.word_plot);
                   setSpeedPlot(response.data.speed_plot);
                   setSentenceLength(response.data.sentence_length);
                   setLength(response.data.total_length);
                   setaSpeed(response.data.average_speed);
                })
                .catch(error => {
                    console.error('Error:', error);
                    navigate('/reload');
                    setSimple([]);
                    setDiff([]);
                })
             .finally(() => {
                    setIsLoading(false);
                });
        }
         else{
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
                <Typography sx={{ mt: 2 }}>Usually takes <strong>3 - 5 minutes</strong> to load (Related to the length of the video)</Typography>
            </Box>
  );
    }

     const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const homepage = () =>{
         navigate('/');
     };

     const voice = () =>{
         navigate(`/voice?uuid=${videoUUID}`);
     };
  return (
      <>
          <TopBar isVideoUploaded={isVideoUploaded}/>
          <Stack sx={{ width: '100%' }} spacing={5}>
              {alertVisible &&(
              <Alert severity="warning"
                     onClose={() => {setAlertVisible(false)}}>
                  Notice: The video will only be saved for <strong>2 hours</strong>, please check it out as soon as possible! </Alert>
                  )}

          </Stack>
           <Dialog open={open} onClose={handleClose} aria-describedby="alert-dialog-description">
                              <DialogContent>
                                  <DialogContentText id="alert-dialog-description">
                                      <p style={{fontSize: '22px'}}><strong>Frequent Word:</strong></p>
                                      <div className="word-grid">
                                          {simple.map((word, index) => (
                                              <div className="word-item" key={index}>
                                                  {word}
                                              </div>
                                          ))}
                                      </div>
                                      <p style={{fontSize: '22px'}}><strong>Rare Word:</strong></p>
                                      <div className="word-grid">
                                          {diff.map((word, index) => (
                                              <div className="word-item" key={index}>
                                                  {word}
                                              </div>
                                          ))}
                                      </div>
                                  </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                  <Button onClick={handleClose} autoFocus>Close</Button>
                              </DialogActions>
                          </Dialog>
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
                      <Typography style={{fontSize: '30px'}}>Summary</Typography>
                  </AccordionSummary>
                  <Divider style={{ margin: '10px 18px' }} />
                  <AccordionDetails width = '100%' style={{display: 'flex'}}>
                      <div style={{ textAlign: 'center', marginLeft: '120px', marginRight: '150px' ,alignItems: "center", justifyContent: "center", marginTop: '20px'}}>
                          <Typography variant="subtitle1" color="textSecondary"style={{fontSize:'25px', marginBottom: "18px"}}>
                              Word Counts
                          </Typography>
                          <Typography variant="h6">
                              {length} Words
                          </Typography>
                      </div>

                      <div style={{ textAlign: 'center', marginRight: '100px', alignItems: "center", justifyContent: "center", marginTop: '20px'}}>
                          <Typography color="textSecondary" style={{fontSize:'25px' ,marginBottom: "20px"}}>
                              Average Speed of Speech
                          </Typography>
                          <Typography variant="h6">
                              {aSpeed} words / Mins
                          </Typography>
                      </div>

                       <div style={{ textAlign: 'center', marginTop: '20px', alignItems: "center", justifyContent: "center"}}>
                           <Typography variant="subtitle1" color="textSecondary" style={{fontSize:'25px', marginBottom: "20px"}}>
                              Sentence Length
                          </Typography>
                          <Typography>
                              <Slider value1 = {sentenceLength} value2= '37' />
                          </Typography>
                      </div>
                  </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                      <Typography style={{fontSize: '30px'}}>Transcript</Typography>
                  </AccordionSummary>
                  <Divider style={{ margin: '10px 18px' }} />
                  <AccordionDetails>
                      <p>{transcript}</p>
                  </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                      <Typography style={{fontSize: '30px'}}>Word Usage</Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                          <div style={{ flex: 1, textAlign: 'center' }}>
                              <Typography  color = 'black' style={{ display: 'flex', justifyContent: 'center' , fontSize: '25px'}}>
                                  Proportion
                              </Typography>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <Typography>
                                      {wordPlot && <img src={`data:image/png;base64,${wordPlot}`} alt="Generated Plot" style={{ maxWidth: '100%', maxHeight: '300px' }}/>}
                                  </Typography>
                                  <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                                      <div style={{
                                          width: '10px',
                                          height: '10px',
                                          backgroundColor: 'grey',
                                          marginRight: '5px',
                                          }}>
                                      </div>
                                      <Typography variant="body2">Frequent Word Percentage</Typography>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <div style={{
                                          width: '10px',
                                          height: '10px',
                                          backgroundColor: 'orange',
                                          marginRight: '5px',
                                          marginTop: '5px'
                                          }}>
                                      </div>
                                      <Typography variant="body2">Rare Word Percentage</Typography>
                                  </div>
                              </div>
                          </div>

                          <div style={{ flex: 1, textAlign: 'center', marginRight: '30px', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="subtitle1" color="black" style={{fontSize:'25px'}}>
                                  Frequent Word
                              </Typography>
                              <Typography>
                                 <WordCloud words={simpleShow} />
                              </Typography>
                          </div>

                          <div style={{ flex: 1, textAlign: 'center', marginRight: '30px', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="subtitle1" color="black" style={{fontSize:'25px'}}>
                                  Rare Word
                              </Typography>
                              <Typography>
                                  <WordCloud words={diffShow} />
                              </Typography>
                          </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%', marginTop: '20px' }}>
                          <Button variant="text" style={{ margin: '10px', fontSize:'16px'}} onClick={handleOpen}>
                              See ALL Words
                          </Button>
                      </div>

                </AccordionDetails>
              </Accordion>

               <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                      <Typography style={{fontSize: '30px'}}>Speed of Speech</Typography>
                  </AccordionSummary>
                  <Divider style={{ margin: '10px 18px' }} />
                  <AccordionDetails>
                      <Typography variant="body1" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center'}}>
                           <svg width="80" height="10" style={{ marginRight: '10px' }}>
                               <line x1="30" y1="5" x2="80" y2="5" stroke="green" strokeDasharray="5, 5" strokeWidth={2}/>
                           </svg>
                           Your Average (per Minutes)
                            <div style={{
                                width: '50px',
                                height: '25px',
                                backgroundColor: '#d2e3f0',
                                marginLeft: '30px',
                                marginRight:'10px'
                                }}>
                            </div>
                           Recommended Range (per Minutes)
                       </Typography>
                      <Divider style={{ margin: '10px 10px' }} />
                      <Typography width={'40%'}>
                           {speedPlot && <img src={`data:image/png;base64,${speedPlot}`} alt="Generated Plot"/>}
                      </Typography>
                  </AccordionDetails>
              </Accordion>
               <div style={{ marginTop: '40px', width: '100%', bottom: 0, display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                   <Button variant="contained" onClick={homepage} style={{marginLeft: '10px'}}> Go back to Home</Button>
                  <Button variant="contained" onClick={voice} style={{marginRight: '10px'}}>Go to Voice page</Button>
              </div>
          </div>
      </>
  );
}
export default Text;
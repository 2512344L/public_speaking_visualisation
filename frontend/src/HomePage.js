import Card from 'react-bootstrap/Card';
import Button from '@mui/material/Button'
import './homePage.css';
import {Link} from "react-router-dom";



const HomePage = () => {
    const auth = JSON.parse(sessionStorage.getItem('auth'));
  return (
      <>
          <Card className="text-center">
              <Card.Header>Welcome to Speak Trainer :)</Card.Header>
              <Card.Body>
                  <Card.Text>
                      Our software is designed to train your public speaking skills. With powerful features that measure both pitch and volume of your voice, you'll be able to fine-tune your delivery and boost your confidence on stage. Whether you're preparing for a presentation, speech, or just want to improve your communication skills, our web is here to assist you every step of the way. Start your journey to becoming a confident and effective speaker today!
                  </Card.Text>
                  <Card.Text id = "upload">
                      Start your journey now!
                  </Card.Text>
                 <div className="container">
                     <Link to={`/step`}>
                         <Button variant="contained" size="large">   Start   </Button>
                     </Link>
                 </div>
              </Card.Body>
          </Card>
      </>
  );
}
export default HomePage;
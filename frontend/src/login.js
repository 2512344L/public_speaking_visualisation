import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";


const Login = ({setAuth}) => {
    const [password, setPassword] = useState('');
    const[email, setEmail] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/login', {
                method: 'POST',
                body: JSON.stringify({password, email}),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.status === 200) {
                sessionStorage.setItem('auth', JSON.stringify({ loggedIn: true, username: data.username, email: data.email, timestamp: new Date().getTime() }));
                setAuth(true, {username: data.username, email: data.email});
                navigate('/');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError(error.message || 'Login failed due to network error');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
          <div>
              {error && <div style={{ color: 'red' }}>{error}</div>}
          </div>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log in
          </Button>
        </Box>
      </Box>
    </Container>
    );
}
export default Login;
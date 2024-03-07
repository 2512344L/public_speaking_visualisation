import './App.css';

import {useNavigate} from 'react-router-dom';
import VideoContext from './VideoContext';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {useContext, useEffect, useState} from "react";

function TopBar({ auth, user, setAuth}) {
    const { videoUUID, setVideoUUID } = useContext(VideoContext);
    const storedAuth = JSON.parse(sessionStorage.getItem('auth'));
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [username, setUsername] = useState('');
    const open = Boolean(anchorElUser);
    const navigate = useNavigate();

    const basePages = ['Homepage'];
    const pages = videoUUID ? [...basePages, 'Voice', 'Text', 'Compare'] : basePages;


    const recoverAuthState = () => {
        if (storedAuth) {
            const currentTime = new Date().getTime();
            const elapsed = (currentTime - storedAuth.timestamp) / (1000 * 60 * 60);
            if (storedAuth.loggedIn && elapsed < 2) {
                setAuth(true);
                setUsername(storedAuth.username);
            } else {
                sessionStorage.removeItem('auth');
                }
  }
};


    useEffect(() => {
        recoverAuthState();
        }, [recoverAuthState]);

  const handleLogout = async () => {
      setAuth(false, '', '');
      sessionStorage.removeItem('auth');
      sessionStorage.removeItem('videoUUID');
      alert("Successful Log Out");
      navigate('/');
};
  const handleLoginClick = () => {
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('videoUUID');
    navigate('/login');
  };

  const handleRegisterClick = () => {
      sessionStorage.removeItem('auth');
      sessionStorage.removeItem('videoUUID');
      navigate('/register');
  };

  const navigateToPage = (page) => {
    if (page === 'Homepage') {
        sessionStorage.removeItem('videoUUID');
        setVideoUUID(null);
        navigate('/');
    }
    else{
        const route = page.toLowerCase();
        navigate(`/${route}?uuid=${videoUUID}&email=${storedAuth?.email || ''}`);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };



  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href = '/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SpeakTrainer
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => { handleCloseNavMenu(); navigateToPage(page); }}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SpeakTrainer
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => { handleCloseNavMenu(); navigateToPage(page); }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
              {auth ? (
                    <div>
                        <Button onClick={handleOpenUserMenu} sx ={{fontSize: "16px", color: 'white'}}>Welcome:
                            <span style={{ fontSize: "18px", fontWeight: 'bold' }}>{username}</span>
                        </Button>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={() => {handleCloseUserMenu(); navigate(`/profile?email=${storedAuth?.email || ''}`);}}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <div>
                        <Button color="inherit" onClick={handleLoginClick}>Login</Button>
                        <Button color="inherit" onClick={handleRegisterClick}>Register</Button>
                    </div>
                )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default TopBar;
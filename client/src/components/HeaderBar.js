import { useState } from 'react';
import { AppBar, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";


export default function HeaderBar(props) {
  const { isAuthenticated, user, isAdmin, setSendPointsModalIsOpen, setLoginModalIsOpen, authenticate, setIsAdmin, setQrModalIsOpen, logout } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="secondary"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => { navigate('/') }}
        >
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color="secondary">
          {isAuthenticated && user ? `Welcome ${isAdmin ? 'Admin' : user.get("username")}` : 'Please login'}
        </Typography>

        {isAuthenticated ?
          <>
            {user && isAdmin && <Button color="inherit" onClick={() => setSendPointsModalIsOpen(true)}>Send points form</Button>}
          </>
          :
          <>
            <Button color="secondary" variant="contained" onClick={() => setLoginModalIsOpen(true)}>Login</Button>
            <Button color="inherit" style={{ float: 'right' }} onClick={() => authenticate({ onComplete: () => { setIsAdmin(true) } })}>Admin Login</Button>
          </>}

        {isAuthenticated && <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="secondary"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {!isAdmin && user && <MenuItem onClick={() => setQrModalIsOpen(true)}>My Address</MenuItem>}
            <MenuItem onClick={() => { logout(); setIsAdmin(false) }}>Logout</MenuItem>
          </Menu>
        </div>}

      </Toolbar>
    </AppBar>
  );
}
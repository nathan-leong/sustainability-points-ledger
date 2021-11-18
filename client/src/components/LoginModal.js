import { useState } from 'react';
import { useMoralis } from "react-moralis";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function LoginModal(props) {

  const [activePage, setActivePage] = useState('Login');
  const [username, updateUsername] = useState('');
  const [password, updatePassword] = useState('');

  const { signup, login: _login, web3 } = useMoralis();
  const register = async () => {
    console.log('Registering...')
    try {
      const newAccount = web3.eth.accounts.create();
      console.log('account details:', newAccount);
      await signup(username, password, `${username}@gmail.com`, { address: newAccount.address });
      // Hooray! Let them use the app now.
    } catch (error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
    }

    props.setLoginModalIsOpen(false)
  };

  const login = async () => {
    console.log('Logging in...')

    try {
      await _login(username, password);
      // Hooray! Let them use the app now.
    } catch (error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
    }
    props.setLoginModalIsOpen(false)
  };

  const handleActiveBtnClick = async () => {
    if (activePage === 'Login') {
      await login();
    } else if (activePage === 'Register') {
      await register();
    }
  }
  return (
    <div>
      <Dialog open={props.loginModalIsOpen} onClose={() => props.setLoginModalIsOpen(false)} margin="dense">
        <DialogTitle>{activePage}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {activePage === 'Login' ? <p>Click <a href='#' onClick={() => setActivePage('Register')}>register</a> if you don't have an account.</p>
              : <p>Back to <a href='#' onClick={() => setActivePage('Login')}>login</a> page.</p>
            }
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username"
            type="username"
            fullWidth
            variant="standard"
            onChange={(e) => { updateUsername(e.target.value) }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="pw"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={(e) => { updatePassword(e.target.value) }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.setLoginModalIsOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleActiveBtnClick}>{activePage}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
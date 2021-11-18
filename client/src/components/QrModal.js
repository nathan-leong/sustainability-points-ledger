import { useMoralis } from "react-moralis";
import Button from '@mui/material/Button';
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogTitle } from '@mui/material';


export default function QrModal(props) {
  const { user } = useMoralis();
  console.log(user)
  return (
    <Dialog open={props.qrModalIsOpen} onClose={() => props.setQrModalIsOpen(false)}>
      <DialogTitle>{user.get('address')}</DialogTitle>

      <DialogContent style={{ marginRight: 'auto', marginLeft: 'auto' }}>

        <div style={{ display: 'table', marginRight: 'auto', marginLeft: 'auto' }}><QRCode value={user.get('address')} /></div>
      </DialogContent>
      <Button onClick={() => props.setQrModalIsOpen(false)}>Close</Button>
    </Dialog>
  );
}
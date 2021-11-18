import { useState } from 'react';
import { useMoralis } from "react-moralis";
import Button from '@mui/material/Button';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from '@mui/material';

import locations from '../constants/locations';
import PointsTracker from '../contracts/PointsTracker.json';

export default function SendPointsModal(props) {
  const { web3, Moralis } = useMoralis();
  const [location, setLocation] = useState(locations[0]);
  const [toAddress, setToAddress] = useState('');
  const [points, setPoints] = useState(0);
  const [sendingPoints, setSendingPoints] = useState(false);

  const contract = new web3.eth.Contract(PointsTracker.abi, PointsTracker.address);

  const sendPoints = async () => {

    setSendingPoints(true);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0])

    await contract.methods.allocatePoints([location.longitude, location.latitude], toAddress, Number(points)).send({ from: accounts[0] });

    const LocationPoint = Moralis.Object.extend("LocationPoint");

    // const q = new Moralis.Query(LocationPoint);
    // const r = await q.get("TaDE6xS0LK7ELzIRjhJOK1gl")
    // await r.destroy();

    const query1 = new Moralis.Query(LocationPoint);
    query1.equalTo("name", location.name);
    const result = await query1.first();
    console.log('result:', result)

    if (result) {
      const userPoints = result.attributes.userPoints;
      const existingUserPointsIndex = userPoints.findIndex(userPoint => userPoint.user === toAddress);
      if (existingUserPointsIndex !== -1) {
        userPoints[existingUserPointsIndex] = {
          user: toAddress,
          points: userPoints[existingUserPointsIndex].points + Number(points)
        };
      } else {
        userPoints.push({
          user: toAddress,
          points: Number(points)
        })
      }
      result.set('userPoints', userPoints);
      await result.save();
    } else {
      const newLocationPoint = new LocationPoint();
      const saveResult = await newLocationPoint.save({
        name: location.name,
        longitude: location.longitude,
        latitude: location.latitude,
        userPoints: [{
          user: toAddress,
          points: Number(points)
        }]
      });
      console.log('saveResult:', saveResult)
    }
    await props.retrievePointsData();
    setSendingPoints(false);
    props.setSendPointsModalIsOpen(false);
  };

  return (
    <Dialog open={props.sendPointsModalIsOpen} onClose={() => props.setSendPointsModalIsOpen(false)} fullWidth>
      <DialogTitle >Send Points</DialogTitle>
      <DialogContent>
        <Select
          defaultValue={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
        >
          {locations.map(loc => <MenuItem value={loc}>{loc.name}</MenuItem>)}
        </Select>
        <TextField
          autoFocus
          margin="dense"
          id="address"
          label="To Address"
          variant="standard"
          fullWidth
          onChange={(e) => setToAddress(e.target.value)}
        />
        <TextField
          id="standard-basic"
          type="number"
          label="Points to send"
          variant="standard"
          fullWidth
          onChange={(e) => setPoints(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button disabled={sendingPoints} onClick={() => props.setSendPointsModalIsOpen(false)}>Cancel</Button>
        <Button disabled={sendingPoints} type="submit" onClick={sendPoints}>Send Points</Button>
        {sendingPoints && <CircularProgress />}
      </DialogActions>
    </Dialog>
  );
}
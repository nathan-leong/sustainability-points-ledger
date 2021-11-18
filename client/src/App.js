import * as d3 from 'd3';
import './App.css';
import { AppBar, Toolbar, IconButton, Tooltip } from '@mui/material';
import Globe from 'react-globe.gl';
import { useState, useEffect, useRef } from 'react';
import { useMoralis } from "react-moralis";
import LoginModal from './components/LoginModal';
import QrModal from './components/QrModal';
import SendPointsModal from './components/SendPointsModal';
import PointsTracker from './contracts/PointsTracker.json';
import HeaderBar from './components/HeaderBar';
import GitHubIcon from '@mui/icons-material/GitHub';
import DescriptionIcon from '@mui/icons-material/Description';

function App(props) {
  const { authenticate, isAuthenticated, user, logout, Moralis, isWeb3Enabled, enableWeb3, web3 } = useMoralis();
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [qrModalIsOpen, setQrModalIsOpen] = useState(false);
  const [sendPointsModalIsOpen, setSendPointsModalIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [pointsData, setPointsData] = useState([]);

  const globeEl = useRef();
  const weightColor = d3.scaleSequentialSqrt(d3.interpolateYlOrRd)
    .domain([0, 4e2]);

  useEffect(() => {
    // globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.2;
    if (!isWeb3Enabled) enableWeb3();

    if (user && user.attributes) {
      const myAddress = user.attributes.address || user.attributes.accounts[0];
      setUserAddress(myAddress);

      //check if admin
      if (user.attributes.accounts && user.attributes.accounts.length > 0 && isWeb3Enabled) {
        const contract = new web3.eth.Contract(PointsTracker.abi, PointsTracker.address);
        contract.methods.adminGroup(user.attributes.accounts[0]).call().then(res => {
          setIsAdmin(res);
        });
      }
    }

    // load data
    Moralis.initialize(props.moralisAppId); //sometimes throws error if not yet initialized
    retrievePointsData();

  }, [user, Moralis, isWeb3Enabled]);

  const retrievePointsData = () => {

    const LocationPoints = Moralis.Object.extend("LocationPoint");
    const query = new Moralis.Query(LocationPoints);
    query.find().then(result => {
      console.log('results:', result)
      const mappedResult = result.map(locationPoint => {

        const totalPoints = locationPoint.attributes.userPoints.reduce(((total, userPoint) => total += userPoint.points), 0);
        const myContribution = locationPoint.attributes.userPoints.find(up => up.user.toLowerCase() === userAddress.toLowerCase());
        const topContributors = locationPoint.attributes.userPoints.sort((a, b) => b.points - a.points).slice(0, 9);

        return ({
          city: locationPoint.attributes.name,
          lat: Number(locationPoint.attributes.latitude),
          lng: Number(locationPoint.attributes.longitude),
          pop: totalPoints,
          myContribution: myContribution?.points || 0,
          top10Contributors: topContributors
        })
      })
      setPointsData(mappedResult)
      console.log('pointsData:', pointsData)
    })
  }

  return (
    <div className="App">
      <HeaderBar
        isAuthenticated={isAuthenticated}
        user={user}
        isAdmin={isAdmin}
        setSendPointsModalIsOpen={setSendPointsModalIsOpen}
        setLoginModalIsOpen={setLoginModalIsOpen}
        authenticate={authenticate}
        setIsAdmin={setIsAdmin}
        setQrModalIsOpen={setQrModalIsOpen}
        logout={logout}
      />

      <LoginModal loginModalIsOpen={loginModalIsOpen} setLoginModalIsOpen={setLoginModalIsOpen} />
      {user && <QrModal qrModalIsOpen={qrModalIsOpen} setQrModalIsOpen={setQrModalIsOpen} />}
      {isAdmin && isAuthenticated && <SendPointsModal sendPointsModalIsOpen={sendPointsModalIsOpen} setSendPointsModalIsOpen={setSendPointsModalIsOpen} retrievePointsData={retrievePointsData} />}

      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

        hexBinPointsData={pointsData}
        hexBinPointWeight="pop"
        hexAltitude={d => d.sumWeight * 6e-3}
        hexBinResolution={4}
        hexTopColor={d => weightColor(d.sumWeight)}
        hexSideColor={d => weightColor(d.sumWeight)}
        hexLabel={d => {
          console.log(d); return `
        <b>${d.points[0].city}</b>:

        Top 10 Contributors:
        <ol>
        ${d.points[0].top10Contributors.map(entry => `<li>${entry.user}: ${entry.points}</li>`)}
        </ol>

        ${`<b>Your Contribution: ${d.points[0].myContribution ? d.points[0].myContribution : 0}</b>`}
      `}}
      />
      <AppBar position="static" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <Tooltip title="Github repository for this application and smart contract" href="https://github.com/nathan-leong/sustainability-points-ledger" target="_blank">
            <IconButton color="inherit">
              <GitHubIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Etherscan of Smart contract on Ethereum Rinkeby Testnet">
            <IconButton color="inherit" href="https://rinkeby.etherscan.io/address/0x837D3dDF0b8F4B6a71A23fa7E8665Aa422fE880a#code" target="_blank">
              <DescriptionIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default App;

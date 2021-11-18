/*eslint no-restricted-globals: [0]*/
import { AppBar, Button, Card, CardContent, CardHeader, CardMedia, Container, Grid, Toolbar, Typography } from "@mui/material"
import { animateScroll as scroll } from 'react-scroll'
import { useNavigate } from "react-router-dom";
import { Waypoint } from 'react-waypoint';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useState } from "react";

export default function LandingPage() {

  const [backgroundColor, setBackgroundColor] = useState('');
  const navigate = useNavigate();
  const screenHeight = screen.height;
  const scrollAmount = 0.80 * screenHeight;
  const scrollLess = () => {
    scroll.scrollMore(-scrollAmount);
  };
  const scrollMore = () => {
    scroll.scrollMore(scrollAmount);
  };

  const changeBackgroundColour = () => {
    const rand = Math.random() * 50 + 200;
    setBackgroundColor(`rgb(${rand}, 255, ${rand})`);
  }
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <img src="favicon.ico" />
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }} color="secondary" >
            Sustainability Points Ledger
          </Typography>
          <Button color="secondary" variant="contained" onClick={() => { navigate('/app') }}>App</Button>
        </Toolbar>
      </AppBar>
      <button onClick={scrollLess} className="scroll-up-btn"><ArrowUpwardIcon /></button>
      <button onClick={scrollMore} className="scroll-down-btn"><ArrowDownwardIcon /></button>
      <div style={{ background: backgroundColor, transition: 'background 1s ease' }}>
        <Waypoint onEnter={changeBackgroundColour}>
          <Container className="container">
            <h1>How can we incentivise consumers to become sustainably responsible?</h1>
          </Container>
        </Waypoint>
        <Waypoint onEnter={changeBackgroundColour}>
          <Container className="container">
            <h2>What if we knew for certain that the <span className="underline">actions</span> we took had a direct impact on our very own community?</h2>
            <h2>Where our actions give us a <span className="underline">voice</span> to speak to those organisations that need to listen to us.</h2>

          </Container>
        </Waypoint>
        <Waypoint onEnter={changeBackgroundColour}>
          <Container className="container">
            <h2>The idea is simple. We need a reliable platform to measure our contributions to sustainability.</h2>
            <h2>Where YOUR weighted contribution, gives YOU a say on which local sustainability projects are pursued.</h2>

          </Container>
        </Waypoint>
        <Waypoint onEnter={changeBackgroundColour}>
          <Container className="container">
            <h2>Example: Food Waste Recycling Project.</h2>
            <h3>Specialised food waste recycling centres, instead of cash, give 'points' for recycled waste.</h3>
            <h3>Organisations then let consumers use their points to vote on project proposals they want to see worked on in their community.</h3>
          </Container>
        </Waypoint>
        <Waypoint onEnter={changeBackgroundColour}>
          <Container className="container">
            <h2>The systems that would need to be in place:</h2>
            <Grid container spacing={10}>
              <Grid item xs={4}>
                <Card className="card">
                  <CardHeader
                    title="Points Distributor"
                    color="primary"
                  />
                  <CardMedia
                    component="img"
                    height="220"
                    image="pointsDistributor.png"
                    alt="Points distributor"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      A local recycling facility where instead of typically trading waste for cash, a consumer receives points via a QR code.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card className="card">
                  <CardHeader
                    title="Points Ledger"
                    color="primary"
                  />
                  <CardMedia
                    component="img"
                    height="220"
                    image="pointsLedger.png"
                    alt="Points ledger"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      A transparent and trusted database to record all the points given to consumers.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card className="card">
                  <CardHeader
                    title="Sponsor"
                    color="primary"
                  />
                  <CardMedia
                    component="img"
                    height="220"
                    image="sponsor.jpg"
                    alt="sponsor"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      A sponsor such as a council or organisation that wants the community to be able to
                      have a say on the projects they work on. They may present a number of options which a consumer can vote for e.g
                      create a new waste recycling centre, increase planting of trees around the community, or build sustainable energy infrastructure.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>

          </Container>
        </Waypoint>
        <Waypoint onEnter={changeBackgroundColour}>
          <Container className="container">
            <h2>The hurdle.</h2>
            <h3>Assuming that a Points Distributor and Sponsor are in place, as a skeptical consumer you may now be wondering how do we know that the Sponsor will actually use
              our votes to decide on projects and does not just say they will, while rigging it behind closed doors?</h3>
            <h3>What if the Points Ledger was completely transparent, immutable and viewable to the public? Do those features ring any bells?</h3>
          </Container>
        </Waypoint>
        <Waypoint onEnter={changeBackgroundColour}>
          <Container className="container">
            <h2>The Solution is (public) Blockchain.</h2>
            <ul>
              <li>All records on the public blockchain are transparent and viewable by the public.</li>
              <li>Near impossible to maliciously alter records.</li>
              <li>Not owned by any single entity, highly trusted, low risk to Sponsors.</li>
            </ul>
          </Container>
        </Waypoint>
        <Waypoint onEnter={changeBackgroundColour}>
          <Container className="container">
            <h2>Why this will work.</h2>
            <ul>
              <li>Allows for truly community driven projects starting from proposals.</li>
              <li>Consumers can see how their small impacts, together make a world of difference.</li>
              <li>The points system introduces game mechanics which can be used to incentivise uptake. (leaderboards, prizes)</li>
            </ul>
          </Container>
        </Waypoint>
        <Waypoint onEnter={changeBackgroundColour}>
          <Container className="container">
            <h2>The Prototype.</h2>
            <h3>The prototype simulates the interaction between the Points Distributor and the Points Ledger.</h3>
            <ol>
              <li>The consumer is simulated by Logging In/Registering an account, where they are assigned a QR code representing a unique address.</li>
              <li>The Points Distributor is simulated by logging in as an Admin (only certain accounts can login as admin).</li>
              <li>The Admin can select a location to simulate the location of a facility where the contribution was made.</li>
              <li>The Admin can then send points to the consumer's unique address, and the points are recorded on the public ethereum blockchain (Rinkeby).</li>
              <li>Finally, all the recorded points are displayed on a global map, allowing consumers to compare their contributions against leading contributors both in their local area, and around the world. </li>
            </ol>

            <Button color="secondary" variant="contained" onClick={() => { navigate('/app') }}>App</Button>

          </Container>
        </Waypoint>
        <Waypoint onEnter={changeBackgroundColour}>
          <Container className="container">
            <h2>The Future.</h2>
            <ol>
              <li>Create a platform that allows Sponsors to create projects with multiple proposals, where consumers can vote with the weighting of their points on proposals.
                A Sponsor can restrict participation to a subset of locations, to ensure projects are only voted on by their target community.
              </li>
              <li>Set up Points Distributors at existing recycling centers to leverage their facilities.</li>
              <li>Find Sponsors who believe in the idea of truly community driven sustainable projects.</li>
              <li>Potentially migrate from a points system to a token, and price the token to a <a href="https://medium.com/commonsstack/rewriting-the-story-of-human-collaboration-652cfa423588" target="_blank">bonding curve </a>
                to self stimulate adoption of the Points Ledger.</li>
            </ol>

          </Container>
        </Waypoint>
      </div>
    </div>
  );
}
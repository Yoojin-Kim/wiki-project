import './App.css';
import {
  Route,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";
import { LandingPage, GameCardPage, ResultPage } from './page';
import React from 'react';

import './App.css';

function App({history}) {
  return (
    <div className="App">
      <div className="frame">
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path='/' component={LandingPage} />
          {/* <Route exact path='/tutorial' component={TutorialCardPage} /> */}
          <Route exact path='/game/:language' 
            component={({ match }) => (
              <GameCardPage history={history} language={match.params.language} />
            )} />
          <Route exact path='/result' component={ResultPage} />
        </Switch>
      </Router>
      </div>
    </div>
  );
}

export default App;
import React from 'react';
import { Grid } from 'semantic-ui-react';
import './App.css';

import {connect} from 'react-redux'

import ColorPanel from '../ColorPanel/ColorPanel.component';
import Messages from '../Messages/Messages.component';
import SidePanel from '../SidePanel/SidePanel.component';
import MetaPanel from '../MetaPanel/MetaPanel.component';

const App = ({ currentUser }) => (
  <Grid columns='equal' className = 'app' style={ {background: '#eee' } }>
    <ColorPanel />
    <SidePanel currentUser={ currentUser} />
    
    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages />
    </Grid.Column>

    <Grid.Column width={4} >
      <MetaPanel />
    </Grid.Column>
  </Grid>
);

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

export default connect(mapStateToProps)(App);

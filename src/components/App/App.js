import React from 'react';
import { Grid } from 'semantic-ui-react';
import './App.css';

import {connect} from 'react-redux'

import ColorPanel from '../ColorPanel/ColorPanel.component';
import Messages from '../Messages/Messages.component';
import SidePanel from '../SidePanel/SidePanel.component';
import MetaPanel from '../MetaPanel/MetaPanel.component';

const App = ({ currentUser, currentChannel , isPrivateChannel }) => (
  <Grid columns='equal' className = 'app' style={ {background: '#eee' } }>
    <ColorPanel />
    <SidePanel currentUser={ currentUser} key={currentUser && currentUser.uid } />
    
    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages currentChannel={ currentChannel } key={ currentChannel && currentChannel.id} currentUser = {currentUser}  isPrivateChannel={isPrivateChannel} />
    </Grid.Column>

    <Grid.Column width={4} >
      <MetaPanel />
    </Grid.Column>
  </Grid>
);

const mapStateToProps = state => ({
  currentUser: state.user.currentUser , 
  currentChannel: state.channels.currentChannel,
  isPrivateChannel: state.channels.isPrivateChannel
});

export default connect(mapStateToProps)(App);

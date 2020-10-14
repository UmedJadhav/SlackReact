import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

import UserPanel  from './UserPanel.component';
import Channels  from './Channels.component';

export default class SidePanel extends Component {
    render() {
        const currentUser = this.props.currentUser;
        return (
        <Menu size='large' inverted  fixed='left' vertical style={{ background: '#4c3c43', fontSize: '1.2rem'}}>
            <UserPanel currentUser = {currentUser} />
            <Channels />
        </Menu>
        )
    }
}

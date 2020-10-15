import React, { Component } from 'react'
import { Segment, Comment }  from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader.component';
import MessageForm from './MessageForm.component';

import firebase from '../../firebase';

export default class Messages extends Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser
    }

    render() {
        const { messagesRef, channel, user } = this.state;

        return (
            <React.Fragment>
                <MessagesHeader />
                <Segment>
                    <Comment.Group className='messages'>

                    </Comment.Group>
                </Segment>

                <MessageForm 
                    messagesRef={ messagesRef } currentChannel = {channel} currentUser={user}
                />
            </React.Fragment>
        )
    }
}

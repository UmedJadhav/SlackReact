import React, { Component } from 'react'
import { Segment, Comment }  from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader.component';
import MessageForm from './MessageForm.component';
import Message from './Message.component';

import firebase from '../../firebase';

export default class Messages extends Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true,
        progressBar : false,
        numUniqueUsers : '',
        searchTerm: '',
        searchLoading: false,
        searchResults: []
    }

    componentDidMount() {
        const { channel, user } = this.state;
        if(channel && user){
            this.addListeners(channel.id);
        }
    }
    
    addListeners = channelID => {
        this.addMessageListener(channelID);
    }

    addMessageListener = channelID => {
        let loaded_messages = [];
        this.state.messagesRef.child(channelID).on('child_added', snap => {
            loaded_messages.push(snap.val());
            this.setState({
                messages: loaded_messages,
                messagesLoading: false
            })
        this.countUniqueUsers(loaded_messages);
        });
    }

    handleSearchChange = event => {
        this.setState({
            searchTerm:  event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages());
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi'); // Regex to be applied globally and be case insensitive
        const searchResults = channelMessages.reduce((acc, message) => {
            if(message.content && message.content.match(regex) || message.user.name.match(regex)){
                acc.push(message); 
            }
            return acc;
        }, []);
        this.setState({ searchResults });
        setTimeout( ()=>this.setState({ searchLoading: false}), 1000);
    };

    countUniqueUsers = messages => {
        const unique_users = messages.reduce(( acc , message) => {
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        const plural = unique_users.length > 1 || unique_users.length === 0;
        const numUniqueUsers = `${unique_users.length} user${plural? 's':''}`
        this.setState({ numUniqueUsers });
    }

    displayMessages = messages => (
        messages.length > 0 && messages.map(msg => (
            <Message key={ messages.timestamp } message={msg} user={this.state.user} />
        ))
    );

    isProgressBarVisible = percent => {
        if(percent > 0 ){
            this.setState({ progressBar: true});
        }
    }

    displayChannelName = channel => channel ? `#${channel.name}` : ''

    render() {
        const { messagesRef, channel, user, messages, progressBar, numUniqueUsers, searchTerm, searchResults , searchLoading } = this.state;

        return (
            <React.Fragment>
            <div className='messages__container'>
                <MessagesHeader className='messages__header' channelName={ this.displayChannelName(channel) } numUniqueUsers={ numUniqueUsers } handleSearchChange={ this.handleSearchChange } searchLoading={ searchLoading }/>
                <Segment>
                    <Comment.Group className={ progressBar ? 'messages__progress': 'messages'}>
                        {
                            searchTerm ? this.displayMessages(searchResults) :this.displayMessages(messages)
                        }
                    </Comment.Group>
                </Segment>

                <MessageForm 
                    messagesRef={ messagesRef } currentChannel = {channel} currentUser={user} className='messages__form' isProgressBarVisible={this.isProgressBarVisible}
                    />
            </div>
            </React.Fragment>
        )
    }
}

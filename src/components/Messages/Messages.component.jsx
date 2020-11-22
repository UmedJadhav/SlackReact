import React, { Component } from 'react'
import { Segment, Comment }  from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setUserPosts } from '../../actions/actions'; 
import MessagesHeader from './MessagesHeader.component';
import MessageForm from './MessageForm.component';
import Message from './Message.component';

import firebase from '../../firebase';
class Messages extends Component {
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
        searchResults: [],
        isPrivateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        isChannelStarred: false,
        usersRef: firebase.database().ref('users'), 
    }

    componentDidMount() {
        const { channel, user } = this.state;
        if(channel && user){
            this.addListeners(channel.id);
            this.addUsersStarsListeners(channel.id, user.uid);
        }
    }
    
    addListeners = channelID => {
        this.addMessageListener(channelID);
    }

    addMessageListener = channelID => {
        let loaded_messages = [];
        const ref = this.getMessagesRef();
        ref.child(channelID).on('child_added', snap => {
            loaded_messages.push(snap.val());
            this.setState({
                messages: loaded_messages,
                messagesLoading: false
            })
        this.countUniqueUsers(loaded_messages);
        this.countUserPosts(loaded_messages);
        });
    }

    addUsersStarsListeners = (channelID, userId)  => {
        this.state.usersRef.child(userId).child('starred')
        .once('value').then( data => {
            console.log(data)
            if(data.val() !== null){
                const channelIds = Object.keys(data.val());
                const prevStarred = channelIds.includes(channelID);
                this.setState({ isChannelStarred: prevStarred });
            }
        })
    }

    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, isPrivateChannel } = this.state;
        return isPrivateChannel ? privateMessagesRef : messagesRef ;
    }

    handleSearchChange = event => {
        this.setState({
            searchTerm:  event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages());
    }

    handleStar = () => {
        this.setState( prevState => ({
            isChannelStarred : !prevState.isChannelStarred
        }), () => this.starChannel());
    }

    starChannel = () => {
        if(this.state.isChannelStarred){
            this.state.usersRef.child(`${ this.state.user.uid}/starred`)
            .update({
                [this.state.channel.id]:{
                    name: this.state.channel.name,
                    details: this.state.channel.details,
                    createdBy: {
                        name: this.state.channel.createdBy.name,
                        avatar:  this.state.channel.createdBy.avatar
                    }
                }
            })
        }else{
            this.state.usersRef.child(`${ this.state.user.uid}/starred`)
            .child(this.state.channel.id).remove(err => {
                if(err){
                    console.error(err);
                }
            })
        }
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

    countUserPosts = messages => {
        let userPosts = messages.reduce((acc, message) => {
            if(message.user.name in acc){
                acc[message.user.name].count += 1;
            }else{
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    count: 1
                }
            }
            return acc;
        },{});
        this.props.setUserPosts(userPosts);
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

    displayChannelName = channel => channel ? `${this.state.isPrivateChannel ? '@' : '#'}${channel.name}` : ''

    render() {
        const { messagesRef, channel, user, messages, progressBar, numUniqueUsers, searchTerm, searchResults , searchLoading, isPrivateChannel, isChannelStarred } = this.state;

        return (
            <React.Fragment>
            <div className='messages__container'>
                <MessagesHeader className='messages__header' channelName={ this.displayChannelName(channel) } numUniqueUsers={ numUniqueUsers } handleSearchChange={ this.handleSearchChange } searchLoading={ searchLoading } isPrivateChannel={isPrivateChannel} handleStar={ this.handleStar} isChannelStarred={ isChannelStarred } />
                <Segment>
                    <Comment.Group className={ progressBar ? 'messages__progress': 'messages'}>
                        {
                            searchTerm ? this.displayMessages(searchResults) :this.displayMessages(messages)
                        }
                    </Comment.Group>
                </Segment>

                <MessageForm 
                    messagesRef={ messagesRef } currentChannel = {channel} currentUser={user} className='messages__form' isProgressBarVisible={this.isProgressBarVisible}
                    isPrivateChannel={isPrivateChannel} getMessagesRef={ this.getMessagesRef } />
            </div>
            </React.Fragment>
        )
    }
}


export default connect(null, { setUserPosts })(Messages);

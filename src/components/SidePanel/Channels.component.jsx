import React, { Component } from 'react'
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase'

export default class Channels extends Component {
    state = {
        currentUser: this.props.currentUser,
        channels: [],
        modal: false,
        ChannelName: '',
        ChannelDetails: '',
        ChannelsRef: firebase.database().ref('channels')
    }

    closeModal = () => this.setState({ modal: false });
    
    openModal = () => this.setState({ modal: true });

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid(this.state)){
            this.addChannel()
        }
    }

    isFormValid = ({ ChannelName, ChannelDetails }) => ChannelName && ChannelDetails ;

    addChannel = () => {
        const { currentUser, ChannelsRef, ChannelName , ChannelDetails} = this.state;
        const key = ChannelsRef.push().key;
        const newChannel = {
            id: key,
            name: ChannelName,
            details: ChannelDetails,
            createdBy: {
                name: currentUser.displayName,
                avatar: currentUser.photoURL
            }
        };
        ChannelsRef.child(key).update(newChannel)
        .then(() => {
            this.setState({ channelName: '', ChannelDetails: ''});
            this.closeModal();
            console.log('Channel created');
        }).catch(err => {
            console.error(err);
        });
    };


    render() {
        const { channels, modal } = this.state;
        return (
            <React.Fragment>
                <Menu.Menu tyle={{ paddingBottom: '2em' }}>
                    <Menu.Item>
                        <span>
                            <Icon name='exchange' />CHANNELS
                        </span>{" "}
                        ({channels.length}) <Icon name='add' onClick={ this.openModal }/>
                    </Menu.Item>
                </Menu.Menu>
                <Modal basic open={modal} onClose={ this.closeModal }>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={ this.handleSubmit }>
                            <Form.Field>
                                <Input fluid label='Name of Channel' name='ChannelName' onChange={ this.handleChange }/>
                            </Form.Field>
                            <Form.Field>
                                <Input fluid label='Channel Details' name='ChannelDetails' onChange={ this.handleChange }/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' inverted onClick={ this.handleSubmit }><Icon name='checkmark'/>Add</Button>
                        <Button color='red' inverted onClick={ this.closeModal }><Icon name='remove'/>Cancel</Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

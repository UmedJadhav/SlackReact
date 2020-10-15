import React, { Component } from 'react'
import { Segment, Button, Input} from 'semantic-ui-react';
import firebase from '../../firebase';

export default class MessageForm extends Component {
    state = {
        message: '',
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: []
    }

    handleChange = event => {
        this.setState({
            [ event.target.name ]: event.target.value
        });
    }

    sendMessage = () => {
        const { messagesRef } = this.props;
        const { message, channel, errors } = this.state;

        if(message){
            this.setState({ loading: true });
            messagesRef.child( channel.id ).push()
            .set( this.createMessage())
            .then(() => {
                this.setState({ loading:false, message: '' , errors: []})
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    loading: false,
                    errors: errors.concat(err)
                });
            })
        }else{
            this.setState({
                errors: errors.concat({message: 'Add a message'})
            })
        }
    }

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message
        };
        return message
    }

    render() {
        const { errors, message, loading } = this.state;
        return (
            <Segment class='message__form'>
                <Input fluid name='message' style= {{ marginBottom:'0.7em' }}  value={ message }
                label={<Button icon={'add'} />} labelPosition='left' placeholder='Write your Message'
                onChange={this.handleChange} className={ errors.some(err => err['message'].includes('message')) ? 'error' : ''}
                />
                <Button.Group icon widths='2'>
                    <Button color='orange' content='Add Reply' labelPosition='left' icon='edit' disabled={ loading }
                    onClick={ this.sendMessage }/>
                    <Button color='teal' content='Upload Media' labelPosition='right' icon='cloud upload'/>
                </Button.Group>
            
            </Segment>
        )
    }
}

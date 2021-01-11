import React, { Component } from 'react'
import { Segment, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase';
import uuidv4 from 'uuid/dist/v4';

import FileModal from './FileModal.component';
import Progressbar from './Progressbar.component';

export default class MessageForm extends Component {
    state = {
        message: '',
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: [],
        modal: false,
        uploadState: '',
        uploadTask: undefined,
        storageRef: firebase.storage().ref(),
        percentUploaded: 0,
        isPrivateChannel: this.props.isPrivateChannel,
        getMessagesRef: this.props.getMessagesRef,
        typingRef: firebase.database().ref('typing')
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    getPath = () => this.state.isPrivateChannel ? `chat/private-${this.state.channel.id}` : 'chat/public'

    uploadFile = (file, metaData) => {
        const pathtoUpload = this.state.channel.id;
        const ref = this.state.getMessagesRef();
        const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metaData)
        }, () => {
            this.state.uploadTask.on('state_changed', snap => {
                const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                this.props.isProgressBarVisible(percentUploaded);
                this.setState({ percentUploaded });
            },
                err => {
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        uploadState: 'error',
                        uploadTask: null
                    })
                },
                () => {
                    this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.sendFileMessage(downloadURL, ref, pathtoUpload);
                    }).catch(err => {
                        console.error(err);
                        this.setState({
                            errors: this.state.errors.concat(err),
                            uploadState: 'error',
                            uploadTask: null
                        })
                    })
                });
        });

    }

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload).push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({ uploadState: 'done' })
            }).catch(err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err)
                });
            });
    }

    sendMessage = () => {
        const { getMessagesRef } = this.props;
        const { message, channel, errors, typingRef, user } = this.state;

        if (message) {
            this.setState({ loading: true });
            getMessagesRef().child(channel.id).push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: [] });
                    typingRef.child(channel.id)
                        .child(user.uid)
                        .remove();
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        loading: false,
                        errors: errors.concat(err)
                    });
                })
        } else {
            this.setState({
                errors: errors.concat({ message: 'Add a message' })
            })
        }
    }

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },

        };
        if (fileUrl !== null) {
            message['image'] = fileUrl;
        } else {
            message['content'] = this.state.message;
        }
        return message
    }

    handleKeyDown = () => {
        const { message, typingRef, channel, user } = this.state;
        if (message) {
            typingRef.child(channel.id)
                .child(user.uid)
                .set(user.displayName);
        } else {
            typingRef.child(channel.id)
                .child(user.uid)
                .remove();
        }
    }

    render() {
        const { errors, message, loading, modal, uploadState, percentUploaded } = this.state;
        return (
            <Segment className='message__form'>
                <Input fluid name='message' style={{ marginBottom: '0.7em' }} value={message}
                    label={<Button icon={'add'} />} labelPosition='left' placeholder='Write your Message'
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleChange} className={errors.some(err => err['message'].includes('message')) ? 'error' : ''}
                />
                <Button.Group icon widths='2'>
                    <Button color='orange' content='Add Reply' labelPosition='left' icon='edit' disabled={loading}
                        onClick={this.sendMessage} />
                    <Button color='teal' content='Upload Media' labelPosition='right' icon='cloud upload' disabled={uploadState == 'uploading'}
                        onClick={this.openModal} />
                </Button.Group>
                <FileModal modal={modal} closeModal={this.closeModal} uploadFile={this.uploadFile} />
                <Progressbar uploadState={uploadState} percentUploaded={percentUploaded} />
            </Segment>
        )
    }
}

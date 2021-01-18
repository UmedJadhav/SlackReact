import React, { Component } from 'react'
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react';
import firebase from '../../firebase'
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions/actions';

class Channels extends Component {
    state = {
        currentUser: this.props.currentUser,
        channels: [],
        modal: false,
        ChannelName: '',
        ChannelDetails: '',
        ChannelsRef: firebase.database().ref('channels'),
        firstLoad: true,
        activeChannel: '',
        channel: null,
        messagesRef: firebase.database().ref('messages'),
        notifications: [],
        typingRef: firebase.database().ref('typing'),

    }

    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }



    addListeners = () => {
        let loadedChannels = [];
        this.state.ChannelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
            this.addNotificationListener(snap.key);
        });
    };

    addNotificationListener = channelId => {
        this.state.messagesRef.child(channelId).on('value', snap => {
            if (this.state.channel) {
                this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
            }
        })
    }

    handleNotifications = (channelId, CurrentChannelId, notifications, snap) => {
        let lastTotal = 0;
        let index = notifications.findIndex(notification => notification.id === channelId);

        if (index !== -1) {
            if (channelId !== CurrentChannelId) {
                lastTotal = notifications[index].total;

                if (snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal; // set the number of new messages
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        } else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            });
        }

        this.setState({ notifications });
    }

    removeListeners = () => {
        this.state.ChannelsRef.off();
        this.state.channels.forEach(channel => {
            this.state.messagesRef.child(channel.id).off();
        });
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if (this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
            this.setState({ channel: firstChannel });
        }
        this.setState({ firstLoad: false });
    }

    closeModal = () => this.setState({ modal: false });

    openModal = () => this.setState({ modal: true });

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.addChannel()
        }
    }

    isFormValid = ({ ChannelName, ChannelDetails }) => ChannelName && ChannelDetails;

    addChannel = () => {
        const { currentUser, ChannelsRef, ChannelName, ChannelDetails } = this.state;
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
                this.setState({ channelName: '', ChannelDetails: '' });
                this.closeModal();
                console.log('Channel created');
            }).catch(err => {
                console.error(err);
            });
    };

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.state.typingRef.child(this.state.channel.id)
            .child(this.state.currentUser.uid)
            .remove();
        this.clearNotifications();
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({ channel });
    };

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);

        if (index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
            updatedNotifications[index].count = 0;
            this.setState({ notifications: updatedNotifications });
        }
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }

    displayChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === this.state.activeChannel}
            >
                { this.getNotificationCount(channel) && (
                    <Label color='red'>{this.getNotificationCount(channel)}</Label>
                )}
                # { channel.name}
            </Menu.Item>
        ))
    );

    getNotificationCount = channel => {
        let count = 0;
        this.state.notifications.forEach(notification => {
            if (notification.id === channel.id) {
                count = notification.count;
            }
        });

        if (count > 0) return count;
    };

    render() {
        const { channels, modal } = this.state;
        return (
            <React.Fragment>
                <Menu.Menu className='menu'>
                    <Menu.Item>
                        <span>
                            <Icon name='exchange' />CHANNELS
                        </span>{" "}
                        ({channels.length}) <Icon name='add' onClick={this.openModal} />
                    </Menu.Item>
                    {
                        this.displayChannels(channels)
                    }
                </Menu.Menu>
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input fluid label='Name of Channel' name='ChannelName' onChange={this.handleChange} />
                            </Form.Field>
                            <Form.Field>
                                <Input fluid label='Channel Details' name='ChannelDetails' onChange={this.handleChange} />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' inverted onClick={this.handleSubmit}><Icon name='checkmark' />Add</Button>
                        <Button color='red' inverted onClick={this.closeModal}><Icon name='remove' />Cancel</Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);

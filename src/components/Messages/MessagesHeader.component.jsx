import React, { Component } from 'react'
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

export default class MessagesHeader extends Component {
    render() {
        const { channelName , numUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel } = this.props;
        return (
            <Segment clearing>
                <Header fluid='true' as='h2' floated='left' styled={{ marginBottom: 0 }}>
                    <span>
                        { channelName }
                        { !isPrivateChannel && <Icon name={'star outline'} size='small' color='black'/> }
                    </span>
                    <Header.Subheader>
                        { numUniqueUsers }
                    </Header.Subheader>
                </Header>

                <Header floated='right'> 
                    <Input size='mini' icon='search' name='searchTerm' placeholder='Search Messages...' onChange={ handleSearchChange } loading={searchLoading} />
                </Header>
            </Segment>
        )
    }
}

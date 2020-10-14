import React, { Component } from 'react'
import { Segment, Button, Input} from 'semantic-ui-react';

export default class MessageForm extends Component {
    render() {
        return (
            <Segment class='message__form'>
                <Input fluid name='message' style= {{ marginBottom:'0.7em' }} 
                label={<Button icon={'add'} />} labelPosition='left' placeholder='Write your Message'
                />
                <Button.Group icon widths='2'>
                    <Button color='orange' content='Add Reply' labelPosition='left' icon='edit'
                    />
                    <Button color='teal' content='Upload Media' labelPosition='right' icon='cloud upload'/>
                </Button.Group>
            
            </Segment>
        )
    }
}

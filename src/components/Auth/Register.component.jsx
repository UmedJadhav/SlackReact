import React, { Component } from 'react'
import { Grid, Form , Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import firebase from '../../firebase';

class Register extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: []
    };

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length ;
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if(password.length < 6 || passwordConfirmation.length < 6 ){
            return false;
        }else if(password !== passwordConfirmation){
            return false;
        }else{
            return true;
        }
    }

    isFormValid = () => {

        let errors = [];
        let error;

        if(this.isFormEmpty( this.state )){
        
            error = { message: 'Fill in all the fields '}
            this.setState({ errors: errors.concat(error) });
            return false;
        
        }else if(!this.isPasswordValid(this.state)){

            error = { message: 'Passwords must match' };
            this.setState({ errors: errors.concat(error) });
            return false;

        }else{

            return true;

        }
    }

    handleChange = event =>{
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        if(this.isFormValid()){

            event.preventDefault();
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then( createdUser => {
                console.log(createdUser);
            })
            .catch(err => console.error(err));
        }
    }

    render() {
        const { username, email, password, passwordConfirmation } = this.state;
        
        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{ maxWidth:450 }}>
                    <Header as='h2' icon color='orange' textAlign='center'>
                        <Icon name='puzzle piece' color='orange'/>
                    </Header>
                    <Form size='large' onSubmit={ this.handleSubmit }>
                        <Segment stacked>
                            <Form.Input fluid name='username' icon='user' iconPosition='left' placeholder='Username' onChange={ this.handleChange } type='text' value={username} />
                            <Form.Input fluid name='email' icon='mail' iconPosition='left' placeholder='Email' onChange={ this.handleChange } type='email' value={email} />
                            <Form.Input fluid name='password' icon='user' iconPosition='left' placeholder='Password' onChange={ this.handleChange } type='password' value={password} />
                            <Form.Input fluid name='passwordConfirmation' icon='repeat' iconPosition='left' placeholder='Confirm Password' onChange={ this.handleChange } type='password' value={ passwordConfirmation }/>
                            <Button color='orange' fluid size='large'>Submit</Button>
                        </Segment>
                    </Form>
                    <Message>Already a user? <Link to='/login'>Login</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register 

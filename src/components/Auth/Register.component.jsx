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
        event.preventDefault();
        if(this.isFormValid()){
            this.setState({ errors:[], loading: true});

            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then( createdUser => {
                console.log(createdUser);
                this.setState({ loading:false });
            })
            .catch(err => {
                console.error(err);
                this.setState({ errors: this.state.errors.concat(err), loading:false  });
            });
        }
    }

displayErrors = errors => errors.map((error, i) => <p key={i}>{ error.message}</p>);

    handleInputErrors  = (errors, inputName) => (errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '');

    render() {
        const { username, email, password, passwordConfirmation, errors, loading } = this.state;
        
        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{ maxWidth:450 }}>
                    <Header as='h2' icon color='orange' textAlign='center'>
                        <Icon name='puzzle piece' color='orange'/>
                    </Header>
                        {
                            errors.length > 0 && (<Message error>
                                <h4>{this.displayErrors(errors) }</h4> 
                            </Message>)
                        }
                    <Form size='large' onSubmit={ this.handleSubmit }>
                        <Segment stacked>
                            <Form.Input fluid className = { this.handleInputErrors(errors, 'username')} name='username' icon='user' iconPosition='left' placeholder='Username' onChange={ this.handleChange } type='text' value={username} />
                            <Form.Input fluid className = { this.handleInputErrors(errors, 'email')} name='email' icon='mail' iconPosition='left' placeholder='Email' onChange={ this.handleChange } type='email' value={email} />
                            <Form.Input fluid className = { this.handleInputErrors(errors, 'password') } name='password' icon='user' iconPosition='left' placeholder='Password' onChange={ this.handleChange } type='password' value={password} />
                            <Form.Input fluid className = { this.handleInputErrors(errors, 'password') } name='passwordConfirmation' icon='repeat' iconPosition='left' placeholder='Confirm Password' onChange={ this.handleChange } type='password' value={ passwordConfirmation }/>
                            <Button color='orange' fluid size='large' className= { loading? 'loading' : ''} disabled = {loading} >Submit</Button>
                        </Segment>
                    </Form>
                    <Message>Already a user? <Link to='/login'>Login</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register 

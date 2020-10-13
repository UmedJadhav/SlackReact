import React, { Component } from 'react'
import { Grid, Form , Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import firebase from '../../firebase';

class Login extends Component {
    state = {
        email: '',
        password: '',
        errors: [],
        loading: false
    };

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length ;
    }

    
    handleChange = event =>{
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid( this.state )){
            this.setState({ errors:[], loading: true});
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then( signedInUser => {
                console.log(signedInUser);
                this.setState({ loading: false});
            })
            .catch(err => {
                console.error(err);
                this.setState({ errors:this.state.errors.concat(err), loading: false});
            });
        }
    }

    isFormValid = ({ email, password}) => email && password ;


    displayErrors = errors => errors.map((error, i) => <p key={i}>{ error.message}</p>);

    handleInputErrors  = (errors, inputName) => (errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '');

    render() {
        const { email, password, errors, loading } = this.state;
        
        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{ maxWidth:450 }}>
                    <Header as='h2' icon color='violet' textAlign='center'>
                        <Icon name='code branch' color='violet'/>
                        Login to ReactSlack
                    </Header>
                        {
                            errors.length > 0 && (<Message error>
                                <h4>{this.displayErrors(errors) }</h4> 
                            </Message>)
                        }
                    <Form size='large' onSubmit={ this.handleSubmit }>
                        <Segment stacked>
                            <Form.Input fluid className = { this.handleInputErrors(errors, 'email')} name='email' icon='mail' iconPosition='left' placeholder='Email' onChange={ this.handleChange } type='email' value={email} />
                            <Form.Input fluid className = { this.handleInputErrors(errors, 'password') } name='password' icon='user' iconPosition='left' placeholder='Password' onChange={ this.handleChange } type='password' value={password} />
                            <Button color='violet' fluid size='large' className= { loading? 'loading' : ''} disabled = {loading} >Submit</Button>
                        </Segment>
                    </Form>
                    <Message>Dont have an account? <Link to='/register'>Register</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login 

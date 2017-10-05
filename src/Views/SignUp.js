import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, TextInput, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import Header from '../Components/Header';
import firebaseApp from '../firebaseApp';
import Loader from '../Components/Loader';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: false,
            email: false,
            password: false,
            usernameError: false,
            emailError: false,
            passwordError: false,
            loading: false
        };
    }

    goBack() {
        const { navigation } = this.props;
        navigation.goBack();
    }

    storeToken(user_id) {
        const { navigation } = this.props;

        AsyncStorage.setItem('token', user_id)
        .then(result => {
            navigation.navigate('Lists');
        });
    }

    errorCheck() {
        const { usernameError, emailError, passwordError } = this.state;
        return !usernameError && !emailError && !passwordError;
    }

    register() {
        const { username, email, password } = this.state;

        if (!this.errorCheck()) { return; }

        this.setState({ loading: true });
        firebaseApp.database().ref('/users/' + username)
            .ref.once('value')
            .then(snapshot => {

                // Check if username is already taken
                if (snapshot.val()) {
                    this.triggerError('username', 'Username is already taken');
                    return;
                }

                // Create new user
                firebaseApp.auth().createUserWithEmailAndPassword(email, password)
                    .then(result => {
                        var userId = result.uid;
                        
                        // Store user in users collection.
                        firebaseApp.database().ref('/users/' + userId).set({
                            email,
                            username,
                            user_id: userId
                        })
                        .then(result => {
                            // Store user and send them to todos
                            this.storeToken(userId);
                        }).catch(err => console.log(err));;
                    })
                    .catch(error => {
                        this.triggerError('email', 'Please enter a valid email address');
                        return;
                    });
            }).catch(err => console.log(err));
    }

    triggerError(type, reason) {
        this.setState({ [`${type}Error`]: reason });
    }

    clearInput(type) {
        /*
            Clears input when user taps on input with an error 
        */
        if (this.state[`${type}Error`]) {
            this.setState({ [`${type}Error`]: false, [type]: false });
        }
    }

    whiteSpaceCheck(text) {
        if (!text) return true;
        return text.indexOf(' ') >= 0;
    }

    validateUsername() {
        const { username } = this.state;
        if (this.whiteSpaceCheck(username)) {
            this.triggerError('username', 'Please enter a valid email username');
            return false;
        }

        this.refs.email.focus();
        return true;
    }

    validateEmail() {        
        // Makes sure the users email is valid
        // If it is not then we display an error
        const { email } = this.state;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(email)) {            
            this.triggerError('email', 'Please enter a valid email address');
            return false;
        }

        this.refs.password.focus();
        return true;
    }

    validatePassword() {
        const { password } = this.state;
        
        if (password.length < 6) {
            this.triggerError('password', 'Password must be at least 6 characters long');
            return false;
        }
        return true;
    }

    render() {
        const { navigation } = this.props;        
        const { usernameError, emailError, passwordError, loading } = this.state;
        return (
            <View style={styles.container}>

                {loading ? <Loader /> : null}

                <Header goBack={this.goBack.bind(this)} type='back' />

                <Image style={styles.logoImage} source={require('../../assets/img/ying_logo.png')} />

                {/* INPUTS */}
                <View style={styles.inputsContainer}>
                    <View style={styles.inputs}>
                        <TextInput
                            ref='username'
                            placeholder='Username'
                            returnKeyType='next'
                            onEndEditing={this.validateUsername.bind(this)}
                            onChangeText={username => this.setState({ username: username.toLowerCase() })}
                            onFocus={this.clearInput.bind(this, 'username')}
                            placeholderTextColor='black' />
                    </View>
                    {usernameError ? <Text style={styles.errorMessage}>{usernameError}</Text> : null}

                    <View style={styles.inputs}>
                        <TextInput
                            ref='email'
                            keyboardType='email-address'
                            placeholder='Email'
                            returnKeyType='next'
                            onEndEditing={this.validateEmail.bind(this)}
                            onChangeText={email => this.setState({ email })}
                            onFocus={this.clearInput.bind(this, 'email')}
                            placeholderTextColor='black' />
                    </View>
                    {emailError ? <Text style={styles.errorMessage}>{emailError}</Text> : null}

                    <View style={styles.inputs}>
                        <TextInput
                            ref='password'
                            placeholder='Password'
                            returnKeyType='done'
                            onEndEditing={this.validatePassword.bind(this)}
                            secureTextEntry={true}
                            onChangeText={password => this.setState({ password })}
                            onFocus={this.clearInput.bind(this, 'password')}
                            placeholderTextColor='black' />
                    </View>
                    {passwordError ? <Text style={styles.errorMessage}>{passwordError}</Text> : null}

                    {/* SIGN UP BTN */}
                    <TouchableOpacity onPress={this.register.bind(this)} style={styles.signUpBtn}>
                        <Text style={styles.signUpBtnText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7FB',
        alignItems: 'center'
    },
    logoImage: {
       marginTop: Height * 0.2,
       height: Height * 0.063,
       width: Width * 0.5,
    },
    inputsContainer: {
        height: Height * 0.3,
        position: 'absolute',
        left: Width * 0.1,
        right: Width * 0.1,
        bottom: Height * 0.36
    },
    inputs: {
        borderWidth: 1,
        borderColor: 'transparent',
        borderBottomColor: '#4A4A4A',
        marginBottom: Height * 0.05,
        paddingBottom: Height * 0.01
    },
    signUpBtn: {
        height: Height * 0.065,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#75D69C',
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 5
    },
    signUpBtnText: {
        color: 'white',
        fontSize: 16
    },
    errorMessage: {
        color: 'red',
        marginTop: -Width * 0.1,
        marginBottom: Width * 0.03
    }
});

export default SignUp;
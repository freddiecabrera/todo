import React, { Component } from 'react';
import { AsyncStorage, View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, TextInput } from 'react-native';
import firebaseApp from '../firebaseApp';
import Loader from '../Components/Loader';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: false,
            password: false,
            emailError: false,
            passwordError: false,
            loading: false
        };
    }

    errorCheck() {
        const { email, password } = this.state;
        return email && password;
    }

    storeToken(user_id) {
        const { navigation } = this.props;

        AsyncStorage.setItem('token', user_id)
        .then(result => {
            navigation.navigate('Lists', { user_id });
        });
    }

    login() {
        const { email, password } = this.state;

        if (!this.errorCheck()) { return; }
        this.setState({ loading: true });
        firebaseApp.auth().signInWithEmailAndPassword(email, password)
            .then(result => {
                this.storeToken(result.uid);
            })
            .catch(error => {
                const errorMessage = error.message;
                const code = error.code;
                
                if (code === 'auth/user-not-found') {
                    this.triggerError('email', 'Your account is incorrect');
                } else if (code === 'auth/wrong-password') {
                    this.triggerError('password', 'Incorrect password');
                } else if (code === 'auth/invalid-email') {
                    this.triggerError('email', 'Please enter a valid email address');
                }
            });
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
    

    validateEmail() {
        const { email } = this.state;
        if (!email) {
            this.triggerError('email', 'Please enter a valid email address');
            return;
        }
        this.refs.password.focus();
        return true;
    }

    validatePassword() {
        const { password } = this.state;
        if (!password) {
            this.triggerError('password', 'Please enter a valid email password');
            return;
        }
        return true;
    }

    render() {
        const { navigation } = this.props;
        const { emailError, passwordError, loading } = this.state;
        return (
            <View style={styles.container}>

                {loading ? <Loader /> : null}

                {/* LOGO */}
                <Image style={styles.logoImage} source={require('../../assets/img/ying_logo.png')} />

                {/* INPUTS */}
                <View style={styles.inputsContainer}>
                    <View style={styles.inputs}>
                        <TextInput
                            ref='email'
                            keyboardType='email-address'
                            placeholder='Email'
                            returnKeyType='next'
                            placeholderTextColor='black'
                            onChangeText={email => this.setState({ email })}
                            onFocus={this.clearInput.bind(this, 'email')}
                            onEndEditing={this.validateEmail.bind(this)}
                            placeholderTextColor='black' />
                    </View>
                    {emailError ? <Text style={styles.errorMessage}>{emailError}</Text> : null}

                    <View style={styles.inputs}>
                        <TextInput
                            ref='password'
                            placeholder='Password'
                            returnKeyType='done'
                            secureTextEntry={true}
                            placeholderTextColor='black'
                            secureTextEntry={true}
                            onEndEditing={this.validatePassword.bind(this)}
                            onChangeText={password => this.setState({ password })}
                            onFocus={this.clearInput.bind(this, 'password')} />
                    </View>
                    {passwordError ? <Text style={styles.errorMessage}>{passwordError}</Text> : null}

                    {/* LOGIN BTN */}
                    <TouchableOpacity onPress={this.login.bind(this)} style={styles.loginBtn}>
                        <Text style={styles.loginBtnText}>Login</Text>
                    </TouchableOpacity>
                </View>

                {/* CREATE ACCOUNT */}
                <View style={styles.signUpContainer}>
                    <Text style={styles.noAccountText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.createAccountBtn}>
                        <Text style={styles.createAccountBtnText}>Create</Text>
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
       marginTop: Height * 0.25,
       height: Height * 0.063,
       width: Width * 0.5,
    },
    inputsContainer: {
        height: Height * 0.3,
        position: 'absolute',
        left: Width * 0.1,
        right: Width * 0.1,
        bottom: Height * 0.25
    },
    inputs: {
        borderWidth: 1,
        borderColor: 'transparent',
        borderBottomColor: '#4A4A4A',
        marginBottom: Height * 0.05,
        paddingBottom: Height * 0.01
    },
    loginBtn: {
        height: Height * 0.065,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#75D69C',
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 5
    },
    loginBtnText: {
        color: 'white',
        fontSize: 16
    },
    signUpContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: Height * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    noAccountText: {
        color: '#4A4A4A',
        marginRight: Width * 0.05,
        fontSize: 16
    },
    createAccountBtn: {
        height: Height * 0.05,
        width: Width * 0.2,
        backgroundColor: '#6979FE',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 5
    },
    createAccountBtnText: {
        color: 'white'
    },
    errorMessage: {
        color: 'red',
        marginTop: -Width * 0.1,
        marginBottom: Width * 0.03
    }
});

export default Login;
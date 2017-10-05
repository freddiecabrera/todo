import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Image, AsyncStorage } from 'react-native';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

class Header extends Component {
    constructor(props) {
        super(props);

    }

    logout() {
        AsyncStorage.removeItem('token');
        this.props.navigation.navigate('Login');
    }

    getHeaderType(type) {
        switch(type) {
            case 'main':
                return this.main();
            case 'back':
                return this.back();
            case 'logout':
                return this.logoutUi();
        }
    }

    main() {
        const { goBack, goTrash } = this.props;
        return(
            <View>
                <TouchableOpacity onPress={goBack.bind(null)} style={styles.backWhiteIconBtn}>
                    <Image style={styles.backIcon} source={require('../../assets/img/back_white.png')} />    
                </TouchableOpacity>

                <TouchableOpacity onPress={goTrash.bind(null)} style={styles.trashIconBtn}>
                    <Image style={styles.backIcon} source={require('../../assets/img/trash.png')} />    
                </TouchableOpacity>
            </View>
        );
    }

    back() {
        const { goBack, arrowColor } = this.props;
        return(
            <TouchableOpacity onPress={goBack.bind(null)} style={styles.backBtn}>
                {arrowColor 
                ? <Image style={styles.backIcon} source={require('../../assets/img/back_white.png')} />
                : <Image style={styles.backIcon} source={require('../../assets/img/back.png')} />}
            </TouchableOpacity>
        );
    }

    logoutUi() {
        const { goBack, arrowColor } = this.props;
        return(
            <TouchableOpacity onPress={this.logout.bind(this)} style={styles.trashIconBtn}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        );
    }

    render() {        
        return(
            <View style={styles.container}>
                {this.getHeaderType(this.props.type)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Height * 0.1,
        zIndex: 1
    },
    backBtn: {
        height: Width * 0.12,
        width: Width * 0.12,
        position: 'absolute',
        left: Width * 0.02,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backIcon: {
        height: Width * 0.08,
        width: Width * 0.08
    },
    backWhiteIconBtn: {
        position: 'absolute',
        top: Height * 0.05,
        left: Width * 0.05
    },
    trashIconBtn: {
        position: 'absolute',
        top: Height * 0.05,
        right: Width * 0.05
    },
    logoutText: {
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 16
    }
});

export default Header;
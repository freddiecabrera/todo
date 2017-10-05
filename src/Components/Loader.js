import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

class Loader extends Component {
    constructor(props) {
        super(props);

    }

    render() {        
        return(
            <View style={styles.container}>
                <ActivityIndicator animating={true} color='black' size='large' />
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
        bottom: 0,
        zIndex: 2,
        backgroundColor: 'rgba(117, 214, 156, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Loader;
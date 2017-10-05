import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Image, Animated, TextInput } from 'react-native';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

class AddTodo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.bottom = new Animated.Value(-Height);
    }

    handlePress() {
        Animated.spring(this.bottom, {
            toValue: -Height * 0.5
        }).start();

        setTimeout(() => this.props.trigger(false), 200);
    }

    componentDidMount() {
        Animated.spring(this.bottom, {
            toValue: Height * 0.5
        }).start();
    }

    render() {        
        return(
            <TouchableOpacity activeOpacity={1} onPress={this.handlePress.bind(this)} style={styles.container}>
                 <Animated.View style={[styles.popUpContainer, { bottom: this.bottom }]}>
                    <Text style={{
                        fontSize: 24,
                        marginTop: Height * 0.1
                    }}>{`New ${this.props.type}`}</Text>
                    
                    <View style={styles.inputContainer}>
                        <TextInput
                            onChangeText={this.props.handleTextChange.bind(null)}
                            autoFocus={true}
                            returnKeyType='done'
                            defaultValue={this.props.rowTitle}
                            onEndEditing={this.props.createList.bind(this)}
                            placeholder={`${this.props.type} Name`}
                            placeholderTextColor='black'
                            autoCapitalize='none'
                            style={styles.input} />
                        
                        <TouchableOpacity onPress={this.props.createList.bind(null)} style={styles.addBtn}>
                            <Text style={styles.addIcon}>+</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View> 
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    popUpContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        minHeight: Height * 0.3,
        width: Height * 0.4,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
    }, 
    inputContainer: {
        position: 'absolute',
        paddingLeft: 10,
        bottom: 30,
        left: 30,
        right: 30,
        backgroundColor: '#e3e4e5',
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 5,
        flexDirection: 'row'
    },
    input: {
        height: Height * 0.06,
        width: Width * 0.52
     },
    addBtn: {
        backgroundColor: '#092FFE',
        height: Height * 0.05,
        width: Width * 0.1,
        position: 'absolute',
        right: 5,
        top: 5,
        bottom: 5,
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addIcon: {
        color: 'white',
        fontSize: 20
    }
});

export default AddTodo;
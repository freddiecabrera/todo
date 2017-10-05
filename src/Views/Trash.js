import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import firebaseApp from '../firebaseApp';
import Row from '../Components/Row';
import Header from '../Components/Header';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

class Trash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.navigation.state.params.userId, 
            deletedTodos: props.navigation.state.params.deletedTodos,
            listTitle: props.navigation.state.params.listTitle,
            damping: 1-0.6,
            tension: 300,
        };
    }

    keyExtractor = (item, index) => index;

    updateTodos(rowData) {
        const { deletedTodos } = this.state;
        const updateTodos = deletedTodos.filter(item => item.title !== rowData.title);
        this.setState({ deletedTodos: updateTodos });
    }

    permanentlyDeleteTodo(rowData, index) {
        this.updateTodos(rowData);
        const { userId, listTitle } = this.state;
        this.props.navigation.state.params.updateDeletedTodos(rowData);
        firebaseApp.database().ref(`/users/${userId}/lists/${listTitle}/todos/${rowData.title}`).remove();
    }

    recoverTodo(rowData, index) {
        this.updateTodos(rowData);
        const { deletedTodos, listTitle, userId } = this.state;        
        const newTodo = { ...rowData, deleted: false };
        const updateTodos = this.props.navigation.state.params.updateTodos;
        firebaseApp.database().ref(`/users/${userId}/lists/${listTitle}/todos/${rowData.title}`).update(newTodo).
        then(result => updateTodos(rowData))
        .catch(err => console.log('err', err));
    }

    renderItem({ index, item }) {
        return(
            <Row 
                type='Trash'
                rowData={item} 
                itemIndex={index} 
                trashAction={this.permanentlyDeleteTodo.bind(this)} 
                damping={this.state.damping} 
                checkAction={this.recoverTodo.bind(this)}
                tension={this.state.tension}>
              <Text>{item.title}</Text>
            </Row>
        );
    }

    goBack() {
        const { navigation } = this.props;
        navigation.goBack();
    }

    render() {
        const { deletedTodos } = this.state;
        
        return (
            <View style={styles.container}>

                <Header arrowColor='white' type='back' goBack={this.goBack.bind(this)} />
                
                <View style={styles.wallpaperContainer}>
                    <Image style={styles.wallpaper} source={require('../../assets/img/route_66.png')} />

                    <View style={styles.wallpaperTextContainer}>
                        <Text style={[styles.wallpaperText, { fontSize: Height * 0.04 }]}>Trash</Text>
                    </View>
                </View>

                  <View style={styles.flatListContainer}>
                    <FlatList
                        style={styles.flatList}
                        data={deletedTodos}
                        ItemSeparatorComponent={({ index }) => <View key={index} style={styles.itemSeparator} />}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem.bind(this)}
                        ListFooterComponent={() => <View style={styles.footer} />} />
                </View>  
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7FB',
        alignItems: 'center',
        justifyContent: 'center'
    },
    wallpaperContainer: {
        position: 'absolute',
        top: 0,
        left: 0, 
        right: 0
    },
    wallpaper: {
        height: Height * 0.3,
        width: Width
    },
    wallpaperTextContainer: {
        position: 'absolute',
        bottom: Width * 0.05,
        left: Width * 0.05
    },
    wallpaperText: {
        color: 'white',
        backgroundColor: 'transparent'
    },
    flatListContainer: {
        height: Height * 0.7,
        position: 'absolute',
        bottom: 0
    },
    flatList: {
        width: Width,
        backgroundColor: '#F6F7F8',
    },
    itemSeparator: {
        width: Width, 
        height: 1,
        backgroundColor: '#efefef'
    },
    footer: {
        backgroundColor: '#F7F7FB',
        height: Height * 0.1
    },
});

export default Trash;
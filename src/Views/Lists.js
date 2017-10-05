import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import AddTodo from '../Components/AddTodo';
import firebaseApp from '../firebaseApp';
import Row from '../Components/Row';
import Loader from '../Components/Loader';
import Header from '../Components/Header';
import moment from 'moment'

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

class Lists extends Component {
    constructor(props) {
        super(props);        
        this.state = {
            addingList: false,
            list: false,
            listTitle: '',
            userId: props.navigation.state.params.user_id,
            damping: 1-0.6,
            tension: 300,
            loading: true
        };
    }

    componentWillMount() {
        this.handleInitialTodos();
    }

    handleInitialTodos() {
        const { userId } = this.state;
        firebaseApp.database().ref('/users/' + userId + '/lists')
            .ref.once('value')
            .then(result => {
                const list = [];
                const firebaseList = result.val();
                for(key in firebaseList) {
                    list.push(firebaseList[key]);
                }

                this.setState({ list, loading: false });
            })
            .catch(err => console.log('err', err));
    }

    handleAddListPress(bool) {
        this.setState({ addingList: bool });
    }
    
    handleTextChange(listTitle) {
        this.setState({ listTitle });
    }

    goToTodos(todos) {    
        const { userId } = this.state;
        
        this.props.navigation.navigate('Todos', { todos, userId, listTitle: todos.title, updateLists: this.handleInitialTodos.bind(this) });
    }

    deleteList(rowData, index) {
        const { userId } = this.state;
        firebaseApp.database().ref('/users/' + userId + '/lists/' + rowData.title).remove();
        const result = this.state.list.filter(item => item.title !== rowData.title);
        this.setState({ list: result });
    }

    createList() {
        const { listTitle, userId } = this.state;
        firebaseApp.database().ref(`/users/${userId}/lists/${listTitle}`).update({
            title: listTitle
        })
        .then(result => {
            this.handleInitialTodos();  
            this.setState({ listTitle: '', addingList: false });
        })
        .catch(err => console.log('err', err));
    }

    renderItem({ index, item }) {
        
        return (
            <Row 
                rowData={item} 
                itemIndex={index} 
                trashAction={this.deleteList.bind(this)} 
                damping={this.state.damping} 
                goToTodos={this.goToTodos.bind(this)}
                tension={this.state.tension}>

                <Text>{item.title}</Text>
            </Row>
        );
    }

    keyExtractor = (item, index) => index;

    render() {
        const { addingList, list, userId, loading } = this.state;

        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation} type='logout' />
                {loading ? <Loader /> : null}

                <View style={styles.wallpaperContainer}>
                    <Image style={styles.wallpaper} source={require('../../assets/img/los_angeles.jpg')} />

                    <View style={styles.wallpaperOverlay} />

                    <View style={styles.wallpaperTextContainer}>
                        <Text style={[styles.wallpaperText, { fontSize: Height * 0.04 }]}>My Lists</Text>
                        <Text style={[styles.wallpaperText, { fontSize: Height * 0.03 }]}>{moment().format('dddd, MMMM D')}</Text>
                    </View>
                </View>

                <View style={styles.flatListContainer}>
                    <FlatList
                        style={styles.flatList}
                        data={this.state.list}
                        ItemSeparatorComponent={({ index }) => <View key={index} style={styles.itemSeparator} />}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem.bind(this)}
                        ListFooterComponent={() => <View style={styles.footer} />} />
                </View>

                {list.length === 0 ? <Text>You have no lists. Add a list</Text> : null}

                <TouchableOpacity onPress={this.handleAddListPress.bind(this, true)} style={styles.addListBtn}>
                    <Image style={styles.plusIcon} source={require('../../assets/img/add.png')} />
                    <Text style={styles.addListText}>Add a list</Text>
                </TouchableOpacity>

                {addingList ? <AddTodo type='List' createList={this.createList.bind(this)} handleTextChange={this.handleTextChange.bind(this)} trigger={this.handleAddListPress.bind(this)} /> : null}
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
    wallpaperOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(117, 214, 156, 0.5)'
    },
    addListBtn: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        height: Height * 0.1
    },
    footer: {
        backgroundColor: '#F7F7FB',
        height: Height * 0.1
    },
    plusIcon: {
        height: Width * 0.06,
        width: Width * 0.06,
        marginLeft: Width * 0.1,
        marginRight: Width * 0.05
    },
    addListText: {
        fontSize: 20,
        color: '#6979FE'
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
    }
});

export default Lists;
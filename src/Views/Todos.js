import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import AddTodo from '../Components/AddTodo';
import firebaseApp from '../firebaseApp';
import Row from '../Components/Row';
import Header from '../Components/Header';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

class Todos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.navigation.state.params.userId, 
            todo: props.navigation.state.params.todos,
            title: '',
            addingTodo: false,
            todoTitle: '',
            damping: 1-0.6,
            tension: 300,
            deletedTodos: [],
            editing: false
        };
    }

    componentWillMount() {
        this.handleInitialTodos(this.state.todo.todos, this.state.todo.title);
    }

    handleInitialTodos(todos, title) {        
        const result = [];
        const deletedTodos = []
        for(key in todos) {                        
            !todos[key].deleted ? result.push(todos[key]) : deletedTodos.push(todos[key]);
        }

        this.setState({ todo: result, title, deletedTodos });
    }

    updateTodos(todo) {
        const deletedTodos = this.state.deletedTodos.filter(item => item.title !== todo.title);
        this.setState({ deletedTodos, todo: [ ...this.state.todo, todo ]});
    }

    updateDeletedTodos(todo) {
        const deletedTodos = this.state.deletedTodos.filter(item => item.title !== todo.title);
        this.setState({ deletedTodos });
    }

    capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    keyExtractor = (item, index) => index;

    deleteTodo(rowData, index) {
        const { userId, title, todo, deletedTodos } = this.state;       
        const updatedTodos = todo.filter(item => item.title !== rowData.title);
        const newTodo = { ...rowData, deleted: true };
        const updateLists = this.props.navigation.state.params.updateLists;
        
        this.setState({ todo: updatedTodos, deletedTodos: [ ...deletedTodos, rowData ] });
        
        firebaseApp.database().ref(`/users/${userId}/lists/${title}/todos/${rowData.title}`).update(newTodo)
        .then(result => updateLists())
        .catch(err => console.log('err', err));
        
    }

    completeTodo(rowData, index, bool) {        
        const { userId, title, todo } = this.state;        
        const newTodo = {
            title: rowData.title,
            completed: bool,
            deleted: false
        }

        const updatedTodos = todo.map(item => {
            if (item.title === rowData.title) {
                item.completed = bool;
            }

            return item;
        });

        this.setState({ todo: updatedTodos });

        firebaseApp.database().ref(`/users/${userId}/lists/${title}/todos/${rowData.title}`).update(newTodo)
        .catch(err => console.log('err', err));
    }

    renderItem({ index, item }) {
        return (
            <Row 
                type='Todos'
                rowData={item} 
                itemIndex={index} 
                trashAction={this.deleteTodo.bind(this)} 
                damping={this.state.damping} 
                checkAction={this.completeTodo.bind(this)}
                tension={this.state.tension}>

                        <RadioButton labelHorizontal={true} >
                            <RadioButtonInput
                                obj={{label: item.title, value: index}}
                                isSelected={item.completed}
                                onPress={this.completeTodo.bind(this, item, index, !item.completed)}
                                borderWidth={1}
                                buttonInnerColor={'#092FFE'}
                                buttonOuterColor={'gray'}
                                buttonSize={Height * 0.04}
                                buttonOuterSize={Height * 0.04}
                                buttonStyle={{ }}
                            />
                            <RadioButtonLabel
                                obj={{label: item.title, value: index}}
                                labelHorizontal={true}
                                onPress={() => this.handleEdit(item.title)}
                                labelStyle={item.completed ? {textDecorationLine: 'line-through'} : {}}
                            />
                        </RadioButton>                    

            </Row>
        );
    }

    createTodo() {
        const { todoTitle, userId, title, todo } = this.state;
        const newTodo = {
            title: todoTitle,
            completed: false,
            deleted: false
        }
        
        firebaseApp.database().ref(`/users/${userId}/lists/${title}/todos/${todoTitle}`).update(newTodo)
        .then(result => {  
            this.setState({ todoTitle: '', addingTodo: false, todo: [ newTodo, ...todo ] });
        })
        .catch(err => console.log('err', err));
    }

    editTodo() {
        const { todoTitle, userId, title, todo, editing } = this.state;
        let newTodo;
        const updatedTodos = todo.map(todo => {
            if (todo.title === editing) {
                todo.title = todoTitle;
                newTodo = todo;
            }
            return todo;
        });

        firebaseApp.database().ref(`/users/${userId}/lists/${title}/todos/${newTodo.title}`).update(newTodo)
            .then(result => {
                firebaseApp.database().ref(`/users/${userId}/lists/${title}/todos/${editing}`).remove();
            })
            .catch(err => console.log('err', err));
        
        this.handleAddTodoPress(false);
    }

    handleTextChange(todoTitle) {
        this.setState({ todoTitle });
    }

    handleEdit(title) {        
        this.setState({ todoTitle: title, editing: title, addingTodo: true});
    }

    handleAddTodoPress(bool) {                
        this.state.editing ? this.setState({ addingTodo: bool, editing: false }) : this.setState({ addingTodo: bool, todoTitle: '' });
    }

    goBack() {
        const { navigation } = this.props;
        navigation.goBack();
    }

    goTrash() {
        const { deletedTodos, userId, title } = this.state;
        const { navigation } = this.props;
        navigation.navigate('Trash', { deletedTodos, userId, listTitle: title, updateDeletedTodos: this.updateDeletedTodos.bind(this), updateTodos: this.updateTodos.bind(this) });
    }

    render() {
        const { todo, title, addingTodo, todoTitle, editing } = this.state;
        return (
            <View style={styles.container}>

                <Header goBack={this.goBack.bind(this)} goTrash={this.goTrash.bind(this)} type='main' />

                <View style={styles.wallpaperContainer}>
                    <Image style={styles.wallpaper} source={require('../../assets/img/seattle.png')} />

                    <View style={styles.wallpaperTextContainer}>
                        <Text style={[styles.wallpaperText, { fontSize: Height * 0.04 }]}>{this.capitalize(title)}</Text>
                    </View>
                </View>

                 <View style={styles.flatListContainer}>
                    <FlatList
                        style={styles.flatList}
                        data={this.state.todo}
                        ItemSeparatorComponent={({ index }) => <View key={index} style={styles.itemSeparator} />}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem.bind(this)}
                        ListFooterComponent={() => <View style={styles.footer} />} />
                </View> 

                {todo.length === 0 ? <Text>Your list is empty. Add a to-do.</Text> : null}

                 <TouchableOpacity onPress={this.handleAddTodoPress.bind(this, true)} style={styles.addListBtn}>
                    <Image style={styles.plusIcon} source={require('../../assets/img/add.png')} />
                    <Text style={styles.addListText}>Add a to-do</Text>
                </TouchableOpacity> 

                {addingTodo ? <AddTodo rowTitle={todoTitle} type='Todo' trigger={this.handleAddTodoPress.bind(this)} createList={editing ? this.editTodo.bind(this) : this.createTodo.bind(this)} handleTextChange={this.handleTextChange.bind(this)} /> : null}
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
});

export default Todos;

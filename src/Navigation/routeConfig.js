import Login  from '../Views/Login';
import SignUp from '../Views/SignUp';
import Lists  from '../Views/Lists';
import Todos  from '../Views/Todos';
import Todo   from '../Views/Todo';
import Trash  from '../Views/Trash';

const routeConfig = {
   Login : {
        screen: Login,
        navigationOptions: {
            gesturesEnabled: false,
        }
    },
   SignUp : {
        screen: SignUp
    },
   Lists : {
        screen: Lists,
        navigationOptions: {
            gesturesEnabled: false,
        }
    },
   Todos : {
        screen: Todos
    },
   Todo : {
        screen: Todo
    },
   Trash : {
        screen: Trash
    }
}

export default routeConfig;
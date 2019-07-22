import React from 'react';
import Firebase from './firebase';

const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase}/> }
    </FirebaseContext.Consumer>
);

export default FirebaseContext;
import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';

const App = () => (
    <Router>
        {/* passing in component 'Join'. This is what the user is greeted by. 
        Here, user will pass data into login form. This will be passed on to the /Chat. Once we have the data, we can render the chat component */}
        <Route path="/" exact component={Join} /> 

        {/* not exact path since we're going to pass properties. */}
        <Route path="/chat" component={Chat} /> 
    </Router>
);


export default App;
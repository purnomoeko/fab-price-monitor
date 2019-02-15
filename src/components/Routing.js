import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';
import InputPage from './InputPage';
import List from './List';
import Details from './Details';

const AllRoutes = () => (
    <Router basename="/">
        <div>
            <Switch>
                <Route exact path="/" component={InputPage} />
                <Route exact path="/input-page" component={InputPage} />
                <Route exact path="/list" component={List} />
                <Route exact path="/details" component={Details} />
                <Route
                    render={(props) => {
                        window.location = `/404.html?from=${props.location.pathname}`;
                    }}
                />
            </Switch>
        </div>
    </Router>
);

export default AllRoutes;

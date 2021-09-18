import React from "react";
import ReactDOM from "react-dom";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import LoginPage from "./components/aut-service/login-page";
import ExpenseEntry from "./components/wedding-planner/expenses-entry";
import WeddingEntry from "./components/wedding-planner/wedding-entry";
import WelcomePage from "./components/wedding-planner/welcome";
import store from "./store/wedding";

ReactDOM.render(
    <Router>
        <Switch>
            <Provider store={store}>
                <Route exact path="/">
                    <Redirect to="/home"></Redirect>
                </Route>
                <Route path="/home">
                    <WelcomePage></WelcomePage>
                    <LoginPage></LoginPage>
                </Route>
                <Route path="/wedding">
                    <WeddingEntry></WeddingEntry>
                    <ExpenseEntry></ExpenseEntry>
                </Route>
                <Route path="/chat">
                    <WelcomePage></WelcomePage>
                </Route>
            </Provider>
        </Switch>
    </Router>,
    document.getElementById("root")
);

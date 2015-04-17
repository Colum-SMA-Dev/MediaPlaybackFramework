'use strict';
var React = require('react');
var LoginPage = require('../pages/login-page.jsx');
var ClientStore = require('../stores/client-store');
var SceneActions = require('../actions/scene-actions');
var Loader = require('./loader.jsx');
var StatusMessageStore = require('../stores/status-message-store');
var StatusAlert = require('./status-alert.jsx');
var Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    Link = Router.Link;


function _getState () {
    return {
        loggedIn: ClientStore.loggedIn(),
        attemptingLogin: ClientStore.attemptingLogin(),
        messages: StatusMessageStore.getMessages()
    };
}

var App = React.createClass({
    
    getInitialState: function() {
        return _getState();
    },

    componentDidMount: function() {
        ClientStore.addChangeListener(this._onChange);
        StatusMessageStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ClientStore.removeChangeListener(this._onChange);
        StatusMessageStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(_getState());
    },

    handleLogout: function(event) {
        SceneActions.logout();
    },
    
    render: function() {
        var sessionNav, nav;

        if (this.state.loggedIn) {
            sessionNav = <div className='session-nav'>
                <a className='btn' onClick={this.handleLogout}>Log out</a>
            </div>;
        }

        var messages = this.state.messages;

        var statusAlerts = Object.keys(messages).map(function(name) {
            return <StatusAlert key={name} name={name} state={messages[name]} />;
        });        

        return (
            <div className='app'>
                <div className='header'>
                    {sessionNav}                      
                    <a target='_blank' className='dos-donts' href='https://docs.google.com/document/d/1B25gvDRob576KPsgusEhhUY3GI_XF6guHIBpLPrn9U0/edit?usp=sharing'>
                        Do's &amp; Don'ts of Media Frameworks
                    </a> 
                    <h4 className='title'>Media Scene Editor</h4>
                </div>
                <Loader message='Logging in...' loaded={! this.state.attemptingLogin}>
                    <RouteHandler key='handler' />
                </Loader>

                <div className="file-upload-status">
                    {statusAlerts}
                </div>
            </div>
        );       

        
    }

});

module.exports = App;

'use strict';

var AppDispatcher = require('../dispatchers/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/scene-constants').ActionTypes;
var assign = require('object-assign');
var _ = require('lodash');
var CHANGE_EVENT = 'CHANGE_EVENT';

var _loggedIn = false;
var _failedAttempt = false;

var ClientStore = assign({}, EventEmitter.prototype, {
	loggedIn: function() {
		return _loggedIn;
	},

    failedAttempt: function() {
        return _failedAttempt;
    },

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	dispatcherIndex: AppDispatcher.register(function(payload){
        var action = payload.action; // this is our action from handleViewAction
        switch(action.type){
            case ActionTypes.HUB_LOGIN_RESULT:
            	_loggedIn = action.result;

                if (! _loggedIn) {
                    _failedAttempt = true;
                }
                ClientStore.emitChange();
                break;

            case ActionTypes.HUB_LOGOUT:
                _loggedIn = false;
                _failedAttempt = false;
                ClientStore.emitChange();
                break;
        }        

        return true;
    })
});

module.exports = ClientStore;
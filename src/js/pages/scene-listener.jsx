'use strict';

var React = require('react');
var SceneStore = require('../stores/scene-store');
var ScenePlayer = require('../components/scene-player.jsx');
var HubSendActions = require('../actions/hub-send-actions');
var randomScenePlayer = require('../utils/random-scene-player');
var scenePlayerElementManager = require('../utils/scene-player-element-manager');
var FormHelper = require('../mixins/form-helper');
var Router = require('react-router');

var SceneListener = React.createClass({

    mixins: [Router.State, FormHelper],

    statics: {
        willTransitionFrom: function(transition, component) {
            HubSendActions.unsubscribeScene(component.getParams().id);
        }
    },

    _getState: function() {
        return {scene: SceneStore.getScene(this.getParams().id)};
    },

    getInitialState: function() {
        return this._getState();
    },

    componentDidMount: function() {
        HubSendActions.subscribeScene(this.getParams().id);
        SceneStore.addChangeListener(this._onChange);

        var playerElem = this.getDOMNode().querySelector('.player');
        var player = randomScenePlayer(scenePlayerElementManager(playerElem));
        player.setScene(this.state.scene);
        player.start();

        this.setState({player: player});
    },
    
    componentWillUnmount: function() {
        SceneStore.removeChangeListener(this._onChange);
    },

    updateTags: function(event) {
        if (event) {
            event.preventDefault();
        }

        var tagNode = this.getRefNode('tags');
        this.state.player.setTagFilter(tagNode.value);
        tagNode.blur();
    },

    handleBlur: function(event) {
        this.updateTags();
    },
    
    _onChange: function() {
        this.setState(this._getState());
        this.state.player.setScene(this.state.scene);
    },

    render: function() {
        return (
            <div className='scene-listener'>
                <div className='player'></div>
                <form onSubmit={this.updateTags}>
                    <input ref='tags' onBlur={this.handleBlur} type='text' placeholder='tag, tag, ...' className='form-control scene-listener-tag-input' />
                </form>
            </div>
        );
    }

});

module.exports = SceneListener;
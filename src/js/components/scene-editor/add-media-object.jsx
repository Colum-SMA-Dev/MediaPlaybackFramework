'use strict';
/*jshint browser: true */

var React = require('react');
var MediaButton = require('./media-button.jsx');
var SceneActions = require('../../actions/scene-actions');
var FormHelper = require('../../mixins/form-helper');
var HubClient = require('../../utils/HubClient');
var AddMediaObjectStore = require('../../stores/add-media-object-store');
var getVimeoId = require('../../utils/get-vimeo-id');
var Loader = require('../loader.jsx');
var _ = require('lodash');

var SceneEditor = React.createClass({

	mixins: [FormHelper],

	getInitialState: function() {
		return this.getStateFromStore();
	},

	getStateFromStore: function() {
		return {
			loading: AddMediaObjectStore.loading(),
			inputValue: AddMediaObjectStore.inputValue()
		};
	},

	componentDidMount:function(){
	    AddMediaObjectStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
	    AddMediaObjectStore.removeChangeListener(this._onChange);
	},

	_onChange:function(){
	    this.setState(this.getStateFromStore());
	},

	handleInputChange: function(event) {
		this.setState({inputValue: event.target.value});
	},

	handleSubmit: function(event) {
		event.preventDefault();
		var content = this.getRefNode('content'),
			data = content.value;

		var addMediaObject = function (obj) {
			SceneActions.addMediaObject(this.props.scene, obj);	
			content.value = '';	
		}.bind(this);

		
		var vimeoId =  getVimeoId(data); 
		if (vimeoId) {
			SceneActions.addVimeo(this.props.scene._id, data);
		} else {
			SceneActions.addText(this.props.scene._id, data);
		}
	},

	render: function() {
		var text = this.state.loading ? 'Loading...' : 'Add';

		return (
			<form onSubmit={this.handleSubmit} className='add-media-object'>
				
				<input ref='content'
					   value={this.state.inputValue}
					   onChange={this.handleInputChange}
				       className='form-control' 
				       placeholder='vimeo url or text' 
				       required />
				
				<button className='btn btn-primary' type='submit' 
				 disabled={this.state.loading}>
				 	{text}
				</button>
			</form>
		);
	}

});

module.exports = SceneEditor;
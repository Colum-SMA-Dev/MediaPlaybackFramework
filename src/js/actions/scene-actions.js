var SceneConstants = require('../constants/scene-constants');
var AppDispatcher = require('../dispatchers/app-dispatcher');
var HubClient = require('../utils/HubClient');
var hat = require('hat');
var ActionTypes = SceneConstants.ActionTypes;
var SceneActions = {
    sceneChange: function(scene) {
        AppDispatcher.handleViewAction({
            type: ActionTypes.SCENE_CHANGE,
            scene: scene
        });
        HubClient.save(scene);
    },

    addMediaObject: function(sceneId, mediaType, url, tags) {
        AppDispatcher.handleViewAction({
            type: ActionTypes.ADD_MEDIA_OBJECT,
            sceneId: sceneId,
            mediaType: mediaType,
            mediaObjectId: hat(),
            url: url,
            tags: tags
        });
    },

    removeMediaObject: function(sceneId, mediaObjectId) {
        AppDispatcher.handleViewAction({
            type: ActionTypes.REMOVE_MEDIA_OBJECT,
            sceneId: sceneId,
            mediaObjectId: mediaObjectId
        });
    },

    logout: function() {
        AppDispatcher.handleViewAction({
            type: ActionTypes.HUB_LOGOUT
        });
        HubClient.logout();
        var AppRouter = require('../app-router.jsx');
        AppRouter.transitionTo('login');
    }
};

module.exports = SceneActions;  
'use strict';

var _ = require('highland');

function MediaObjectStream(types) {
	// allows us to verify if a written object should be put back in the stream or not
	var sceneVersion = 0,
		stream = _();
	
	this.write = function(mediaObject) {
		if (mediaObject.sceneVersion === sceneVersion) {
			stream.write(mediaObject);
		}
	};

	this.setScene = function(mediaObjects) {
		var mo;
		for (var i = 0; i < mediaObjects.length; i++) {
			mo = mediaObjects[i];
			mo.sceneVersion = sceneVersion;
			stream.write(mo);
		}
	};


	this.setTagMatcher = function(newTagMatcher) {
	    if (! tagMatcher.equalTo(newTagMatcher)) {
	        tagMatcher = newTagMatcher;
	        // clear the current queue
	        queue = [];
	        _.forEach(masterList, function(mo) {
	            var activeIndex = _.findIndex(active, function(activeMo) { return activeMo === mo; }); 
	            if ( tagMatcher.match(mo.tags) ) {
	                if(activeIndex === -1 ) {
	                    queue.push(mo);
	                }
	            } else if (activeIndex > -1) {
	                mo.transition();
	            }
	        });
	    }
	};
}

module.exports = MediaObjectStream;
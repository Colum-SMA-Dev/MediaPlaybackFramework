'use strict';
/* jshint browser:true */

var _ = require('highland');
var lo = require('lodash');
var VideoMediaObject = require('./media-object/video-media-object');
var variableThrottle = require('./variable-throttle');
var ImageMediaObject = require('./media-object/image-media-object');
var TextMediaObject = require('./media-object/text-media-object');


function buildQuadElement(positions) {
	var elem = document.createElement('div');
	var inner = document.createElement('div');
	inner.classList.add('quadrant-inner');
	elem.appendChild(inner);
	
	_(positions)
		.map(function(pos) { return 'quad-' + pos; })
		.append('quadrant')
		.each(elem.classList.add.bind(elem.classList));
	
	return elem;
}

function QuadrantVisualPlayer (stageElement, queue) {

	// make the quadrant container elements
	var quadsPositions = [
		['top', 'left'],
		['top', 'right'],
		['bottom', 'left'],
		['bottom', 'right']
	];

	var emptyQuadrants = [];


	var quadElements = _(quadsPositions)
			.map(buildQuadElement);
	
	quadElements.each(function(e) {
		stageElement.appendChild(e);
		emptyQuadrants.push(e);	
	});


	



	this.start = function() {
		// showMedia();
	};
}

module.exports = QuadrantVisualPlayer;
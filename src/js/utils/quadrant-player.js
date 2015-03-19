'use strict';
/*jshint browser:true */
var _ = require('lodash');

function QuadrantPlayer (stageElement) {
    var queue,
        top = document.createElement('div'),
        bottom = document.createElement('div'),
        topRight = document.createElement('div'),
        bottomRight = document.createElement('div'),
        bottomLeft = document.createElement('div'),
        topLeft = document.createElement('div');

    _.each([top, bottom], function(el) {
        el.classList.add('vertical-half');
        el.style.height = '50%';
        stageElement.appendChild(el);
    });

    var setupHoriz = function(parentEl) {
        return function(el) {
            el.classList.add('quad-horizontal-half');
            el.style.width = '50%';
            el.style.height = '100%';
            el.style.display = 'inline-block';
            parentEl.appendChild(el);
        };
    };

    _.each([topLeft, topRight], setupHoriz(top));
    _.each([bottomLeft, bottomRight], setupHoriz(bottom));

    var fillPosition = function(targetElement, position, type) {
        var mediaObject = queue.nextWithAttrs({
            position: position,
            type: type
        });

        if (mediaObject) {
            mediaObject.makeElement(function(el) {

                targetElement.appendChild(el);
                
                // and show - use defer to make sure callstack clears and image get's added to screen prior to adding class
                setTimeout(function() {
                    el.classList.add('show-media-object');
                }, 0);

                setTimeout(function() {
                    el.classList.remove('show-media-object');

                    fillPosition(targetElement, position, type);
                }, 3000);
            });
        }
    };

    this.setMediaObjectQueue = function(newQueue) {
        queue = newQueue; 
    };

    this.play = function() {
        if (! queue) throw 'queue must be set before calling play';
        // keep fill the quadrants
        fillPosition(topRight, 'top-right', ['image']);
        fillPosition(topLeft, 'top-left', ['image']);
        fillPosition(bottomRight, 'bottom-right', ['image']);
        fillPosition(bottomLeft, 'bottom-left', ['image']);
    };
}

module.exports = QuadrantPlayer;
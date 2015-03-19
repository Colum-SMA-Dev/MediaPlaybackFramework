'use strict';
/*jshint browser:true */

var StaticMediaObject = require('./static-media-object');

function ImageMediaObject (obj) {
    StaticMediaObject.call(this, obj);
}

ImageMediaObject.prototype = Object.create(StaticMediaObject.prototype);
ImageMediaObject.prototype.constructor = ImageMediaObject;

// trigger callback with preloaded element
ImageMediaObject.prototype.makeElement = function(callback) {
    var el = new Image();

    el.classList.add('image-media-object', 'media-object');
    
    el.onload = function() {
        callback(el);
    };

    el.src = this._obj.url;
};

ImageMediaObject.prototype.play = function() {
    var el = new Image();
    this._element = el;

    el.classList.add('image-media-object', 'media-object');
    
    el.onLoad = function() {
        StaticMediaObject.play.call(this);

    }.bind(this);

    el.src = this._obj.url;
};

module.exports = ImageMediaObject;
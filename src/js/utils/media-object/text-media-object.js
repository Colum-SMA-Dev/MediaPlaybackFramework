'use strict';
/*jshint browser:true */

var MediaObject = require('./media-object');

function TextMediaObject (obj) {
    MediaObject.call(this, obj);
}

TextMediaObject.prototype = Object.create(MediaObject.prototype);
TextMediaObject.prototype.constructor = TextMediaObject;

// trigger callback with preloaded element
TextMediaObject.prototype.makeElement = function(callback) {
    var el = document.createElement('p');

    el.innerText = this._obj.text;
    el.classList.add('text-media-object', 'media-object');
    
    callback(el);
};

module.exports = TextMediaObject;
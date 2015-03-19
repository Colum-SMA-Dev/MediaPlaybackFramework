'use strict';
/*jshint browser:true */

var _ = require('lodash');
var MediaObject = require('./media-object');

function StaticMediaObject (obj) {
    MediaObject.call(this, obj);

    this._element = null;
}

StaticMediaObject.prototype = Object.create(MediaObject.prototype);
StaticMediaObject.prototype.constructor = StaticMediaObject;

StaticMediaObject.prototype.play = function(parent) {
    parent.appendChild(this._element);
    var el = this._element;
    el.style.left = Math.random() * (parent.offsetWidth - el.offsetWidth);
    el.style.top = Math.random() * (parent.offsetHeight - el.offsetHeight);

    window.setTimeout(function() {
        el.classList.add('show-media-object');
    }, 0);
};


module.exports = StaticMediaObject;
'use strict';

var MediaObjectQueue = require('../src/js/utils/media-object/media-object-queue');
var assert = require('chai').assert;
var chance = require('chance').Chance();
var ImageMediaObject = require('../src/js/utils/media-object/image-media-object');
var VideoMediaObject = require('../src/js/utils/media-object/video-media-object');
var TextMediaObject = require('../src/js/utils/media-object/text-media-object');
var AudioMediaObject = require('../src/js/utils/media-object/audio-media-object');


function makeScene (ops) {
    var scene = [];

    ['image', 'video', 'audio'].forEach(function(type) {
        for (var i = 0; i < ops[type] || 0; i++) {
            scene.push({
                type: type,
                url: chance.url()
            });
        }    
    });

    for (var i = 0; i < ops.text || 0; i++) {
        scene.push({
            type: 'text',
            text: chance.string()
        });
    }
    
    return {
        name: chance.string(),
        _id: chance.string(),
        themes: {},
        scene: scene
    };
}


describe('MediaObjectQueue', function () {
    beforeEach(function () {
        this.queue = new MediaObjectQueue();
    });

    describe('instantation of MediaObject sub types', function () {
        beforeEach(function () {
            this.queue.setScene(makeScene({image: 1, video: 1, text: 1, audio: 1}));
        });

        describe('nextByType()', function () {
            it('should return proper sub types', function () {
                assert.instanceOf(this.queue.nextByType('image'), ImageMediaObject);
                assert.instanceOf(this.queue.nextByType('video'), VideoMediaObject);
                assert.instanceOf(this.queue.nextByType('text'), TextMediaObject);
                assert.instanceOf(this.queue.nextByType('audio'), AudioMediaObject);
            });
        });
    });

    describe('filtering by type behavior with only 1 image', function () {
        beforeEach(function () {
            this.queue.setScene(makeScene({image: 1}));
        });

        describe('nextByType()', function () {
            it('should return an ImageMediaObject when called with "image"', function () {
                assert.instanceOf(this.queue.nextByType('image'), ImageMediaObject);
            });

            it('should return undefined when called with "video"', function () {
                assert.isUndefined(this.queue.nextByType('video'));
            });
        });
    });

    describe('queue refilling behavior with 1 video and 2 images', function () {
        beforeEach(function () {
            this.queue.setScene(makeScene({video: 1, image: 2}));
        });

        describe('nextByType()', function () {
            it('should return the same video when called twice', function () {
                var mo1 = this.queue.nextByType('video');
                var mo2 = this.queue.nextByType('video');

                assert.strictEqual(mo1, mo2);
            });

            it('should return both images then a duplicate when called three times', function () {
                var mo1 = this.queue.nextByType('image'),
                    mo2 = this.queue.nextByType('image'),
                    mo3 = this.queue.nextByType('image');

                assert.notStrictEqual(mo1, mo2);
                assert(mo3 === mo1 || mo3 === mo2, 'queue did not return a duplicate');
            });
        });

    });

    describe('tagFiltering behavior', function () {
        
    });

    describe('edge cases', function () {
        
        describe('no scene set', function () {
        
            describe('nextByType()', function () {
                it('should return undefined', function () {
                    assert.isUndefined(this.queue.nextByType('image'));
                });
            });
        });    
    });
});
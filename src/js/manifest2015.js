'use strict';
/*jshint browser: true */

var io = require('socket.io-client');
var _ = require('lodash');
var $ = require('jquery');

var TextMediaObject = require('./utils/media-object/text-media-object');
var VideoMediaObject = require('./utils/media-object/video-media-object');
var ImageMediaObject = require('./utils/media-object/image-media-object');
var AudioMediaObject = require('./utils/media-object/audio-media-object');
var MediaObjectQueue = require('./utils/media-object/media-object-queue');
var RandomAudioPlayer = require('./utils/random-audio-player');
var RandomVisualPlayer = require('./utils/random-visual-player');
var transitionEventName = require('./utils/transition-event')();
var TagMatcher = require('./utils/tag-matcher');


var form = document.getElementById('login-form'),
    login = document.getElementById('login'),
    errors = document.getElementById('errors'),
    playerElem = document.getElementById('player'),
    submitBtn = document.getElementById('submit'),
    sceneNameElem = document.getElementById('scene-name'),
    themeNameElem = document.getElementById('theme-name'),
    mediaObjectQueue = new MediaObjectQueue(
        [TextMediaObject, AudioMediaObject, VideoMediaObject, ImageMediaObject],
        {image: 3, text: 1, video: 1, audio: 1}
    ),
    randomVisualPlayer = new RandomVisualPlayer(playerElem, mediaObjectQueue),
    randomAudioPlayer = new RandomAudioPlayer(mediaObjectQueue),
    sceneDisplayTimeout,
    sceneList,
    currentSceneIndex;

var socket;


function showError (message) {
    var msg = document.createElement('li');
    msg.classList.add('error');
    msg.innerText = message.toString();
    errors.appendChild(msg);
    msg.style.opacity = 1;
    setTimeout(function() {
        msg.addEventListener(transitionEventName, function() {
            errors.removeChild(msg);
        });
        msg.style.opacity = 0;
    }, 40 * message.length);
}

function getRandomThemeName (scene) {
    if (! scene.themes) {
        return null;
    } else {
        return _(scene.themes).keys().sample();
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function showThemeName (name) {
    themeNameElem.textContent = name;

    if (name === '') {
        themeNameElem.style.display = 'none';
    } else {
        themeNameElem.style.display = 'block';
    }
}

function playScene (scene) {
    console.log('showing scene ' + scene.name);

    if (scene.style) {
        $(playerElem).removeAttr('style');
        $(playerElem).css(scene.style);
    }
    var name = scene.name.replace(/^GUIscene/, '').replace(/([A-Z]|[\d]+)/g, ' $1').trim();
    sceneNameElem.textContent = name;

    mediaObjectQueue.setScene(scene, {hardReset: true});

    var themeName = getRandomThemeName(scene);
    var themeQuery = '';
    if (themeName) {
        themeQuery = scene.themes[themeName];
        showThemeName(themeName);
    } else {
        themeNameElem.textContent = '';
        showThemeName('');
    }

    mediaObjectQueue.setTagMatcher(new TagMatcher(themeQuery));

    randomVisualPlayer.start();
    randomAudioPlayer.start();
}

function playSceneAJFTesting (scene) { //AJF: todo: rename or remove once proper requirements elicited
    console.log('playSceneAJFTesting: showing scene: ' + scene.name);

    if (scene.style) {
        $(playerElem).removeAttr('style');
        $(playerElem).css(scene.style);
    }
    var name = scene.name.replace(/^GUIscene/, '').replace(/([A-Z]|[\d]+)/g, ' $1').trim();
    sceneNameElem.textContent = name;

    mediaObjectQueue.setScene(scene, {hardReset: true});
    mediaObjectQueue.setTagMatcher(new TagMatcher());
    themeNameElem.textContent = '';
    showThemeName('');

    /*var themeName = getRandomThemeName(scene);
    var themeQuery = '';
    if (themeName) {
        themeQuery = scene.themes[themeName];
        showThemeName(themeName);
    } else {
        themeNameElem.textContent = '';
        showThemeName('');
    }
	*/
    //mediaObjectQueue.setTagMatcher(new TagMatcher(themeQuery));

    randomVisualPlayer.start();
    randomAudioPlayer.start();
}

function nextScene() {
    var delay,
        sceneToLoad = sceneList[currentSceneIndex];

		console.log("nextScene()");

		console.log("sceneList.length: " + sceneList.length);
		console.log("currentSceneIndex: " + currentSceneIndex);

    socket.emit('loadScene', sceneToLoad, handleError(function(scene) {
        if (scene && scene._id !== sceneList[currentSceneIndex]) {
            // this handler may be triggered with older request, so make sure request is still valid for the current scene
            console.log('server responded too late with scene "' + scene.name + '", just gonna ignore it');
        } else {
            if (! scene) {
                showError('Attempted to load scene "' + sceneToLoad + '" but it could not be found.');
                delay = 1000;
            } else {
                playScene(scene);

                delay = (Number(scene.sceneTransition) || 15) * 1000;
            }

			console.log("nextScene(), delay: " + delay);

            if (sceneList.length > 1) {
				console.log("Incrementing");
                currentSceneIndex++;
                // loop back to beginning when we reach the end
                if (currentSceneIndex == sceneList.length) {
					console.log("Setting currentSceneIndex = 0");
                    currentSceneIndex = 0;
                }

                if (sceneDisplayTimeout) {
					console.log("calling clearTimeout(sceneDisplayTimeout)");
                    clearTimeout(sceneDisplayTimeout);
                }
                sceneDisplayTimeout = setTimeout(function() {
					console.log("calling nextScene()");
                    nextScene();
                }, delay);
            }

        }

    }));

}

function showScenes (newSceneList) {
    if (sceneDisplayTimeout) {
        clearTimeout(sceneDisplayTimeout);
    }

	if(newSceneList)
	{
		if(newSceneList.length == 1) { //AJF: if a single scene is received then just invoke a player that plays everything.
			sceneList=newSceneList;
			socket.emit('loadScene', sceneList[0], handleError(function(scene) { playSceneAJFTesting(scene) }));
		} else if (
            newSceneList.length > 1) {
            sceneList = _.shuffle(newSceneList);
            currentSceneIndex = 0;
            nextScene();
        } else {
            showError('No scenes attached to selected node.');
        }
	}
}

function handleError (func, errorHandler) {
    return function() {
        // error
        if ( arguments[0] ) {
            showError(arguments[0]);
            if ( errorHandler ) {
                errorHandler.call(this, arguments[0]);
            }
        } else {
            var args = Array.prototype.slice.call(arguments, 1);
            func.apply(this, args);
        }
    };
}

function tryLogin (auth) {
    submitBtn.disabled = true;
    submitBtn.value = 'Logging in';

    socket = io(process.env.MEDIA_HUB, {forceNew: true});
    socket.on('connect', function() {
        var cleanup = function() {
            submitBtn.disabled = false;
            submitBtn.value = 'Submit';
        };

        socket.emit('auth', auth, handleError(function(token) {
            console.log('Logged in: ' + token)
            localStorage.setItem('token', token);
            login.style.opacity = 0;
            playerElem.className = 'player-on'
            cleanup();

            var roomId = getParameterByName('room');

            socket.emit('register', "/#" + roomId);

            // show demo scene right out the gate
            //socket.emit('loadSceneByName', 'GUIsceneTeaser', handleError(playScene)); //TODO decide if we want to load one on start
        }, cleanup));
    });

    socket.on('command', function(data) {

        console.log("COMMAND: ", data);

        if (data.name === 'showScenes') {
            showScenes(data.value);
        } else {
            showError('Recieved unknown command from hub: ' + data.name);
        }
    });
}

form.addEventListener('submit', function(event) {
    event.preventDefault();
    tryLogin({password: this.password.value});
    form.password.value = '';
});

if (localStorage.getItem('token')) {
    tryLogin({token: localStorage.getItem('token')});
}

// force reload every hour just to be safe
setTimeout(function() {
    location.reload();
}, 1000 * 60 * 60); // 1 hr

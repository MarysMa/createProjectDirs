/**
 * [description]
 * @param         {string} id     [id which is the parent node of keyframes images]
 * @param         {object} params  [the option of the instance]
 * @author        Marys Ma
 * @createdate    2017-08-22
 * @lastdate      2017-08-24
 * @version       1.0.2
 */
//HOW TO USE
/**
 * <div class="rabbit_a" id="rabbit1">
 *   <img src="./images/rabbit1/rabbit_01.png" alt="rabbit">
 *   <img src="./images/rabbit1/rabbit_02.png" alt="rabbit">
 *</div>
 *
 * var frame = new KeyframesPlayer('rabbit1', {
 * 		isLoop:true
 * });
 *
 * options:
 * 				 isLoop(type:Boolean, default:false): Whether to play loop,
 * 		isAlternate(type:Boolean, default:false): Whether to roll back,
 * 			 autoPlay(type:Boolean, default:false): Whether auto to play,
 * 			 		speed(type:int Number, default:10): set the speed of playing,
 * 			   							playEnd(type:Function): set the function when the end of playing.
 * 			   																			it only useful when the isLoop = false
 *
 * export Function:
 * 		 		play[ (instance).play() ]: let the keyframes play,
 * 	 	  	stop[ (instance).stop() ]: let the keyframes stop,
 * 	destroy[ (instance).destroy() ]: destroy the instance ,clear the timeout, it must be used when you with no need for the animation.
 */

(function() {
	'use strict';

	function KeyframesPlayer(id, params) {
		if (!id || typeof id !== 'string') throw new Error("the id of parent node is not defined");
		var parent_dom = document.getElementById(id);
		if (!parent_dom) throw new Error("the parent node is not exist");
		var _keyframes = parent_dom.getElementsByTagName('img');

		if (!(this instanceof KeyframesPlayer)) return new KeyframesPlayer(id, params);
		var defaults = {
			isLoop: false,
			speed: 10,
			autoPlay: false,
			isAlternate: false,
			isPlay: false,
			frameId: null,
			keyframes: _keyframes
		};

		params = params || {};

		for (var def in defaults) {
			if (typeof params[def] === 'undefined') {
				params[def] = defaults[def];
			}
		}

		var $_ = this;
		$_.params = params;

		$_.render = (function() {
			var eq = 0,
				flag = 1,
				speed = $_.params.speed;
			return function() {
				if ($_.params.isPlay) {
					speed--;
					if (!speed) {
						speed = $_.params.speed;
						for (var i = 0; i < _keyframes.length; i++) {
							if (i === eq) {
								_keyframes[i].style.opacity = 1;
							} else {
								_keyframes[i].style.opacity = 0;
							}
						}

						if ($_.params.isAlternate) {
							if (eq === (_keyframes.length - 1)) flag = -1;
							else if (eq === 0) flag = 1;
							eq += flag;
						} else {
							if (eq === (_keyframes.length - 1)) {
								if ($_.params.isLoop) eq = 0;
								else {
									$_.clearTimer();
									$_.params.playEnd && $_.params.playEnd();
									return false;
								};
							} else eq++;
						}

					}
				}
				$_.params.frameId = _requestAFrame($_.render);
			}
		})();
		$_.clearTimer = function() {
			_cancelAFrame($_.params.frameId);
		}
		$_.init = function() {
			if ($_.params.autoPlay) {
				$_.params.isPlay = true;
				$_.render();
			}
		}
		$_.init();
	}
	var _requestAFrame = (function() {
		return window['requestAnimationFrame'] ||
			window['webkitRequestAnimationFrame'] ||
			function(c) {
				return setTimeout(c, 1000 / 60);
			}
	})();
	var _cancelAFrame = (function() {
		return window['cancelRequestAnimationFrame'] ||
			window['cancelAnimationFrame'] ||
			window['webkitCancelRequestAnimationFrame'] ||
			window['webkitCancelAnimationFrame'] ||
			function(id) {
				clearTimeout(id);
			};
	})();

	/*prototype*/
	KeyframesPlayer.prototype.play = function() {
		if (!this.params.isPlay) this.params.isPlay = true;
	}
	KeyframesPlayer.prototype.stop = function() {
		this.params.isPlay = false;
	}
	KeyframesPlayer.prototype.destroy = function() {
		this.params.isPlay = false;
		for (var i = 0; i < this.params.keyframes.length; i++) {
			this.params.keyframes[i].style.opacity = 0;
		}
		this.clearTimer();
	}

	window.KeyframesPlayer = KeyframesPlayer;
})()

if (typeof(module) !== 'undefined') {
	module.exports = window.KeyframesPlayer;
} else if (typeof define === 'function' && define.amd) {
	define([], function() {
		'use strict';
		return window.KeyframesPlayer;
	});
}
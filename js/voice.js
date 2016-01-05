/**
 * Modified from:
 * Francium Voice plugin 0.4 (23 Dec 2015)
 * Copyright Subin Siby - http://subinsb.com
 * 
 * ---------------------
 * Licensed under Apache
 * ---------------------
 * 
 * A JavaScript plugin to record, play & download microphone input sound from the user.
 * NEEDS recorder.js and recorderWorker.js to work - https://github.com/mattdiamond/Recorderjs
 * 
 *
 * Full Documentation & Support - http://subinsb.com/html5-record-mic-voice
*/

(function(window){
  window.Fr = window.Fr || {};
	Fr.voice = {
    workerPath: "js/recorderWorker.js",
    stream: false,
    
    init_called: false,
    
    /**
     * Initialize. Set up variables.
     */
    init: function(){
    	try {
    		// Fix up for prefixing
    		window.AudioContext = window.AudioContext||window.webkitAudioContext;
    		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    		window.URL = window.URL || window.webkitURL;
    		if(navigator.getUserMedia === false){
          alert('getUserMedia() is not supported in your browser');
    		}
    		this.context = new AudioContext();
    	}catch(e) {
    		alert('Web Audio API is not supported in this browser');
    	}
    },
    
    /**
     * Start recording audio
     */
    record: function(callback){
    	callback = callback || function(){};
      if(this.init_called === false){
    		this.init();
    		this.init_called = true;
    	}
      $that = this;
    	navigator.getUserMedia({audio: true}, function(stream){
    		var input = $that.context.createMediaStreamSource(stream);
        input.connect($that.context.destination);
    		$that.recorder = new Recorder(input, {
          workerPath : $that.workerPath
    		});
    		$that.stream = stream;
    		$that.recorder.record();
    		callback(stream);
    	}, function() {
    		alert('No live audio input');
    	});
    },
    
    /**
     * Stop recording audio
     */
    stop: function(){
    	this.recorder.stop();
    	//this.recorder.clear();
    	/*this.stream.getTracks().forEach(function (track) {
        track.stop();
      });*/
    	return this;
    },
    
    /**
     * Export the recorded audio to different formats :
     * BLOB, Base64, BLOB URL
     */
    export: function(callback, type){
        this.recorder.exportWAV(function(blob) {
          if(type == "" || type == "blob"){
            callback(blob);
          }else if (type == "base64"){
            var reader = new window.FileReader();
            reader.readAsDataURL(blob); 
            reader.onloadend = function() {
              base64data = reader.result;            
              callback(base64data);
            };
          }else if(type == "URL"){
            var url = URL.createObjectURL(blob);
            callback(url);
          }
        });
    }
  };
})(window);

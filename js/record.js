$(document).ready(function(){
  $(document).on("click", "#record:not(.disabled)", function(){
    elem = $(this);
    voice.record(function(){
      $("#time").timer({
        action:'start',
        seconds: 0,
        format:'%M:%S'
      });
      $("#time").addClass("badge-important");
      elem.addClass("disabled");
      $("#stop").removeClass("disabled");
    });
  });
  
  $(document).on("click", "#stop:not(.disabled)", function(){
    $(this).addClass("disabled");
    voice.stop();
    $("#time").timer('pause');
    $("#time").removeClass("badge-important");
    $("#download").removeClass("disabled");
    $("#play").removeClass("disabled");
    $("#clear").removeClass("disabled");
  });
  
  $(document).on("click", "#play:not(.disabled)", function(){
    voice.export(function(url){
      $("#audio").attr("src", url);
      $("#audio")[0].play();
    }, "URL");
  });
  
  $(document).on("click", "#download:not(.disabled)", function(){
    voice.export(function(url){
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = "MyRecording.wav";
      a.click();
      setTimeout(function(){
	document.body.removeChild(a);
	window.URL.revokeObjectURL(url);  
      }, 100);  
    }, "URL");
  });
});
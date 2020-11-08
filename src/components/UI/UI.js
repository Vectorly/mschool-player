/**
 * Created by sam on 1/16/16.
 */





module.exports = function (elementID, vvid, clock, options) {

    var ui = this;

    options = options || {};

    require('../../lib/jquery-ui.min.js');


    var limit = clock.limit;

    ui.elements = {};
    ui.elements.container = document.getElementById(elementID);

    $(ui.elements.container).empty();

    ui.update = update;


    ui.controlsHidden = options.hideControls || false;


    ui.isFullScreen = false;


    //ui.paper  = require('paper');
  //  window.paper = ui.paper;



    ui.width = options.width || 800;
    ui.height = options.height || 450;
    ui.resize = resize;



    setHTML();
    setImages();
    setCSS();
    setEventHandlers();
    setScroll();
    setControlsInterface();


    if(options.fullscreen) ui.requestFullScreen();
    else resize(ui.height, ui.width);


    function setScroll(){

        ui.scroll = {

            to: scrollTo,
            setListener: toListener,
            listeners: [],
            onSeek: onSeek

        };


        function onSeek(targetTime){

            var highestTime = 0;
            var scrollToValue  = 0;

            ui.scroll.listeners.forEach(function (scrollListener) {
                if(scrollListener.time < targetTime){
                    highestTime = scrollListener.time;
                    scrollToValue = scrollListener.to;
                }
            });

            ui.scroll.to(scrollToValue);

        }

       function toListener(time, scrollToValue) {

            ui.scroll.listeners.push({
               time: time,
               to: scrollToValue
            });
        }


        function scrollTo(toScrollTo){

            $(ui.elements.canvasContainer).scrollTop(toScrollTo);
        }


    }


    function setHTML(){




        var hideScrollBar = createElement("hide-scroll-bar");
        var canvasContainer = createElement("canvas-container");



        var screen = createElement("screen");

        var svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");





        $(canvasContainer).scroll(function(e) {
           e.preventDefault();
        });




        svg.id = "canvas";




        ui.elements.canvasContainer  =canvasContainer;
        ui.elements.canvas = svg;


        var controls = createElement("controls");
        var trackbar = createElement("trackbar");
        var line = createElement("track-line");
        var dot = createElement("track-dot");
        var timestamp = createElement("timestamp");
        var trackprogress = createElement("track-progress");
        var logoText = createElement("logotext");

        var volume_line = createElement("volume-line");
        var volume_dot = createElement("volume-dot");
        var volume_bar = createElement("volume-bar");


        volume_bar.appendChild(volume_line);
        volume_bar.appendChild(volume_dot);




        logoText.appendChild(document.createTextNode("dot Learn"));


        trackbar.appendChild(trackprogress);
        trackbar.appendChild(line);
        trackbar.appendChild(dot);


        controls.appendChild(volume_bar);
        controls.appendChild(trackbar);
        controls.appendChild(timestamp);
        controls.appendChild(logoText);

        if(ui.controlsHidden) controls.style.display = "none";


        var cursor = document.createElement("img");
        cursor.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAACqCAYAAAA9dtSCAAABxUlEQVR42u3aQQ3DMAxA0UAKgB3KoBAGJVAC1VUAtNq0dKri9yQTcL5ycil8JCJ6zNdsFqEiVKEiVBAqQhUqQgWhIlShIlQQKkIVKkJFqEJFqCBUhCpUhApCRahCRaggVIQqVIQKQkWoIFSEKlSECkJFqEJFqCBUhCpUhApCRahCRagIVagIFYSKUIWKUEGoCFWoCBWEilCFilARqlARKggVoQoVoYJQEapQESoIFaEKlX+Fuo+wJs9mswAAAAAAAAAAAFy44XTtyVMXerct09uVyOW92AeThlCFKlShClWoQhWqUIUqVKEKVahCFapQhSpUoQpVqEIVqlCFKlShClWoQhWqUIUqVKEKVahCFapQhSpUoQpVqEIVqlCF+kWoPdG8Fgp1z/R2BQAAAAAAAAAAAM6NE8Fxzzp5qs0yO9R+wz1ws1mEilCFilBBqAhVqAgVhIpQhYpQQagIVagIFaEKFaGCUBGqUBEqCBWhChWhglARqlARKggVoYJQEapQESoIFaEKFaGCUBGqUBEqCBWhChWhIlShIlQQKkIVKkIFoSJUoSJUECpCFSpCRahCRaggVIQqVIQKQkWoQkWoIFSEKtTfHG0UML4vD0shAAAAAElFTkSuQmCC";
        if(vvid.json.background && (vvid.json.background.toUpperCase() === "#FFFFFF")) cursor.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAACqCAYAAAA9dtSCAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QwSEwsTVwaVrgAAAZJJREFUeNrt3cEJwjAYhuGv0k1cQ9BNHCWj1BF0BDeoAwhuUico5JCDJs8DuQby5z2GNqHWkmRrvIqx1jkYAUIFoSJUECoIFaGCUEGoCBWECkJFqCBUhApCBaEiVBAqCBWhglBBqAgVhIpQQaggVIQKQgWhIlQQKggVoYJQQagIFYSKUEGoIFSECkIFoSJUECoIFaGCUBEqCBWEilBBqCBUhApChR2zEVS7J/k03vNprAAAAAAAAAAAAOybkpSBzvtIsnZylkuS80ixbgOta0f3Vka6Oy/8+QtCRaggVIQKQgWhIlQQKggVoYJQQagIFYSKUEGoIFSECr9gTnIb6Lzvjs6yDnZ3AAAAAAAAAAAAA5qMoNopybHxnq/0808BfsSS9t+mL8Zaxwt/hApCRaggVBAqQgWhglARKggVhIpQQagIFYQKQkWoIFQQKkIFoYJQESoIFaGCUEGoCBWECkJFqCBUECpCBaGCUBEqCBWhglBBqAgVhApCRaggVBAqQgWhIlQQKggVoYJQQagIFYQKe77g06tS6aMivAAAAABJRU5ErkJggg==";
        cursor.style.display = "none";
        cursor.style.position = "absolute";
        cursor.style.height = (25*ui.height/900) + "px";
        cursor.style.zIndex = "70";



        screen.appendChild(cursor);
        screen.appendChild(svg);

        canvasContainer.appendChild(screen);
        hideScrollBar.appendChild(canvasContainer);

        ui.elements.cursor = cursor;

        ui.elements.container.appendChild(hideScrollBar);
        ui.elements.container.appendChild(controls);

    }

    function resize(height, width, targetFullScreen) {


        var svg = ui.elements.canvas;

        svg.setAttribute("width", width);
        svg.setAttribute("height", height * 10);

        svg.width = width;
        svg.height = height*10;

        ui.height = height;
        ui.width = width;



        ui.elements["canvas-container"].style.height = height + "px";
        ui.elements["hide-scroll-bar"].style.height = height + "px";

        ui.elements["canvas-container"].style.width = width + "px";
        ui.elements["hide-scroll-bar"].style.width = width + "px";
        ui.elements["screen"].style.width = width + "px";

        ui.elements.controls.style.width = width + "px";

/*
        TODO
        Fix fullscreen issue with firefox (and make sure it works with chrome)
        When fullscreen, firefox makes the video position on the left of the screen, and not centered

        if(targetFullScreen){
            ui.elements["hide-scroll-bar"].style.left= (screen.availWidth -width)/2 + "px";
            ui.elements.controls.style.left = (screen.availWidth -width)/2 + "px";
        } else{
            ui.elements["hide-scroll-bar"].style.left= 0;
            ui.elements.controls.style.left = 0;
        }

*/
        var controlsHeight = height*0.12;

        ui.elements.container.style.width = width + "px";
        ui.elements.container.style.height= height + "px";

        ui.elements.trackbar.style.height = controlsHeight*0.2 + "px";
        ui.elements.trackbar.style.top = controlsHeight*-0.2 + "px";

        ui.elements["track-dot"].style.height = controlsHeight*0.3 + "px";
        ui.elements["track-dot"].style.width = controlsHeight*0.3 + "px";
        ui.elements["track-dot"].style.borderRadius = controlsHeight*0.3 + "px";


        ui.elements.play.style.height = controlsHeight+ "px";
        ui.elements.pause.style.height = controlsHeight + "px";
        ui.elements.play.style.padding = controlsHeight*0.15 + "px";
        ui.elements.pause.style.padding = controlsHeight*0.15 + "px";

        ui.elements.fullscreen.style.height = controlsHeight + "px";
        ui.elements.fullscreen.style.padding = controlsHeight*0.1 + "px";

        ui.elements.logo.style.height = controlsHeight+ "px";
        ui.elements.logo.style.padding = controlsHeight*0.2 + "px";
        ui.elements.logo.style.right =  controlsHeight*2.9 + "px";

        ui.elements.logotext.style.fontSize = controlsHeight*0.35 + "px";
        ui.elements.logotext.style.top= controlsHeight*0.30 + "px";
        ui.elements.logotext.style.width =  controlsHeight*1.8 + "px";
        ui.elements.logotext.style.right =  controlsHeight + "px";


        ui.elements.volume.style.left = controlsHeight + "px";
        ui.elements.volume.style.height = controlsHeight+ "px";
        ui.elements.volume.style.padding = controlsHeight*0.2 + "px";

        ui.elements['volume-bar'].style.left  = controlsHeight*2 + "px";
        ui.elements['volume-bar'].style.width  = controlsHeight*2 + "px";


        ui.elements["volume-line"].style.left = controlsHeight*0.2 + "px";
        ui.elements["volume-line"].style.right = controlsHeight*0.2 + "px";


        ui.elements["volume-dot"].style.height = controlsHeight*0.2 + "px";
        ui.elements["volume-dot"].style.width = controlsHeight*0.2 + "px";
        ui.elements["volume-dot"].style.borderRadius = controlsHeight*0.2 + "px";


        ui.elements.timestamp.style.fontSize = controlsHeight*0.32 + "px";
        ui.elements.timestamp.style.left = controlsHeight*4 + "px";
        ui.elements.timestamp.style.padding = controlsHeight*0.32 + "px " + controlsHeight*0.40 + "px";

        ui.onResizeListenerExecute();


        setVolumeTracker(ui.volume || 100);

        setTimeout(function(){
            setTracker(clock.time);       // Relies on UI repainting to get updated with of tracker timeline, so wait 100ms
        }, 200);


    }

    function setCSS(){

       var css = require('./css');

        Object.keys(css).forEach(function (key) {
            $(ui.elements[key]).css(css[key]);
        });


        if(options.defaultBackgroundColor){
            $(ui.elements.canvas).css("backgroundColor", options.defaultBackgroundColor);
        }

        if(vvid.json.background){
            $(ui.elements.canvas).css("backgroundColor", vvid.json.background);
        }



        $("head").prepend("<style type=\"text/css\">" +
            "@font-face {font-family: \"OpenSans\"; src: url('fonts/OpenSans.ttf');}" +
            "@font-face {font-family: \"GreatVibes\"; src: url('fonts/GreatVibes.ttf');}" +
            "@font-face {font-family: \"PermanentMarker\"; src: url('fonts/PermanentMarker.ttf');}" +
            "@font-face {font-family: \"Rancho\"; src: url('fonts/Rancho.ttf');}" +
            "</style>");

    }





    function setImages(){

        var play = document.createElement("img");
        play.id = "play";
        play.src = require('./icons/playIcon');
        ui.elements.play = play;

        var pause = document.createElement("img");
        pause.id = "pause";
        pause.src = require('./icons/pauseIcon');
        ui.elements.pause = pause;


        var logo  = document.createElement("img");
        logo.id = "logo";
        logo.src = require('./icons/dotlearnIcon');
        ui.elements.logo = logo;

        var fullscreen = document.createElement("img");
        fullscreen.id = "fullscreen";
        fullscreen.src = require('./icons/fullsize');
        ui.elements.fullscreen = fullscreen;

        var volume = document.createElement("img");
        volume.id = "volume_icon";

        volume.src = require("./icons/volume_button");
        ui.elements.volume = volume;


        ui.elements.controls.appendChild(volume);
        ui.elements.controls.appendChild(logo);
        ui.elements.controls.appendChild(play);
        ui.elements.controls.appendChild(pause);
        ui.elements.controls.appendChild(fullscreen);
    }




    function setControlsInterface() {

        ui.play = function () {
            $(ui.elements.play).click();
        };

        ui.pause = function () {
            $(ui.elements.pause).click();
        };

        ui.seek = function (time) {

            clock.setTime(time);
            update(time);

            ui.onSeekListenerExecute();
            ui.scroll.onSeek(time);

        };
    }
    function setVolumeTracker(volume) {

        var trackWidth = $(ui.elements["volume-line"]).width();
        var offset = $(ui.elements["volume-line"]).position().left;

        var position = (volume/100) * trackWidth;

        $(ui.elements["volume-dot"]).css('left', position + offset);

    }





    function setEventHandlers(){

        var play = ui.elements.play;
        var pause = ui.elements.pause;

        ui.onPlayListenerQueue = [];
        ui.onPauseListenerQueue = [];
        ui.onSeekListenerQueue = [];
        ui.onEndListenerQueue = [];
        ui.onResizeListenerQueue = [];
        ui.onVolumeChangeListenerQueue = [];

        ui.requestFullScreen = function(){


            if(ui.isFullScreen){
                if(document.exitFullscreen) document.exitFullscreen();
                else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                else if(document.webkitExitFullscreen)document.webkitExitFullscreen();
                else{
                    console.log("fullscreen not supported");
                }

                resize(options.height || 450, options.width || 800);
            } else if((document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement)) {

                if(document.exitFullscreen) document.exitFullscreen();
                else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                else if(document.webkitExitFullscreen)document.webkitExitFullscreen();
                else{
                    console.log("fullscreen not supported");
                }

                resize(options.height || 450, options.width || 800);
            } else {

                if(ui.elements.container.requestFullscreen)ui.elements.container.requestFullscreen();
                else if (ui.elements.container.mozRequestFullScreen)ui.elements.container.mozRequestFullScreen();
                else if(ui.elements.container.webkitRequestFullscreen)ui.elements.container.webkitRequestFullscreen();
                else{
                    console.log("fullscreen not supported");
                }


                var targetH;
                var targetW;
                var heightWithControls;

                if(ui.controlsHidden) heightWithControls = screen.height;
                else if($.browser.webkit) heightWithControls = screen.height/1.288;
                else heightWithControls = screen.height/1.144;


                if(screen.width*9 >= heightWithControls*16) {
                    targetH = heightWithControls;
                    targetW = heightWithControls*16/9;
                } else{
                    targetW = screen.width;
                    targetH = targetW*9/16;
                }


                resize(targetH, targetW, !ui.isFullScreen);

            }

            ui.isFullScreen = !ui.isFullScreen;
        };

        ui.onFullscreen = function () {

            ui.requestFullScreen();

        };

        function onFullscreenChange () {

           if(!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement)) {
               resize(options.height || 450, options.width || 800);
               ui.isFullScreen = false;
           }
        }

        document.addEventListener("fullscreenchange", onFullscreenChange);
        document.addEventListener("mozfullscreenchange", onFullscreenChange);
       document.addEventListener("webkitfullscreenchange", onFullscreenChange);




        ui.onPauseListener = function () {};

        ui.onVolumeChange = function(fn) {ui.onVolumeChangeListenerQueue.push(fn);}
        ui.onResize = function (fn) {ui.onResizeListenerQueue.push(fn);};
        ui.onPause = function (fn) {ui.onPauseListenerQueue.push(fn);};
        ui.onPlay = function (fn) {ui.onPlayListenerQueue.push(fn);};
        ui.onSeek = function (fn) {ui.onSeekListenerQueue.push(fn);};
        ui.onEnd = function (fn) {ui.onEndListenerQueue.push(fn);};


        ui.onPlayListenerExecute = function(){ui.onPlayListenerQueue.forEach(function (fn) {fn();});};

        ui.onPauseListenerExecute = function(){ui.onPauseListenerQueue.forEach(function (fn) {fn();});};

        ui.onSeekListenerExecute = function () {ui.onSeekListenerQueue.forEach(function (fn) {fn(clock.time);});};

        ui.onEndListenerExecute = function () { ui.onEndListenerQueue.forEach(function (fn) {fn();})};

        ui.onResizeListenerExecute = function () { ui.onResizeListenerQueue.forEach(function (fn) {fn(ui.height, ui.width);})};
        ui.onVolumeChangeListenerExecute  = function () { ui.onVolumeChangeListenerQueue.forEach(function (fn) {fn(ui.volume);})};

        $(ui.elements.fullscreen).click(function () {
           ui.onFullscreen();
        });

        $(play).click(function () {

            ui.onPlayListenerExecute(clock.time);

            clock.start();
            $(pause).css("visibility", "visible");
            $(play).css("visibility", "hidden");
        });


        $(pause).click(function () {
            ui.onPauseListenerExecute();

            clock.stop();
            $(play).css("visibility", "visible");
            $(pause).css("visibility", "hidden");
        });


        ui.setVolume = function (volume) {

            ui.volume = volume;

            setVolumeTracker(volume);

            ui.onVolumeChangeListenerExecute();

        };



        ui.setTracker = function (per) {
            var trackWidth = $(ui.elements["track-line"]).width();
            var position = (per/1000) * trackWidth;
            $(ui.elements["track-dot"]).css('left', position);

            $(ui.elements["track-progress"]).css('width', position +  'px');

        };


        ui.setTime = function (string) {
            ui.elements.timestamp.innerHTML = string;
        };

        clock.onTick(update);

        ui.attach = function (div) {
          ui.elements.canvas.appendChild(div);
        };

        ui.reset = function () {


            ui.pause();
            ui.seek(0);

        };
        
        
        $("#trackbar").slider({
            min: 0,
            max:450,
            range: "min",
            animate: true,
            slide: function (event, a) {

                var percentage = (a.value)/4.50;

                if(percentage < 0) percentage= 0;
                if(percentage > 100) percentage = 100;

                var targetTime = Math.floor((clock.limit * (percentage/100))/clock.timestep)*clock.timestep;

                clock.setTime(targetTime);

                update(targetTime);


                ui.onSeekListenerExecute();

                ui.scroll.onSeek(targetTime);



            }
        });

        $("#volume-bar").slider({
            min: 0,
            max: 100,
            range: "min",
            animate: true,
            slide: function (event, a) {

                var percentage = (a.value - 10)/0.8;

                if(percentage < 0) percentage= 0;
                if(percentage > 100) percentage = 100;

                ui.setVolume(percentage);


            }
        });


        setTimeout(function () {

            $("#trackbar")[0].className = "";
            $("#trackbar").children()[2].className = "";
            $("#trackbar").children()[3].className = "";

        }, 300);



        clock.onFinished(ui.onEndListenerExecute);
        clock.onFinished(ui.reset);
    }

    ui.reset();
    ui.setVolume(100);

    

    function createElement(id, className){
        var div = document.createElement("div");

        if(id) div.id = id;
        if(className) div.className = className;

        ui.elements[id] = div;

        return div;

    }

    function update(time){

        setTime(time);
        setTracker(time);
    }




    function setTracker(time){

        var percentageComplete = Math.floor((time/limit)*1000);

        ui.setTracker(percentageComplete);
    }


    function setTime(time){
        var totalTime = formatTime(limit);
        var currentTime = formatTime(time);
        var timeString = currentTime + "/" + totalTime;

        ui.setTime(timeString);
    }





    return ui;



    function formatTime(ms){

        var m = 0;
        var s = 0;
        var mspmin = 1000*60;

        while(ms > mspmin){
            ms = ms -mspmin;
            m=m+1;
        }

        s = Math.floor(ms/1000);

        if(s < 10) s = "0" + s;

        return (m + ":" + s);

    }


};


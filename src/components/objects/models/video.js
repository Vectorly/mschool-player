/**
 * Created by sam on 1/16/16.
 */

function Video(json, app) {

    var Video = this;
    var params  = json.params;
    var video = instantiateVideo();
    var svgContainer;

    var actions = [];
    
    var duration;

    video.addEventListener("loadedmetadata", function(event) {

        duration = video.duration*1000;

    });

    Video.Actions = {

        play: function (action) {

            this.data = action;
            this.object = json;

            this.events = {

                fire: function () {
                    video.play();
                    svgContainer.setAttribute("visibility", "visible");
                    console.log("Now playing");
                },

                play: function(){

                    var time = app.clock.time;
                    if((time > action.time) && (time < (action.time + duration)) ){

                        video.currentTime = (time-  action.time)/1000;
                        video.play();

                    }
                },

                pause: function () {
                    video.pause();
                },

                seek: function () {



                        var time = app.clock.time;


                        if(time < action.time){
                            video.currentTime = 0;
                            video.pause();
                            svgContainer.setAttribute("visibility", "hidden");
                        } else if( time > (action.time + duration)){

                            video.currentTime = duration;
                            video.pause();
                            svgContainer.setAttribute("visibility", "hidden");
                        } else{
                            svgContainer.setAttribute("visibility", "visible");
                            video.currentTime = (time-  action.time)/1000;
                        }




                },

                end: function () {

                    video.currentTime = 0;
                    video.pause();
                    svgContainer.setAttribute("visibility", "hidden");

                }


            };



        }

    };



    json.actions.forEach(function (jsonAction) {

        actions.push(getAction(jsonAction));
    });

    Video.actions = actions;




    function getAction(action){
        var Action = Video.Actions[action.type];
        return new Action(action);
    }


    function instantiateVideo(){


        console.log("Instantiating video object");

        svgContainer =  document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        var video = document.createElement("video");

        video.className = "viewer";

        video.id = json.id;

        console.log("Creating blob");
        var  blob = toMP4(app.getFile(params.file));

        console.log("Loading from blob");
        loadURLFromBlob(video, blob);


        app.attach(svgContainer);

        svgContainer.appendChild(video);

        svgContainer.setAttribute("visibility", "hidden");

        video.onended = function () {
            video.currentTime = 0;
            video.pause();
            svgContainer.setAttribute("visibility", "hidden");
        };

        app.onSize(function () {

            svgContainer.setAttribute("x", app.scaledWidth(params.xy[0]));
            svgContainer.setAttribute("y", app.scaledHeight(params.xy[1]));
            svgContainer.setAttribute("width", app.scaledWidth(params.width));
            svgContainer.setAttribute("height", app.scaledHeight(params.height));

            video.style.width = app.scaledWidth(params.width) + "px";
            video.style.left=  app.scaledWidth(params.xy[0]) + "px";
            video.style.top =  app.scaledHeight(params.xy[1]) + "px";


            if(isChrome()){
                // Bug in chrome
                // Not sure why we have to do this
                $(video).width(app.scaledWidth(params.width) *$(video).position().left/$("#canvas").position().left)
            }

        });






        return video;
    }

}



function loadURLFromBlob(video, blob) {


    var xhr = new XMLHttpRequest();
    xhr.open("GET", URL.createObjectURL(blob));
    xhr.responseType = "blob";
    xhr.onreadystatechange = function () {


        if(xhr.readyState === 4 && xhr.status === 200){
            console.log("Blob successfully read in pass 2, creating object url");
            video.src = URL.createObjectURL(xhr.response);
        }
    };

    xhr.send();
}

function isChrome() {
    var isChromium = window.chrome,
        winNav = window.navigator,
        vendorName = winNav.vendor,
        isOpera = winNav.userAgent.indexOf("OPR") > -1,
        isIEedge = winNav.userAgent.indexOf("Edge") > -1,
        isIOSChrome = winNav.userAgent.match("CriOS");

    if (isIOSChrome) {
        return true;
    } else if (
        isChromium !== null &&
        typeof isChromium !== "undefined" &&
        vendorName === "Google Inc." &&
        isOpera === false &&
        isIEedge === false
    ) {
        return true;
    } else {
        return false;
    }
}



function toMP4(data){

    console.log("Creating new blob from UintArray");

    var l = data.length;
    var array = new Uint8Array(l);
    for (var i = 0; i < l; i++) {
        array[i] = data.charCodeAt(i);
    }

    var blob = new Blob([array], {type: 'video/mp4'});

    return blob;

}


module.exports = Video;
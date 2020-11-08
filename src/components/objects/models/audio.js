/**
 * Created by sam on 1/16/16.
 */

function Audio(json, app) {

    var Audio = this;
    var params  = json.params;
    var audio = instantiateAudio();

    var actions = [];
    var AMR = {};
    var AMR = require('./lib/amrnb');

    var duration;

    app.attach(audio);

    audio.addEventListener("loadedmetadata", function(event) {

        duration = audio.duration*1000;

    });

    Audio.Actions = {

        play: function (action) {

            this.data = action;
            this.object = json;

            this.events = {

                fire: function () {
                    audio.play();
                    app.clock.setAudio(audio);
                    app.clock.lastStopTime = action.time;


                    if(audio._buffer){

                        audio.endOfPlayback = function () {
                            app.clock.setAudio(null);
                        };

                    } else{

                        audio.addEventListener('ended', function () {
                            app.clock.setAudio(null);
                        });

                    }



                },

                volume: function (volume) {

                    audio.volume = volume/100;
                },

                play: function(){

                    var time = app.clock.time;
                    if((time > action.time) && (time < (action.time + duration)) ){


                        audio.currentTime = (time-  action.time)/1000;
                        audio.play();

                    }
                },

                pause: function () {
                    audio.pause();
                },

                seek: function () {

                    var time = app.clock.time;

                    if(time < action.time){
                        audio.currentTime = 0;

                        audio.pause();
                    } else if( time > (action.time + duration)){

                        audio.currentTime = duration;
                        audio.pause();
                    } else{


                        app.clock.setAudio(audio);
                        app.clock.lastStopTime = action.time;

                        audio.addEventListener('ended', function () {
                            app.clock.setAudio(null);
                        });


                        if(app.clock.ticking) audio.pause();

                        audio.currentTime = (time-  action.time)/1000;
                        if(app.clock.ticking) audio.play();
                    }

                },

                end: function () {

                    audio.currentTime = 0;
                    audio.pause();

                }


            };



        }

    };





    json.actions.forEach(function (jsonAction) {

        actions.push(getAction(jsonAction));
    });

    Audio.actions = actions;




    function getAction(action){
        var Action = Audio.Actions[action.type];
        return new Action(action);
    }


    function instantiateAudio(){



        var audio = document.createElement("audio");
        audio.id = "audio";
        audio.className = "viewer";

        console.log("Converting audio blob to mp3");
        var  blob = toMP3(app.getFile(params.file));

        console.log("Param file name");
        console.log(params.file);

        loadURLFromBlob(blob);


        console.log("Audio blob");
        console.log(blob);


        console.log("Loading audio blob as source");
 
        audio.volume = app.volume/100;

        audio.onerror = function () {
            console.log("Audio blob had an error, most likely because the audio file is not mp3");

            console.log(audio.error);
            console.log(JSON.stringify(audio.error));
            console.log(audio.error.code);
            // If file is AMR-NB, will return error code 4
            if(audio.error.code == 4) return loadAMRNB(blob);

        };


        return audio;
    }




    function loadURLFromBlob(blob) {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", URL.createObjectURL(blob));
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200){

                audio.src = URL.createObjectURL(xhr.response);
            }
        };

        xhr.send();
    }

    function loadAMRNB(blob){

        //Convert AMR-NB to WAVf

        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);

            var samples = AMR.decode(data);

            var waveBlob = exportWAV(samples);

            loadURLFromBlob(waveBlob);


        };
        reader.readAsArrayBuffer(blob);

    }


}




function exportWAV(buffer){

    var dataview = encodeWAV(buffer);
    var audioBlob = new Blob([dataview], { type: 'audio/wav' });

  return audioBlob;
}



function floatTo16BitPCM(output, offset, input){
    for (var i = 0; i < input.length; i++, offset+=2){
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}


function encodeWAV(samples){
    var buffer = new ArrayBuffer(44 + samples.length * 2);
    var view = new DataView(buffer);

    var sampleRate = 8000;

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 32 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    //view.setUint16(22, 2, true); /*STEREO*/
    view.setUint16(22, 1, true); /*MONO*/
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    //view.setUint32(28, sampleRate * 4, true); /*STEREO*/
    view.setUint32(28, sampleRate * 2, true); /*MONO*/
    /* block align (channel count * bytes per sample) */
    //view.setUint16(32, 4, true); /*STEREO*/
    view.setUint16(32, 2, true); /*MONO*/
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    floatTo16BitPCM(view, 44, samples);

    return view;
}


function writeString(view, offset, string){
    for (var i = 0; i < string.length; i++){
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}



function toMP3(data){

    var l = data.length;
    var array = new Uint8Array(l);
    for (var i = 0; i < l; i++) {
        array[i] = data.charCodeAt(i);
    }


    var blob = new Blob([array], {type: 'audio/mpeg'});

    return blob;

}


module.exports = Audio;
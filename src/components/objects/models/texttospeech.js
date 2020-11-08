/**
 * Created by sam on 1/18/16.
 */
/**
 * Created by sam on 1/16/16.
 */


function TextToSpeech(json, app) {


    var SpeakRate = 1/55;      // 1 character per  ~55 ms   (trial and error)


    var TTS = this;
    var params  = json.params;
    var speech = instantiateTTS(params);
    var actions = [];

    var duration = params.text/SpeakRate;


    TTS.Actions = {

        play: function (action) {

            this.data = action;
            this.object = json;

            this.events = {

                fire: function () {



                },

                play: function(){
                    speechSynthesis.resume();

                },

                pause: function () {
                    speechSynthesis.pause();
                },

                seek: function () {

                    var time = app.clock.time;

                    speechSynthesis.cancel();
                    var interpolated = interpolateSpeech(params.text, action.time, time);

                    speechSynthesis.speak(interpolated);


                    if(!app.clock.ticking)     speechSynthesis.pause();


                }


            };



        }

    };


    function interpolateSpeech(text, startTime, currentTime){


        var audioTime = currentTime - startTime;

        if (audioTime < 0) return null;

        if(audioTime > duration) return null;


        var charsIn = Math.round(audioTime*SpeakRate);


        var cutText = text.substring(charsIn);

        var u = new SpeechSynthesisUtterance();
        u.text = cutText;
        u.lang = 'en-GB';
        return u;


    }





    var startTime = 0;
    var endTime = 1;

    speech.onstart = function(event) {

        startTime = JSON.parse(JSON.stringify(app.clock.time));
    };


    speech.onend = function(event) {

        console.log("Start Time");
        console.log(startTime);


        console.log("End time");
        endTime =  JSON.parse(JSON.stringify(app.clock.time));
        console.log(endTime);

        console.log("Text length: ");
        console.log(params.text.length);
        console.log("Time it took");


        console.log(endTime - startTime);
        console.log("time per char");
        console.log((endTime - startTime) / params.text.length);


    };



    json.actions.forEach(function (jsonAction) {

        actions.push(getAction(jsonAction));
    });

    TTS.actions = actions;




    function getAction(action){
        var Action = TTS.Actions[action.type];
        return new Action(action);
    }


    function instantiateTTS(params){

        var u = new SpeechSynthesisUtterance();
        u.text = params.text;
        u.lang = 'en-GB';
        return u;
    }



}





module.exports = TextToSpeech;
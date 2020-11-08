/**
 * Created by sam on 1/18/16.
 */


module.exports =  (function () {

    function Clock(limit, timestep){


        var clockInterval;

        var clock = this;

        var time = 0;
        clock.lastStopTime= 0;
        var timestep = timestep || 100;
        clock.ticking = false;
        clock.audio = null;

        this.setTime = function (newTime) {

            this.setAudio(null);

            if(clock.ticking) {
                this.stop();
                this.time = newTime;
                this.lastStopTime = JSON.parse(JSON.stringify(newTime));
                this.start();
            } else {
                this.time = newTime;
                this.lastStopTime = JSON.parse(JSON.stringify(newTime));
            }

        };

        this.start = function () {


            clock.reference = Date.now();
            clock.ticking = true;
            tick();

        };

        this.setAudio = function (audio) {

            if(!audio  && this.audio){
                clock.lastStopTime = JSON.parse(JSON.stringify(clock.time));
                clock.reference = Date.now();
            }


            this.audio = audio;
        };


        this.stop = function () {


            clock.ticking = false;
            clearInterval(clockInterval);
            if(!clock.audio) clock.lastStopTime = JSON.parse(JSON.stringify(clock.time));

        };

        this.reset = function () {

            clock.ticking = false;
            clock.time = 0;
            clock.lastStopTime = 0;
        };



        this.onTick = function (listener) {
            onTickQueue.push(listener);
        };


        this.onFinished = function (listener) {
            onFinishedQueue.push(listener);
        };



        var onFinishedQueue = [];
        var onTickQueue = [];


        function onFinishedExecute(){

            onFinishedQueue.forEach(function (fn) {
                fn();
            });

        }

        function onTickExecute(){
            onTickQueue.forEach(function (fn) {
               fn(clock.time);
            });
        }





        function tick(){

            onTickExecute();

            clockInterval = setInterval(function () {

                if(clock.audio)clock.time = Math.round( clock.audio.currentTime*20)*50 + clock.lastStopTime;
                else{ clock.time = Math.round((Date.now() - clock.reference)/timestep)*timestep + clock.lastStopTime;}


                if(clock.time >= limit){
                    clock.stop();
                    onFinishedExecute();
                } else{
                    onTickExecute();
                }



            }, timestep);


        }


        clock.onFinished(clock.reset);







        clock.time = time;
        clock.timestep = timestep;
        clock.limit = limit;

    }



    return Clock;


})();
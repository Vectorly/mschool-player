/**
 * Created by sam on 1/16/16.
 */
module.exports =(function () {



    function EventManager(objectManager, clock, ui) {


        EventManager = this;
        var objects = objectManager.objects;


        var listeners = {
            render:[],
            fire: {}
        };

        EventManager.Events = {
            play: function (action) {
                ui.onPlay(function (time) {


                    action.events.play(time);

                });
            },

            pause: function (action) {
                ui.onPause(action.events.pause);
            },

            volume: function (action) {

                ui.onVolumeChange(action.events.volume);
            },

            resize: function (action) {
                ui.onResize(action.events.resize);
            },

            seek: function (action) {

                ui.onSeek(action.events.seek);
            },

            fire: function (action) {

                var roundedTime = Math.round(action.data.time/50)*50;

                if(!listeners.fire[roundedTime]) listeners.fire[roundedTime] = [];
                listeners.fire[roundedTime].push(action.events.fire);
            },

            render: function (action) {
                listeners.render.push(action.events.render);
            },

            end: function (action) {
              ui.onEnd(action.events.end);
            }
        };


        objects.forEach(function (object) {

            object.actions.forEach(function (action) {

                attachListeners(action);

            });
        });


        function attachListeners(action) {


            var Events = Object.keys(EventManager.Events);
            Events.forEach(function (Event) {

                if (action.events[Event]) EventManager.Events[Event](action);
            });



        }




        clock.onTick(function (time) {        //Event Cycle

            listeners.render.forEach(function (render) {
                render();
            });

            if(listeners.fire[time]) listeners.fire[time].forEach(function (fire) {
               fire();
            });

        });


    }




    return EventManager;



})();








/*
 function FireEvent(action){

 clock.onTick(function (time) {
 if(time == action.time) action.events.fire();
 });
 }

 function PauseEvent(action){




 }

 function PlayEvent(action){



 }


 function SeekEvent(action){


 }



 function RenderEvent(action){
 clock.onTick(function (time) {
 if(time == action.time) action.events.fire();
 });
 }


 */
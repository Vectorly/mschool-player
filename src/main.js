var vv = (function vv (){

    var $ = require('jquery-browserify');
    var UI = require('./components/UI/UI.js');
    var VVid = require('./components/file/VVid.js');
    var ObjectManager = require('./components/objects/ObjectManager.js');
    var EventManager = require('./components/events/EventManager.js');
    var Clock = require('./components/clock/Clock.js');
    var App = require('./components/app/App.js');
    var VideoInterface = require('./components/video/interface');

    /*
        Event manager
        - 1) Play, pause, end, seek, getTime

     */

    var ui;
    var vvid;
    var clock;
    var app;

    var vv ={
        load: load
    };


    var objectManager;
    var eventManager;





    function load(file, id, options){
        vvid = new VVid(file);
        options = options || {};

        vvid.onLoad(function () {
            setup(id, options);
            vv.meta = vvid.json;


            var videoInterface = new VideoInterface(vvid.json, ui, clock);

            if(options.autoplay) videoInterface.play();

            if(options.callback) options.callback(videoInterface);
        });

    }


    function setup(id, options){


        clock = new Clock(vvid.json.time, 50);
        ui = new UI(id, vvid, clock, options);

        app = new App(vvid, ui, clock);
        objectManager = new ObjectManager(vvid, app);
        eventManager = new EventManager(objectManager, clock, ui);



        ui.onSeekListenerExecute();    //Render first frame

    }



    return vv;
})();




module.exports = vv;



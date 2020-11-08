/**
 * Created by sam on 1/16/16.
 */


module.exports = (function ObjectManager(){

    var Audio = require('./models/audio.js');
    var Image = require('./models/image.js');
    var TextBox = require('./models/textbox.js');
    var Shape = require('./models/shape.js');
    var TextToSpeech =require('./models/texttospeech.js');
    var Line = require('./models/line.js');
    var Path = require('./models/path.js');
    var Scroll = require('./models/scroll.js');
    var Cursor = require('./models/cursor.js');
    var Video = require('./models/video');
    var AceCode = require('./models/code/code');

    var ObjectManager = function(vvid, app){


        var objects = vvid.json.objects;

        var om = this;
        om.objects = [];
        om.jsonObjects = objects;

        objects.forEach(function (object) {

            var iface = new app.Interface(object);

            var objectModel;

            switch (object.type) {
                case "text":
                    objectModel = new TextBox(object, iface);
                    break;
                case "image":
                    objectModel = new Image(object, iface);
                    break;
                case "shape":
                    objectModel = new Shape(object, iface);
                    break;
                case "audio":
                    objectModel = new Audio(object, iface);
                    break;
                case "scroll":
                    objectModel = new Scroll(object, iface);
                    break;
                case "line":
                    objectModel = new Line(object, iface);
                    break;
                case "path":
                    objectModel = new Path(object, iface);
                    break;
                case "tts":
                    objectModel = new TextToSpeech(object, iface);
                    break;
                case "cursor":
                    objectModel = new Cursor(object, iface);
                    break;
                case "video":
                    objectModel = new Video(object, iface);
                    break;
                case "ace-code":
                    objectModel = new AceCode(object, iface);
                    break;

            }

           if(objectModel) om.objects.push(objectModel);

        });






    };


    return ObjectManager;





})();


// Before we go ahead and delete everything:
// It's been working so far that we just start and stop everything
      // We time event start and stop


// Maybe we represent the object state as a function of time?


// So the same things apply, but instead of storing them as events in the event Cycle


// We store events Same way in the model


// A major sequence of events



// So you have two types of events
// Instantaneous events


// Duration events




/*



    new Object()




    A duration event has a start
    you choose the start

 */






// Animations
// Transitions
// Rotations




// Audio





// Seek to
// Pause
// Play


// If you just had a re-render function

        // You would be re-rendering everything



// Events can:
   // pause
   // play
   // seek
   //





///                UI Provides 5 types of interactions
//====================================================
   // Play         -- On every Play, hit play
   // Pause        -- On every pause, show the pause
   // Seek         -- On every seek, show the time
   // Render  -- on Every event cycle
   // Fire     -- At a specified time




//        Each object supports it's own set of events
// ======================================================
//        Audio:  Play,  Stop
//        Shape: Rotation, Translation, etc...
//        Image: Show, Fade-In
//        Text: Show


//        Each object's set of events can leverage the following types of interactions:
           // Play, Pause, Seek, Render, Fire



//Logic flow:

      // On startup, each object's events get read
          // Each object's Object's Event calls has fire, pause etc.. methods
               // If it has the method, it adds it to the appopriate listener


/*

- Fire listener
- Play listener
- Pause listener
- Seek listener

 */



/*

   audio has event play @t=2

   Audio has Event Play, gets fed the event object


            Play -> play: function(){
                check Audio State
                check current time
                if play, then play
            }

            Pause -> pause: function(){
                audio.pause();
            }


            Play-> seek: function(){

                    is time within the bounds?
            }

            Play-> fire: function(){
                audio.seek(0)
                audio.play();
            }





 */









/*
    If it was all just rendered, what would happen?




 */






// Animation

/*

// Animation - Render


Play:  Fire, Play, Pause, Seek


Hide/Show:  Fire, Seek (on Seek - if time is below, then show) <-- Order events to fire based on timestamp -->



Only render what needs to be rendered
Only seek what needs to be seeked


If we just render

 - show/hide would need to be re-rendered in order from the beginning
 - Audio would need to be ordered from the beginning

 */


   // render



// Render only depends on time







// And we re-render every second



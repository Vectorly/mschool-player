# Vectorized Video Web Player

Vectorized Video (.vvid) is a video file format developed by dot Learn for data-light transmission of online video lessons in low-connectivity environments.

See more information in the Wiki:


## Usage

### Quickstart

Import the library into the browser

        <script type="application/javascript" src="vv.js"></script>


You will need to access a .vvid object as a blob


        var oReq = new XMLHttpRequest();

        oReq.onload = function(e) {
            var arraybuffer = oReq.response;
            var blob = new Blob([oReq.response], {type: "application/zip"});
        };
        oReq.open("GET", "demo.vvid");
        oReq.responseType = "arraybuffer";
        oReq.send();


Once you have a blob in javascript, you can load the video into a the player

      vv.load(blob, "container", {width: 800, height:450 });


### API

    vvid.load(vvidBlob, 'container-id', options);  // Load a video

**container-id** - The id of the div element you wish to place the video in

**options**  - Options object, with the following parameters

**width** - Width, in pixels, of the video
**height** - Height, in pixels, of the video
**callback** - Function to call after video is loaded

    vvid.play() // Play the video


    vvid.pause(); // Pause the video


    vvid.stop(); //Stop the video


## Contributing


### Setup

To get started with the player, you will need NodeJS. Clone the repository, enter the working directory and do npm install

     npm install

That should install grunt (for builds), and a few other dependencies


### Building

To build the library, use:

    grunt build

To rebuild the demos, use:

    grunt demo

### Examples

You can view a live demo of a vectorized-video here: http://watch.dotlearn.org/#audio-slideshow-demo



You can see a number of examples, both for demonstration and testing purposes, in the examples and examples-unzipped folder. The build script treats each folder in "examples-unzipped" as the raw contents of a .vvid file, which it wil then build, package and sent for distribution to the "examples" folder. You can then find the folder of the same name in examples. To view the output, just load index.html in any of the example folders.
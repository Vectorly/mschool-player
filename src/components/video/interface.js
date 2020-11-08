

module.exports = function (meta, ui, clock) {

    this.meta = meta;

    this.meta.duration = clock.limit;


    this.play = function () {
      ui.play();
    };


    this.pause = function () {
      ui.pause();
    };

    this.seek = function (time) {
      ui.seek(time);
    };

    this.onPlay = function (fn) {
      ui.onPlay(fn);
    };

    this.requestFullScreen = function () {
      ui.requestFullScreen();
    };

    this.resize = function (height, width) {
      ui.resize(height, width);
    };

    this.setVolume = function(volume){
        ui.setVolume(volume);
    }

    this.getVolume = function(){
        return ui.volume;
    };

    this.onFullscreen = function (fn) {

        ui.onFullscreen = fn;
    };

    this.onPause = function (fn) {
        ui.onPause(fn);
    };

    this.onEnd = function (fn) {
      ui.onEnd(fn);
    };

    this.onSeek = function (fn) {
      ui.onSeek(fn);
    };


    this.getTime = function () {
      return clock.time;
    };




};
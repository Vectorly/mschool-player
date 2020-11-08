/**
 * Created by sam on 1/18/16.
 */



module.exports = (function () {

    function App(vvid, ui, clock){

        var app = this;

        app.height = ui.height;
        app.width = ui.width;
        app.attach = ui.attach;
        app.clock = clock;
      //  app.paper = ui.paper;


        app.setScroll = ui.scroll.to;

        function Interface(object){

            this.height = ui.height;
            this.width = ui.width;
            this.attach = ui.attach;
            this.clock = clock;
            this.volume = ui.volume;


            this.onSize = function (fn) {
                fn(ui.height, ui.width);    //Allow app objects to instantiate, to facilitate code re-use
                ui.onResize(fn);
            };


            this.scaledHeight = function(normalizedHeight){
                var frac = normalizedHeight/900;
                return Math.floor(ui.height *frac);
            };

            this.scaledWidth= function(normalizedWidth){
                var frac = normalizedWidth / 1600;
                return Math.floor(ui.width* frac);
            };

            this.getFile = function (filename) {

                return vvid.getFile(object.id + '/' + filename );
            };

       //     this.paper = ui.paper;

            this.scrollTo = ui.scroll.to;
            this.scrollListener = ui.scroll.setListener;

            this.cursor = ui.elements.cursor;

        }
        app.Interface = Interface;

    }


    return App;

})();


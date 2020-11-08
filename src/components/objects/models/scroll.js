/**
 * Created by sam on 16-11-12.
 */
function Scroll(json, app){

    var Scroll = this;
    var params  = json.params;

    var actions = [];


    var Y;


    app.onSize(function () {

        Y = [];
        params.y.forEach(function (y) {
            Y.push(app.scaledHeight(y));
        });


    });


    var numeric = require('numeric');


        Scroll.Actions = {

        show: function (action) {

            this.data = action;
            this.object = json;

            var Yf = Y[Y.length-1];

            app.scrollListener(action.time, Yf);


            this.events = {

                fire: function () {


                    app.scrollTo(Yf);


                }
            };

        },


        draw: function (action) {

            this.data = action;
            this.object = json;


            var spline = numeric.spline(params.t, Y);


            var start = action.time;
            var lim = start + params.t[params.t.length-1];
            var Yf = Y[Y.length-1];


            app.scrollListener(lim, Yf);

            this.events = {


                render: function () {

                    if((app.clock.time > start) &&(app.clock.time < lim)){

                        var tRel = app.clock.time - start;

                        app.scrollTo(spline.at(tRel));


                    }

                }
            };




        }


    };


    json.actions.forEach(function (jsonAction) {

        actions.push(getAction(jsonAction));
    });

    Scroll.actions = actions;



    function getAction(action){
        var Action = Scroll.Actions[action.type];
        return new Action(action);
    }




}

module.exports = Scroll;
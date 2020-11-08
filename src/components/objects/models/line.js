function Line(json, app){

    var Line = this;
    var params  = json.params;
    var line = instantiateLine();
    var actions = [];




    Line.Actions = {

        show: function (action) {

            this.data = action;
            this.object = json;

            this.events = {

                fire: function () {
                    $(line).css('display', 'block');
                },

                seek: function () {

                    var time = app.clock.time;
                    if(time < action.time){
                        $(line).css('display', 'none');
                    } else{

                        $(line).css('display', 'block');

                    }
                }
            };

        },

        translate: function (action) {

            this.data = action;
            this.object = json;

            this.events = {



                seek: function () {

                    var time = app.clock.time;
                    if(time < action.time){
                        //   $(line).css('display', 'block');
                    } else{

                        $(line).css('display', 'none');

                    }
                }
            };




        },


        hide: function (action) {


            this.data = action;
            this.object = json;

            this.events = {

                fire: function () {
                    $(line).css('display', 'none');
                },

                seek: function () {

                    var time = app.clock.time;
                    if(time < action.time){
                        //   $(line).css('display', 'block');
                    } else{

                        $(line).css('display', 'none');

                    }
                }
            };


        }

    };


    json.actions.forEach(function (jsonAction) {

        actions.push(getAction(jsonAction));
    });

    Line.actions = actions;




    app.attach(line);


    function instantiateLine(){


        var line =  document.createElementNS("http://www.w3.org/2000/svg", "line");

        app.onSize(function () {

            line.setAttribute("x1", app.scaledWidth(params.xy[0]));
            line.setAttribute("x2", app.scaledWidth(params.to[0]));

            line.setAttribute("y1", app.scaledHeight(params.xy[1]));
            line.setAttribute("y2", app.scaledHeight(params.to[1]));
            line.setAttribute("stroke-width", app.scaledHeight(params.width));

        });


        line.setAttribute("stroke", params.color);
        line.style.display = "none";

        return line;

    }


    function getAction(action){
        var Action = Line.Actions[action.type];
        return new Action(action);
    }


}

module.exports = Line;
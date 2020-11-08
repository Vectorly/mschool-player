/**
 * Created by sam on 1/16/16.
 */

function Shape(json, app){

    var Shape = this;
    var params  = json.params;
    var shape = instantiateShape();
    var actions = [];



    Shape.Actions = {

        show: function (action) {

            this.data = action;
            this.object = json;

            this.events = {

                fire: function () {
                    $(shape).css('display', 'block');
                },

                seek: function () {

                    var time = app.clock.time;
                    if(time < action.time){
                        $(shape).css('display', 'none');
                    } else{

                        $(shape).css('display', 'block');

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
                        //   $(text).css('display', 'block');
                    } else{

                        $(shape).css('display', 'none');

                    }
                }
            };




        },


        hide: function (action) {


            this.data = action;
            this.object = json;

            this.events = {

                fire: function () {
                    $(shape).css('display', 'none');
                },

                seek: function () {

                    var time = app.clock.time;
                    if(time < action.time){
                        //   $(text).css('display', 'block');
                    } else{

                        $(shape).css('display', 'none');

                    }
                }
            };


        }

    };


    json.actions.forEach(function (jsonAction) {

        actions.push(getAction(jsonAction));
    });

    Shape.actions = actions;



    app.attach(shape);


    function instantiateShape(){


        var shape;


        var x = params.xy[0];
        var y = params.xy[1];
        var h = params.height;
        var w = params.width;
        var bw = params.borderWidth||0;


        switch (params.type){

            case "circle":
                shape = newCircle(w, h, bw, x, y);
                break;
            case "rectangle":
                shape =  newSquare(w, h, bw, x, y);
                break;

            case "triangle":
                shape =  newTriangle(w, h, bw, x, y);
                break;

            default:
                shape =  newSquare(w, h, bw, x, y);
                break;
        }


        shape.setAttribute('fill', params.fill || 'white');
        shape.setAttribute('stroke', params.borderColor || 'blue');
        shape.setAttribute('stroke-width', bw +'');
        shape.style.display = "none";


        return shape;



        function newCircle(w, h, bw, x, y){

            var circle = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');

            app.onSize(function () {

                var borderWidth = app.scaledWidth(bw) || 0;
                var xp = app.scaledWidth(x)||0;
                var yp= app.scaledHeight(y)||0;
                var wp = app.scaledWidth(w);
                var hp = app.scaledHeight(h);

                circle.setAttribute('cx',xp+ wp/2 + borderWidth);
                circle.setAttribute('cy', yp+hp/2 + borderWidth);
                circle.setAttribute('rx', wp/2);
                circle.setAttribute('ry', wp/2);

            });



            return circle;

        }

        function newSquare(w, h, borderWidth, x, y){

            var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

            app.onSize(function () {

                var xp=app.scaledWidth(x)||0;
                var yp=app.scaledHeight(y)||0;
                var wp = app.scaledWidth(w);
                var hp = app.scaledHeight(h);

                rect.setAttribute('x', xp);
                rect.setAttribute('y', yp);
                rect.setAttribute('width', wp);
                rect.setAttribute('height', hp);

            });



            return rect;

        }

        function newTriangle(w,h, bw, x, y){

            var triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

            app.onSize(function () {

                var borderWidth = app.scaledHeight(bw) || 0;
                var xp=app.scaledWidth(x)||0;
                var yp=app.scaledHeight(y)||0;
                var wp = app.scaledWidth(w);
                var hp  = app.scaledHeight(h);

                var points =  (xp +wp/2) + " "+  (yp+borderWidth) + ", " + (xp+wp) + " " + (yp+hp) + ", " + (xp+borderWidth) + " " + (yp+hp);

                triangle.setAttribute('points',  points);

            });



            return triangle;
        }
    }




    function getAction(action){
        var Action = Shape.Actions[action.type];
        return new Action(action);
    }



}

module.exports = Shape;
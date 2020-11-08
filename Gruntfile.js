/*global module:false*/


var fs = require('fs-extra');
var Zip = require('node-zip');

module.exports = function (grunt) {


    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');


    grunt.initConfig({


        browserify: {
            api: {
                options: {
                    browserifyOptions: {
                        standalone: 'vv',
                        debug: true
                    }
                },
                src: ['src/main.js'],
                dest: 'build/vv.js'
            }
        },

        zip: {
          demo:{
              cwd:'unzipped',
              // Files will zip to 'hello.js' and 'world.js'
              src: ['unzipped/**'],
              dest: 'demo/demo.vvid'
          }
        },


        copy:{
            demo: {
                files: [
                    // includes files within path
                    {expand: true, cwd: 'build/', src: ['**'], dest: 'demo/',  filter: 'isFile'}

                ]

            }

        },

        open : {
            dev: {
                path: 'http://localhost:8080',
                app: 'google-chrome-stable'
            }
        },


        uglify: {

            main: {
                files: [
                    {
                        src: 'build/vv.js',
                        dest: 'dist/vv.js'
                    }
                ]
            }
        },


     connect: {
    demo: {
      options: {
		    keepalive: true,
        port: 8080,
            base: {
          path: 'demo',
          options: {
            index: 'index.html',
            maxAge: 300000
          }
        }
         }
          }
  }

    });




    grunt.registerTask('demos',  'Task to do x',  function (which) {


        var done = this.async();

        var files =[];

        if(which) files.push(which);
        else {
            files = fs.readdirSync('./examples-unzipped');
        }


        files.forEach(function (file) {
            fs.emptyDirSync('examples/' + file);
            fs.copySync('demo', 'examples/' + file);



            var zip = new Zip();

            var srcContents = fs.walkSync('examples-unzipped/' + file);



            srcContents.forEach(function (srcFile) {


                var targetName = srcFile.split('examples-unzipped/' + file + '/')[1];


                zip.file(targetName, fs.readFileSync(srcFile));

            });


            var data = zip.generate({base64:false,compression:'DEFLATE'});

            fs.writeFileSync('examples/' + file + '/demo.vvid', data, 'binary');


        });












    });


    grunt.registerTask('build', ['browserify', 'uglify']);

    grunt.registerTask('demo', ['build', 'copy:demo', 'demos']);

    grunt.registerTask('image', ['build', 'copy:demo', 'demos:image']);

};

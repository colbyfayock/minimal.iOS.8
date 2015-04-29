module.exports = function(grunt) {

    require('jit-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {

            options: {
                separator: ';',
            },

            build: {
                src: [

                    './lib/mios_functions.jsx',
                    './lib/mios_icons.jsx',
                    './lib/mios_sizes.jsx',
                    './lib/mios_init.jsx'

                ],
                dest: './mios.jsx',
            },

        },

        extendscript: {

            build_files: {

                options: {
                    app: 'Adobe Photoshop CC 2014',
                    args: [ "compressed" ]
                },

                src: [
                    './mios.jsx'
                ]
            }

        }


    });

    grunt.registerTask('default', [
        // 'build'
    ]);

    grunt.registerTask('build', [
        'concat:build',
        'extendscript:build_files'
    ]);

};


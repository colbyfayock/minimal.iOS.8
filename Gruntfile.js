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
                    app: 'Adobe Photoshop CC 2015',
                    args: [ "compressed" ]
                },

                src: [
                    './mios.jsx'
                ]
            },

            test_files: {

                options: {
                    app: 'Adobe Photoshop CC 2015',
                    args: [ "test" ]
                },

                src: [
                    './mios.jsx'
                ]
            }

        }


    });

    grunt.registerTask('default', [
        'concat:build'
    ]);

    grunt.registerTask('build', [
        'concat:build',
        'extendscript:build_files'
    ]);

    grunt.registerTask('test', [
        'concat:build',
        'extendscript:test_files'
    ]);

};


module.exports = function(grunt) {

    require('jit-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {

            options: {
                separator: ';\n\n',
            },

            build: {
                src: [

                    './lib/mios_functions.jsx',
                    './lib/mios_icons.jsx',
                    './lib/icons/*',
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

        },

        makedeb: {

            dev: {
                options: {
                    name: 'minimal.iOS.dev',
                    control: 'control-dev',
                    postfix: '.dev'
                }
            },

            prod: {
                options: {
                    name: 'minimal.iOS',
                    control: 'control-prod'
                }
            }

        },

        rsync: {

            options: {
                args: ["-avhzS --progress"],
                recursive: true
            },

            dev: {
                options: {
                    src: "dist/mios",
                    dest: "/Library/Themes",
                    host: "root@192.168.1.182" // iPhone
                    // host: "root@192.168.1.84" // iPad
                }
            }

        }


    });

    grunt.registerMultiTask('makedeb', 'Build mios .deb using dpkg-deb', function() {

        var data = this.data.options,
            exec = require('child_process').execSync,
            pkg_name,
            pkg_version,
            controlSplit = exec( "cat " + data.control, { encoding: 'utf8' } ).split('\n'),
            control = {};

        for ( var i = 0, controlLen = controlSplit.length; i < controlLen; i++ ) {
            var item = controlSplit[i].split(': ');
            control[item[0].toLowerCase()] = String(item[1]).trim();
        }

        pkg_name = data.name && data.name !== '' ? data.name : false;
        pkg_version = control.version && control.version !== '' ? control.version : false;
        pkg_file = '';

        if ( pkg_name ) pkg_file += pkg_name.replace(/ /g,"_");
        if ( data.postfix && data.postfix !== '' ) pkg_file += data.postfix;
        if ( pkg_version ) pkg_file += '-' + pkg_version;

        // make deb directories

        exec( "mkdir -p Package/DEBIAN" );
        exec( "mkdir -p Package/Library/Themes" );

        // copy control

        exec( "cp " + data.control + " Package/DEBIAN/control" );

        exec( "find ./dist -maxdepth 1 -type d -name \"" + pkg_name + "*\"", { encoding: 'utf8' } ).split(/\n/).forEach(function(dir) {
            if ( dir.length > 0 ) {
                grunt.log.write( 'Found: ' + dir + '\n');
                exec( "cp -r " + dir.replace(/ /g,"\\ ") + " Package/Library/Themes/" );
            }
        });

        if ( exec( "dpkg-deb --version", { encoding: 'utf8' } ).indexOf('See dpkg-deb --licence for details') === -1 ) {
            exec( "rm -rf Package" );
            grunt.log.error(['Oops, you need dpkg-deb to run this task']);
            grunt.fail.fatal( 'Exiting...');

            return false;
        }

        try {
        	exec( "find . -name \".DS_Store\" -exec rm -rf {} \\;" );
            exec( "dpkg-deb -b Package" );
        } catch(e) {
            grunt.fail.fatal( 'Exiting...');
            return false;
        }

        exec( "mv Package.deb " + pkg_file  + ".deb" );

        exec( "rm -rf Package" );


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

    grunt.registerTask('sync', [
        'rsync:dev'
    ]);

    grunt.registerTask('dev', [
        'makedeb:dev'
    ]);

    grunt.registerTask('prod', [
        'makedeb:prod'
    ]);

};


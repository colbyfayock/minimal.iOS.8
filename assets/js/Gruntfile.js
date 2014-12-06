module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*\n' +
                ' * <%= pkg.name %> <%= pkg.version %>\n' +
                ' * <%= pkg.description %> \n' +
                ' */\n',
        mangle: true,
        compress: true
      },
      build: {
        src: 'main.min.js',
        dest: 'main.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
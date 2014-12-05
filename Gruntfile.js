/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    debian_package: {
      options: {
          maintainer: {
              name: "Colby Fayock",
              email: "info@colbyfayock.com"
          },
          name: "mininal.iOS.8",
          short_description: "Minimal winterboard theme for iOS8",
          long_description: "Minimal winterboard theme for iOS8",
          version: "1.1.1",
          dependencies: "winterboard"
      },
      files: [
          {
              src: [
                  'minimal.iOS - Icons/**'
              ],
              dest: '/Library/Themes/'
          }
      ]
    }
  });
  
  grunt.loadNpmTasks('grunt-debian-package');

  // Default task.
  grunt.registerTask('default', ['debian_package']);

};

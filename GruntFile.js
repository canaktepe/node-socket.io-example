module.exports= function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
          src: 'public/scripts/**.js',
          dest: 'dist/app.min.js'
        }
      }
    });
  
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
  
    // Default task(s).
    grunt.registerTask('default', ['uglify']);
  };
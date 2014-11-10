module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: [
                'Gruntfile.js',
                'lib/**/*.js',
                'app.js'
            ]
        }
    });

    // Automatically load in all Grunt npm tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', 'build');
    grunt.registerTask('build', ['jshint']);
    grunt.registerTask('test', ['jshint']);
};

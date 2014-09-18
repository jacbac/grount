module.exports = function (grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Create responsive images for dev env.
    // @todo: make it works !
    responsive_images: {
      dev: {
        options: {
          aspectRatio: true,
          quality: 80
        },
        sizes: [
          {
            name: 'small',
            width: 320
          },
          {
            name: 'medium',
            width: 640
          },
          {
            name: "large",
            width: 1024,
            suffix: "_x2"
          }
        ],
        files: [{
          expand: true,
          src: ['img/resto/original_*.{jpg,gif,png}', 'img/event/original_*.{jpg,gif,png}'],
          cwd: 'src/',
          dest: 'img/'
        }]
      }
    },

    // Define a banner for minified css
    banner: '/*!\n' +
            ' * <%= pkg.owner %> | v<%= pkg.version %> | ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * <%= pkg.homepage %>\n' +
            ' *\n' +
            ' * Designed and built by <%= pkg.author %>, <%= pkg.twitter %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> ' + '<%= pkg.owner %>\n' +
            ' *\n' +
            ' * Love, Peace & Soul !\n' +
            ' */\n',

    // Compile all LESS files to 1 CSS file
    less: {
      dist: {
        files: {
          'src/css/main.css': 'src/less/main.less'
        }
      }
    },

    // Autoprefix css 
    autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
      dist: {
        options: {
          map: false
        },
        src: 'src/css/main.css'
      }
    },

    // Copy all src/ dir in a dist/ dir => working task folder
    copy: {
      dist: {
        files: [
          { expand: true, cwd: 'src/', src: '**', dest: 'dist/' }
        ],
      },
      options: {
        mode: 0644
      }
    },

    // Remove unused CSS across multiple files, compressing the final output
    uncss: {
      dist: {
        files: {
          'dist/css/main.css': ['dist/index.html']
        }
      },
      options: {
        compress: false,
      }
    },

    // Minify and clean UnCssed CSS
    cssmin: {
      dist: {
        options: {
          banner: '<%= banner %>',
          keepSpecialComments: 0
        },
        files: {
          'dist/css/compiled.min.css': ['dist/css/main.css']
        }
      }
    },

    // JS validation
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
      },
      dist: {
        src: ['src/js/main.js']
      }
    },

    // Uglify JS
    uglify: {
      dist: {
        files: {
          'dist/js/compiled.min.js': [
            'src/js/jquery-1.11.1.js',
            'src/js/bootstrap.js',
            'src/js/main.js',
          ],
          'dist/js/modernizr.custom.min.js': [
            'src/js/modernizr.custom.js',
            'src/js/picturefill.js',
          ]
        }
      },
      options: {
        banner: '<%= banner %>',
        mangle: false,
        // sourceMap: true
      }
    },

    // Process
    processhtml: {
      dist: {
        files: {
          'index.html': ['dist/index.html'],
          'mentions-legales.html': ['dist/mentions-legales.html'],
          '404.html': ['dist/404.html']
        }
      }
    },

    // Clean pre-compiled files. Keep minified files
    clean: {
      dist: {
        src: [
          'dist/less/',
          'dist/css/*.css',
          '!dist/css/*.min.css',
          'dist/js/*.js',
          '!dist/js/*.min.js'
        ]
      }
    },

    // Watch changes and launch grunt tasks
    // @todo merge less path
    watch: {
      src: {
        files: [
          'src/js/*.js',
          'src/less/*.less',
          'src/less/partials/*.less',
          'src/*.html'
        ],
        tasks: ['default']
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default tasks
  grunt.registerTask('default', ['less', 'autoprefixer', 'copy', /*'uncss',*/ 'cssmin', 'jshint', 'uglify', 'processhtml', 'clean']);

  // Dev tasks
  grunt.registerTask('dev', ['responsive_images:dev']);
};

# Gulp Docker Compose

Hey there ;) The binding between `gulp` and `docker compose` lies ahead.

## Installation

Just make sure you have installed `docker`, `docker-compose` and `node`, and the current user is in the `docker` group in order to be able to run `docker` commands without `sudo`.

## Usage

### Typical gulp pipeline

~~~~
const gulp = require('gulp');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const path = require('path');
const plumber = require('gulp-plumber');
const vfs = require('vinyl-fs');
const GulpDockerCompose = require('gulp-docker-compose').GulpDockerCompose;

const srcFolder = `${__dirname}/src/`;
const dstFolder = `${__dirname}/build/`;

// clean the previous build
gulp.task('clean', function() {
    return gulp.src(dstFolder, {read: false})
        .pipe(clean({force: true}));
});

// compile js
gulp.task('build', ['clean'], function() {
    // vfs follows symlinks
    return vfs.src(srcFolder+'/**/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: [
                ["env", {
                    "targets": {
                        "node": "4"
                    },
                    "modules": "commonjs",
                }],
            ]
        }))
        .pipe(vfs.dest(dstFolder));
});

var gulpDocker = new GulpDockerCompose(gulp, {
    serviceName: 'app',
    tasks: {
        run: {
            name: 'docker-compose:run:app',
            dependences: ['build'],
        },
        restart: {
            name: 'docker-compose:restart:app',
            dependences: ['build'],
        },
    },
});

gulp.task('watch', function() {
    gulp.watch([srcFolder+'/**/*'], ['build', 'docker-compose:restart:app']);
});
gulp.task('default', ['build', 'watch', 'docker-compose:run:app']);
~~~~

## Options and arguments

`GulpDockerCompose` takes 2 arguments:
* `gulp` - the reference to `gulp` object to work with
* `options` - an object of various options described below

## Options

* `serviceName` (mandatory) - the name of the service to build (typically, the one in `docker-compose.yml` which has `build` directive)
* `tasks` (optional) - the list of tasks to create, an object with two keys: `run` - stands for `run compose` task, and `restart` - for restart
* `hangOnInt` (optional, default - `true`) - when the `Ctrl+C` combo is pressed on `gulp watch`, it stops `docker compose`. If the option is set to `false`, it will not override `process.on('SIGINT')` handler, but in this case, the `docker compose` (started as a daemon) will not be terminated. You may call `gulpDocker.stopDockerCompose()` manually in this case.

Both tasks have the same format: an object with the following keys:
* `name` - the name of the task (an alias `#SERVICE_NAME#` is available and will get replaced with the value of `serviceName`)
* `dep` - the list of tasks which should be executed before `gulp` enters this task

If no `tasks` block specified, they can be created with `makeRunTask()` and `makeRestartTask()` respectively like the following:

~~~~
gulpDocker.makeRunTask('run:#SERVICE_NAME#', ['build']);
gulpDocker.makeRestartTask('restart:#SERVICE_NAME#', ['build']);
~~~~

### Typical docker-compose.yml

~~~~
version: '3'

services:
  app:
    build: .
    depends_on:
          - "db"
    ports:
      - "3101:3012"
    environment:
      - DB_URL=mongodb://db:27017/mydatabase
      - PORT=3012
      - ROOT_URL=http://localhost
  db:
      image: "mongo"
      ports:
        - "3110:27017"
~~~~

Note that the corresponding `Dockerfile` should be present inside the same folder in order to build the `service`.

### Under the hood

In fact, the module only launches the following `docker-compose` commands:

On `run` task:
~~~~
docker-compose up -d --build
~~~~

On `restart` task, in series:
~~~~
docker-compose stop <service name>;
docker-compose create --build <service name>;
docker-compose restart <service name>;
~~~~

On `Ctrl+C`:
~~~~
docker-compose stop
~~~~

If somebody knows more efficient way to get the same result, please let me know.

## License

MIT

Enjoy ;)

/*
 * Gulp-plugin для сборки sass файла, на основе путей от блоков
 * @author: rg team
 *
 */

var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var gutil = require('gulp-util');
var _ = require('lodash');

var extendify = require('extendify');
_.extend = extendify({
    arrays: 'concat'
});

/*
 * Helpers
 *
 */

// If resource exists
var resExistsSync = function(path) {
    try {
        fs.statSync(path);
        return true;
    } catch (err) {
        return false;
    }
};

// Get parent folder
var parentDir = function(path) {
    return path.split('/').slice(0, -1).join('/');
};

// Find crossdata file
var findCrossData = function(dirPath) {

    var targetDir = dirPath,
        crossData = '/crosspages/page.js';

    // #1 Find setup
    targetFile = targetDir + crossData;

    // #1 Find process
    if (resExistsSync(targetFile)) {
        return targetFile;
    } else { // if not file, go to parent dir

        // #2 Find setup
        targetDir = parentDir(parentDir(targetDir));
        targetFile = targetDir + crossData;

        // #2 Find process
        if (resExistsSync(targetFile)) {
            return targetFile;
        } else { // if not file, go to default template

            // #3 Find setup
            targetDir = parentDir(parentDir(targetDir));
            targetFile = targetDir + '/data' + crossData;

            // #3 Find process
            if (resExistsSync(targetFile)) {
                return targetFile;
            }

        }

    }

    return null;

};


/*
 * Module
 *
 */

module.exports = function(userOptions) {

    'use strict';

    /*
     * Setup
     *
     */

    var

        // Стандартые опции
        options = {
            stylePathKey: 'stylesPath'
        };


    // Update options
    _.extend(options, userOptions);

    // Data processing
    //      @file - file pass gulp
    //      @callback - process function

    var rgcsspack = function(file, callback) {

        var

            // File contents
            fileContents = file.contents,

            // File path
            filePath = file.path,

            // src dest
            dirPath = null;

        // Processing
        try {

            // Store dir path file, when watch gulp
            dirPath = path.dirname(filePath);

            // Set crossdata file
            tmplCrossData = require(findCrossData(dirPath));

            // Merge data template
            tmplData = _.extend({}, tmplCrossData, require(filePath).toMerge);

            // Set extension
            file.path = gutil.replaceExtension(filePath, extFile);

            // Вот тут собираем SASS файл
            console.log(tmplData);

            // Save data
            file.contents = new Buffer(compiled);

            // Send data
            callback(null, file);

        } catch (err) {

            // Send error
            callback(err);
        }

    };

    // Return data 
    return es.map(rgswig);

};
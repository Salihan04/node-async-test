var async = require('async'),
    events = require('events'),
    eventEmitter = new events.EventEmitter(),
    my_keys = ['a', 'b', 'c'],
    myObj = {
        'a': {
            'a1': 1,
            'a2': 2,
            'a3': 3
        },
        'b': {
            'b1': 4,
            'b2': 5,
            'b3': 6
        },
        'c': {
            'c1': 7,
            'c2': 8,
            'c3': 9
        }
    },
    myFile = require('./myFile.json');

/**
 * Originally myFile.json has same structure as myObj but values are all 0
 * This function loops through the outer and inner keys of myObj and writes
 * it into myFile.json
 */
function main() {
    eventEmitter.on('done', () => {
        done();
    });

    async.eachSeries(my_keys, (outerKey, outerCallback) => {
        let obj = myObj[outerKey];
        async.eachSeries(Object.keys(obj), (innerKey, innerCallback) => {
            outer(outerKey, innerKey, writeToFile);
            innerCallback();
        }, (error) => {
            if (error) {
                console.log('error');
            }
            outerCallback(error);
        });
    }, (error) => {
        if (error) {
            console.log('Error happened! :(');
        }
        // Finish applying async task to each outerKey
        eventEmitter.emit('done');
    });
}

function outer(outerKey, innerKey, callback) {
    callback(outerKey, innerKey);
}

/**
 * Function to write value into correct field in myFile.json
 * @param  {String} outerKey Outer key of myObj
 * @param  {String} innerKey Inner key of myObj
 */
function writeToFile(outerKey, innerKey) {
    let fs = require('fs');
    myFile[outerKey][innerKey] = myObj[outerKey][innerKey];
    fs.writeFile('./myFile.json', JSON.stringify(myFile, null, 2), error => {
        if (error) {
            console.log('Error writing to file!');
        }
        console.log('myObj.' +
            outerKey +
            '.' +
            innerKey +
            ' = ' +
            myFile[outerKey][innerKey] +
            ' written to myFile.json!');
    });
}

/**
 * Function to call when all the async tasks
 * are done for each item in a collection
 */
function done() {
    let fs = require('fs');

    // Add 1 last key-value pair to myFile.json
    myFile.d = 'All done!';
    fs.writeFile('./myFile.json', JSON.stringify(myFile, null, 2), error => {
        if (error) {
            console.log('Error writing to file!');
        }
        console.log('Finish writing to myFile.json!');
    });
}

main();

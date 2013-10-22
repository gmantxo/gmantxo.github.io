var CODELENGTH = 4;
var COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
var duplicatesAllowed = true;

var generateCode = function(duplicates) {
    duplicates = typeof duplicates !== 'undefined' ? duplicates : true;
    var newCode = [];
    if (duplicates) {
        for (var i = 0; i < CODELENGTH; i++) {
            var randomNumber = Math.floor(Math.random() * COLORS.length);
            newCode.push(COLORS[randomNumber]);
        };
    } else {
        newColors = COLORS.slice(0);
        for (var i = 0; i < CODELENGTH; i++) {
            var randomNumber = Math.floor(Math.random() * newColors.length);
            newCode.push(newColors.splice(randomNumber, 1)[0]);
        };
    };
    return newCode;
}

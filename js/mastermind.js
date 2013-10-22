var CODELENGTH = 4;
var COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
var duplicatesAllowed = true;

var generateCode = function(duplicates) {
    if (!duplicates) {duplicates = true};
    var newCode;
    if (duplicates) {
        newCode = [];
        for (var i = 0; i < CODELENGTH; i++) {
            var randomNumber = Math.floor(Math.random() * COLORS.length);
            newCode.push(COLORS[randomNumber]);
        };
    } else {
        newCode = COLORS.slice(0);
        for (var i = 0; i < COLORS.length - CODELENGTH; i++) {
            var randomNumber = Math.floor(Math.random() * newCode.length);
            newCode.splice(randomNumber, 1);
        };
    };
    return newCode;
}

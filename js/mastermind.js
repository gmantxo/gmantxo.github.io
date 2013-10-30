var CODELENGTH = 4;
var COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
var duplicatesAllowed = true;

var TURNS = 10;

var CURRENTTURN = {
    index: -1,
    activeRow: null,
    codePegs: [],
    feedbackPegs: [],
    guessCode: []
}

var gameCode = [];

//Initialize-----------------------------------------------------

//CreateRows
var SELECTOR = document.querySelector(".selector");
var ACTIONS = document.querySelector(".actions");
SELECTOR.remove();
ACTIONS.remove();
for (var i = 0; i < TURNS - 1; i++) {
    document.querySelector(".board").appendChild(document.querySelector(".row:nth-child(n+2)").cloneNode(true));

};
document.querySelector(".board").appendChild(SELECTOR);
document.querySelector(".board").appendChild(ACTIONS);

//Set array for hidden pegs
var HIDDENPEGS = [].slice.call(document.querySelectorAll(".row:first-child .peg"));

//Set arrays for playing ROWS and COLORBUTTONS
var ROWS = [].slice.call(document.querySelectorAll(".row:nth-child(n+2)")).reverse();
var COLORBUTTONS = document.querySelectorAll('.selector>.peg');

//Set variables for turn buttons
var RESTARTBUTTON = document.querySelector('.board .button.restart');
var UNDOBUTTON = document.querySelector('.board .button.undo');
var GUESSBUTTON = document.querySelector('.board .button.guess');

//Set variables for message box
var MESSAGEBOX = document.querySelector('.messageBox');
var MESSAGE = document.querySelector('.messageBox p');
var messageTimeout;

//Listen COLORBUTTONS clicks
for (var i = 0; i < COLORBUTTONS.length; i++) {
    COLORBUTTONS[i].addEventListener('click', function(e) {
        selectColor(e);
    })
};
//Listen turn buttons clicks
RESTARTBUTTON.addEventListener('click', function(e) {
    startNewGame();
})
UNDOBUTTON.addEventListener('click', function(e) {
    undoColorSelection(e);
})
GUESSBUTTON.addEventListener('click', function(e) {
    guess(e);
})


//--------------------------------------------------------------

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

var setActiveRow = function(index) {
    if (CURRENTTURN.activeRow) {
        CURRENTTURN.activeRow.classList.remove('active');
    };
    var row = ROWS[index];
    row.classList.add('active')
    CURRENTTURN.activeRow = row;
}

var nextTurn = function(argument) {
    if (CURRENTTURN.index >= 0) {
        ROWS[CURRENTTURN.index].classList.remove('active');
    };
    if (CURRENTTURN.index + 1 < TURNS) {
        CURRENTTURN.index++
        setActiveRow(CURRENTTURN.index)
        CURRENTTURN.codePegs = [].slice.call(document.querySelectorAll(".row.active .peg.code"));
        CURRENTTURN.feedbackPegs = [].slice.call(document.querySelectorAll(".row.active .peg.feedback"));
        CURRENTTURN.guessCode = [];
        disable(UNDOBUTTON);
        disable(GUESSBUTTON);
        enable(COLORBUTTONS);
    } else {
        lose()
    };
}
var startNewGame = function() {
    clearTimeout(messageTimeout);
    MESSAGEBOX.classList.remove('visible');
    var pegs = [].slice.call(document.querySelectorAll(".row:nth-child(n+2)>.peg"));
    for (var i = pegs.length - 1; i >= 0; i--) {
        if (pegs[i].className.indexOf('code') >= 0) {
            pegs[i].className = 'peg code';
        } else if (pegs[i].className.indexOf('feedback') >= 0) {
            pegs[i].className = 'peg feedback';
        };;

    };
    var gameCodePegs = [].slice.call(document.querySelectorAll(".row:nth-child(1)>.peg"));
    for (var i = gameCodePegs.length - 1; i >= 0; i--) {
        gameCodePegs[i].className = 'peg code hidden';
    };
    disable(RESTARTBUTTON);
    disable(UNDOBUTTON);
    disable(GUESSBUTTON);
    gameCode = generateCode(duplicatesAllowed);
    CURRENTTURN.index = -1;
    nextTurn()
}

var selectColor = function(e) {
    var button = e.target;
    var color = e.target.className.replace('peg', '').replace(' ', '');
    if (CURRENTTURN.guessCode.length < CODELENGTH) {
        CURRENTTURN.codePegs[CURRENTTURN.guessCode.length].classList.add(color);
        CURRENTTURN.guessCode.push(color);
        enable(RESTARTBUTTON);
        enable(UNDOBUTTON);
    }
    if (CURRENTTURN.guessCode.length === CODELENGTH) {
        GUESSBUTTON.removeAttribute('disabled');
        disable(COLORBUTTONS);
    };
}
var undoColorSelection = function(e) {
    CURRENTTURN.guessCode.pop();
    CURRENTTURN.codePegs[CURRENTTURN.guessCode.length].className = 'peg code';
    disable(GUESSBUTTON);
    enable(COLORBUTTONS);
    if (CURRENTTURN.guessCode.length === 0) {
        disable(UNDOBUTTON);
    };
}
var guess = function() {
    var result = compare();
    for (var i = 0; i < result.positionMatches; i++) {
        CURRENTTURN.feedbackPegs[i].classList.add('positionOK');
    };
    for (var i = 0; i < result.colorMatches; i++) {
        CURRENTTURN.feedbackPegs[i + result.positionMatches].classList.add('colorOK');
    };
    if (result.positionMatches === 4) {
        win();
    } else {
        nextTurn();
    }
}
var compare = function() {
    var codeA = gameCode.slice(0);
    var codeB = CURRENTTURN.guessCode.slice(0);

    var positionMatches = 0;
    var colorMatches = 0;

    for (var i = codeB.length - 1; i >= 0; i--) {
        if (codeB[i] === codeA[i]) {
            positionMatches++;
            codeB.splice(i, 1);
            codeA.splice(i, 1);
        };
    };

    for (var i = codeB.length - 1; i >= 0; i--) {
        if (codeA.indexOf(codeB[i]) >= 0) {
            colorMatches++;
            codeA.splice(codeA.indexOf(codeB[i]), 1);
            codeB.splice(i, 1);
        };
    };
    return {
        positionMatches: positionMatches,
        colorMatches: colorMatches
    }
}

var showMessage = function(messageText) {
    MESSAGE.innerHTML = messageText;
    MESSAGEBOX.classList.add('visible');
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(function() {
        MESSAGEBOX.classList.remove('visible');
    }, 5000);
}
var showHiddenCode = function() {
    for (var i = HIDDENPEGS.length - 1; i >= 0; i--) {
        HIDDENPEGS[i].classList.add(gameCode[i]);
        HIDDENPEGS[i].classList.remove('hidden');
    };
}
var win = function() {
    showMessage('You win! :)');
    disable(UNDOBUTTON);
    disable(GUESSBUTTON);
    disable(COLORBUTTONS);
    showHiddenCode();
}
var lose = function() {
    showMessage('You lose :(');
    disable(UNDOBUTTON);
    disable(GUESSBUTTON);
    disable(COLORBUTTONS);
    showHiddenCode();
}
var enable = function(element) {
    switch (element) {
        case COLORBUTTONS:
            for (var i = element.length - 1; i >= 0; i--) {
                element[i].removeAttribute('disabled');
            };
            break;
        case RESTARTBUTTON:
        case UNDOBUTTON:
        case GUESSBUTTON:
            element.removeAttribute('disabled');
            break;

    }
}
var disable = function(element) {
    switch (element) {
        case COLORBUTTONS:
            for (var i = COLORBUTTONS.length - 1; i >= 0; i--) {
                COLORBUTTONS[i].setAttribute('disabled', 'disabled')
            };
            break;
        case RESTARTBUTTON:
        case UNDOBUTTON:
        case GUESSBUTTON:
            element.setAttribute('disabled', 'disabled');
            break;
    }
}
//Start game
startNewGame();
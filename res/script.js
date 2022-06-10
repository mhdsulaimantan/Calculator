const calScreenOperator = document.querySelector(".rel-op");
const calScreenNum = document.querySelector(".rel-num");

const buttons = document.querySelectorAll("button");

// to get the previous answer
let preAnswer = 0;

// to check if there was a operation sign before
let operatorStatus = false;

// Array of our operation elements
let ops = [];

// buttons listener
buttons.forEach(btn => {
    btn.addEventListener('mousedown', () => { listener(btn.value) });
});


// keyBoard listener 
document.addEventListener('keydown', (event) => { listener(event.key) });


// remove the active animation when keyboard up or mouse up
["keyup", "mouseup"].forEach((ev) => document.addEventListener(ev, () => {
    const activeBtn = document.querySelector(".active");
    if (activeBtn) activeBtn.classList.remove("active");
}));


/* functions section */

// To listen to any user input and work with the entered values
function listener(value) {
    // To replace the zero of the start of an operation with an empty text
    if (calScreenNum.textContent === "0" && parseInt(value)) calScreenNum.textContent = "";

    if (parseInt(value) || value === "0" || value === ".") {
        // The user entered a number
        if (operatorStatus === true) {
            calScreenNum.textContent = "";
            operatorStatus = false;
        }

        calScreenNum.textContent += value;
    }

    // Enter Backspace
    else if (["Backspace", "del"].includes(value)) {
        backSpace(calScreenNum);
    }

    // Enter an operator
    else if (["-", "+", "/", "*"].includes(value)) {
        // Can't press two different operators
        if (operatorStatus === true) calScreenNum.textContent = "ERROR";

        else {
            ops.push(parseFloat(calScreenNum.textContent));
            ops.push(value);
            operatorStatus = true;
            calScreenOperator.textContent = value;
        }
    }

    else if (["=", "Enter"].includes(value)) {
        if (operatorStatus === true) calScreenNum.textContent = "ERROR";
        else {
            ops.push(parseFloat(calScreenNum.textContent));
            calScreenNum.textContent = operate(ops);
            calScreenOperator.textContent = "";
        }
    }

    else if (value === "clear") {
        clear();
    }

    else if (value === "ans") {
        if (preAnswer !== 0) calScreenNum.textContent = preAnswer;
        else calScreenNum.textContent = "0";
    }

    else if (value === "mul-10") {
        if (calScreenNum.textContent === "") calScreenNum.textContent = "0";
        else calScreenNum.textContent = parseFloat(calScreenNum.textContent) * 10;
        calScreenOperator.textContent = "";
    }

    // The user entered a number
    else if (parseFloat(value)) {
        // there was an operator before
        if (operatorStatus === true) {
            calScreenNum.textContent = "";
            operatorStatus = false;
        }
        calScreenNum.textContent += value;
    }

    // run keyboard click audio
    clickSound();

    buttons.forEach(btn => {
        if (value === btn.value) btn.classList.add("active");
        else if (value === "Backspace") {
            document.getElementById("del").classList.add("active");
        }
    });
}

// function to delete a number when calling backspace
function backSpace(screenNum) {
    if (screenNum.textContent.length === 1 || screenNum.textContent.length === 0) screenNum.textContent = "0";
    else screenNum.textContent = screenNum.textContent.replace(/.$/, "");
}

// calculate function
function operate(opsArr) {
    // opsArr will contain entered numbers and their operation
    let answer = opsArr[0];
    let i = 1;
    while (i < opsArr.length) {
        if (opsArr[i] === "+") answer += opsArr[i + 1];
        else if (opsArr[i] === "-") answer -= opsArr[i + 1];
        else if (opsArr[i] === "*") answer *= opsArr[i + 1];
        else if (opsArr[i] === "/") {
            if (opsArr[i + 1] === 0) return "ERROR YOU CAN NOT DIVIDE BY 0";
            else answer /= opsArr[i + 1];;
        }
        i += 2;
    }
    ops = [];
    preAnswer = answer;

    return answer;
}


// to clear everything and start new  
function clear() {
    ops = []
    calScreenNum.textContent = "0";
    calScreenOperator.textContent = "";
    operatorStatus = false;
}

// audio function when clicking a button
function clickSound() {
    new Audio("res/audio/keyboard-click.wav").play();
}
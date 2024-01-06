document.addEventListener("DOMContentLoaded", init);

let maxTries = 6;
let gameOver = false;

function init() {
    initializeLocalStorage();
    decideDailyColor();

    const $button = document.querySelector("button.submit");
    const $newGameButton = document.querySelector("button#new-game");
    const $inputField = document.querySelector(
        ".input-section .input-and-button input"
    );

    $button.addEventListener("click", analyzeInput);
    $newGameButton.addEventListener("click", resetGame);
    $inputField.addEventListener("keydown", handleKeyDown);

    function handleKeyDown(event) {
        const cursorPosition = $inputField.selectionStart;

        if (
            (event.key === "Backspace" || cursorPosition === 0) &&
            $inputField.value.length === 1 &&
            $inputField.value.startsWith("#")
        ) {
            event.preventDefault();
        }
    }
}

function initializeLocalStorage() {
    localStorage.setItem("gamemode", "easy");
    localStorage.setItem("guessed", JSON.stringify([]));
}

function decideDailyColor() {
    const color = randomHexColor();

    const $colorDiv = document.querySelector(".target div.color");
    $colorDiv.style.backgroundColor = color;
}

function resetGame() {
    maxTries = 6;
    gameOver = false;

    const rowsInjectDiv = document.querySelector(
        "section:nth-of-type(2) #rows-inject"
    );
    rowsInjectDiv.innerHTML = "";

    const yourGuessDiv = document.querySelector(".guess div.color");
    yourGuessDiv.style.backgroundColor = "";

    const inputField = document.querySelector(
        ".input-section .input-and-button input"
    );
    inputField.value = "#";

    const statusText = document.querySelector(".status-text");
    statusText.textContent = "Start by typing your guess above!";

    disableInputfield(false);

    const $button = document.querySelector("button.submit");
    $button.style.cursor = "pointer";

    decideDailyColor();
    localStorage.setItem("guessed", JSON.stringify([]));
}

function analyzeInput() {
    if (maxTries === 0 || gameOver) {
        return;
    } // Check if the game is over

    const guessedHexInput = document.querySelector(
        ".input-section .input-and-button input"
    ).value;

    if (!isValidHexColor(guessedHexInput)) {
        displayStatusMessage(
            "Invalid hex color format. Please provide a valid 6-character hex color."
        );
        return;
    }

    maxTries--;

    // Check if the guessed input has already been guessed
    const guessedArray = JSON.parse(localStorage.getItem("guessed")) || [];
    if (guessedArray.includes(guessedHexInput)) {
        displayStatusMessage(
            "You already guessed that color. Try a different one!"
        );
        return;
    }

    // Add the current guess to the guessed array in local storage
    guessedArray.push(guessedHexInput);
    localStorage.setItem("guessed", JSON.stringify(guessedArray));

    setColorOfGuessDiv(guessedHexInput);
    addGuess(guessedHexInput);

    if (
        //checks if the game is guessed, if so, it is true, if not, false (gameOver global variable)
        guessedHexInput.toUpperCase() !==
        `#${rgbaToHex(
            document.querySelector(".target div.color").style.backgroundColor
        )}`
    ) {
        updateStatusText();
    } else {
        gameOver = true; // Set gameOver to true when the correct color is guessed
        updateStatusText(true); // Pass true to indicate the game is over
        disableInputfield(true);
    }
}

function disableInputfield(isDisabled) {
    document.querySelector(".input-section .input-and-button input").disabled =
        isDisabled;
}

function isValidHexColor(hexColor) {
    return /^#[0-9A-Fa-f]{6}$/.test(hexColor);
}

function displayStatusMessage(message) {
    const statusText = document.querySelector(".status-text");

    statusText.textContent = message;
}

function updateStatusText(isGameOver) {
    const statusText = document.querySelector(".status-text");
    const targetColorDiv = document.querySelector(".target div.color");

    if (maxTries > 0 && !isGameOver) {
        let guessWord = "guesses";
        if (maxTries === 1) {
            guessWord = "guess";
        }
        
        statusText.textContent = `Wrong guess! Keep trying. ${maxTries} ${guessWord} left.`;
    } else if (isGameOver) {
        const $button = document.querySelector("button.submit");

        $button.style.cursor = "not-allowed";
        statusText.textContent = `Congratulations! You guessed it right! 🎉`;
    }

    if (maxTries === 0 && !isGameOver) {
        const correctAnswer = rgbaToHex(targetColorDiv.style.backgroundColor);

        statusText.textContent += ` The correct answer was: #${correctAnswer}`;
    }
}

function setColorOfGuessDiv(guessedHexInput) {
    const $guessDiv = document.querySelector(".guess div.color");
    $guessDiv.style.backgroundColor = guessedHexInput;
}

function addGuess(guessedHexInput) {
    const guessedCharacters = guessedHexInput.split("").slice(1);
    const targetColorDiv = document.querySelector(".target div.color");
    const targetColor = rgbaToHex(targetColorDiv.style.backgroundColor);
    const secondSection = document.querySelector(
        "section:nth-of-type(2) #rows-inject"
    );

    const containerDiv = document.createElement("div");

    guessedCharacters.forEach((char, index) => {
        const div = document.createElement("div");
        const valueParagraph = document.createElement("p");
        const emojiParagraph = document.createElement("p");

        valueParagraph.textContent = char;
        emojiParagraph.textContent = determineHigherOrLower(
            char,
            targetColor.charAt(index)
        );

        div.appendChild(valueParagraph);
        div.appendChild(emojiParagraph);
        div.style.border = `3px solid #${guessedCharacters.join("")}`;
        containerDiv.appendChild(div);
    });

    secondSection.insertAdjacentElement("afterbegin", containerDiv);
}

function determineHigherOrLower(guessedChar, targetChar) {
    const hexDigits = "0123456789ABCDEF";
    const guessedCharCode = hexDigits.indexOf(guessedChar.toUpperCase());
    const targetCharCode = hexDigits.indexOf(targetChar.toUpperCase());
    const threshold = 2;

    if (guessedCharCode === targetCharCode) {
        return "✅";
    } else if (guessedCharCode < targetCharCode - threshold) {
        return "⏫";
    } else if (guessedCharCode < targetCharCode) {
        return "🔼";
    } else if (guessedCharCode > targetCharCode + threshold) {
        return "⏬";
    } else {
        return "🔽";
    }
}

function randomHexColor() {
    return `#${Math.random().toString(16).slice(2, 8).padEnd(6, "0")}`;
}

function rgbaToHex(rgba) {
    const values = rgba.match(/\d+/g);
    const hex = values
        .slice(0, 3)
        .map((value) => parseInt(value).toString(16).padStart(2, "0"))
        .join("");

    return `${hex.toUpperCase()}`;
}

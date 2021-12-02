document.addEventListener('DOMContentLoaded', function () {
    let numberOfWords = 10;
    let guessCount = 4;
    let password = '';

    let start = document.getElementById('start');

    start.addEventListener('click', function () {
        toggleClass(document.getElementById('start-screen'), 'hide', 'show');
        toggleClass(document.getElementById('game-screen'), 'hide', 'show');

        startGame();
    });


    function toggleClass(element) {
        for (let i = 1; i < arguments.length; i++){
            element.classList.toggle(arguments[i]);
        }
    }


    function startGame() {
        let wordsList = document.getElementById('word-list');

        let randomWords = getRandomValues(words, numberOfWords);
        
        randomWords.forEach(word => {
            let li = document.createElement('li');
            li.innerText = word;
            wordsList.appendChild(li);
        });

        password = getRandomValues(randomWords, 1)[0];
        // console.log(password);
        setGuessCount(guessCount);

        wordsList.addEventListener('click', updateGame);
    }


    function getRandomValues(array, count) {
        return shuffle(array).slice(0, count);
    }

    function shuffle(array) {
        let copiedArr = array.slice();

        for (let idx1 = copiedArr.length - 1; idx1 > 0; idx1--){
            let idx2 = Math.floor(Math.random() * (idx1 + 1));

            // swap idx1 and idx2
            [copiedArr[idx1], copiedArr[idx2]] = [copiedArr[idx2], copiedArr[idx1]];
        }

        return copiedArr;
    }

    function setGuessCount(newCount) {
        guessCount = newCount;
        document.getElementById('guesses-remaining').innerText =
            `Guesses remaining ${guessCount}.`;
    }


    function updateGame(e) {
        if (e.target.tagName === 'LI' && !e.target.classList.contains('disabled')) {
            // grab guessed word, check it against password, update view
            let guess = e.target.innerText;
            let similarityScore = compareWords(guess, password);

            e.target.classList.add('disabled');
            e.target.innerText = `${guess} ---> Matching Letters: ${similarityScore}`;

            setGuessCount(guessCount - 1);

            // check whether the game is over
            if (similarityScore === password.length) {
                toggleClass(document.getElementById('winner'), 'hide', 'show');
                this.removeEventListener('click', updateGame);
            } else if (guessCount === 0) {
                toggleClass(document.getElementById('loser'), 'hide', 'show');
                this.removeEventListener('click', updateGame);
            }
        }
    }


    function compareWords(word1, word2) {
        if (word1.length !== word2.length) {
            throw 'Words must have the same length';
        }
        let count = 0;
        for (let i = 0; i < word1.length; i++){
            if (word1[i] === word2[i]) {
                count++;
            }
        }

        return count;
    }
});
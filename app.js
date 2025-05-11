'use strict';

// Psuedocode

// Create a visually appealing Kiseki quiz that has an array of questions, when the user starts the game via button/prompt the queries will appear and if the user correctly answers them he will move onto the next ones. Should he answer all 10 of them that means he won the game. However, failing to answer 3 times would result in a loss.

// Steps:

// 1. I mean why do I even bother at this point we know what the first step is right..? Connect the HTML and Javascript using however many elements as you may need.

// 2. Create a function that produces model of 10 questions.

// 3. Create a shuffle function that will shuffle the array of questions and select one at random. Recommended method is fisher yates, would it be appropriate for this situation? That remains to be seen. Play with it until you could contrive a working solution.

// 4. Implement a function that generates buttons and enable it so that when the user clicks it, the game will begin and the entirety of the UI and functionality will be applied.

// 5. Deftly contrive a way to match the user's choice and the questions themselves that will either move him to the next phase or reduce the players' remaining tries.

// 6. Make a function that will count losses or retries and when the user surpasses 3 tried he ends up losing.

// 7. Create a function that displays a clever message depending on the games' situation.

// 8. Make a victory function that will congratulate the winner when he has answered all the questions correctly.

// 9. Implement a reset game function that will reset everything to its starting state when the user click on the reset button that we will be creating within this function.

// 10. Add 2 more levels, for level 2 conjure 20 questions as for level 3... Make that 30!

// 11. Add a timelimit feature. The timer will be 10 seconds. Should the player failed to answer correctly in that timeframe, it means ending the game

// 12. Add music to the game to make it lively and more immersive. Preferably Kiseki music.

// 13. STYLE BEAUTILFULLY! (As Bleublanc would no doubt say..) - Visually enhance and glorify this project so it can stand as a great measure of plateau compared with your other projects and finally, upload it to Github!

const container = document.querySelector('.main-container');
const resultDisplay = document.getElementById('result');
const buttonsContainer = document.createElement('div');
container.appendChild(buttonsContainer);
buttonsContainer.classList.add('buttons-container');
const lossMessage = document.createElement('div');
lossMessage.classList.add('loss-message');
container.appendChild(lossMessage);
const audioTracks = {
    begin: new Audio('BGM/Sky_FC.mp3'),
    danger: new Audio('BGM/Sky_SC_Danger.mp3'),
    lose: new Audio('BGM/Zero_Failed.mp3'),
    win: new Audio('BGM/Cold_Steel_Victory.mp3')
};
audioTracks.begin.volume = 0.5;
audioTracks.begin.loop = true;
audioTracks.danger.volume = 0.5;
audioTracks.danger.loop = true;
audioTracks.lose.volume = 0.5;
audioTracks.lose.loop = true;
audioTracks.win.volume = 0.5;
audioTracks.win.loop = true;

let tierOneAvailableQuestions = [];
let tierTwoAvailableQuestions = [];
let tierThreeAvailableQuestions = [];
let currentQuestionIndex = 0;
let failCount = 0;
const MAX_FAILURES = 5;
let lives;
let remainingLives = MAX_FAILURES;
const LIVES_ICON = `<img src="Images/Bracer_Emblem.png" alt="lives-icon" style="width:50px; height:50px">`;
let questionsAnswered = 0;
let currentLevel = 1;
let isGameOn = false;
let resultTimeout = null;

const TIME_LIMIT = 500;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let timerDisplay;

const TOTAL_QUESTIONS_PER_LEVEL = {
    tierOne: 1,
    tierTwo: 1,
    tierThree: 1
};

function produceQuestionsAndAnswers(tier = 'tierOne') {
    const questionsAndAnswersTierOne = [
        {
            question: `What is the name of the continent that the Kiseki world is located in?`,
            answers: [`Zemuria`, `Zemurian`, `Rivellon`, `Europe`],
            correctAnswer: 'Zemuria'
        },
        {
            question: `What is the last name of Estelle the first protagonist in the series?`,
            answers: [`Bright`, `Schwarzer`, `Bannings`, `Astray`],
            correctAnswer: 'Bright'
        },
        {
            question: `Where are the SSS (Special Support Section) based in?`,
            answers: [`Erebonia`, `Calvard`, `Crossbell`, `Liberl`],
            correctAnswer: 'Crossbell'
        },
        {
            question: `Who is the goddess of all creation in Zemuria?`,
            answers: [`The Grand Master`, `Aurelia`, `Estelle`, `Aidios`],
            correctAnswer: 'Aidios'
        },
        {
            question: `How many Sept-Terrions were bestowed upon humanity by the goddess?`,
            answers: [`4`, `7`, `2`, `1`],
            correctAnswer: '7'
        },
        {
            question: `Who is the founder of the Eight Leaves One Blade School?`,
            answers: [`Cassius Bright`, `Victor S. Arseid`, `Ein Selnate`, `Yun Ka Fai`],
            correctAnswer: 'Yun Ka Fai'
        },
        {
            question: `Which character has been repeatedly appearing in every arc?`,
            answers: [`Rean`, `Renne`, `Estelle`, `Van`],
            correctAnswer: 'Renne'
        },
        {
            question: `How many games are currently existing in the Kiseki franchise?`,
            answers: [`6`, `10`, `13`, `11`],
            correctAnswer: '13'
        },
        {
            question: `What is the name of the calamity that devastated North Ambria?`,
            answers: [`The Salt Pale`, `McBurn`, `Forest Fires`, `Communism`],
            correctAnswer: 'The Salt Pale'
        },
        {
            question: `In which Cold Steel game is it revealed that the empire's blood and iron chancellor Giliath Osborne is the biological father of Rean?`,
            answers: [`Cold Steel 1`, `Cold Steel 2`, `Cold Steel 3`, `Cold Steel 4`],
            correctAnswer: 'Cold Steel 2'
        },
    ];

    const questionsAndAnswersTierTwo = [
        {
            question: `What are the names of Rean's foster parents?`,
            answers: [`Bernard and Lucia`, `Teo and Lucia`, `Cassius and Lena`, `Osborne and Kasia`],
            correctAnswer: 'Teo and Lucia'
        },
        {
            question: `Which entity is the cause of the Dark Dragon Zoro Agruga's creation?`,
            answers: [`Roselia`, `Aidios`, `Argres`, `Ragnard`],
            correctAnswer: 'Argres'
        },
        {
            question: `Which one of those characters is NOT part of the four great houses of Erebonia's nobility?`,
            answers: [`Musse Egret`, `Angelica Rogner`, `Towa Herschel`, `Rufus Albarea`],
            correctAnswer: 'Towa Herschel'
        },
        {
            question: `Which form of the Eight Leaves One Blade is Arios MacLaine a master of?`,
            answers: [`Helix`, `Gale`, `Void`, `Morning Moon`],
            correctAnswer: 'Gale'
        },
        {
            question: `Which one of among these Divine Knights is the most powerful?`,
            answers: [`Valimar`, `Ordine`, `Zector`, `Testa-Rossa`],
            correctAnswer: 'Testa-Rossa'
        },
        {
            question: `Which group is the counterpart of the Erebonian witches?`,
            answers: [`Ouroboros`, `Marduk`, `Gnomes`, `D.G Cult`],
            correctAnswer: 'Gnomes'
        },
        {
            question: `Which group is considered to be the most vile and detested in the series?`,
            answers: [`Ouroboros`, `The Church`, `D.G Cult`, `The Garden`],
            correctAnswer: 'D.G Cult'
        },
        {
            question: `Which nation is considered to be a superpower among these available options?`,
            answers: [`Leman`, `Liberl`, `Calvard`, `Remiferia`],
            correctAnswer: 'Calvard'
        },
        {
            question: `In the world of Zemuria, which nation is depicted as Nazi Germany from the Second World War?`,
            answers: [`Calvard`, `Liberl`, `North Ambria`, `Erebonia`],
            correctAnswer: 'Erebonia'
        },
        {
            question: `Weissmann was a refugee orphan... But from whence?`,
            answers: [`Erebonia`, `Liberl`, `Jurai`, `North Ambria`],
            correctAnswer: 'North Ambria'
        },
        {
            question: `Which martial arts style does Van Arkride employ?`,
            answers: [`Taito`, `Gekka`, `Vander`, `Kunlun`],
            correctAnswer: 'Kunlun'
        },
        {
            question: `Which form of the Eight Leaves One Blade is Rean Schwarzer a master of?`,
            answers: [`Scarlet Sky`, `Helix`, `Gale`, `Void`],
            correctAnswer: 'Void'
        },
        {
            question: `Which form of the Eight Leaves One Blade is Cassius Bright a master of?`,
            answers: [`Void`, `Helix`, `Gale`, `Autumn Leaves`],
            correctAnswer: 'Helix'
        },
        {
            question: `Which is one of the Empire's foremost swordsmanship schools?`,
            answers: [`Taito`, `Kunlun`, `Vander`, `Hundred-Form`],
            correctAnswer: 'Vander'
        },
        {
            question: `How old is Campanella?`,
            answers: [`14`, `18`, `Unknown`, `999`],
            correctAnswer: 'Unknown'
        },
        {
            question: `Who is Enforcer X of Ouroboros?`,
            answers: [`Walter`, `Sharon`, `Luciola`, `Bleublanc`],
            correctAnswer: 'Bleublanc'
        },
        {
            question: `Who are directly in opposition and in contrast to The Septian Church?`,
            answers: [`D.G Cult`, `Bracer Guild`, `Ouroboros`, `Almata`],
            correctAnswer: 'Ouroboros'
        },
        {
            question: `Which country is the largest in the continent of Zemuria by land mass?`,
            answers: [`Calvard`, `Erebonia`, `Crossbell`, `Remiferia`],
            correctAnswer: 'Erebonia'
        },
        {
            question: `Which is the main antagonistic faction in Cold Steel 1?`,
            answers: [`Almata`, `Imperial Liberation Front`, `Intelligence Division`, `Ouroboros`],
            correctAnswer: 'Imperial Liberation Front'
        },
        {
            question: `Which Kiseki game has the largest characters script?`,
            answers: [`Cold Steel 4`, `Cold Steel 3`, `Sky SC`, `DayBreak`],
            correctAnswer: 'Cold Steel 4'
        },
    ];

    const questionsAndAnswersTierThree = [
        {
            question: `When was Sky FC first released in Japan?`,
            answers: [`2005`, `2006`, `2008`, `2004`],
            correctAnswer: '2004'
        },
        {
            question: `Which is considered the smallest state among those states?`,
            answers: [`Jurai`, `Leman`, `Ored`, `Crossbell`],
            correctAnswer: 'Crossbell'
        },
        {
            question: `Who among the three is NOT a disciple of Claude Epstein?`,
            answers: [`Albert Russell`, `Gerhard Schmidt`, `Latoya Hamilton`, `Joerg Rosenberg`],
            correctAnswer: 'Joerg Rosenberg'
        },
        {
            question: `Which game did NOT end in a cliffhanger?`,
            answers: [`Cold Steel 1`, `Sky FC`, `Horizon`, `Cold Steel 4`],
            correctAnswer: 'Cold Steel 4'
        },
        {
            question: `Which game did end in a cliffhanger?`,
            answers: [`Cold Steel 3`, `Cold Steel 2`, `Sky SC`, `Zero`],
            correctAnswer: 'Cold Steel 3'
        },
        {
            question: `Who is Enforcer XIX of Ouroboros?`,
            answers: [`Ulrica`, `Cedric`, `Renne`, `Joshua`],
            correctAnswer: 'Cedric'
        },
        {
            question: `Who is the strongest enforcer among Ouroboros?`,
            answers: [`Leonhart`, `McBurn`, `Arianrhod`, `Simeon`],
            correctAnswer: 'McBurn'
        },
        {
            question: `What was Sharon Kreuger's speciality during her days in Ouroboros?`,
            answers: [`Assassination`, `Direct Conflict`, `Negotiating`, `Communication`],
            correctAnswer: 'Assassination'
        },
        {
            question: `What was the name of the twisted place that Renne was initially a part of before joining Ouroboros?`,
            answers: [`D.G Cult`, `The Garden`, `Almata`, `Paradise`],
            correctAnswer: 'Paradise'
        },
        {
            question: `Which Kiseki game introduced the concept of the "Great Twilight"?`,
            answers: [`Cold Steel 2`, `Cold Steel 3`, `Cold Steel 4`, `Sky 3rd`],
            correctAnswer: 'Cold Steel 3'
        },
        {
            question: `Who is the leader of the Imperial Liberation Front in Cold Steel 1?`,
            answers: [`Crow Armbrust`, `Vulcan`, `Scarlet`, `Michael Gideon`],
            correctAnswer: 'Crow Armbrust'
        },
        {
            question: `What is the name of the ancient dragon who guards the Sept-Terrion of Space in the Sky arc?`,
            answers: [`Ragnard`, `Zoro-Agruga`, `Regnart`, `Argres`],
            correctAnswer: 'Ragnard'
        },
        {
            question: `Which character is revealed to be the "Grandmaster" of Ouroboros in the Kiseki series?`,
            answers: [`Arianrhod`, `Nina`, `Weissmann`, `Unknown`],
            correctAnswer: 'Unknown'
        },
        {
            question: `What is the name of the airship used by the Special Support Section in the Crossbell arc?`,
            answers: [`The Merkabah`, `The Arseille`, `The Pantagruel`, `The Courageous`],
            correctAnswer: 'The Merkabah'
        },
        {
            question: `Which Kiseki character is known as the "Radiant Blademaster" of Erebonia?`,
            answers: [`Victor S. Arseid`, `Aurelia Le Guin`, `Cassius Bright`, `Yun Ka-Fai`],
            correctAnswer: 'Victor S. Arseid'
        },
        {
            question: `What is the true identity of the "C" character's version revealed in Daybreak 2?`,
            answers: [`Crow Armbrust`, `Rufus Albarea`, `Dingo Brad`, `Cedric Reise Arnor`],
            correctAnswer: 'Dingo Brad'
        },
        {
            question: `Which organization is responsible for the creation of the homunculus KeA in the Crossbell arc?`,
            answers: [`The Crois Clan`, `D.G Cult`, `The Gnomes`, `The Hexen Clan`],
            correctAnswer: 'The Crois Clan'
        },
        {
            question: `Which Kiseki character is known as the "Azure Siegfried"?`,
            answers: [`Crow Armbrust`, `Rufus Albarea`, `Shirley Orlando`, `Campanella`],
            correctAnswer: 'Crow Armbrust'
        },
        {
            question: `What is the name of the mysterious organization introduced in Daybreak 1 that opposes Ouroboros?`,
            answers: [`Almata`, `The Garden`, `Marduk`, `The Hexen Clan`],
            correctAnswer: 'Almata'
        },
        {
            question: `Which character serves as the "Dominion" of the Gralsritter in the Sky arc?`,
            answers: [`Kevin Graham`, `Ries Argent`, `Thomas Lysander`, `Ein Selnate`],
            correctAnswer: 'Kevin Graham'
        },
        {
            question: `What is the name of the Sept-Terrion associated with the element of Earth in the Kiseki series?`,
            answers: [`The Ark of Destiny`, `The Demiourgos`, `The Lost Zem`, `The Mirage`],
            correctAnswer: 'The Lost Zem'
        },
        {
            question: `Which Kiseki game features the "Phantasmal Blaze Plan" as a central plot element?`,
            answers: [`Sky 3rd`, `Cold Steel 2`, `Cold Steel 3`, `Azure`],
            correctAnswer: 'Cold Steel 2'
        },
        {
            question: `Who is the true identity of the "Black Alberich" in the Cold Steel series?`,
            answers: [`Franz Reinford`, `Giliath Osborne`, `Rufus Albarea`, `Ishmelga`],
            correctAnswer: 'Franz Reinford'
        },
        {
            question: `Which character is the leader of the Hexen Clan in the Erebonia arc?`,
            answers: [`Roselia`, `Vita Clotilde`, `Emma Millstein`, `Celine`],
            correctAnswer: 'Roselia'
        },
        {
            question: `Which Kiseki character is known as the "Divine Blade Of Silver"?`,
            answers: [`Cassius Bright`, `Shizuna Rem Misurugi`, `Rean Schwarzer`, `Leonhart`],
            correctAnswer: 'Shizuna Rem Misurugi'
        },
        {
            question: `What is the capacity of the maximum orbment slots in the Calvard arc?`,
            answers: [`7`, `6`, `15`, `16`],
            correctAnswer: '16'
        },
        {
            question: `Which Kiseki game introduced the Vantage Masters card game?`,
            answers: [`Cold Steel 1`, `Zero`, `Cold Steel 3`, `Daybreak`],
            correctAnswer: 'Cold Steel 3'
        },
        {
            question: `Which element has healing attributes in the quartz system?`,
            answers: [`Wind`, `Mirage`, `Water`, `Time`],
            correctAnswer: 'Water'
        },
        {
            question: `At what year does the Kiseki franchise's story begin?`,
            answers: [`1154`, `1204`, `1202`, `1192`],
            correctAnswer: '1202'
        },
        {
            question: `Which element is NOT part of the higher elements?`,
            answers: [`Time`, `Wind`, `Space`, `Mirage`],
            correctAnswer: 'Wind'
        },
    ];

    const questionsByTier = {
        tierOne: {
            available: tierOneAvailableQuestions,
            source: questionsAndAnswersTierOne
        },
        tierTwo: {
            available: tierTwoAvailableQuestions,
            source: questionsAndAnswersTierTwo
        },
        tierThree: {
            available: tierThreeAvailableQuestions,
            source: questionsAndAnswersTierThree
        }
    };

    const currentTier = questionsByTier[tier];

    if (currentTier.available.length === 0) {
        currentTier.available.push(...shuffle([...currentTier.source]));
    }

    if (currentTier.available.length === 0) {
        return undefined;
    }

    return currentTier.available.shift();
}

function startTimer() {
    stopTimer();
    timeLeft = TIME_LIMIT;
    timerDisplay.textContent = `Time Left: ${timeLeft} seconds remaining`;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft} seconds remaining`;

        if (timeLeft <= 0) {
            stopTimer();
            audioTracks.begin.pause();
            audioTracks.begin.currentTime = 0;
            audioTracks.danger.pause();
            audioTracks.danger.currentTime = 0;
            audioTracks.lose.play();
            const answerButtons = document.querySelectorAll('.answer-button');
            answerButtons.forEach(btn => btn.disabled = true);
            resultDisplay.textContent = 'Time\'s up!';
            buttonsContainer.insertAdjacentElement('afterend', resultDisplay);
            setTimeout(() => {
                resultDisplay.textContent = '';
                losingMessage('Time ran out! Game Over.');
                setTimeout(() => {
                    resetGame();
                }, 3000);
            }, 1500);
            isGameOn = false;
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function generateUtilities() {
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Game?';
    resultDisplay.insertAdjacentElement('beforebegin', startButton);
    startButton.classList.add('start-button');
    const tutorialMessage = document.querySelector('.tutorial');

    timerDisplay = document.createElement('div');
    timerDisplay.classList.add('timer-display');
    timerDisplay.textContent = `Time Left: ${TIME_LIMIT} seconds remaining`;
    timerDisplay.classList.add('hidden');
    startButton.insertAdjacentElement('afterend', timerDisplay);

    startButton.addEventListener('click', () => {
        if (isGameOn) return;
        isGameOn = true;
        buttonsContainer.innerHTML = '';
        audioTracks.begin.play();
        tutorialMessage.style.display = 'none';
        startButton.classList.add('hidden');
        timerDisplay.classList.remove('hidden');
        lives = document.createElement('div');
        lives.classList.add('lives-icon');

        const tier = currentLevel === 1 ? 'tierOne' : currentLevel === 2 ? 'tierTwo' : 'tierThree';
        const randomQuestion = produceQuestionsAndAnswers(tier);
        console.log('Question text:', randomQuestion?.question);

        if (!randomQuestion) {
            resultDisplay.textContent = 'Error: No questions available for this level.';
            return;
        }

        const questionElement = document.createElement('h2');
        startButton.insertAdjacentElement('afterend', questionElement);
        questionElement.classList.add('question');
        questionElement.textContent = randomQuestion.question;
        lives.innerHTML = LIVES_ICON.repeat(remainingLives);
        lives.classList.add('lives');
        questionElement.insertAdjacentElement('beforebegin', lives);
        questionElement.insertAdjacentElement('afterend', timerDisplay);


        const shuffledAnswers = shuffle([...randomQuestion.answers]);

        shuffledAnswers.forEach(answer => {
            const answerButton = document.createElement('button');
            answerButton.textContent = answer;
            answerButton.classList.add('answer-button');
            buttonsContainer.appendChild(answerButton);

            answerButton.addEventListener('click', () => {
                if (answer === randomQuestion.correctAnswer) {
                    stopTimer();
                    console.log('Correct!');
                    resultDisplay.textContent = 'Amazing! You are correct!';
                    timerDisplay.classList.add('hidden');
                    questionsAnswered++;
                    console.log('Questions correctly answered:', questionsAnswered);
                    questionElement.remove();
                    document.querySelectorAll('.answer-button').forEach(btn => btn.remove());
                    setTimeout(() => {
                        resultDisplay.textContent = '';
                    }, 1000);

                    setTimeout(() => {
                        const nextTier = currentLevel === 1 ? 'tierOne' : currentLevel === 2 ? 'tierTwo' : 'tierThree';
                        const nextQuestion = produceQuestionsAndAnswers(nextTier);
                        timerDisplay.classList.remove('hidden');
                        renderQuestions(nextQuestion);
                        console.log('Question text:', nextQuestion?.question);
                    }, 1000);
                } else {
                    console.log('Wrong!');
                    resultDisplay.textContent = `You're very, deadly wrong!`;
                    answerButton.disabled = true;
                    implementLoss();
                }
            });
            timerDisplay.insertAdjacentElement('afterend', answerButton);
            buttonsContainer.appendChild(answerButton);
        });
        startTimer();
    });
}
generateUtilities();

function renderQuestions(questionObj) {
    if (!questionObj) {
        resultDisplay.textContent = 'No more questions. You rock!';
        return;
    }

    document.querySelectorAll('.question').forEach(question => question.remove());
    document.querySelectorAll('.answer-button').forEach(answer => answer.remove());
    buttonsContainer.innerHTML = '';

    const questionElement = document.createElement('h2');
    questionElement.classList.add('question');
    questionElement.textContent = questionObj.question;

    const startButton = document.querySelector('.start-button');

    if (lives) {
        if (lives.parentNode) {
            lives.parentNode.removeChild(lives);
        }
        startButton.insertAdjacentElement('afterend', lives);
    }
    lives.insertAdjacentElement('afterend', questionElement);
    questionElement.insertAdjacentElement('afterend', timerDisplay);

    const shuffledAnswers = shuffle([...questionObj.answers]);

    shuffledAnswers.forEach(answer => {
        const answerButton = document.createElement('button');
        answerButton.textContent = answer;
        answerButton.classList.add('answer-button');

        answerButton.addEventListener('click', () => {
            if (answer === questionObj.correctAnswer) {
                stopTimer();
                console.log('Correct!');
                resultDisplay.textContent = 'Amazing! You are correct!';
                timerDisplay.classList.add('hidden');
                questionsAnswered++;
                console.log('Questions correctly answered:', questionsAnswered);
                setTimeout(() => {
                    resultDisplay.textContent = '';
                }, 1000);

                questionElement.remove();
                document.querySelectorAll('.answer-button').forEach(btn => btn.remove());

                setTimeout(() => {
                    const totalQuestions = TOTAL_QUESTIONS_PER_LEVEL[currentLevel === 1 ? 'tierOne' : currentLevel === 2 ? 'tierTwo' : 'tierThree'];

                    if (questionsAnswered >= totalQuestions) {
                        if (currentLevel === 1) {
                            currentLevel = 2;
                            timerDisplay.classList.remove('hidden');
                            questionsAnswered = 0;
                            tierOneAvailableQuestions = [];
                            tierTwoAvailableQuestions = [];
                            stopTimer();
                            timerDisplay.classList.add('hidden');
                            resultDisplay.textContent = 'Incredible...! Level 1 Complete! Starting Level 2...';
                            setTimeout(() => {
                                resultDisplay.textContent = '';
                                const nextQuestion = produceQuestionsAndAnswers('tierTwo');
                                renderQuestions(nextQuestion);
                                timerDisplay.classList.remove('hidden');
                            }, 2000);
                            return;
                        } else if (currentLevel === 2) {
                            currentLevel = 3;
                            questionsAnswered = 0;
                            tierTwoAvailableQuestions = [];
                            tierThreeAvailableQuestions = [];
                            stopTimer();
                            timerDisplay.classList.add('hidden');
                            resultDisplay.textContent = 'Truly incredible...! Level 2 Complete! Starting Level 3...';
                            setTimeout(() => {
                                resultDisplay.textContent = '';
                                const nextQuestion = produceQuestionsAndAnswers('tierThree');
                                renderQuestions(nextQuestion);
                                timerDisplay.classList.remove('hidden');
                            }, 2000);
                            return;
                        } else {
                            audioTracks.begin.pause();
                            audioTracks.begin.currentTime = 0;
                            audioTracks.danger.pause();
                            audioTracks.danger.currentTime = 0;
                            audioTracks.win.play();
                            victoryMessage();
                            isGameOn = false;
                            setTimeout(() => {
                                resetGame(true);
                            }, 3000);
                            return;
                        }
                    }

                    const nextTier = currentLevel === 1 ? 'tierOne' : currentLevel === 2 ? 'tierTwo' : 'tierThree';
                    const nextQuestion = produceQuestionsAndAnswers(nextTier);
                    console.log('Question text:', nextQuestion?.question);
                    timerDisplay.classList.remove('hidden');
                    renderQuestions(nextQuestion);
                }, 1000);
            } else {
                console.log('Wrong!');
                resultDisplay.textContent = `You're very, deadly wrong!`;
                answerButton.disabled = true;
                implementLoss();
            }
        });
        timerDisplay.insertAdjacentElement('afterend', answerButton);
        buttonsContainer.appendChild(answerButton);
    });
    startTimer();
}

function implementLoss() {
    failCount++;
    remainingLives--;
    buttonsContainer.insertAdjacentElement('afterend', resultDisplay);
    if (lives) {
        lives.innerHTML = '';
        lives.innerHTML = LIVES_ICON.repeat(remainingLives);
    }
    if (resultTimeout) {
        clearTimeout(resultTimeout);
        resultTimeout = null;
    }

    if (remainingLives === 1) {
        audioTracks.begin.pause();
        audioTracks.begin.currentTime = 0;
        audioTracks.danger.play();
    }

    if (MAX_FAILURES === failCount) {
        const answerButton = document.querySelectorAll('.answer-button');
        answerButton.forEach(answerBtn => answerBtn.disabled = true);
        audioTracks.begin.pause();
        audioTracks.begin.currentTime = 0;
        audioTracks.danger.pause();
        audioTracks.danger.currentTime = 0;
        audioTracks.lose.play();
        resultDisplay.textContent = '';
        timerDisplay.classList.add('hidden');
        document.querySelector('h2').classList.add('hidden');
        stopTimer();

        resultTimeout = setTimeout(() => {
            setTimeout(() => {
                losingMessage();
                setTimeout(() => {
                    resetGame();
                }, 3000);
            }, 100);
        }, 100);
        isGameOn = false;
    } else {
        resultTimeout = setTimeout(() => {
            resultDisplay.textContent = '';
        }, 1500);
    }
}

function victoryMessage() {
  lossMessage.classList.add('hidden');
  const victoryMessageElement = document.createElement('div');
  victoryMessageElement.classList.add('victory-message');
  victoryMessageElement.textContent = `Hahaha! AMAZING! You've conquered the Kiseki's ultimate trivia. You are quite a spectacular specimen, aren't you?`;
  container.appendChild(victoryMessageElement);

  if (lives) lives.classList.add('hidden');
  document.querySelectorAll('.question').forEach(q => q.classList.add('hidden'));
  resultDisplay.classList.add('hidden');
  timerDisplay.classList.add('hidden');
}


function losingMessage(customMessage) {
    lossMessage.textContent = customMessage || `GAME OVER! You've lost the Kiseki Trivia.. Keep on trying, we're sure someone of your Kiseki knowledge caliber could manage that, right?`;
    lossMessage.classList.remove('hidden');
    if (lives) lives.classList.add('hidden');
    document.querySelectorAll('.question').forEach(q => q.classList.add('hidden'));
    resultDisplay.classList.add('hidden');
    timerDisplay.classList.add('hidden');
    return lossMessage;
}

function resetGame(playerWon = false) {
    stopTimer();
    isGameOn = false;

    buttonsContainer.innerHTML = "";
    const oldReset = document.querySelector(".reset-button");
    if (oldReset) oldReset.remove();

    if (playerWon) {
        lossMessage.classList.add("hidden");
        lossMessage.textContent = "";
    }
    if (!playerWon) {
        const oldVictory = document.querySelector(".victory-message");
        if (oldVictory) oldVictory.remove();
    }

    const resetButton = document.createElement("button");
    resetButton.classList.add("reset-button");
    resetButton.textContent = "Restart Quiz?";

    if (!playerWon) {
        lossMessage.classList.remove("hidden");
    }

    const ReferencedElement = playerWon
        ? document.querySelector(".victory-message")
        : lossMessage;

    if (ReferencedElement && ReferencedElement.parentNode) {
        ReferencedElement.insertAdjacentElement("afterend", resetButton);
    } else {
        container.appendChild(resetButton);
    }

    resetButton.addEventListener("click", () => {
        if (isGameOn) return;
        isGameOn = true;

        const victoryEl = document.querySelector(".victory-message");
        if (victoryEl) victoryEl.remove();

        ["danger", "lose", "win"].forEach(key => {
            audioTracks[key].pause();
            audioTracks[key].currentTime = 0;
        });
        audioTracks.begin.play();
        document.querySelectorAll(".answer-button").forEach(btn => btn.remove());
        remainingLives = MAX_FAILURES;
        lives.innerHTML = LIVES_ICON.repeat(remainingLives);
        lives.classList.remove("hidden");
        lossMessage.classList.add("hidden");
        resetButton.classList.add("hidden");
        resultDisplay.classList.remove("hidden");
        timerDisplay.classList.remove("hidden");
        tierOneAvailableQuestions = [];
        tierTwoAvailableQuestions = [];
        tierThreeAvailableQuestions = [];
        questionsAnswered = 0;
        failCount = 0;
        currentLevel = 1;

        const firstQuestion = produceQuestionsAndAnswers("tierOne");
        renderQuestions(firstQuestion);
    });
}

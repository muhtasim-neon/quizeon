const quizData = [
  { hira: 'あ', romaji: 'a' }, { hira: 'い', romaji: 'i' }, { hira: 'う', romaji: 'u' }, { hira: 'え', romaji: 'e' }, { hira: 'お', romaji: 'o' },
  { hira: 'か', romaji: 'ka' }, { hira: 'き', romaji: 'ki' }, { hira: 'く', romaji: 'ku' }, { hira: 'け', romaji: 'ke' }, { hira: 'こ', romaji: 'ko' },
  { hira: 'さ', romaji: 'sa' }, { hira: 'し', romaji: 'shi' }, { hira: 'す', romaji: 'su' }, { hira: 'せ', romaji: 'se' }, { hira: 'そ', romaji: 'so' },
  { hira: 'た', romaji: 'ta' }, { hira: 'ち', romaji: 'chi' }, { hira: 'つ', romaji: 'tsu' }, { hira: 'て', romaji: 'te' }, { hira: 'と', romaji: 'to' },
  { hira: 'な', romaji: 'na' }, { hira: 'に', romaji: 'ni' }, { hira: 'ぬ', romaji: 'nu' }, { hira: 'ね', romaji: 'ne' }, { hira: 'の', romaji: 'no' },
  { hira: 'は', romaji: 'ha' }, { hira: 'ひ', romaji: 'hi' }, { hira: 'ふ', romaji: 'fu' }, { hira: 'へ', romaji: 'he' }, { hira: 'ほ', romaji: 'ho' },
  { hira: 'ま', romaji: 'ma' }, { hira: 'み', romaji: 'mi' }, { hira: 'む', romaji: 'mu' }, { hira: 'め', romaji: 'me' }, { hira: 'も', romaji: 'mo' },
  { hira: 'や', romaji: 'ya' }, { hira: 'ゆ', romaji: 'yu' }, { hira: 'よ', romaji: 'yo' },
  { hira: 'ら', romaji: 'ra' }, { hira: 'り', romaji: 'ri' }, { hira: 'る', romaji: 'ru' }, { hira: 'れ', romaji: 're' }, { hira: 'ろ', romaji: 'ro' },
  { hira: 'わ', romaji: 'wa' }, { hira: 'を', romaji: 'wo' }, { hira: 'ん', romaji: 'n' }
];

let current = {}, score = 0, highScore = 0, time = 15, timer;
let lives = 3;

const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const card = document.getElementById("quizCard");
const hira = document.getElementById("hiraganaSide");
const romaji = document.getElementById("romajiSide");
const userInput = document.getElementById("userInput");
const resultMsg = document.getElementById("resultMsg");
const highScoreDisplay = document.getElementById("highScore");
const livesDisplay = document.getElementById("lives");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

function startTimer() {
  time = 15;
  timeDisplay.textContent = time;
  timer = setInterval(() => {
    time--;
    timeDisplay.textContent = time;
    if (time <= 0) {
      clearInterval(timer);
      handleWrong();
    }
  }, 1000);
}

function showRomaji() {
  romaji.style.display = "block";
}

function nextCard() {
  if (lives <= 0) return;
  current = quizData[Math.floor(Math.random() * quizData.length)];
  hira.textContent = current.hira;
  romaji.textContent = current.romaji;
  romaji.style.display = "none";
  userInput.value = "";
  card.classList.remove("correct", "wrong");
  resultMsg.textContent = "";
  clearInterval(timer);
  startTimer();
}

function checkAnswer() {
  if (lives <= 0) return;
  clearInterval(timer);
  const answer = userInput.value.trim().toLowerCase();
  if (answer === current.romaji) {
    card.classList.add("correct");
    correctSound.play();
    showRomaji();
    score++;
    resultMsg.textContent = "✅ Correct!";
  } else {
    handleWrong();
    return;
  }
  scoreDisplay.textContent = score;
  highScore = Math.max(score, highScore);
  highScoreDisplay.textContent = highScore;
  setTimeout(nextCard, 1000);
}

function handleWrong() {
  card.classList.add("wrong");
  wrongSound.play();
  showRomaji();
  resultMsg.textContent = "❌ Wrong!";
  lives--;
  livesDisplay.textContent = lives;
  if (lives <= 0) {
    resultMsg.textContent = "💀 Game Over! Please restart.";
    return;
  }
  setTimeout(nextCard, 1000);
}

function restartGame() {
  lives = 3;
  score = 0;
  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
  resultMsg.textContent = "";
  nextCard();
}

document.addEventListener("DOMContentLoaded", nextCard);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") checkAnswer();
});

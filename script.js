const hiraganaBasic = [['あ','a'],['い','i'],['う','u'],['え','e'],['お','o'],['か','ka'],['き','ki'],['く','ku'],['け','ke'],['こ','ko'],['さ','sa'],['し','shi'],['す','su'],['せ','se'],['そ','so'],['た','ta'],['ち','chi'],['つ','tsu'],['て','te'],['と','to'],['な','na'],['に','ni'],['ぬ','nu'],['ね','ne'],['の','no'],['は','ha'],['ひ','hi'],['ふ','fu'],['へ','he'],['ほ','ho'],['ま','ma'],['み','mi'],['む','mu'],['め','me'],['も','mo'],['や','ya'],['ゆ','yu'],['よ','yo'],['ら','ra'],['り','ri'],['る','ru'],['れ','re'],['ろ','ro'],['わ','wa'],['を','wo'],['ん','n']];
    const hiraganaDakuten = [['が','ga'],['ぎ','gi'],['ぐ','gu'],['げ','ge'],['ご','go'],['ざ','za'],['じ','ji'],['ず','zu'],['ぜ','ze'],['ぞ','zo'],['だ','da'],['ぢ','ji'],['づ','zu'],['で','de'],['ど','do'],['ば','ba'],['び','bi'],['ぶ','bu'],['べ','be'],['ぼ','bo'],['ぱ','pa'],['ぴ','pi'],['ぷ','pu'],['ぺ','pe'],['ぽ','po']];
    const hiraganaYouon = [['きゃ','kya'],['きゅ','kyu'],['きょ','kyo'],['しゃ','sha'],['しゅ','shu'],['しょ','sho'],['ちゃ','cha'],['ちゅ','chu'],['ちょ','cho'],['にゃ','nya'],['にゅ','nyu'],['にょ','nyo'],['ひゃ','hya'],['ひゅ','hyu'],['ひょ','hyo'],['みゃ','mya'],['みゅ','myu'],['みょ','myo'],['りゃ','rya'],['りゅ','ryu'],['りょ','ryo'],['ぎゃ','gya'],['ぎゅ','gyu'],['ぎょ','gyo'],['じゃ','ja'],['じゅ','ju'],['じょ','jo'],['びゃ','bya'],['びゅ','byu'],['びょ','byo'],['ぴゃ','pya'],['ぴゅ','pyu'],['ぴょ','pyo']];
    const kanaToKatakana = kana => kana.replace(/./g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60));
    const katakanaBasic = hiraganaBasic.map(([k, r]) => [kanaToKatakana(k), r]);
    const katakanaDakuten = hiraganaDakuten.map(([k, r]) => [kanaToKatakana(k), r]);
    const katakanaYouon = hiraganaYouon.map(([k, r]) => [kanaToKatakana(k), r]);

    function getKanaSet(mode) {
      switch (mode) {
        case 1: return hiraganaBasic;
        case 2: return [...hiraganaBasic, ...hiraganaDakuten, ...hiraganaYouon];
        case 3: return katakanaBasic;
        case 4: return [...katakanaBasic, ...katakanaDakuten, ...katakanaYouon];
        case 5: return shuffle([...hiraganaBasic, ...katakanaBasic]);
        case 6: return shuffle([...hiraganaBasic, ...katakanaBasic, ...hiraganaDakuten, ...katakanaDakuten, ...hiraganaYouon, ...katakanaYouon]);
        default: return hiraganaBasic;
      }
    }

    let currentMode = 1, kanaList = [], currentKana;
    let score = 0, highScore = 0, lives = 3, timeLeft = 15, timer;
    let gameOver = false;

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function pause(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function startGame(mode) {
      document.getElementById('clickSound').play();
      currentMode = mode;
      kanaList = shuffle([...getKanaSet(mode)]);
      score = 0;
      lives = 10;
      timeLeft = 15;
      gameOver = false;
      document.getElementById('score').textContent = score;
      document.getElementById('lives').textContent = lives;
      document.getElementById('resultMsg').textContent = '';
      document.getElementById('modeSelector').classList.add('hidden');
      document.getElementById('gameContainer').classList.remove('hidden');
      nextQuestion();
      startTimer();
      document.getElementById('userInput').focus();
    }

    function goBack() {
      clearInterval(timer);
      document.getElementById('clickSound').play();
      document.getElementById('gameContainer').classList.add('hidden');
      document.getElementById('modeSelector').classList.remove('hidden');
    }

    function restartGame() {
      document.getElementById('clickSound').play();
      startGame(currentMode);
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(() => {
        if (!gameOver) {
          timeLeft--;
          document.getElementById('time').textContent = timeLeft;
          if (timeLeft <= 0) {
            clearInterval(timer);
            handleIncorrect();
          }
        }
      }, 1000);
    }

    function nextQuestion() {
      if (kanaList.length === 0) kanaList = shuffle([...getKanaSet(currentMode)]);
      currentKana = kanaList.pop();
      document.getElementById('kanaChar').textContent = currentKana[0];
      document.getElementById('romajiHint').classList.add('hidden');
      document.getElementById('userInput').value = '';
      document.getElementById('resultMsg').textContent = '';
      timeLeft = 15;
      document.getElementById('time').textContent = timeLeft;
      startTimer();
    }

    async function handleCorrect() {
      document.getElementById('correctSound').play();
      const card = document.getElementById('kanaCard');
      card.classList.add('flash-green');
      document.getElementById('romajiHint').textContent = currentKana[1];
      document.getElementById('romajiHint').classList.remove('hidden');
      score++;
      if (score > highScore) {
        highScore = score;
        document.getElementById('highScore').textContent = highScore;
      }
      document.getElementById('score').textContent = score;
      //document.getElementById('resultMsg').textContent = '✅ Correct!';
      await pause(1200);
      card.classList.remove('flash-green');
      document.getElementById('romajiHint').classList.add('hidden');
      nextQuestion();
    }

    async function handleIncorrect() {
      clearInterval(timer);
      if (gameOver) return;
      document.getElementById('wrongSound').play();
      const card = document.getElementById('kanaCard');
      card.classList.add('flash-red', 'shake');
      document.getElementById('romajiHint').textContent = currentKana[1];
      document.getElementById('romajiHint').classList.remove('hidden');
      lives = Math.max(0, lives - 1);
      document.getElementById('lives').textContent = lives;
      //document.getElementById('resultMsg').textContent = `❌ Wrong!`;
      await pause(1200);
      card.classList.remove('flash-red', 'shake');
      document.getElementById('romajiHint').classList.add('hidden');
      if (lives <= 0) {
        gameOver = true;
        document.getElementById('kanaChar').textContent = 'Game Over';
      } else {
        nextQuestion();
      }
    }

    document.getElementById('userInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !gameOver) {
        const userAnswer = this.value.trim().toLowerCase();
        if (userAnswer === currentKana[1]) handleCorrect();
        else handleIncorrect();
      }
    });

/**
 * LexiDrop - 英単語ブロック落下タイピングゲーム
 * JavaScript Game Logic & Web Audio Synthesizer
 */

// --- 語彙ライブラリ (words.json から動的読み込み & バックアップ保持) ---
let wordLibrary = {
  translations: {
    "cat": "猫", "dog": "犬", "sun": "太陽", "sky": "空", "run": "走る", "cup": "カップ",
    "box": "箱", "star": "星", "red": "赤", "blue": "青", "hat": "帽子", "pen": "ペン",
    "bus": "バス", "key": "鍵", "toy": "おもちゃ", "pig": "豚", "fox": "キツネ", "egg": "卵",
    "jam": "ジャム", "sea": "海", "cow": "牛", "owl": "フクロウ", "ant": "アリ", "bee": "ハチ",
    "apple": "リンゴ", "happy": "幸せな", "water": "水", "music": "音楽", "bread": "パン",
    "smile": "笑顔", "house": "家", "clock": "時計", "table": "テーブル", "green": "緑",
    "candy": "キャンディー", "robot": "ロボット", "cloud": "雲", "magic": "魔法",
    "lemon": "レモン", "paper": "紙", "shirt": "シャツ", "shoes": "靴", "beach": "砂浜",
    "flower": "花", "banana": "バナナ", "rocket": "ロケット", "family": "家族",
    "window": "窓", "guitar": "ギター", "yellow": "黄色", "orange": "オレンジ",
    "monkey": "サル", "rabbit": "ウサギ", "castle": "城", "school": "学校", "pencil": "鉛筆",
    "doctor": "医者", "butterfly": "チョウ", "dinosaur": "恐竜", "elephant": "ゾウ",
    "sunflower": "ヒマワリ", "rainbow": "虹", "hamburger": "ハンバーガー",
    "sandwich": "サンドイッチ", "chocolate": "チョコレート", "popcorn": "ポップコーン",
    "birthday": "誕生日", "computer": "コンピューター", "princess": "姫",
    "superhero": "ヒーロー", "treasure": "宝物", "adventure": "冒険", "dolphin": "イルカ",
    "flamingo": "フラミンゴ", "kangaroo": "カンガルー", "umbrella": "傘",
    "good morning": "おはよう", "ice cream": "アイスクリーム", "thank you": "ありがとう",
    "happy birthday": "誕生日おめでとう", "see you": "またね", "wake up": "目を覚ます",
    "super cool": "とてもかっこいい", "have fun": "楽しんでね", "good night": "おやすみ",
    "so sweet": "とても優しい", "hot dog": "ホットドッグ", "let us go": "行こう",
    "high five": "ハイタッチ", "well done": "よくできました", "good luck": "幸運を祈る",
    "best friend": "親友", "sweet dreams": "良い夢を", "play game": "ゲームをする",
    "apple pie": "アップルパイ", "sunny day": "晴れた日", "blue sky": "青空",
    "fast car": "速い車", "cute cat": "可愛い猫", "red apple": "赤いリンゴ",
    "big bear": "大きなクマ", "small dog": "小さな犬", "magic star": "魔法の星",
    "happy face": "笑顔", "fly high": "高く飛ぶ", "sing a song": "歌を歌う",
    "read a book": "本を読む", "make a wish": "願い事をする", "open door": "ドアを開ける",
    "green tree": "緑の木", "take care": "気をつけてね", "no problem": "問題ないよ",
    "never mind": "気にしないで", "come back": "戻ってくる", "find out": "見つけ出す",
    "give up": "あきらめる", "go ahead": "お先にどうぞ", "look for": "探す",
    "pick up": "拾う・迎えに行く", "stand up": "立ち上がる", "turn off": "電気を消す",
    "turn on": "電気をつける", "work hard": "頑張る", "be careful": "注意する",
    "stay safe": "無事でいてね", "feel good": "気分が良い", "slow down": "減速する",
    "speed up": "加速する", "reconstruction": "復興・再構築", "architecture": "建築・構造",
    "biodiversity": "生物多様性", "classification": "分類", "communication": "意思疎通・通信",
    "congratulations": "おめでとう・祝福", "conversation": "会話", "demonstration": "実演・デモ",
    "development": "開発・発展", "electricity": "電気", "entertainment": "娯楽・エンタメ",
    "environmental": "環境の", "globalization": "グローバル化", "identification": "身元確認・身分証明",
    "implementation": "実装・実行", "infrastructure": "社会基盤・インフラ", "international": "国際的な",
    "investigation": "調査・捜査", "neighborhood": "近所・地域", "organization": "組織・団体",
    "qualification": "資格・適性", "recommendation": "推薦・おすすめ", "representation": "代表・表現",
    "responsibility": "責任", "satisfaction": "満足", "transportation": "交通・輸送",
    "understanding": "理解"
  },
  short: [
    "cat", "dog", "sun", "sky", "run", "cup", "box", "star", "red", "blue",
    "hat", "pen", "bus", "key", "toy", "pig", "fox", "egg", "jam", "sea"
  ],
  medium: [
    "apple", "happy", "water", "music", "bread", "smile", "house", "clock",
    "table", "green", "candy", "robot", "cloud", "magic", "lemon", "paper"
  ],
  long: [
    "banana", "rocket", "family", "window", "guitar", "yellow", "orange",
    "monkey", "rabbit", "planet", "castle", "school", "pencil", "doctor"
  ],
  phrase: [
    "good morning", "ice cream", "thank you", "happy birthday",
    "see you", "wake up", "super cool", "have fun", "good night"
  ]
};

async function loadWordsJSON() {
  try {
    const res = await fetch('./words.json');
    if (res.ok) {
      const data = await res.json();
      if (data) {
        if (data.translations) {
          wordLibrary.translations = { ...wordLibrary.translations, ...data.translations };
        }
        if (data.short) wordLibrary.short = data.short;
        if (data.medium) wordLibrary.medium = data.medium;
        if (data.long) wordLibrary.long = data.long;
        if (data.phrase) wordLibrary.phrase = data.phrase;
        console.log('words.json 辞書の読み込みに成功しました。');
      }
    }
  } catch (err) {
    console.warn('words.json の取得に失敗したため、内蔵辞書を使用します:', err);
  }
}

// --- ゲーム状態管理 ---
let gameState = {
  isRunning: false,
  isPaused: false,
  score: 0,
  highScore: 0,
  clearedCount: 0,
  comboCount: 0,
  consecutiveMisses: 0, // 連続ミス（未消去着地）カウント
  pinchRecoveryStep: 0, // ピンチ後の段階的スピード復帰ステップ (0:通常, 1:50%, 2:67%, 3:84%)
  currentSpeedMultiplier: 1.0, // 現在の速度倍率
  hasMistypedCurrentBlock: false,
  speedLevel: 1,
  fallSpeed: 0.85, // ピクセル/フレーム (極めて緩やかに上昇)
  isPinch: false, // ピンチ時スローダウンフラグ
  soundEnabled: true,
  currentBlock: null, // 現在落下中の単一ブロック
  stackedBlocks: [],  // 積み上がったブロックの配列
  animationFrameId: null
};

// --- DOMエレメントの参照 ---
const gameContainer = document.getElementById('game-container');
const fallingContainer = document.getElementById('falling-container');
const stackedContainer = document.getElementById('stacked-container');
const dangerLine = document.getElementById('danger-line');
const dangerBadge = document.getElementById('danger-badge');

const scoreDisplay = document.getElementById('score-display');
const highScoreDisplay = document.getElementById('highscore-display');
const speedDisplay = document.getElementById('speed-display');
const comboDisplay = document.getElementById('combo-display');
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const soundIcon = document.getElementById('sound-icon');
const pauseToggleBtn = document.getElementById('pause-toggle-btn');
const pauseIcon = document.getElementById('pause-icon');
const targetWordPreview = document.getElementById('target-word-preview');

const startModal = document.getElementById('start-modal');
const startBtn = document.getElementById('start-btn');
const gameoverModal = document.getElementById('gameover-modal');
const restartBtn = document.getElementById('restart-btn');
const pauseModal = document.getElementById('pause-modal');
const resumeBtn = document.getElementById('resume-btn');

const finalScore = document.getElementById('final-score');
const finalHighScore = document.getElementById('final-highscore');
const finalClearedCount = document.getElementById('final-cleared-count');

// --- Web Audio API サウンド合成器 ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// 1. タイプライター打鍵音
function playTypeSound() {
  if (!gameState.soundEnabled || !audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  // 短いクリックピッチ
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800 + Math.random() * 400, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.03);
  
  gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.03);
}

// 2. タイプミス警告音（「ブー」）
function playErrorSound() {
  if (!gameState.soundEnabled || !audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(140, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(110, audioCtx.currentTime + 0.2);
  
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}

// 3. ブロック消去時のポップ・チャイム音
function playClearSound() {
  if (!gameState.soundEnabled || !audioCtx) return;
  
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (アルペジオ)
  notes.forEach((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.05);
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime + index * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.05 + 0.15);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime + index * 0.05);
    osc.stop(audioCtx.currentTime + index * 0.05 + 0.15);
  });
}

// 4. コンボ爆破ボーナス音（ボカン！重低音爆発音）
function playBombSound() {
  if (!gameState.soundEnabled || !audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(25, audioCtx.currentTime + 0.35);
  
  gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.35);
}

// 5. 英語ネイティブ音声読み上げ (Web Speech API)
function speakEnglishWord(word) {
  if (!gameState.soundEnabled || !('speechSynthesis' in window)) return;
  if (!word) return;

  try {
    // 進行中の発音をキャンセルして最新の単語を発声
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US'; // ネイティブアメリカ英語
    utterance.rate = 0.9;     // 聞き取りやすい自然な速度
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // ネイティブボイス優先取得
    const voices = window.speechSynthesis.getVoices();
    const nativeVoice = voices.find(v => (v.lang === 'en-US' || v.lang === 'en_US') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Alex'))) ||
                        voices.find(v => v.lang === 'en-US' || v.lang.startsWith('en'));
    if (nativeVoice) {
      utterance.voice = nativeVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}

// ボイスリスト初期化プリロード
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

// --- ハイスコアのロード＆セーブ ---
function loadHighScore() {
  const saved = localStorage.getItem('lexidrop_highscore');
  if (saved) {
    gameState.highScore = parseInt(saved, 10) || 0;
  }
  highScoreDisplay.textContent = gameState.highScore;
}

function saveHighScore() {
  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
    localStorage.setItem('lexidrop_highscore', gameState.highScore);
    highScoreDisplay.textContent = gameState.highScore;
  }
}

// --- ランダム単語の生成 ---
let lastPickedWord = '';

function getRandomWord() {
  const currentScore = gameState.score;
  let wordPool = [];

  if (currentScore < 100) {
    // 序盤: 短い単語
    wordPool = wordLibrary.short;
  } else if (currentScore < 250) {
    // 中盤: 短い〜中くらいの単語
    wordPool = [...wordLibrary.short, ...wordLibrary.medium];
  } else if (currentScore < 400) {
    // 中盤〜後半: 中〜長い単語
    wordPool = [...wordLibrary.medium, ...wordLibrary.long];
  } else {
    // 得点十分: 2単語フレーズ含む全プール
    wordPool = [...wordLibrary.medium, ...wordLibrary.long, ...wordLibrary.phrase];
  }

  if (!wordPool || wordPool.length === 0) {
    wordPool = wordLibrary.short;
  }

  let selectedWord = '';
  // 連続で同じ単語が出現しないように選択
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * wordPool.length);
    selectedWord = wordPool[randomIndex];
    if (selectedWord !== lastPickedWord || wordPool.length === 1) break;
  }

  lastPickedWord = selectedWord;
  return selectedWord;
}

// --- ブロックオブジェクトの生成 ---
function spawnFallingBlock() {
  const text = getRandomWord();
  const containerWidth = gameContainer.clientWidth;
  
  // 新しいブロックのミス状態リセット
  gameState.hasMistypedCurrentBlock = false;

  // 単語長に応じた横幅クラス・スタイル計算
  let colorClass = 'block-short';
  if (text.includes(' ') || text.length >= 9) {
    colorClass = 'block-phrase';
  } else if (text.length >= 7) {
    colorClass = 'block-long';
  } else if (text.length >= 5) {
    colorClass = 'block-medium';
  }

  // DOM要素作成
  const element = document.createElement('div');
  element.className = `word-block ${colorClass}`;
  
  // 入力ガイド付きHTMLのレンダリング
  updateBlockTextHTML(element, text, 0);

  fallingContainer.appendChild(element);

  // 初期サイズ取得とX位置決定 (両端20pxのマージンを確保)
  const blockWidth = element.offsetWidth;
  const padding = 20;
  const maxX = containerWidth - blockWidth - padding;
  const minX = padding;
  const initialX = Math.max(minX, Math.floor(Math.random() * (maxX - minX + 1)) + minX);

  const blockObj = {
    text: text,
    typedIndex: 0,
    x: initialX,
    y: 0,
    width: blockWidth,
    height: element.offsetHeight,
    element: element
  };

  element.style.left = `${blockObj.x}px`;
  element.style.top = `${blockObj.y}px`;

  gameState.currentBlock = blockObj;
  updateFooterPreview();
}

// --- ブロック文字のHTMLハイライト更新 ---
function updateBlockTextHTML(element, wordText, typedIndex) {
  let html = '';
  for (let i = 0; i < wordText.length; i++) {
    const char = wordText[i];
    const displayChar = char === ' ' ? '&nbsp;' : char;
    
    if (i < typedIndex) {
      html += `<span class="char-typed">${displayChar}</span>`;
    } else if (i === typedIndex) {
      html += `<span class="char-untyped char-current">${displayChar}</span>`;
    } else {
      html += `<span class="char-untyped">${displayChar}</span>`;
    }
  }
  element.innerHTML = html;
}

// --- フッターの入力ターゲットプレビュー更新 ---
function updateFooterPreview() {
  if (!gameState.currentBlock) {
    targetWordPreview.innerHTML = `<span class="placeholder-text">ゲーム準備中...</span>`;
    return;
  }
  
  const { text, typedIndex } = gameState.currentBlock;
  let html = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const displayChar = char === ' ' ? '␣' : char;
    
    if (i < typedIndex) {
      html += `<span class="char-typed">${displayChar}</span>`;
    } else if (i === typedIndex) {
      html += `<span class="char-untyped char-current" style="color:#e84393">${displayChar}</span>`;
    } else {
      html += `<span class="char-untyped" style="color:#2d3436">${displayChar}</span>`;
    }
  }
  targetWordPreview.innerHTML = html;
}

// --- ピンチ時（デンジャー線接近 / 3連続失敗）判定 & 段階的スピード復帰処理 ---
function checkPinchMode() {
  const dangerY = dangerLine.offsetTop + dangerLine.offsetHeight;
  let isHeightPinch = false;

  // 1. 積み上がりブロックのいずれかが危険線から140px以内に接近したらピンチ
  for (const stacked of gameState.stackedBlocks) {
    if (stacked.y <= dangerY + 140) {
      isHeightPinch = true;
      break;
    }
  }

  let speedMultiplier = 1.0;
  let inPinchUI = false;

  if (isHeightPinch) {
    // 高さ危険ピンチ: 最短高さ解消まで50%固定スローダウン
    inPinchUI = true;
    speedMultiplier = 0.5;
    dangerBadge.textContent = '⚡ PINCH SLOW! ⚡';
  } else if (gameState.pinchRecoveryStep === 1) {
    // 3連続ミス発動直後: 50% スローダウン
    inPinchUI = true;
    speedMultiplier = 0.50;
    dangerBadge.textContent = '⚡ PINCH SLOW (3 MISS)! ⚡';
  } else if (gameState.pinchRecoveryStep === 2) {
    // 正解1回目: 67% スピードへ段階復帰
    inPinchUI = true;
    speedMultiplier = 0.67;
    dangerBadge.textContent = '⚡ SPEED RECOVERING (1/3) ⚡';
  } else if (gameState.pinchRecoveryStep === 3) {
    // 正解2回目: 84% スピードへ段階復帰
    inPinchUI = true;
    speedMultiplier = 0.84;
    dangerBadge.textContent = '⚡ SPEED RECOVERING (2/3) ⚡';
  } else {
    // 正解3回達成: 100% 通常スピード完全復帰
    inPinchUI = false;
    speedMultiplier = 1.0;
    dangerBadge.textContent = '⚠️ DANGER ⚠️';
  }

  gameState.isPinch = inPinchUI;
  gameState.currentSpeedMultiplier = speedMultiplier;

  if (inPinchUI) {
    dangerLine.classList.add('pinch-active');
    dangerBadge.classList.add('pinch-badge');
  } else {
    dangerLine.classList.remove('pinch-active');
    dangerBadge.classList.remove('pinch-badge');
  }
}

// --- メインゲームループ ---
function gameLoop() {
  if (!gameState.isRunning || gameState.isPaused) return;

  // ピンチ時・復帰段階に応じたスピード判定
  checkPinchMode();
  const currentSpeed = gameState.fallSpeed * gameState.currentSpeedMultiplier;

  // 1. アクティブ落下ブロックの更新
  if (gameState.currentBlock) {
    const block = gameState.currentBlock;
    block.y += currentSpeed;
    block.element.style.top = `${block.y}px`;

    // 2. 衝突検出（着地判定）
    const containerHeight = gameContainer.clientHeight;
    let landY = containerHeight - block.height - 10; // 最下部

    // 積み上がったブロック群との衝突をチェック
    for (const stacked of gameState.stackedBlocks) {
      // 横軸の重なり幅を計算
      const overlapLeft = Math.max(block.x, stacked.x);
      const overlapRight = Math.min(block.x + block.width, stacked.x + stacked.width);
      const overlapWidth = overlapRight - overlapLeft;

      // 重なり幅が規定値（24px以上 または ブロック幅の25%以上）ある場合のみ着地！
      // 端っこを僅かに擦っただけの場合はすり抜けて下へ落下（浮遊防止）
      const minRequiredOverlap = Math.min(24, block.width * 0.25);
      if (overlapWidth >= minRequiredOverlap) {
        // 積み上がりブロックの上端
        const stackTopY = stacked.y - block.height;
        if (stackTopY < landY) {
          landY = stackTopY;
        }
      }
    }

    // 着地した場合の処理
    if (block.y >= landY) {
      block.y = landY;
      block.element.style.top = `${block.y}px`;
      
      // スタック状態へ移行
      freezeBlockToStack(block);

      // ゲームオーバー判定
      if (checkGameOver()) {
        triggerGameOver();
        return;
      }

      // 次のブロックを生成
      spawnFallingBlock();
    }
  }

  gameState.animationFrameId = requestAnimationFrame(gameLoop);
}

// --- ブロックのスタック（着地固定）化 ---
function freezeBlockToStack(block) {
  // タイピング失敗（未消去のまま着地）カウントをインクリメント
  gameState.consecutiveMisses++;

  // 3連続ミスに達した場合、50%スローダウン (Pinch Recovery Step 1) を起動
  if (gameState.consecutiveMisses >= 3) {
    gameState.pinchRecoveryStep = 1;
  }

  block.element.classList.add('stacked');
  // スタック時はプレーンテキストに戻す
  block.element.textContent = block.text;

  // DOMを stackedContainer に移動
  fallingContainer.removeChild(block.element);
  stackedContainer.appendChild(block.element);

  gameState.stackedBlocks.push(block);
  gameState.currentBlock = null;
  
  // スタック更新に伴うピンチ判定
  checkPinchMode();
}

// --- ゲームオーバー判定 ---
function checkGameOver() {
  const dangerY = dangerLine.offsetTop + dangerLine.offsetHeight;
  for (const stacked of gameState.stackedBlocks) {
    if (stacked.y <= dangerY) {
      return true;
    }
  }
  return false;
}

// --- キーボード入力イベント処理 ---
function handleKeyDown(e) {
  // 一時停止ショートカット (ESCキーのみ)
  if (gameState.isRunning && e.key === 'Escape') {
    e.preventDefault();
    togglePause();
    return;
  }

  if (!gameState.isRunning || gameState.isPaused || !gameState.currentBlock) return;

  // 装飾キーや特殊キーを無効化
  if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'Tab') return;

  const block = gameState.currentBlock;
  const expectedChar = block.text[block.typedIndex].toLowerCase();
  const inputChar = e.key.toLowerCase();

  // 正解入力
  if (inputChar === expectedChar || (expectedChar === ' ' && e.key === ' ')) {
    e.preventDefault();
    block.typedIndex++;
    playTypeSound();

    // 単語完了！消去処理
    if (block.typedIndex >= block.text.length) {
      // コンボ計算 (ノーミス時のみコンボを加算)
      if (!gameState.hasMistypedCurrentBlock) {
        gameState.comboCount++;
      } else {
        gameState.comboCount = 1;
      }
      comboDisplay.textContent = gameState.comboCount;

      destroyCurrentBlock();
    } else {
      // 途中の更新
      updateBlockTextHTML(block.element, block.text, block.typedIndex);
      updateFooterPreview();
    }
  } 
  // 単文字・スペースの押し間違い（ミス入力）
  else if (e.key.length === 1 || e.key === ' ') {
    e.preventDefault();
    playErrorSound();

    // コンボリセット＆ミスフラグセット
    gameState.hasMistypedCurrentBlock = true;
    gameState.comboCount = 0;
    comboDisplay.textContent = '0';
    
    // エラーシェイク演出
    block.element.classList.remove('shake-error');
    void block.element.offsetWidth; // リフロー発生させてアニメーションリセット
    block.element.classList.add('shake-error');

    // ミスしたら最初から入力し直し！
    block.typedIndex = 0;
    updateBlockTextHTML(block.element, block.text, 0);
    updateFooterPreview();
  }
}

// --- 日本語訳の取得 ---
function getJapaneseTranslation(word) {
  if (!word) return "";
  const key = word.toLowerCase().trim();
  if (wordLibrary.translations && wordLibrary.translations[key]) {
    return wordLibrary.translations[key];
  }
  return word;
}

// --- ブロック消去＆スコア獲得（英語ネイティブ音声読み上げ＋日本語訳表示付き） ---
function destroyCurrentBlock() {
  const block = gameState.currentBlock;
  
  // 単語消去成功に伴い連続ミス（未消去着地）カウントをリセット
  gameState.consecutiveMisses = 0;

  // ピンチ復帰中であれば、正解するごとに段階的にスピード復帰ステップを進める (1 -> 2 -> 3 -> 0[完全復帰])
  if (gameState.pinchRecoveryStep > 0) {
    if (gameState.pinchRecoveryStep === 1) {
      gameState.pinchRecoveryStep = 2; // 1回成功: 50% -> 67%
    } else if (gameState.pinchRecoveryStep === 2) {
      gameState.pinchRecoveryStep = 3; // 2回成功: 67% -> 84%
    } else if (gameState.pinchRecoveryStep === 3) {
      gameState.pinchRecoveryStep = 0; // 3回成功: 84% -> 100% 完全復帰！
    }
  }

  // 正解英単語の英語ネイティブ音声発音読み上げ（チャイム効果音は消去）
  speakEnglishWord(block.text);

  const length = block.text.length;
  
  // スコア計算 (文字数 * 10 * スピード倍率)
  const earnedScore = Math.round(length * 10 * (1 + (gameState.speedLevel - 1) * 0.25));
  gameState.score += earnedScore;
  gameState.clearedCount++;
  saveHighScore();
  updateStatsDisplay();

  // 日本語訳の取得
  const jaTranslation = getJapaneseTranslation(block.text);

  // 1. ブロック要素のテキストを日本語訳に変更してスタイルを適用
  block.element.innerHTML = `<span class="ja-translation-text">💡 ${jaTranslation}</span>`;
  block.element.classList.add('show-translation');

  // 2. 変更後の新しい日本語訳ブロックの横幅を測定
  const newWidth = block.element.offsetWidth;
  const containerWidth = gameContainer.clientWidth;
  const padding = 15;

  // 3. 新しい横幅に基づいて画面右端・左端からはみ出さないようX座標を厳密クランプ
  const maxAllowedX = Math.max(padding, containerWidth - newWidth - padding);
  const safeLeft = Math.max(padding, Math.min(maxAllowedX, block.x));
  block.element.style.left = `${safeLeft}px`;

  // スコア浮遊アニメーション
  showScoreFloat(safeLeft + newWidth / 2, block.y - 20, `+${earnedScore}`);

  // 3コンボ達成ボーナス：一番上に積まれているブロックを爆破！
  if (gameState.comboCount > 0 && gameState.comboCount % 3 === 0) {
    explodeTopStackedBlock();
  }

  // スピード＆レベル調整
  updateSpeedAndLevel();

  // キー入力を受け付けないように一旦クリア
  gameState.currentBlock = null;

  // 日本語訳をしっかり読めるよう 1100ms (1.1秒) 待ってから消去エフェクト＆次ブロック生成
  setTimeout(() => {
    block.element.classList.add('pop-clear');
    setTimeout(() => {
      if (block.element.parentNode) {
        block.element.parentNode.removeChild(block.element);
      }
    }, 300);

    // 次のブロック生成
    spawnFallingBlock();
  }, 1100);
}

// --- 一番上に積まれているブロックの爆破ボーナス ---
function explodeTopStackedBlock() {
  if (gameState.stackedBlocks.length === 0) return;

  // 最上部（y座標が最小）のスタックブロックを特定
  let topIndex = 0;
  let minY = gameState.stackedBlocks[0].y;
  for (let i = 1; i < gameState.stackedBlocks.length; i++) {
    if (gameState.stackedBlocks[i].y < minY) {
      minY = gameState.stackedBlocks[i].y;
      topIndex = i;
    }
  }

  const topBlock = gameState.stackedBlocks.splice(topIndex, 1)[0];
  
  // 爆発音声 & アニメーション
  playBombSound();
  topBlock.element.classList.add('bomb-explode');

  // ボーナス表示
  showScoreFloat(topBlock.x + topBlock.width / 2, topBlock.y, '💣 BOMB BONUS +100!', true);
  
  gameState.score += 100;
  saveHighScore();
  updateStatsDisplay();

  setTimeout(() => {
    if (topBlock.element.parentNode) {
      topBlock.element.parentNode.removeChild(topBlock.element);
    }
    // 爆破後ピンチ状態の再チェック
    checkPinchMode();
  }, 450);
}

// --- スコア・スピード難易度の更新 ---
function updateSpeedAndLevel() {
  // 300点ごとにスピードレベルがアップ
  const newLevel = 1 + Math.floor(gameState.score / 300);
  gameState.speedLevel = newLevel;
  
  // 落下スピード計算 (初期0.85からレベルごとに+0.05と極めてゆるやかに加速)
  gameState.fallSpeed = 0.85 + (newLevel - 1) * 0.05;
  
  speedDisplay.textContent = `Lv.${newLevel}`;
}

// --- スコア浮遊演出 ---
function showScoreFloat(x, y, text, isBomb = false) {
  const floatEl = document.createElement('div');
  floatEl.className = isBomb ? 'score-float bomb-bonus' : 'score-float';
  floatEl.textContent = text;
  floatEl.style.left = `${x}px`;
  floatEl.style.top = `${y}px`;
  
  gameContainer.appendChild(floatEl);
  setTimeout(() => {
    if (floatEl.parentNode) {
      floatEl.parentNode.removeChild(floatEl);
    }
  }, 900);
}

// --- スタッツ表示更新 ---
function updateStatsDisplay() {
  scoreDisplay.textContent = gameState.score;
  highScoreDisplay.textContent = gameState.highScore;
  speedDisplay.textContent = `Lv.${gameState.speedLevel}`;
  comboDisplay.textContent = gameState.comboCount;
}

// --- ゲーム開始 ---
function startGame() {
  initAudio();
  
  // 状態のクリア
  gameState.isRunning = true;
  gameState.isPaused = false;
  gameState.score = 0;
  gameState.clearedCount = 0;
  gameState.comboCount = 0;
  gameState.consecutiveMisses = 0;
  gameState.pinchRecoveryStep = 0;
  gameState.currentSpeedMultiplier = 1.0;
  gameState.hasMistypedCurrentBlock = false;
  gameState.speedLevel = 1;
  gameState.fallSpeed = 0.85;
  gameState.isPinch = false;
  gameState.stackedBlocks = [];
  gameState.currentBlock = null;

  // ピンチスタイルの初期化
  dangerLine.classList.remove('pinch-active');
  dangerBadge.classList.remove('pinch-badge');
  dangerBadge.textContent = '⚠️ DANGER ⚠️';

  // コンテナの全消去
  fallingContainer.innerHTML = '';
  stackedContainer.innerHTML = '';
  
  updateStatsDisplay();

  // モーダル非表示
  startModal.classList.add('hidden');
  gameoverModal.classList.add('hidden');
  pauseModal.classList.add('hidden');
  pauseIcon.textContent = '⏸️';

  // 最初のブロックの生成
  spawnFallingBlock();

  // ループの開始
  if (gameState.animationFrameId) {
    cancelAnimationFrame(gameState.animationFrameId);
  }
  gameLoop();
}

// --- ゲームオーバー発動 ---
function triggerGameOver() {
  gameState.isRunning = false;
  saveHighScore();

  // 結果ステータス書き込み
  finalScore.textContent = gameState.score;
  finalHighScore.textContent = gameState.highScore;
  finalClearedCount.textContent = gameState.clearedCount;

  // ゲームオーバーモーダル表示
  gameoverModal.classList.remove('hidden');
}

// --- 一時停止（ポーズ）切り替え ---
function togglePause() {
  if (!gameState.isRunning) return;

  gameState.isPaused = !gameState.isPaused;

  if (gameState.isPaused) {
    if (gameState.animationFrameId) {
      cancelAnimationFrame(gameState.animationFrameId);
    }
    pauseModal.classList.remove('hidden');
    pauseIcon.textContent = '▶️';
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } else {
    pauseModal.classList.add('hidden');
    pauseIcon.textContent = '⏸️';
    gameState.animationFrameId = requestAnimationFrame(gameLoop);
  }
}

// --- サウンドMUTE切り替え ---
function toggleSound() {
  gameState.soundEnabled = !gameState.soundEnabled;
  soundIcon.textContent = gameState.soundEnabled ? '🔊' : '🔇';
}

// --- イベントリスナーの登録 ---
document.addEventListener('DOMContentLoaded', () => {
  loadHighScore();
  loadWordsJSON();

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);
  pauseToggleBtn.addEventListener('click', togglePause);
  resumeBtn.addEventListener('click', togglePause);
  soundToggleBtn.addEventListener('click', toggleSound);

  window.addEventListener('keydown', handleKeyDown);
});

const container = document.getElementById('container');
// 野菜たちの初期位置指定
const drinks = [
    { element: document.getElementById('barTea'), id: 'barTea', startX: 0, startY: 0 },
    { element: document.getElementById('stTea'), id: 'stTea', startX: 0, startY: 0 },
    { element: document.getElementById('orange'), id: 'orange', startX: 0, startY: 0 },
    { element: document.getElementById('grape'), id: 'grape', startX: 0, startY: 0 },
];

const title_elements = [
    document.getElementById('title-1'),
    document.getElementById('title-2'),
    document.getElementById('title-3'),
    document.getElementById('title-4'),
];

const title_elementsPic = [
    document.getElementById('title-1Pi'),
    document.getElementById('title-2Pi'),
    document.getElementById('title-3Pi'),
    document.getElementById('title-4Pi'),
];
const box = document.getElementById('box');
const grape_list = document.getElementById("list-1");
const stTea_list = document.getElementById("list-2");
const orange_list = document.getElementById("list-3");
const barTea_list = document.getElementById("list-4");

// --- データ計測用の変数 ---
let startTime = Date.now(); // 開始時間
let failCount = 0;          // 失敗回数
let playTime = 0;           // プレイ時間(秒)
let missAccumulator = [0, 0, 0, 0]; 
const drinkInternalNames = ["barTea", "stTea", "orange", "grape"];

let url = new URL(window.location.href);
let params = url.searchParams;

const dispTypeSum = params.get('dispTypeSum');
const questTypeSumParam = params.get('questTypeSum');
const questSumParam = params.get('questSum');

let numdispTypeSum = parseInt(dispTypeSum) || 4;
let numquestTypeSum = parseInt(questTypeSumParam) || 1;
let numquestSum = parseInt(questSumParam) || 1;

// --- 表示モードの判定 ---
const isPicMode = (params.get('pic') === 'true' && params.get('chara') === 'false');

// 画像パスの定義
const drinkImages = {
    "むぎちゃ　　　　": "image/drink/barTea.png",
    "こうちゃ　　　　": "image/drink/stTea.png",
    "オレンジジュース": "image/drink/orange.png",
    "ぶどうジュース　": "image/drink/grape.png"
};

const drinkImagesById = {
    "barTea": "image/drink/barTea.png",
    "stTea": "image/drink/stTea.png",
    "orange": "image/drink/orange.png",
    "grape": "image/drink/grape.png"
};

const alldrinks = [
    { element: document.getElementById('barTea'), id: 'barTea', name: "むぎちゃ　　　　", overlayId: 'barTea_overlay', originalIndex: 0 },
    { element: document.getElementById('stTea'), id: 'stTea', name: "こうちゃ　　　　", overlayId: 'stTea_overlay', originalIndex: 1 },
    { element: document.getElementById('orange'), id: 'orange', name: "オレンジジュース", overlayId: 'orange_overlay', originalIndex: 2 },
    { element: document.getElementById('grape'), id: 'grape', name: "ぶどうジュース　", overlayId: 'grape_overlay', originalIndex: 3 },
];

// --- 1. 表示する野菜をランダムに選択 ---
const shuffledIndices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);

for (let i = 0; i < alldrinks.length; i++) {
    const originalIndex = shuffledIndices[i];
    const drink = alldrinks[originalIndex];
    const overlayElement = document.getElementById(drink.overlayId);
    const overlayElementP = document.getElementById(drink.overlayId + 'P');

    if (i < numdispTypeSum) {
        drink.element.style.display = '';
        if (overlayElement) overlayElement.style.opacity = 1;
        if (overlayElementP) overlayElementP.style.opacity = 1;
    } else {
        drink.element.style.display = 'none';
        if (overlayElement) overlayElement.style.opacity = 0;
        if (overlayElementP) overlayElementP.style.opacity = 0;
    }
}

// --- 2. 問題の作成（画像モード時は1種類4個までに制限） ---
const displayeddrinks = alldrinks.filter(drink => drink.element.style.display !== 'none');
let target_drinks = [];

if (displayeddrinks.length > 0 && numquestSum > 0) {
    const questCandidates = [...displayeddrinks].sort(() => Math.random() - 0.5);
    const actualQuestTypeSum = Math.min(numquestTypeSum, questCandidates.length);
    
    let selectedForQuest = [];
    for (let i = 0; i < actualQuestTypeSum; i++) {
        selectedForQuest.push(questCandidates[i]);
    }

    selectedForQuest.sort((a, b) => a.originalIndex - b.originalIndex);

    for (let i = 0; i < selectedForQuest.length; i++) {
        target_drinks.push({
            originalIndex: selectedForQuest[i].originalIndex,
            name: selectedForQuest[i].name,
            count: 0
        });
    }

    let remainingSum = numquestSum;
    let counts = new Array(target_drinks.length).fill(0);

    // 最小1つずつ割り当て
    if (remainingSum >= target_drinks.length) {
        counts.fill(1);
        remainingSum -= target_drinks.length;
    } else {
        for(let i = 0; i < remainingSum; i++) counts[i] = 1;
        remainingSum = 0;
    }

    // 残りをランダムに配分（画像モードなら「問題は最大4個」）
    let safetyCounter = 0;
    const questLimit = isPicMode ? 4 : 99; 
    
    while (remainingSum > 0 && safetyCounter < 100) {
        const randomIndex = Math.floor(Math.random() * target_drinks.length);
        if (counts[randomIndex] < questLimit) {
            counts[randomIndex]++;
            remainingSum--;
        }
        safetyCounter++;
    }

    updateQuestDisplay(counts);
}

function updateQuestDisplay(counts) {
    // 1. 全てのタイトルを一旦「&nbsp;」でリセット
    title_elements.forEach(el => { if(el) el.innerHTML = ""; });

    // 2. 問題に含まれる飲み物を、指定された固定位置に表示
    for (let i = 0; i < target_drinks.length; i++) {
        if (counts) target_drinks[i].count = counts[i];
        const target = target_drinks[i];

        /**
         * 固定位置の指定マッピング
         * originalIndex: 3(オレンジジュース) -> index 0 (title-1)
         * originalIndex: 1(ぶどうジュース)   -> index 1 (title-2)
         * originalIndex: 2(むぎちゃ)         -> index 2 (title-3)
         * originalIndex: 0(こうちゃ)         -> index 3 (title-4)
         */
        const titleIndexMap = [3, 1, 2, 0];
        const displayPos = titleIndexMap[target.originalIndex];

        if (title_elements[displayPos] && target.count > 0) {
            if (isPicMode) {
                const imgTag = `<img src="${drinkImages[target.name]}" style="height:11dvh; vertical-align:middle; margin-right:0.8dvw;">`;
                title_elementsPic[displayPos].innerHTML = imgTag.repeat(target.count);
            } else {
                title_elements[displayPos].innerHTML = `・${target.name} ${toFullWidth(target.count)}こ`;
            }
        }
    }
}

const countAll = [0, 0, 0, 0];
var sW = window.innerWidth;
var sH = window.innerHeight;
var grape_cnt = 0, stTea_cnt = 0, orange_cnt = 0, barTea_cnt = 0; 

const boxRect = { left: sW * 0.76, top: sH * 0.71 };
box.style.left = `${boxRect.left}px`;
box.style.top = `${boxRect.top}px`;

drinks[0].startX = sW * -0.01; drinks[0].startY = sH * 0.7; // barTea
drinks[1].startX = sW * 0.34; drinks[1].startY = sH * 0.7; // stTea
drinks[2].startX = sW * -0.01; drinks[2].startY = sH * 0.31; // orange
drinks[3].startX = sW * 0.34; drinks[3].startY = sH * 0.31; // grape

let isMoving = false;
const duration = 700;

function easeInOutSine(t) { return -0.5 * (Math.cos(Math.PI * t) - 1); }

drinks.forEach(drinkInfo => {
    const drinkElement = drinkInfo.element;
    drinkElement.style.left = `${drinkInfo.startX}px`;
    drinkElement.style.top = `${drinkInfo.startY}px`;
    let animationInterval = null;

    drinkElement.addEventListener('click', () => {
        if (drinkElement.style.display === 'none') return;

        // --- カゴの上限チェック ---
        // 画像モードの時、すでに4個入っていたらそれ以上入れられないようにする
        if (isPicMode) {
            let currentVal = 0;
            if(drinkElement.id == 'grape') currentVal = grape_cnt;
            if(drinkElement.id == 'stTea') currentVal = stTea_cnt;
            if(drinkElement.id == 'orange') currentVal = orange_cnt;
            if(drinkElement.id == 'barTea') currentVal = barTea_cnt;
            if (currentVal >= 4) return; 
        }

        isMoving = true;
        if (animationInterval) cancelAnimationFrame(animationInterval);

        const targetX = boxRect.left + box.offsetWidth / 2 - drinkElement.offsetWidth / 2;
        const targetY = boxRect.top + box.offsetHeight / 2 - drinkElement.offsetHeight / 2;
        const startX = parseFloat(drinkElement.style.left);
        const startY = parseFloat(drinkElement.style.top);
        let moveStartTime;

        function animateToBox(currentTime) {
            if (!moveStartTime) moveStartTime = currentTime;
            const elapsed = currentTime - moveStartTime;
            let progress = Math.min(1, elapsed / duration);
            progress = easeInOutSine(progress);
            drinkElement.style.left = `${startX + (targetX - startX) * progress}px`;
            drinkElement.style.top = `${startY + (targetY - startY) * progress}px`;

            if(progress > 0.9) drinkElement.style.opacity = Math.max(0, drinkElement.style.opacity - 0.05);

            if (progress >= 0.99) {
                isMoving = false;
                drinkElement.style.left = `${drinkInfo.startX}px`;
                drinkElement.style.top = `${drinkInfo.startY}px`;
                drinkElement.style.opacity = 1;

                if(drinkElement.id == 'grape') grape_cnt++;
                if(drinkElement.id == 'stTea') stTea_cnt++;
                if(drinkElement.id == 'orange') orange_cnt++;
                if(drinkElement.id == 'barTea') barTea_cnt++;

                countAll[0] = barTea_cnt; countAll[1] = stTea_cnt;
                countAll[2] = orange_cnt; countAll[3] = grape_cnt;
                updateCountDisplay();
                return;
            }
            animationInterval = requestAnimationFrame(animateToBox);
        }
        animationInterval = requestAnimationFrame(animateToBox);
    });
});

function animateFromBox(drinkId) {
    const drinkInfo = drinks.find(v => v.id === drinkId);
    if (!drinkInfo) return;
    isMoving = true;
    const drinkElement = drinkInfo.element;
    const startX = boxRect.left + box.offsetWidth / 2 - drinkElement.offsetWidth / 2;
    const startY = boxRect.top + box.offsetHeight / 2 - drinkElement.offsetHeight / 2;
    drinkElement.style.left = `${startX}px`;
    drinkElement.style.top = `${startY}px`;
    drinkElement.style.opacity = 0.2;

    const targetX = drinkInfo.startX;
    const targetY = drinkInfo.startY;
    let backStartTime = null;

    function animateBack(currentTime) {
        if (!backStartTime) backStartTime = currentTime;
        const elapsed = currentTime - backStartTime;
        let progress = Math.min(1, elapsed / duration);
        progress = easeInOutSine(progress);
        drinkElement.style.left = `${startX + (targetX - startX) * progress}px`;
        drinkElement.style.top = `${startY + (targetY - startY) * progress}px`;
        drinkElement.style.opacity = 0.2 + (0.8 * progress);

        if (elapsed < duration) requestAnimationFrame(animateBack);
        else { drinkElement.style.opacity = 1; isMoving = false; }
    }
    requestAnimationFrame(animateBack);
}

function updateCountDisplay() {
    const listConfig = [
        { el: grape_list, count: grape_cnt, name: "ぶどうジュース　", id: "grape" },
        { el: stTea_list, count: stTea_cnt, name: "こうちゃ　　　　", id: "stTea" },
        { el: orange_list, count: orange_cnt, name: "オレンジジュース", id: "orange" },
        { el: barTea_list, count: barTea_cnt, name: "むぎちゃ　　　　", id: "barTea" }
    ];

    listConfig.forEach(item => {
        if (item.count > 0) {
            if (isPicMode) {
                // カゴの中身は最大5つまで表示
                const displayCount = Math.min(item.count, 5);
                const imgTag = `<img src="${drinkImagesById[item.id]}" style="height:2.8em; vertical-align:middle; margin-right:3dvw;">`;
                item.el.innerHTML = imgTag.repeat(displayCount);
            } else {
                item.el.innerHTML = `${item.name} ${toFullWidth(item.count)}こ`;
            }
        } else {
            item.el.innerHTML = "";
        }
    });
}

function ansJudge() {
    if (isMoving) return;
    let countAll_quest = [0, 0, 0, 0];
    target_drinks.forEach(target => {
        countAll_quest[target.originalIndex] = target.count;
    });

    if (JSON.stringify(countAll_quest) === JSON.stringify(countAll)) {
        correctPopup();
    } else {
        failCount++;
        for (let i = 0; i < 4; i++) {
            missAccumulator[i] += Math.abs(countAll_quest[i] - countAll[i]);
        }
        wrongPopup();
    }
}

let crackerInterval = null;

function correctPopup(){
    playTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('correct_Popup').classList.add('show');
    new Audio('./sound/correct.mp3').play();
    const crackerContainer = document.getElementById('cracker-container');
    if (crackerContainer) crackerContainer.classList.add('active');
    if (typeof animateCracker === 'function' && crackerInterval === null) {
        animateCracker();
        crackerInterval = setInterval(animateCracker, 3000);
    }
};

function wrongPopup(){
    document.getElementById('wrong_Popup').classList.add('show');
    new Audio('./sound/fail.mp3').play();
};

function hidePopup() {
    document.getElementById('correct_Popup').classList.remove('show');
    document.getElementById('wrong_Popup').classList.remove('show');
    const crackerContainer = document.getElementById('cracker-container');
    if (crackerContainer) crackerContainer.classList.remove('active');
    const confettiContainer = document.getElementById('confetti-container');
    if (confettiContainer) {
        confettiContainer.querySelectorAll('.confetti').forEach(c => c.remove());
        confettiContainer.innerHTML = '';
    }
    if (crackerInterval !== null) { clearInterval(crackerInterval); crackerInterval = null; }
}

function finalizeRoundData() {
    const currentParams = new URLSearchParams(window.location.search);
    const sendParams = new URLSearchParams();

    const settings = ['pic', 'chara', 'questSum', 'questTypeSum', 'dispTypeSum'];
    settings.forEach(key => {
        if (currentParams.has(key)) sendParams.append(key, currentParams.get(key));
    });
    sendParams.append('course', 'のみもの');

    let maxRound = 0;
    for (let [key, value] of currentParams.entries()) {
        if (key.startsWith('playTime_')) {
            sendParams.append(key, value);
            const roundNum = parseInt(key.split('_')[1]);
            if (roundNum > maxRound) maxRound = roundNum;
        } else if (key.startsWith('failCount_') || key.startsWith('mostMissed_') || key.startsWith('leastMissed_')) {
            sendParams.append(key, value);
        }
    }

    const nextRound = maxRound + 1;
    sendParams.append(`playTime_${nextRound}`, playTime);
    sendParams.append(`failCount_${nextRound}`, failCount);

    let maxMissVal = -1;
    let minMissVal = Infinity;
    let mostMisseddrink = "なし";
    let leastMisseddrink = "なし";
    const jpNames = ["むぎちゃ", "こうちゃ", "オレンジジュース", "ぶどうジュース"];

    missAccumulator.forEach((val, idx) => {
        if (val > maxMissVal) {
            maxMissVal = val;
            mostMisseddrink = jpNames[idx];
        }
        if (val < minMissVal) {
            minMissVal = val;
            leastMisseddrink = jpNames[idx];
        }
    });

    if (failCount === 0) {
        mostMisseddrink = "なし";
        leastMisseddrink = "すべて正解";
    }

    sendParams.append(`mostMissed_${nextRound}`, mostMisseddrink);
    sendParams.append(`leastMissed_${nextRound}`, leastMisseddrink);

    return sendParams.toString();
}

function goToNextStage() {
    const queryString = finalizeRoundData();
    window.location.href = `drink-game4.html?${queryString}`;
}

function exitGame() {
    const queryString = finalizeRoundData();
    window.location.href = `giveto.html?${queryString}`;
}

function quitGame() {
    const currentParams = new URLSearchParams(window.location.search);

    // 'course' パラメータがあるかどうかで判定
    if (currentParams.has('course')) {
        // ラウンド2以降：現在のパラメータを維持して giveto.html へ
        const queryString = currentParams.toString();
        window.location.href = `giveto.html?${queryString}`;
    } else {
        // ラウンド1：タイトル画面へ
        window.location.href = `title.html`;
    }
}

function Decgrape() { if (!isMoving && grape_cnt > 0) { grape_cnt--; updateCountDisplay(); countAll[3] = grape_cnt; animateFromBox('grape'); } }
function DecstTea() { if (!isMoving && stTea_cnt > 0) { stTea_cnt--; updateCountDisplay(); countAll[1] = stTea_cnt; animateFromBox('stTea'); } }
function Decorange() { if (!isMoving && orange_cnt > 0) { orange_cnt--; updateCountDisplay(); countAll[2] = orange_cnt; animateFromBox('orange'); } }
function DecbarTea() { if (!isMoving && barTea_cnt > 0) { barTea_cnt--; updateCountDisplay(); countAll[0] = barTea_cnt; animateFromBox('barTea'); } }

function toFullWidth(str) {
    return String(str).replace(/[A-Za-z0-9]/g, s => String.fromCharCode(s.charCodeAt(0) + 0xFEE0));
}

document.addEventListener('DOMContentLoaded', () => {
    updateInfoDisplay();
    setInterval(updateInfoDisplay, 1000);

    // かってくるもの(kaimono-memo)を5回タップで表示
    const memoEl = document.querySelector('.kaimono-memo');
    if (memoEl) {
        memoEl.addEventListener('click', () => {
            tapCount++;
            if (tapCount >= 5) showDisplay();
        });
    }

    document.getElementById('check-button').addEventListener('click', ansJudge);
    document.getElementById('correct-popup-button').addEventListener('click', goToNextStage);

    // --- 追加：playTime_11 がある場合にボタンを非表示にする ---
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('playTime_11')) {
        const nextButton = document.getElementById('correct-popup-button');
        if (nextButton) {
            nextButton.style.display = 'none';
        }
    }

    const exitButton = document.getElementById('exit-popup-button');
    if (exitButton) {
        exitButton.addEventListener('click', exitGame);
    }

    const quitButton = document.getElementById('quit-popup-button');
    if (quitButton) {
        quitButton.addEventListener('click', quitGame);
    }

    document.getElementById('wrong-popup-button').addEventListener('click', hidePopup);
    document.getElementById('list-1').addEventListener('click', Decgrape);
    document.getElementById('list-2').addEventListener('click', DecstTea);
    document.getElementById('list-3').addEventListener('click', Decorange);
    document.getElementById('list-4').addEventListener('click', DecbarTea);
});
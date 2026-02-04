const container = document.getElementById('container');
// 野菜たちの初期位置指定
const snacks = [
    { element: document.getElementById('potatostick'), id: 'potatostick', startX: 0, startY: 0 },
    { element: document.getElementById('chocolate'), id: 'chocolate', startX: 0, startY: 0 },
    { element: document.getElementById('chococookie'), id: 'chococookie', startX: 0, startY: 0 },
    { element: document.getElementById('potatochips'), id: 'potatochips', startX: 0, startY: 0 },
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
const potatochips_list = document.getElementById("list-1");
const chocolate_list = document.getElementById("list-2");
const chococookie_list = document.getElementById("list-3");
const potatostick_list = document.getElementById("list-4");

// --- データ計測用の変数 ---
let startTime = Date.now(); // 開始時間
let failCount = 0;          // 失敗回数
let playTime = 0;           // プレイ時間(秒)
let missAccumulator = [0, 0, 0, 0]; 
const snackInternalNames = ["potatostick", "chocolate", "chococookie", "potatochips"];

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
const snackImages = {
    "ポテトスティック": "image/snack/potatostick.png",
    "チョコレート　　": "image/snack/chocolate.png",
    "チョコクッキー　": "image/snack/chococookie.png",
    "ポテトチップス　": "image/snack/potatochips.png"
};

const snackImagesById = {
    "potatostick": "image/snack/potatostick.png",
    "chocolate": "image/snack/chocolate.png",
    "chococookie": "image/snack/chococookie.png",
    "potatochips": "image/snack/potatochips.png"
};

const allsnacks = [
    { element: document.getElementById('potatostick'), id: 'potatostick', name: "ポテトスティック", overlayId: 'potatostick_overlay', originalIndex: 0 },
    { element: document.getElementById('chocolate'), id: 'chocolate', name: "チョコレート　　", overlayId: 'chocolate_overlay', originalIndex: 1 },
    { element: document.getElementById('chococookie'), id: 'chococookie', name: "チョコクッキー　", overlayId: 'chococookie_overlay', originalIndex: 2 },
    { element: document.getElementById('potatochips'), id: 'potatochips', name: "ポテトチップス　", overlayId: 'potatochips_overlay', originalIndex: 3 },
];

// --- 1. 表示する野菜をランダムに選択 ---
const shuffledIndices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);

for (let i = 0; i < allsnacks.length; i++) {
    const originalIndex = shuffledIndices[i];
    const snack = allsnacks[originalIndex];
    const overlayElement = document.getElementById(snack.overlayId);
    const overlayElementP = document.getElementById(snack.overlayId + 'P');

    if (i < numdispTypeSum) {
        snack.element.style.display = '';
        if (overlayElement) overlayElement.style.opacity = 1;
        if (overlayElementP) overlayElementP.style.opacity = 1;
    } else {
        snack.element.style.display = 'none';
        if (overlayElement) overlayElement.style.opacity = 0;
        if (overlayElementP) overlayElementP.style.opacity = 0;
    }
}

// --- 2. 問題の作成（画像モード時は1種類4個までに制限） ---
const displayedsnacks = allsnacks.filter(snack => snack.element.style.display !== 'none');
let target_snacks = [];

if (displayedsnacks.length > 0 && numquestSum > 0) {
    const questCandidates = [...displayedsnacks].sort(() => Math.random() - 0.5);
    const actualQuestTypeSum = Math.min(numquestTypeSum, questCandidates.length);
    
    let selectedForQuest = [];
    for (let i = 0; i < actualQuestTypeSum; i++) {
        selectedForQuest.push(questCandidates[i]);
    }

    selectedForQuest.sort((a, b) => a.originalIndex - b.originalIndex);

    for (let i = 0; i < selectedForQuest.length; i++) {
        target_snacks.push({
            originalIndex: selectedForQuest[i].originalIndex,
            name: selectedForQuest[i].name,
            count: 0
        });
    }

    let remainingSum = numquestSum;
    let counts = new Array(target_snacks.length).fill(0);

    // 最小1つずつ割り当て
    if (remainingSum >= target_snacks.length) {
        counts.fill(1);
        remainingSum -= target_snacks.length;
    } else {
        for(let i = 0; i < remainingSum; i++) counts[i] = 1;
        remainingSum = 0;
    }

    // 残りをランダムに配分（画像モードなら「問題は最大4個」）
    let safetyCounter = 0;
    const questLimit = isPicMode ? 4 : 99; 
    
    while (remainingSum > 0 && safetyCounter < 100) {
        const randomIndex = Math.floor(Math.random() * target_snacks.length);
        if (counts[randomIndex] < questLimit) {
            counts[randomIndex]++;
            remainingSum--;
        }
        safetyCounter++;
    }

    updateQuestDisplay(counts);
}

function updateQuestDisplay(counts) {
    // 1. 両方の要素（画像用/テキスト用）をリセットして場所を確保する
    title_elements.forEach(el => { if(el) el.innerHTML = ""; });
    title_elementsPic.forEach(el => { if(el) el.innerHTML = ""; });

    // 2. 問題に含まれるお菓子を、指定された固定位置に表示する
    for (let i = 0; i < target_snacks.length; i++) {
        if (counts) target_snacks[i].count = counts[i];
        const target = target_snacks[i];

        /**
         * 固定位置の指定マッピング
         * originalIndex: 2(チョコクッキー)   -> index 0 (title-1)
         * originalIndex: 3(ポテトチップス) -> index 1 (title-2)
         * originalIndex: 0(ポテトスティック) -> index 2 (title-3)
         * originalIndex: 1(チョコレート)     -> index 3 (title-4)
         */
        const titleIndexMap = [0, 1, 2, 3];
        const displayPos = titleIndexMap[target.originalIndex];

        if (target.count > 0) {
            if (isPicMode) {
                // 画像モード（title_elementsを使用）
                const imgTag = `<img src="${snackImages[target.name]}" style="height:5.2dvw; vertical-align:middle; margin-right:0.3dvw; margin-bottom: 0.5dvh">`;
                if(title_elementsPic[displayPos]) title_elementsPic[displayPos].innerHTML = imgTag.repeat(target.count);
            } else {
                // 文字モード（title_elementsPicを使用）
                if(title_elements[displayPos]) title_elements[displayPos].innerHTML = `・${target.name} ${toFullWidth(target.count)}こ`;
            }
        }
    }
}

const countAll = [0, 0, 0, 0];
var sW = window.innerWidth;
var sH = window.innerHeight;
var potatochips_cnt = 0, chocolate_cnt = 0, chococookie_cnt = 0, potatostick_cnt = 0; 

const boxRect = { left: sW * 0.76, top: sH * 0.71 };
box.style.left = `${boxRect.left}px`;
box.style.top = `${boxRect.top}px`;

snacks[0].startX = sW * -0.01; snacks[0].startY = sH * 0.7; // potatostick
snacks[1].startX = sW * 0.34; snacks[1].startY = sH * 0.7; // chocolate
snacks[2].startX = sW * -0.01; snacks[2].startY = sH * 0.31; // chococookie
snacks[3].startX = sW * 0.34; snacks[3].startY = sH * 0.31; // potatochips

let isMoving = false;
const duration = 700;

function easeInOutSine(t) { return -0.5 * (Math.cos(Math.PI * t) - 1); }

snacks.forEach(snackInfo => {
    const snackElement = snackInfo.element;
    snackElement.style.left = `${snackInfo.startX}px`;
    snackElement.style.top = `${snackInfo.startY}px`;
    let animationInterval = null;

    snackElement.addEventListener('click', () => {
        if (snackElement.style.display === 'none') return;

        // --- カゴの上限チェック ---
        // 画像モードの時、すでに4個入っていたらそれ以上入れられないようにする
        if (isPicMode) {
            let currentVal = 0;
            if(snackElement.id == 'potatochips') currentVal = potatochips_cnt;
            if(snackElement.id == 'chocolate') currentVal = chocolate_cnt;
            if(snackElement.id == 'chococookie') currentVal = chococookie_cnt;
            if(snackElement.id == 'potatostick') currentVal = potatostick_cnt;
            if (currentVal >= 4) return; 
        }

        isMoving = true;
        if (animationInterval) cancelAnimationFrame(animationInterval);

        const targetX = boxRect.left + box.offsetWidth / 2 - snackElement.offsetWidth / 2;
        const targetY = boxRect.top + box.offsetHeight / 2 - snackElement.offsetHeight / 2;
        const startX = parseFloat(snackElement.style.left);
        const startY = parseFloat(snackElement.style.top);
        let moveStartTime;

        function animateToBox(currentTime) {
            if (!moveStartTime) moveStartTime = currentTime;
            const elapsed = currentTime - moveStartTime;
            let progress = Math.min(1, elapsed / duration);
            progress = easeInOutSine(progress);
            snackElement.style.left = `${startX + (targetX - startX) * progress}px`;
            snackElement.style.top = `${startY + (targetY - startY) * progress}px`;

            if(progress > 0.9) snackElement.style.opacity = Math.max(0, snackElement.style.opacity - 0.05);

            if (progress >= 0.99) {
                isMoving = false;
                snackElement.style.left = `${snackInfo.startX}px`;
                snackElement.style.top = `${snackInfo.startY}px`;
                snackElement.style.opacity = 1;

                if(snackElement.id == 'potatochips') potatochips_cnt++;
                if(snackElement.id == 'chocolate') chocolate_cnt++;
                if(snackElement.id == 'chococookie') chococookie_cnt++;
                if(snackElement.id == 'potatostick') potatostick_cnt++;

                countAll[0] = potatostick_cnt; countAll[1] = chocolate_cnt;
                countAll[2] = chococookie_cnt; countAll[3] = potatochips_cnt;
                updateCountDisplay();
                return;
            }
            animationInterval = requestAnimationFrame(animateToBox);
        }
        animationInterval = requestAnimationFrame(animateToBox);
    });
});

function animateFromBox(snackId) {
    const snackInfo = snacks.find(v => v.id === snackId);
    if (!snackInfo) return;
    isMoving = true;
    const snackElement = snackInfo.element;
    const startX = boxRect.left + box.offsetWidth / 2 - snackElement.offsetWidth / 2;
    const startY = boxRect.top + box.offsetHeight / 2 - snackElement.offsetHeight / 2;
    snackElement.style.left = `${startX}px`;
    snackElement.style.top = `${startY}px`;
    snackElement.style.opacity = 0.2;

    const targetX = snackInfo.startX;
    const targetY = snackInfo.startY;
    let backStartTime = null;

    function animateBack(currentTime) {
        if (!backStartTime) backStartTime = currentTime;
        const elapsed = currentTime - backStartTime;
        let progress = Math.min(1, elapsed / duration);
        progress = easeInOutSine(progress);
        snackElement.style.left = `${startX + (targetX - startX) * progress}px`;
        snackElement.style.top = `${startY + (targetY - startY) * progress}px`;
        snackElement.style.opacity = 0.2 + (0.8 * progress);

        if (elapsed < duration) requestAnimationFrame(animateBack);
        else { snackElement.style.opacity = 1; isMoving = false; }
    }
    requestAnimationFrame(animateBack);
}

function updateCountDisplay() {
    const listConfig = [
        { el: potatochips_list, count: potatochips_cnt, name: "ポテトチップス　", id: "potatochips" },
        { el: chocolate_list, count: chocolate_cnt, name: "チョコレート　　", id: "chocolate" },
        { el: chococookie_list, count: chococookie_cnt, name: "チョコクッキー　", id: "chococookie" },
        { el: potatostick_list, count: potatostick_cnt, name: "ポテトスティック", id: "potatostick" }
    ];

    listConfig.forEach(item => {
        if (item.count > 0) {
            if (isPicMode) {
                // カゴの中身は最大5つまで表示
                const displayCount = Math.min(item.count, 5);
                const imgTag = `<img src="${snackImagesById[item.id]}" style="height:1.9em; vertical-align:middle; margin-right:0.3dvw;">`;
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
    let countAll_quest = [0, 0, 0, 0];
    target_snacks.forEach(target => {
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
    sendParams.append('course', 'おかし');

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
    let mostMissedsnack = "なし";
    let leastMissedsnack = "なし";
    const jpNames = ["チョコスティック", "チョコレート", "チョコクッキー", "ポテトチップス"];

    missAccumulator.forEach((val, idx) => {
        if (val > maxMissVal) {
            maxMissVal = val;
            mostMissedsnack = jpNames[idx];
        }
        if (val < minMissVal) {
            minMissVal = val;
            leastMissedsnack = jpNames[idx];
        }
    });

    if (failCount === 0) {
        mostMissedsnack = "なし";
        leastMissedsnack = "すべて正解";
    }

    sendParams.append(`mostMissed_${nextRound}`, mostMissedsnack);
    sendParams.append(`leastMissed_${nextRound}`, leastMissedsnack);

    return sendParams.toString();
}

function goToNextStage() {
    const queryString = finalizeRoundData();
    window.location.href = `snack-game4.html?${queryString}`;
}

function quitGame() {
    const queryString = finalizeRoundData();
    window.location.href = `giveto.html?${queryString}`;
}

function Decpotatochips() { if (!isMoving && potatochips_cnt > 0) { potatochips_cnt--; updateCountDisplay(); countAll[3] = potatochips_cnt; animateFromBox('potatochips'); } }
function Decchocolate() { if (!isMoving && chocolate_cnt > 0) { chocolate_cnt--; updateCountDisplay(); countAll[1] = chocolate_cnt; animateFromBox('chocolate'); } }
function Decchococookie() { if (!isMoving && chococookie_cnt > 0) { chococookie_cnt--; updateCountDisplay(); countAll[2] = chococookie_cnt; animateFromBox('chococookie'); } }
function Decpotatostick() { if (!isMoving && potatostick_cnt > 0) { potatostick_cnt--; updateCountDisplay(); countAll[0] = potatostick_cnt; animateFromBox('potatostick'); } }

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
        exitButton.addEventListener('click', quitGame);
    }

    document.getElementById('wrong-popup-button').addEventListener('click', hidePopup);
    document.getElementById('list-1').addEventListener('click', Decpotatochips);
    document.getElementById('list-2').addEventListener('click', Decchocolate);
    document.getElementById('list-3').addEventListener('click', Decchococookie);
    document.getElementById('list-4').addEventListener('click', Decpotatostick);
});
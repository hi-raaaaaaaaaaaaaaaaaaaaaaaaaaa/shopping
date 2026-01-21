const container = document.getElementById('container');
// 野菜たちの初期位置指定
const veges = [
    { element: document.getElementById('tomato'), id: 'tomato', startX: 0, startY: 0 },
    { element: document.getElementById('potato'), id: 'potato', startX: 0, startY: 0 },
    { element: document.getElementById('greenpepper'), id: 'greenpepper', startX: 0, startY: 0 },
    { element: document.getElementById('yam'), id: 'yam', startX: 0, startY: 0 },
];

const title_elements = [
    document.getElementById('title-1'),
    document.getElementById('title-2'),
    document.getElementById('title-3'),
    document.getElementById('title-4'),
];
const box = document.getElementById('box');
const yam_list = document.getElementById("list-1");
const potato_list = document.getElementById("list-2");
const greenpepper_list = document.getElementById("list-3");
const tomato_list = document.getElementById("list-4");

// --- データ計測用の変数 ---
let startTime = Date.now(); // 開始時間
let failCount = 0;          // 失敗回数
let playTime = 0;           // プレイ時間(秒)
let missAccumulator = [0, 0, 0, 0]; 
const vegeInternalNames = ["tomato", "potato", "greenpepper", "yam"];

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
const vegeImages = {
    "トマト　　": "image/vegetable/tomato.png",
    "じゃがいも": "image/vegetable/potato.png",
    "ピーマン　": "image/vegetable/greenpepper.png",
    "さつまいも": "image/vegetable/yam.png"
};

const vegeImagesById = {
    "tomato": "image/vegetable/tomato.png",
    "potato": "image/vegetable/potato.png",
    "greenpepper": "image/vegetable/greenpepper.png",
    "yam": "image/vegetable/yam.png"
};

const allVegetables = [
    { element: document.getElementById('tomato'), id: 'tomato', name: "トマト　　", overlayId: 'tomato_overlay', originalIndex: 0 },
    { element: document.getElementById('potato'), id: 'potato', name: "じゃがいも", overlayId: 'potato_overlay', originalIndex: 1 },
    { element: document.getElementById('greenpepper'), id: 'greenpepper', name: "ピーマン　", overlayId: 'greenpepper_overlay', originalIndex: 2 },
    { element: document.getElementById('yam'), id: 'yam', name: "さつまいも", overlayId: 'yam_overlay', originalIndex: 3 },
];

// --- 1. 表示する野菜をランダムに選択 ---
const shuffledIndices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);

for (let i = 0; i < allVegetables.length; i++) {
    const originalIndex = shuffledIndices[i];
    const vege = allVegetables[originalIndex];
    const overlayElement = document.getElementById(vege.overlayId);
    const overlayElementP = document.getElementById(vege.overlayId + 'P');

    if (i < numdispTypeSum) {
        vege.element.style.display = '';
        if (overlayElement) overlayElement.style.opacity = 1;
        if (overlayElementP) overlayElementP.style.opacity = 1;
    } else {
        vege.element.style.display = 'none';
        if (overlayElement) overlayElement.style.opacity = 0;
        if (overlayElementP) overlayElementP.style.opacity = 0;
    }
}

// --- 2. 問題の作成（画像モード時は1種類4個までに制限） ---
const displayedVeges = allVegetables.filter(vege => vege.element.style.display !== 'none');
let target_veges = [];

if (displayedVeges.length > 0 && numquestSum > 0) {
    const questCandidates = [...displayedVeges].sort(() => Math.random() - 0.5);
    const actualQuestTypeSum = Math.min(numquestTypeSum, questCandidates.length);
    
    let selectedForQuest = [];
    for (let i = 0; i < actualQuestTypeSum; i++) {
        selectedForQuest.push(questCandidates[i]);
    }

    selectedForQuest.sort((a, b) => a.originalIndex - b.originalIndex);

    for (let i = 0; i < selectedForQuest.length; i++) {
        target_veges.push({
            originalIndex: selectedForQuest[i].originalIndex,
            name: selectedForQuest[i].name,
            count: 0
        });
    }

    let remainingSum = numquestSum;
    let counts = new Array(target_veges.length).fill(0);

    // 最小1つずつ割り当て
    if (remainingSum >= target_veges.length) {
        counts.fill(1);
        remainingSum -= target_veges.length;
    } else {
        for(let i = 0; i < remainingSum; i++) counts[i] = 1;
        remainingSum = 0;
    }

    // 残りをランダムに配分（画像モードなら「問題は最大4個」）
    let safetyCounter = 0;
    const questLimit = isPicMode ? 4 : 99; 
    
    while (remainingSum > 0 && safetyCounter < 100) {
        const randomIndex = Math.floor(Math.random() * target_veges.length);
        if (counts[randomIndex] < questLimit) {
            counts[randomIndex]++;
            remainingSum--;
        }
        safetyCounter++;
    }

    updateQuestDisplay(counts);
}

function updateQuestDisplay(counts) {
    title_elements.forEach(el => { if(el) el.innerHTML = ""; });
    for (let i = 0; i < target_veges.length; i++) {
        if (counts) target_veges[i].count = counts[i];
        const target = target_veges[i];

        if (title_elements[i] && target.count > 0) {
            if (isPicMode) {
                const imgTag = `<img src="${vegeImages[target.name]}" style="height:1.5em; vertical-align:middle; margin-right:1.5dvw;">`;
                title_elements[i].innerHTML = imgTag.repeat(target.count);
            } else {
                title_elements[i].innerHTML = `・${target.name} ${toFullWidth(target.count)}こ`;
            }
        }
    }
}

const countAll = [0, 0, 0, 0];
var sW = window.innerWidth;
var sH = window.innerHeight;
var yam_cnt = 0, potato_cnt = 0, greenpepper_cnt = 0, tomato_cnt = 0; 

const boxRect = { left: sW * 0.72, top: sH * 0.65 };
box.style.left = `${boxRect.left}px`;
box.style.top = `${boxRect.top}px`;

veges[0].startX = sW * 0.1; veges[0].startY = sH * 0.63; // tomato
veges[1].startX = sW * 0.38; veges[1].startY = sH * 0.63; // potato
veges[2].startX = sW * 0.1; veges[2].startY = sH * 0.3; // greenpepper
veges[3].startX = sW * 0.38; veges[3].startY = sH * 0.3; // yam

let isMoving = false;
const duration = 700;

function easeInOutSine(t) { return -0.5 * (Math.cos(Math.PI * t) - 1); }

veges.forEach(vegeInfo => {
    const vegeElement = vegeInfo.element;
    vegeElement.style.left = `${vegeInfo.startX}px`;
    vegeElement.style.top = `${vegeInfo.startY}px`;
    let animationInterval = null;

    vegeElement.addEventListener('click', () => {
        if (vegeElement.style.display === 'none') return;

        // --- カゴの上限チェック ---
        // 画像モードの時、すでに4個入っていたらそれ以上入れられないようにする
        if (isPicMode) {
            let currentVal = 0;
            if(vegeElement.id == 'yam') currentVal = yam_cnt;
            if(vegeElement.id == 'potato') currentVal = potato_cnt;
            if(vegeElement.id == 'greenpepper') currentVal = greenpepper_cnt;
            if(vegeElement.id == 'tomato') currentVal = tomato_cnt;
            if (currentVal >= 4) return; 
        }

        isMoving = true;
        if (animationInterval) cancelAnimationFrame(animationInterval);

        const targetX = boxRect.left + box.offsetWidth / 2 - vegeElement.offsetWidth / 2;
        const targetY = boxRect.top + box.offsetHeight / 2 - vegeElement.offsetHeight / 2;
        const startX = parseFloat(vegeElement.style.left);
        const startY = parseFloat(vegeElement.style.top);
        let moveStartTime;

        function animateToBox(currentTime) {
            if (!moveStartTime) moveStartTime = currentTime;
            const elapsed = currentTime - moveStartTime;
            let progress = Math.min(1, elapsed / duration);
            progress = easeInOutSine(progress);
            vegeElement.style.left = `${startX + (targetX - startX) * progress}px`;
            vegeElement.style.top = `${startY + (targetY - startY) * progress}px`;

            if(progress > 0.9) vegeElement.style.opacity = Math.max(0, vegeElement.style.opacity - 0.05);

            if (progress >= 0.99) {
                isMoving = false;
                vegeElement.style.left = `${vegeInfo.startX}px`;
                vegeElement.style.top = `${vegeInfo.startY}px`;
                vegeElement.style.opacity = 1;

                if(vegeElement.id == 'yam') yam_cnt++;
                if(vegeElement.id == 'potato') potato_cnt++;
                if(vegeElement.id == 'greenpepper') greenpepper_cnt++;
                if(vegeElement.id == 'tomato') tomato_cnt++;

                countAll[0] = tomato_cnt; countAll[1] = potato_cnt;
                countAll[2] = greenpepper_cnt; countAll[3] = yam_cnt;
                updateCountDisplay();
                return;
            }
            animationInterval = requestAnimationFrame(animateToBox);
        }
        animationInterval = requestAnimationFrame(animateToBox);
    });
});

function animateFromBox(vegeId) {
    const vegeInfo = veges.find(v => v.id === vegeId);
    if (!vegeInfo) return;
    isMoving = true;
    const vegeElement = vegeInfo.element;
    const startX = boxRect.left + box.offsetWidth / 2 - vegeElement.offsetWidth / 2;
    const startY = boxRect.top + box.offsetHeight / 2 - vegeElement.offsetHeight / 2;
    vegeElement.style.left = `${startX}px`;
    vegeElement.style.top = `${startY}px`;
    vegeElement.style.opacity = 0.2;

    const targetX = vegeInfo.startX;
    const targetY = vegeInfo.startY;
    let backStartTime = null;

    function animateBack(currentTime) {
        if (!backStartTime) backStartTime = currentTime;
        const elapsed = currentTime - backStartTime;
        let progress = Math.min(1, elapsed / duration);
        progress = easeInOutSine(progress);
        vegeElement.style.left = `${startX + (targetX - startX) * progress}px`;
        vegeElement.style.top = `${startY + (targetY - startY) * progress}px`;
        vegeElement.style.opacity = 0.2 + (0.8 * progress);

        if (elapsed < duration) requestAnimationFrame(animateBack);
        else { vegeElement.style.opacity = 1; isMoving = false; }
    }
    requestAnimationFrame(animateBack);
}

function updateCountDisplay() {
    const listConfig = [
        { el: yam_list, count: yam_cnt, name: "さつまいも", id: "yam" },
        { el: potato_list, count: potato_cnt, name: "じゃがいも", id: "potato" },
        { el: greenpepper_list, count: greenpepper_cnt, name: "ピーマン　", id: "greenpepper" },
        { el: tomato_list, count: tomato_cnt, name: "トマト　　", id: "tomato" }
    ];

    listConfig.forEach(item => {
        if (item.count > 0) {
            if (isPicMode) {
                // カゴの中身は最大5つまで表示
                const displayCount = Math.min(item.count, 5);
                const imgTag = `<img src="${vegeImagesById[item.id]}" style="height:1.7em; vertical-align:middle; margin-right:1dvw;">`;
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
    target_veges.forEach(target => {
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
    sendParams.append('course', 'やさい');

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
    let mostMissedVege = "なし";
    let leastMissedVege = "なし";
    const jpNames = ["トマト", "じゃがいも", "ピーマン", "さつまいも"];

    missAccumulator.forEach((val, idx) => {
        if (val > maxMissVal) {
            maxMissVal = val;
            mostMissedVege = jpNames[idx];
        }
        if (val < minMissVal) {
            minMissVal = val;
            leastMissedVege = jpNames[idx];
        }
    });

    if (failCount === 0) {
        mostMissedVege = "なし";
        leastMissedVege = "すべて正解";
    }

    sendParams.append(`mostMissed_${nextRound}`, mostMissedVege);
    sendParams.append(`leastMissed_${nextRound}`, leastMissedVege);

    return sendParams.toString();
}

function goToNextStage() {
    const queryString = finalizeRoundData();
    window.location.href = `vegetable-game4.html?${queryString}`;
}

function quitGame() {
    const queryString = finalizeRoundData();
    window.location.href = `giveto.html?${queryString}`;
}

function DecYam() { if (!isMoving && yam_cnt > 0) { yam_cnt--; updateCountDisplay(); countAll[3] = yam_cnt; animateFromBox('yam'); } }
function DecPotato() { if (!isMoving && potato_cnt > 0) { potato_cnt--; updateCountDisplay(); countAll[1] = potato_cnt; animateFromBox('potato'); } }
function DecGreenpepper() { if (!isMoving && greenpepper_cnt > 0) { greenpepper_cnt--; updateCountDisplay(); countAll[2] = greenpepper_cnt; animateFromBox('greenpepper'); } }
function DecTomato() { if (!isMoving && tomato_cnt > 0) { tomato_cnt--; updateCountDisplay(); countAll[0] = tomato_cnt; animateFromBox('tomato'); } }

function toFullWidth(str) {
    return String(str).replace(/[A-Za-z0-9]/g, s => String.fromCharCode(s.charCodeAt(0) + 0xFEE0));
}

document.addEventListener('DOMContentLoaded', () => {
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
    document.getElementById('list-1').addEventListener('click', DecYam);
    document.getElementById('list-2').addEventListener('click', DecPotato);
    document.getElementById('list-3').addEventListener('click', DecGreenpepper);
    document.getElementById('list-4').addEventListener('click', DecTomato);
});
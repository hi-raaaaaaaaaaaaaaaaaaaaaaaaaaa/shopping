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
        if (overlayElementP) overlayElementP.style.opacity = 1; // Pも1にする
    } else {
        vege.element.style.display = 'none';
        if (overlayElement) overlayElement.style.opacity = 0;
        if (overlayElementP) overlayElementP.style.opacity = 0; // Pも0にする
    }
}

// --- 2. 表示されている中から問題をランダムに選択し、順序を固定する ---
const displayedVeges = allVegetables.filter(vege => vege.element.style.display !== 'none');
let target_veges = [];

if (displayedVeges.length > 0 && numquestSum > 0) {
    // 問題にする種類をランダムに選ぶ
    const questCandidates = [...displayedVeges].sort(() => Math.random() - 0.5);
    const actualQuestTypeSum = Math.min(numquestTypeSum, questCandidates.length);
    
    let selectedForQuest = [];
    for (let i = 0; i < actualQuestTypeSum; i++) {
        selectedForQuest.push(questCandidates[i]);
    }

    // 指定の順序（originalIndex順）に並べ替える
    selectedForQuest.sort((a, b) => a.originalIndex - b.originalIndex);

    for (let i = 0; i < selectedForQuest.length; i++) {
        target_veges.push({
            originalIndex: selectedForQuest[i].originalIndex,
            name: selectedForQuest[i].name,
            count: 0
        });
    }

    // 個数の分配
    let remainingSum = numquestSum;
    let counts = new Array(target_veges.length).fill(0);
    if (remainingSum >= target_veges.length) {
        counts.fill(1);
        remainingSum -= target_veges.length;
    } else {
        for(let i = 0; i < remainingSum; i++) counts[i] = 1;
        remainingSum = 0;
    }
    for (let i = 0; i < remainingSum; i++) {
        const randomIndex = Math.floor(Math.random() * target_veges.length);
        counts[randomIndex]++;
    }

    // お題の表示（ソート順）
    title_elements.forEach(el => { if(el) el.innerHTML = ""; });
    for (let i = 0; i < target_veges.length; i++) {
        target_veges[i].count = counts[i];
        if (title_elements[i] && target_veges[i].count > 0) {
            title_elements[i].innerHTML = `・${target_veges[i].name} ${toFullWidth(target_veges[i].count)}こ`;
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
    yam_list.innerHTML = yam_cnt > 0 ? `さつまいも ${toFullWidth(yam_cnt)}こ` : "";
    potato_list.innerHTML = potato_cnt > 0 ? `じゃがいも ${toFullWidth(potato_cnt)}こ` : "";
    greenpepper_list.innerHTML = greenpepper_cnt > 0 ? `ピーマン　 ${toFullWidth(greenpepper_cnt)}こ` : "";
    tomato_list.innerHTML = tomato_cnt > 0 ? `トマト　　 ${toFullWidth(tomato_cnt)}こ` : "";
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

// --- パラメータを蓄積するロジックの共通化 ---
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
    
    // 「やめる」ボタンのイベントリスナー
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
const container = document.getElementById('container');
//野菜たちの初期位置指定 (IDと要素の紐づけは固定)
const veges = [
    { element: document.getElementById('tomato'), id: 'tomato', startX: 0, startY: 0 },
    { element: document.getElementById('potato'), id: 'potato', startX: 0, startY: 0 },
];

//innerHTMLのための宣言 - 質問の表示先を title-1, title-2, ... に変更
const title_elements = [
    document.getElementById('title-1'),
    document.getElementById('title-2'),
];
const box = document.getElementById('box');
const potato_list = document.getElementById("list-2");
const tomato_list = document.getElementById("list-4");

//URLの取得
let url = new URL(window.location.href);
let params = url.searchParams;

var type = 0;
const picture = params.get('pic');
const chara = params.get('chara');

if(picture == 'true') type = '写真';
else if(chara == 'true') type = '文字';
else type = 'error';
console.warn(type);

const dispTypeSum = params.get('dispTypeSum');
const questTypeSumParam = params.get('questTypeSum'); // 問題の種類数 (questTypeSum)
const questSumParam = params.get('questSum'); // 問題の合計個数 (questSum)

// dispTypeSumを数値に変換し、1～2の範囲内かチェック。そうでなければデフォルトで4とする
let numdispTypeSum = parseInt(dispTypeSum);
if (isNaN(numdispTypeSum) || numdispTypeSum < 1 || numdispTypeSum > 2) {
    numdispTypeSum = 2;
}

// questTypeSumを数値に変換し、1～2の範囲内かチェック。そうでなければデフォルトで1とする
let numquestTypeSum = parseInt(questTypeSumParam);
if (isNaN(numquestTypeSum) || numquestTypeSum < 1 || numquestTypeSum > 2) {
    numquestTypeSum = 1;
}

// questSumを数値に変換し、1～10の範囲内かチェック。そうでなければデフォルトで1とする
let numquestSum = parseInt(questSumParam);
if (isNaN(numquestSum) || numquestSum < 1 || numquestSum > 10) {
    numquestSum = 1;
}

console.log('%s形式で%i種類陳列されている中から%i種類合計%i個選ぶ',type, numdispTypeSum, numquestTypeSum, numquestSum);

// 陳列数の制御（既存ロジック）
const allVegetables = [
    { element: document.getElementById('tomato'), id: 'tomato', name: "トマト　　", overlayId: 'tomato_overlay', originalIndex: 0 }, // 0: トマト
    { element: document.getElementById('potato'), id: 'potato', name: "じゃがいも", overlayId: 'potato_overlay', originalIndex: 1 }, // 1: じゃがいも
];

// 陳列する野菜のインデックスをランダムに選択（既存ロジック）
const availableIndices = [0, 1];
for (let i = availableIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
}

// numdispTypeSumの数だけ野菜を表示し、残りを非表示にする（既存ロジック）
for (let i = 0; i < allVegetables.length; i++) {
    const originalIndex = availableIndices[i];
    const vege = allVegetables[originalIndex];
    const overlayElement = document.getElementById(vege.overlayId);

    if (i < numdispTypeSum) {
        vege.element.style.display = '';
        if (overlayElement) {
            overlayElement.style.opacity = 1;
        }
    } else {
        vege.element.style.display = 'none';
        if (overlayElement) {
            overlayElement.style.opacity = 0;
        }
    }
}

// 表示されている野菜だけを格納する新しい配列を生成（既存ロジック）
const displayedVeges = allVegetables.filter(vege => vege.element.style.display !== 'none');

// 問題決定ロジックの変更
// 問題の野菜は表示されているものから選び、種類数と合計個数を考慮する

let target_veges = []; // 答えとなる野菜と個数の配列 [{originalIndex: 0-3, count: 1-10}, ...]

if (displayedVeges.length > 0 && numquestSum > 0) {
    // 実際に表示されている野菜の中から、問題にする野菜の候補を選ぶ
    const questCandidates = [...displayedVeges]; // シャッフルされた候補リスト
    const actualQuestTypeSum = Math.min(numquestTypeSum, questCandidates.length); // 実際に問題にできる種類数

    // 問題にする野菜をランダムに選択
    for (let i = 0; i < actualQuestTypeSum; i++) {
        // questCandidates は既にシャッフルされているため、最初の actualQuestTypeSum 個を選ぶ
        target_veges.push({
            originalIndex: questCandidates[i].originalIndex,
            name: questCandidates[i].name,
            count: 0 // 仮に0を設定
        });
    }

    // 合計個数 (numquestSum) を actualQuestTypeSum 個の野菜にランダムに分配する
    let remainingSum = numquestSum;
    let counts = new Array(actualQuestTypeSum).fill(0);

    // まず、すべての種類に最低1個を割り当てる (合計個数 > 種類数の場合)
    if (remainingSum >= actualQuestTypeSum) {
        counts.fill(1);
        remainingSum -= actualQuestTypeSum;
    } else {
        // 合計個数が種類数よりも少ない場合は、最初の remainingSum 個に1個ずつ割り当て
        for(let i = 0; i < remainingSum; i++) {
            counts[i] = 1;
        }
        remainingSum = 0;
    }

    // 残りの個数をランダムに分配
    for (let i = 0; i < remainingSum; i++) {
        // ランダムなインデックスを選んで1個増やす
        const randomIndex = Math.floor(Math.random() * actualQuestTypeSum);
        counts[randomIndex]++;
    }

    // target_vegesに個数を設定し、問題文を作成
    for (let i = 0; i < actualQuestTypeSum; i++) {
        if (counts[i] > 0) {
            target_veges[i].count = counts[i];
            // title-1, title-2, ... にinnerHTMLを設定
            if (title_elements[i]) {
                title_elements[i].innerHTML = `・${target_veges[i].name} ${toFullWidth(target_veges[i].count)}こ`;
            }
        }
    }
} else {
    // 問題が作成できない場合、すべてクリア
    title_elements.forEach(el => el.innerHTML = '');
    console.error("問題作成に必要なパラメータが不足しているか、表示野菜がありません。");
}


//現在の野菜たちの数(随時更新)
const countAll  = [0, 0]; // [tomato, potato, greenpepper, yam] の順

//ウィンドウの縦幅(sW)と横幅(sH)
var sW = window.innerWidth;
var sH = window.innerHeight;

//listで使う関数
var potato_cnt = 0, tomato_cnt = 0;

//box(買い物かご)の位置指定
const boxRect = {
    left: sW * 0.72,
    top: sH * 0.65,
};
box.style.left = `${boxRect.left}px`;
box.style.top = `${boxRect.top}px`;

//動く野菜たちの位置指定（既存ロジック）
// 固定の veges 配列の順番に合わせる
veges[0].startX = sW * 0.08; // tomato
veges[0].startY = sH * 0.47;

veges[1].startX = sW * 0.37; // potato
veges[1].startY = sH * 0.47;


//  (vege[2])---(vege[3])
//     |          |
//   vege[0] --- vege[1]


let isMoving = false;
const duration = 700; //アニメーションに要する秒数(カゴに入れるのも出すのも)

// easeInOutCubic イージング関数 (グローバル)
// https://easings.net/ja#easeInOutSine を参照！
function easeInOutSine(t) {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
}

//移動開始！！ (野菜をクリックしてカゴに入れるアニメーション)（既存ロジック）
veges.forEach(vegeInfo => {
    const vegeElement = vegeInfo.element;
    // 初期位置を設定（display: noneの要素も位置は設定しておく）
    vegeElement.style.left = `${vegeInfo.startX}px`;
    vegeElement.style.top = `${vegeInfo.startY}px`;
    let animationInterval = null; // この変数は、個々の野菜のアニメーションIDを保持するために必要なのだ

    //野菜をクリックすると動くよ〜
    vegeElement.addEventListener('click', () => {
        // 非表示の要素がクリックされても処理しない
        if (vegeElement.style.display === 'none') return;

        //if (isMoving) return;
        isMoving = true;

        if (animationInterval) {
            cancelAnimationFrame(animationInterval);
            animationInterval = null;
        }

        //target(かご)と実行時の野菜の位置指定
        const targetX = boxRect.left + box.offsetWidth / 2 - vegeElement.offsetWidth / 2;
        const targetY = boxRect.top + box.offsetHeight / 2 - vegeElement.offsetHeight / 2;
        const startX = parseFloat(vegeElement.style.left);
        const startY = parseFloat(vegeElement.style.top);
        let startTime;

        //移動プログラム本体
        function animateToBox(currentTime) {
            if (!startTime) {
                startTime = currentTime;
            }
            const elapsed = currentTime - startTime;
            let progress = Math.min(1, elapsed / duration);
            progress = easeInOutSine(progress);
            const newX = startX + (targetX - startX) * progress;
            const newY = startY + (targetY - startY) * progress;

            vegeElement.style.left = `${newX}px`;
            vegeElement.style.top = `${newY}px`;

            //progress(0から1)の値が0.95(かご付近)になったら不透明度を0.2ずつ下げる
            if(progress > 0.9) vegeElement.style.opacity = Math.max(0, vegeElement.style.opacity - 0.05);

            // ボックスに入ったかどうかの判定
            // ボックスの中心に到達したか、またはアニメーションがほぼ完了したら
            if (progress >= 0.99) { // ほぼ到達で判定を確定させる
                isMoving = false;
                // ボックスに入ったら元の位置に瞬時に戻す
                vegeElement.style.left = `${vegeInfo.startX}px`;
                vegeElement.style.top = `${vegeInfo.startY}px`;
                vegeElement.style.opacity = 1;

                //カゴに入ったからかごの中身に追加
                if(vegeElement.id == 'yam') yam_cnt++;
                if(vegeElement.id == 'potato') potato_cnt++;
                if(vegeElement.id == 'greenpepper') greenpepper_cnt++;
                if(vegeElement.id == 'tomato') tomato_cnt++;

                //countAllの数を更新 (countAllは [tomato, potato, greenpepper, yam] の順)
                countAll[0] = tomato_cnt;
                countAll[1] = potato_cnt;
                console.warn(countAll);

                updateCountDisplay(); // カウント表示を更新する関数を呼び出し

                cancelAnimationFrame(animationInterval); // アニメーションを停止
                animationInterval = null;
                return;
            }

            animationInterval = requestAnimationFrame(animateToBox);
        }

        animationInterval = requestAnimationFrame(animateToBox);
    });
});


// 移動開始！！（カゴから元の位置に戻るアニメーション）（既存ロジック）
function animateFromBox(vegeId) {
    const vegeInfo = veges.find(v => v.id === vegeId);//削除された野菜を見つけ出す
    if (!vegeInfo) return;//例外処理

    //if (isMoving) return;
    isMoving = true;

    const vegeElement = vegeInfo.element;
    // アニメーション開始時の位置はカゴの中心
    const startX = boxRect.left + box.offsetWidth / 2 - vegeElement.offsetWidth / 2;
    const startY = boxRect.top + box.offsetHeight / 2 - vegeElement.offsetHeight / 2;

    // 野菜を一旦カゴの中心に移動させ、不透明度をリセットして表示
    vegeElement.style.left = `${startX}px`;
    vegeElement.style.top = `${startY}px`;
    // 非表示の場合はアニメーションしないよう `display:none` のチェックを追加
    if (vegeElement.style.display === 'none') {
        isMoving = false;
        return;
    }
    vegeElement.style.opacity = 0.2;

    const targetX = vegeInfo.startX;
    const targetY = vegeInfo.startY;
    let startTime = null;
    let currentAnimationFrameId = null; // このアニメーション専用のID

    //移動プログラム本体（野菜を削除する）
    function animateBack(currentTime) {
        if (!startTime) {
            startTime = currentTime;
        }
        const elapsed = currentTime - startTime;
        let progress = Math.min(1, elapsed / duration);
        progress = easeInOutSine(progress); // イージング！

        const newX = startX + (targetX - startX) * progress;
        const newY = startY + (targetY - startY) * progress;

        vegeElement.style.left = `${newX}px`;
        vegeElement.style.top = `${newY}px`;

        // progressが0から1に進むにつれて、opacityも0.2から1に増加
        vegeElement.style.opacity = 0.2 + (0.8 * (progress * 40)); // 0.2 (開始) + 0.8 (最大増加量) * progressの40倍

        if (elapsed < duration) {
            currentAnimationFrameId = requestAnimationFrame(animateBack);
        } else {
            // アニメーション完了後
            vegeElement.style.opacity = 1; // 完全に不透明にする
            isMoving = false;
            currentAnimationFrameId = null;
        }
    }
    currentAnimationFrameId = requestAnimationFrame(animateBack);
}

// カウント表示を更新する関数（既存ロジック）
function updateCountDisplay() {
    potato_list.innerHTML = potato_cnt > 0 ? `じゃがいも ${toFullWidth(potato_cnt)}こ` : "";
    tomato_list.innerHTML = tomato_cnt > 0 ? `トマト　　 ${toFullWidth(tomato_cnt)}こ` : "";
}

// 正誤判定（ロジック修正）
// countAllの順序: [tomato=0, potato=1, greenpepper=2, yam=3]
function ansJudge() {
    let countAll_quest = [0, 0];
    let judge = 0;

    // target_veges 配列に基づいて正解の個数配列を作成
    target_veges.forEach(target => {
        countAll_quest[target.originalIndex] = target.count;
    });

    console.warn(countAll_quest, countAll);

    // JSON.stringifyでの比較はオブジェクトの順序まで厳密なので、配列の順序を合わせる
    if (JSON.stringify(countAll_quest) === JSON.stringify(countAll)) judge = 1;

    if (judge == 1) correctPopup();
    else if (judge == 0) wrongPopup();
    else console.warn("判定プログラムが壊れています");

    judge = 0;
}

// クラッカー制御のためのグローバル変数（既存ロジック）
let crackerInterval = null; // クラッカーアニメーションのsetInterval IDを保持

// ポップアップを表示する関数（既存ロジック）
function correctPopup(){
    document.getElementById('correct_Popup').classList.add('show');

    // --- クラッカーアニメーションを開始 ---
    const crackerContainer = document.getElementById('cracker-container');
    if (crackerContainer) {
        crackerContainer.classList.add('active'); // コンテナを表示
    }

    // cracker.jsで定義された関数を呼び出してループを開始
    // animateCrackerがグローバルに定義されていることを前提とする
    // activeクラス追加後にanimateCrackerを呼び出す
    if (typeof animateCracker === 'function' && crackerInterval === null) {
        animateCracker(); // 初回実行
        crackerInterval = setInterval(animateCracker, 3000); // 3秒間隔でループ
    }
};

function wrongPopup(){
    document.getElementById('wrong_Popup').classList.add('show');
};

// ポップアップを非表示にする関数（既存ロジック）
function hidePopup() {
    document.getElementById('correct_Popup').classList.remove('show');
    document.getElementById('wrong_Popup').classList.remove('show');
    // --- クラッカーアニメーションを停止・リセット ---
    const crackerContainer = document.getElementById('cracker-container');
    if (crackerContainer) {
        crackerContainer.classList.remove('active'); // コンテナを非表示
    }
    const confettiContainer = document.getElementById('confetti-container');
    if (confettiContainer) {
        // 現在の紙吹雪をクリア
        confettiContainer.querySelectorAll('.confetti').forEach(c => c.remove());
        confettiContainer.innerHTML = '';
    }
    // setIntervalを停止
    if (crackerInterval !== null) {
        clearInterval(crackerInterval);
        crackerInterval = null;
    }
}

//かごの中身をクリックしたら中身減るプログラム達（既存ロジック）

function DecPotato() {
    if (isMoving) return;
    if (potato_cnt > 0) {
        potato_cnt--;
        updateCountDisplay();
        countAll[1] = potato_cnt;
        animateFromBox('potato'); // アニメーションを呼び出す
    }
}

function DecTomato() {
    if (isMoving) return;
    if (tomato_cnt > 0) {
        tomato_cnt--;
        updateCountDisplay();
        countAll[0] = tomato_cnt;
        animateFromBox('tomato'); // アニメーションを呼び出す
    }
}

function toFullWidth(str) {
    str = String(str);
    // 半角英数字を全角に変換
    str = str.replace(/[A-Za-z0-9]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    });
    return str;
}

document.addEventListener('DOMContentLoaded', () => {
    // ボタンとリストアイテムにイベントリスナーを追加（既存ロジック）
    document.getElementById('check-button').addEventListener('click', ansJudge);
    document.getElementById('correct-popup-button').addEventListener('click', hidePopup);
    document.getElementById('wrong-popup-button').addEventListener('click', hidePopup);
    document.getElementById('list-2').addEventListener('click', DecPotato);
    document.getElementById('list-4').addEventListener('click', DecTomato);
});

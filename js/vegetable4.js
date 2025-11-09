const container = document.getElementById('container');
//野菜たちの初期位置指定 (IDと要素の紐づけは固定)
const veges = [
    { element: document.getElementById('tomato'), id: 'tomato', startX: 0, startY: 0 },
    { element: document.getElementById('potato'), id: 'potato', startX: 0, startY: 0 },
    { element: document.getElementById('greenpepper'), id: 'greenpepper', startX: 0, startY: 0 },
    { element: document.getElementById('yam'), id: 'yam', startX: 0, startY: 0 },
];

//innerHTMLのための宣言
const question = document.getElementById('title');
const box = document.getElementById('box');
const yam_list = document.getElementById("list-1");
const potato_list = document.getElementById("list-2");
const greenpepper_list = document.getElementById("list-3");
const tomato_list = document.getElementById("list-4");

//URLの取得
let url = new URL(window.location.href);

let params = url.searchParams;

//console.log(params.get('pic'));
//console.log(params.get('chara'));
//console.log(params.get('dispTypeSum'));
//console.log(params.get('questTypeSum'));

var type = 0;
const picture = params.get('pic');
const chara = params.get('chara');

console.warn(picture);

if(picture == 'true') type = '写真';
else if(chara == 'true') type = '文字';
else type = 'error';
console.warn(type);

const dispTypeSum = params.get('dispTypeSum');
const questTypeSum = params.get('questTypeSum');
const questSum = params.get('questSum');

// dispTypeSumを数値に変換し、1～4の範囲内かチェック。そうでなければデフォルトで4とする
let numdispTypeSum = parseInt(dispTypeSum);
if (isNaN(numdispTypeSum) || numdispTypeSum < 1 || numdispTypeSum > 4) {
    numdispTypeSum = 4;
}

console.log('%s形式で%i種類陳列されている中から%i種類選ぶ',type, numdispTypeSum, questTypeSum);

// 陳列数の制御
const allVegetables = [
    { element: document.getElementById('tomato'), id: 'tomato', overlayId: 'tomato_overlay' }, // 0: トマト
    { element: document.getElementById('potato'), id: 'potato', overlayId: 'potato_overlay' }, // 1: じゃがいも
    { element: document.getElementById('greenpepper'), id: 'greenpepper', overlayId: 'greenpepper_overlay' }, // 2: ピーマン
    { element: document.getElementById('yam'), id: 'yam', overlayId: 'yam_overlay' }, // 3: さつまいも
];

// 陳列する野菜のインデックスをランダムに選択
const availableIndices = [0, 1, 2, 3];
// Fisher-Yates shuffleアルゴリズムでシャッフル
for (let i = availableIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
}

// numdispTypeSumの数だけ野菜を表示し、残りを非表示にする
for (let i = 0; i < allVegetables.length; i++) {
    const originalIndex = availableIndices[i];
    const vege = allVegetables[originalIndex];
    const overlayElement = document.getElementById(vege.overlayId);

    if (i < numdispTypeSum) {
        // 表示する野菜
        vege.element.style.display = ''; 
        // 対応するオーバーレイを表示 (opacity=1)
        if (overlayElement) {
            overlayElement.style.opacity = 1;
        }
    } else {
        // 非表示にする野菜
        vege.element.style.display = 'none';
        // 対応するオーバーレイを非表示 (opacity=0)
        if (overlayElement) {
            overlayElement.style.opacity = 0;
        }
    }
}

// 表示されている野菜だけを格納する新しい配列を生成
// 問題の選択やリストのクリック処理で参照するために使用
const displayedVeges = allVegetables.filter(vege => vege.element.style.display !== 'none');


// 問題決定 と #titleにinnerHTML
// 問題の野菜は表示されているものから選ぶ
// 表示されている野菜の名前リストを作成
const displayedVegeNames = displayedVeges.map(v => {
    if (v.id === 'yam') return "さつまいも";
    if (v.id === 'potato') return "じゃがいも";
    if (v.id === 'greenpepper') return "ピーマン";
    if (v.id === 'tomato') return "トマト";
    return "";
});

// 表示されている野菜の中からランダムで問題にする野菜を選ぶ
let vege_name_num_index = Math.floor(Math.random() * displayedVegeNames.length);
const vege_name = displayedVegeNames[vege_name_num_index];

// 選択された野菜の元のインデックス (ansJudgeで使う) を特定
// ここは固定の allVegetables のインデックス (tomato=0, potato=1, greenpepper=2, yam=3) に対応させる
let original_vege_index = -1;
if (vege_name === "さつまいも") original_vege_index = 3; // yam
else if (vege_name === "じゃがいも") original_vege_index = 1; // potato
else if (vege_name === "ピーマン") original_vege_index = 2; // greenpepper
else if (vege_name === "トマト") original_vege_index = 0; // tomato


let vege_num = Math.floor(Math.random() * (4 - 1) + 1); // 1から3
console.warn(original_vege_index, vege_name, vege_num);
if((vege_name !== null) && (vege_num != 0)) question.innerHTML = `${vege_name}　${toFullWidth(vege_num)}こ`;

//現在の野菜たちの数(随時更新)
const countAll  = [0, 0, 0, 0]; // [tomato, potato, greenpepper, yam] の順

//ウィンドウの縦幅(sW)と横幅(sH)
var sW = window.innerWidth;
var sH = window.innerHeight;

//listで使う関数
var yam_cnt = 0, potato_cnt = 0, greenpepper_cnt = 0, tomato_cnt = 0; 

//box(買い物かご)の位置指定
const boxRect = {
    left: sW * 0.72,
    top: sH * 0.65,
};
box.style.left = `${boxRect.left}px`;
box.style.top = `${boxRect.top}px`;

//動く野菜たちの位置指定
// 固定の veges 配列の順番に合わせる
veges[0].startX = sW * 0.08; // tomato
veges[0].startY = sH * 0.57;

veges[1].startX = sW * 0.37; // potato
veges[1].startY = sH * 0.57;

veges[2].startX = sW * 0.08; // greenpepper
veges[2].startY = sH * 0.2;

veges[3].startX = sW * 0.37; // yam
veges[3].startY = sH * 0.2;


let isMoving = false;
const duration = 840; //アニメーションに要する秒数(カゴに入れるのも出すのも)

// easeInOutCubic イージング関数 (グローバル)
// https://easings.net/ja#easeInOutSine を参照！
function easeInOutSine(t) {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
}

//移動開始！！ (野菜をクリックしてカゴに入れるアニメーション)
veges.forEach(vegeInfo => {
    const vegeElement = vegeInfo.element;
    // 初期位置を設定（display: noneの要素も位置は設定しておく）
    vegeElement.style.left = `${vegeInfo.startX}px`;
    vegeElement.style.top = `${vegeInfo.startY}px`;
    let animationInterval = null; 

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
                countAll[2] = greenpepper_cnt;
                countAll[3] = yam_cnt;
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


// 移動開始！！（カゴから元の位置に戻るアニメーション）
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
        vegeElement.style.opacity = 0.2 + (0.8 * (progress * 40)); 

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

// カウント表示を更新する関数
function updateCountDisplay() {
    yam_list.innerHTML = yam_cnt > 0 ? `さつまいも ${toFullWidth(yam_cnt)}こ` : "";
    potato_list.innerHTML = potato_cnt > 0 ? `じゃがいも ${toFullWidth(potato_cnt)}こ` : "";
    greenpepper_list.innerHTML = greenpepper_cnt > 0 ? `ピーマン　 ${toFullWidth(greenpepper_cnt)}こ` : "";
    tomato_list.innerHTML = tomato_cnt > 0 ? `トマト　　 ${toFullWidth(tomato_cnt)}こ` : "";
}

// 正誤判定
// countAllの順序: [tomato=0, potato=1, greenpepper=2, yam=3]
function ansJudge() {
    let countAll_quest = [0, 0, 0, 0];
    let judge = 0;
    
    // original_vege_index は allVegetables のインデックス順 (tomato=0, potato=1, greenpepper=2, yam=3)
    countAll_quest[0] = original_vege_index == 0 ? vege_num : 0; // トマト(tomato)
    countAll_quest[1] = original_vege_index == 1 ? vege_num : 0; // じゃがいも(potato)
    countAll_quest[2] = original_vege_index == 2 ? vege_num : 0; // ピーマン(greenpepper)
    countAll_quest[3] = original_vege_index == 3 ? vege_num : 0; // さつまいも(yam)
    
    console.warn(countAll_quest, countAll);

    // JSON.stringifyでの比較はオブジェクトの順序まで厳密なので、配列の順序を合わせる
    if (JSON.stringify(countAll_quest) === JSON.stringify(countAll)) judge = 1;

    if (judge == 1) correctPopup();
    else if (judge == 0) wrongPopup();
    else console.warn("判定プログラムが壊れています");

    judge = 0;
}

// クラッカー制御のためのグローバル変数
let crackerInterval = null; // クラッカーアニメーションのsetInterval IDを保持

// ポップアップを表示する関数
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

// ポップアップを非表示にする関数
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

//かごの中身をクリックしたら中身減るプログラム達
function DecYam() {
    if (isMoving) return;
    if (yam_cnt > 0) {
        yam_cnt--;
        updateCountDisplay();
        // countAllの順序: [tomato=0, potato=1, greenpepper=2, yam=3]
        countAll[3] = yam_cnt; 
        animateFromBox('yam'); // アニメーションを呼び出す
    }
}

function DecPotato() {
    if (isMoving) return;
    if (potato_cnt > 0) {
        potato_cnt--;
        updateCountDisplay();
        countAll[1] = potato_cnt;
        animateFromBox('potato'); // アニメーションを呼び出す
    }
}

function DecGreenpepper() {
    if (isMoving) return;
    if (greenpepper_cnt > 0) {
        greenpepper_cnt--;
        updateCountDisplay();
        countAll[2] = greenpepper_cnt;
        animateFromBox('greenpepper'); // アニメーションを呼び出す
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
    // ボタンとリストアイテムにイベントリスナーを追加
    document.getElementById('check-button').addEventListener('click', ansJudge);
    document.getElementById('correct-popup-button').addEventListener('click', hidePopup);
    document.getElementById('wrong-popup-button').addEventListener('click', hidePopup);
    document.getElementById('list-1').addEventListener('click', DecYam);
    document.getElementById('list-2').addEventListener('click', DecPotato);
    document.getElementById('list-3').addEventListener('click', DecGreenpepper);
    document.getElementById('list-4').addEventListener('click', DecTomato);
});
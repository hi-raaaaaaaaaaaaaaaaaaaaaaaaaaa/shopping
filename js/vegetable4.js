const container = document.getElementById('container');
//野菜たちの初期位置指定
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

//問題決定 と #titleにinnerHTML
let vege_name_num = Math.floor(Math.random() * 4);
const vege_name = ["さつまいも", "じゃがいも", "ピーマン", "トマト"];
let vege_num = Math.floor(Math.random() * (4 - 1) + 1);
console.warn(vege_name_num, vege_name[vege_name_num], vege_num);
if((vege_name !== null) && (vege_num != 0)) question.innerHTML = `${vege_name[vege_name_num]}　${toFullWidth(vege_num)}こ`;

//現在の野菜たちの数(随時更新)
const countAll  = [0, 0, 0, 0];

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
veges[0].startX = sW * 0.08;
veges[0].startY = sH * 0.57;
veges[1].startX = sW * 0.37;
veges[1].startY = sH * 0.57;
veges[2].startX = sW * 0.08;
veges[2].startY = sH * 0.2;
veges[3].startX = sW * 0.37;
veges[3].startY = sH * 0.2;

//  vege[2]---vege[3]
//     |          |
//  vege[0]---vege[1]

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
    vegeElement.style.left = `${vegeInfo.startX}px`;
    vegeElement.style.top = `${vegeInfo.startY}px`;
    let animationInterval = null; // この変数は、個々の野菜のアニメーションIDを保持するために必要なのだ

    //野菜をクリックすると動くよ〜
    vegeElement.addEventListener('click', () => {
        if (isMoving) return;
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

                //countAllの数を更新
                countAll[0] = yam_cnt;
                countAll[1] = potato_cnt;
                countAll[2] = greenpepper_cnt;
                countAll[3] = tomato_cnt;
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

    if (isMoving) return;
    isMoving = true;

    const vegeElement = vegeInfo.element;
    // アニメーション開始時の位置はカゴの中心
    const startX = boxRect.left + box.offsetWidth / 2 - vegeElement.offsetWidth / 2;
    const startY = boxRect.top + box.offsetHeight / 2 - vegeElement.offsetHeight / 2;

    // 野菜を一旦カゴの中心に移動させ、不透明度をリセットして表示
    vegeElement.style.left = `${startX}px`;
    vegeElement.style.top = `${startY}px`;
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

// カウント表示を更新する関数
function updateCountDisplay() {
    yam_list.innerHTML = yam_cnt > 0 ? `さつまいも ${toFullWidth(yam_cnt)}こ` : "";
    potato_list.innerHTML = potato_cnt > 0 ? `じゃがいも ${toFullWidth(potato_cnt)}こ` : "";
    greenpepper_list.innerHTML = greenpepper_cnt > 0 ? `ピーマン　 ${toFullWidth(greenpepper_cnt)}こ` : "";
    tomato_list.innerHTML = tomato_cnt > 0 ? `トマト　　 ${toFullWidth(tomato_cnt)}こ` : "";
}

// 正誤判定
//1はトマト 2はじゃがいも　3はピーマン 4はさつまいも
function ansJudge() {
    let countAll_quest = [0, 0, 0, 0];
    let judge = 0;
    countAll_quest[0] = vege_name_num == 0 ? vege_num : 0;
    countAll_quest[1] = vege_name_num == 1 ? vege_num : 0;
    countAll_quest[2] = vege_name_num == 2 ? vege_num : 0;
    countAll_quest[3] = vege_name_num == 3 ? vege_num : 0;
    console.warn(countAll_quest, countAll);

    if (JSON.stringify(countAll_quest) === JSON.stringify(countAll)) judge = 1;

    if (judge == 1) correctPopup();
    else if (judge == 0) wrongPopup();
    else console.warn("判定プログラムが壊れています");

    judge = 0;
}

// ポップアップを表示する関数
function correctPopup(){
    document.getElementById('correct_Popup').classList.add('show');
};

function wrongPopup(){
    document.getElementById('wrong_Popup').classList.add('show');
};

// ポップアップを非表示にする関数
function hidePopup() {
    document.getElementById('correct_Popup').classList.remove('show');
    document.getElementById('wrong_Popup').classList.remove('show');
}

//かごの中身をクリックしたら中身減るプログラム達
function DecYam() {
    if (isMoving) return;
    if (yam_cnt > 0) {
        yam_cnt--;
        updateCountDisplay();
        countAll[0] = yam_cnt;
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
        countAll[3] = tomato_cnt;
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
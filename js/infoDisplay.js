// --- 追加：コース名の日本語変換リスト ---
const COURSE_MAP = {
    "vegetable": "やさい",
    "snack": "おかし",
    "drink": "のみもの"
    // ここに新しいコースを追加可能
};

// --- 情報表示の更新 (1秒ごとに実行) ---
function updateInfoDisplay() {
    const urlParams = new URLSearchParams(window.location.search);

    // 1. コース名
    const fileName = window.location.pathname.split('/').pop();
    const courseId = fileName.split('-game')[0];
    const courseNameJP = COURSE_MAP[courseId] || courseId;

    // 2. ラウンド数と過去の合計プレイ時間
    let currentRound = 1;
    let totalPastSeconds = 0;
    for (let [key, value] of urlParams.entries()) {
        if (key.startsWith('playTime_')) {
            const roundNum = parseInt(key.split('_')[1]);
            if (roundNum >= currentRound) currentRound = roundNum + 1;
            totalPastSeconds += parseInt(value); // 過去ラウンドの秒数を加算
        }
    }

    // 3. 現在のラウンドの経過時間
    const elapsedCurrentSeconds = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(elapsedCurrentSeconds / 60);
    const s = elapsedCurrentSeconds % 60;
    const playTimeStr = `${m}分${s}秒`;

    // 4. 累計プレイ時間 (過去合計 + 現在経過)
    const cumulativeSeconds = totalPastSeconds + elapsedCurrentSeconds;
    const cm = Math.floor(cumulativeSeconds / 60);
    const cs = cumulativeSeconds % 60;
    const cumulativeTimeStr = `${cm}分${cs}秒`;

    // 5. 現在時刻
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}時${String(now.getMinutes()).padStart(2, '0')}分`;

    // まとめて書き込み
    const displayEl = document.getElementById('round-display');
    if (displayEl) {
        displayEl.innerText = `${courseNameJP}コース ｜ ${currentRound}ラウンドめ ｜ 累計：${cumulativeTimeStr} ｜ 今回：${playTimeStr} ｜ 現在：${timeStr} ｜ `;
    }

    const miniDisplayEl = document.getElementById('mini-round-display');
    if (miniDisplayEl) {
        miniDisplayEl.innerText = `${currentRound}`;
    }
}

let tapCount = 0;
let hideTimeout = null;
let opacityInterval = null;

function showDisplay() {
    const displayEl = document.getElementById('round-display');
    if (!displayEl) return;

    // 前回のタイマー類をクリア
    clearTimeout(hideTimeout);
    clearInterval(opacityInterval);

    // 表示開始
    displayEl.style.transition = 'none'; // 即座に不透明にするため一旦リセット
    displayEl.style.opacity = 1;
    tapCount = 0; // カウントリセット

    // --- 【追加】ダブルタップでタイトルへ戻る機能 ---
    let miniTapCount = 0;
    const miniDisplayEl = document.getElementById('mini-round-display');
    const roundDisplayEl = document.getElementById('round-display');

    if (miniDisplayEl) {
        miniDisplayEl.addEventListener('click', () => {
            // round-display の opacity が 0 より大きい（表示されている）時のみ判定
            const isVisible = window.getComputedStyle(roundDisplayEl).opacity > 0;

            if (isVisible) {
                miniTapCount++;
                if (miniTapCount === 2) {
                    window.location.href = 'title.html';
                }
                // 1秒以内に2回押さなかったらリセット（誤操作防止）
                setTimeout(() => { miniTapCount = 0; }, 1000);
            }
        });
    }

    // 5秒後に消し始める
    hideTimeout = setTimeout(() => {
        let currentOpacity = 1;
        displayEl.style.transition = 'opacity 1s linear';
        
        // 1秒ごとに不透明度を下げる
        opacityInterval = setInterval(() => {
            currentOpacity -= 0.25; // 4段階で消える
            displayEl.style.opacity = currentOpacity;
            
            if (currentOpacity <= 0) {
                clearInterval(opacityInterval);
            }
        }, 1000);
    }, 2000);
}
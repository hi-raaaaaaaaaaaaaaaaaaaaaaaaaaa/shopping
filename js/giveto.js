document.addEventListener('DOMContentLoaded', () => {
    // 1. URLパラメータの取得
    const params = new URLSearchParams(window.location.search);
    
    // --- 【累積データの解析】 ---
    const rounds = [];
    let i = 1;
    // playTime_1, playTime_2... と連番がある限りデータを取得
    while (params.has(`playTime_${i}`)) {
        rounds.push({
            number: i,
            playTime: parseInt(params.get(`playTime_${i}`)),
            failCount: parseInt(params.get(`failCount_${i}`)),
            mostMissed: params.get(`mostMissed_${i}`),
            leastMissed: params.get(`leastMissed_${i}`)
        });
        i++;
    }

    // --- 【統計の計算】 ---
    const successCount = rounds.length;
    const minTime = successCount > 0 ? Math.min(...rounds.map(r => r.playTime)) : 0;
    const avgTime = successCount > 0 ? rounds.reduce((sum, r) => sum + r.playTime, 0) / successCount : 0;

    // 最頻値を求める関数（ミス傾向の集計用）
    const getMostFrequent = (arr) => {
        const validItems = arr.filter(item => item && item !== "なし" && item !== "すべて正解");
        if (validItems.length === 0) return "なし";
        const counts = {};
        validItems.forEach(item => counts[item] = (counts[item] || 0) + 1);
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    };

    const mostMissedCommon = getMostFrequent(rounds.map(r => r.mostMissed));
    const leastMissedCommon = getMostFrequent(rounds.map(r => r.leastMissed));

    // 時間フォーマット関数 (MM:SS)
    const formatTimeSimple = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // 数字を全角にする関数
    const toFullWidth = (str) => {
        return String(str).replace(/[A-Za-z0-9]/g, s => String.fromCharCode(s.charCodeAt(0) + 0xFEE0));
    };

    // --- 【記録の画面反映】 ---
    const countNumEl = document.getElementById('count_num');
    const timeNumEl = document.getElementById('time_num');
    const detailEl = document.getElementById('detail');

    if (countNumEl) countNumEl.textContent = `${toFullWidth(successCount)}回`;
    if (timeNumEl) timeNumEl.textContent = formatTimeSimple(minTime);
    if (detailEl) {
        detailEl.innerHTML = `平均クリア時間：${toFullWidth(formatTimeSimple(Math.round(avgTime)))}<br><br>` +
                             `間違えやすい商品：${mostMissedCommon}<br>` +
                             `間違えにくい商品：${leastMissedCommon}`;
    }

    // ラウンド別リストの動的生成
    const recordDetailContainer = document.getElementById('time_detail');
    if (recordDetailContainer) {
        recordDetailContainer.innerHTML = ''; 
        rounds.forEach(r => {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'round';
            roundDiv.innerHTML = `
                <h3>ラウンド${toFullWidth(r.number)}</h3>
                <div class="d-panel">
                    <div class="d-time">${formatTimeSimple(r.playTime)}</div>
                    <div class="m-count">${toFullWidth(r.failCount)}回ミス</div>
                </div>
            `;
            recordDetailContainer.appendChild(roundDiv);
        });
    }

    // --- 【現在の設定をテーブルへ表示】 ---
    const pic = params.get('pic') === 'true';
    const questSum = params.get('questSum') || '0';
    const questTypeSum = params.get('questTypeSum') || '0';
    const dispTypeSum = params.get('dispTypeSum') || '0';
    const course = params.get('course') || '未設定';
    let formatText = pic ? "画像形式" : "文字形式";

    const tableRows = document.querySelectorAll('.setting-disp tbody tr');
    if (tableRows.length >= 6) {
        tableRows[1].cells[1].textContent = formatText;        // 問題の形式
        tableRows[2].cells[1].textContent = `${questSum}点`;    // 合計点数
        tableRows[3].cells[1].textContent = `${questTypeSum}種類`; // 問題の種類
        tableRows[4].cells[1].textContent = `${dispTypeSum}種類`; // 選択肢の種類
        tableRows[5].cells[1].textContent = `${course}コース`;   // 難易度
    }

    // --- 【ロックボタンの挙動（長押し）】 ---
    const unlockBtn = document.getElementById('unlock');
    let pressTimer;
    const longPressDuration = 1000; // 1秒 (2秒にする場合は2000に変更してください)

    function toggleLock() {
        document.body.classList.toggle('unlocked');
        if (document.body.classList.contains('unlocked')) {
            unlockBtn.textContent = "ロックする (２秒押し)";
        } else {
            unlockBtn.textContent = "ロック解除 (２秒押し)";
        }
    }

    const startPress = (e) => {
        if (e.type === 'touchstart') e.preventDefault();
        unlockBtn.style.backgroundColor = "#ffcccc";
        pressTimer = setTimeout(() => {
            toggleLock();
            unlockBtn.style.backgroundColor = "";
        }, longPressDuration);
    };

    const cancelPress = () => {
        clearTimeout(pressTimer);
        unlockBtn.style.backgroundColor = "";
    };

    if (unlockBtn) {
        unlockBtn.addEventListener('mousedown', startPress);
        unlockBtn.addEventListener('touchstart', startPress);
        unlockBtn.addEventListener('mouseup', cancelPress);
        unlockBtn.addEventListener('mouseleave', cancelPress);
        unlockBtn.addEventListener('touchend', cancelPress);
        unlockBtn.addEventListener('touchcancel', cancelPress);
    }

    // --- 【もう一度スタート ボタン】 ---
    const playAgainBtn = document.getElementById('playagain');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            let baseFileName = "vegetable";
            const dTypeSum = params.get('dispTypeSum');
            let gameNumber = (dTypeSum === '1' || dTypeSum === '2') ? 4 : 4; //一時的な変更

            const nextParams = new URLSearchParams();
            ['pic', 'chara', 'questSum', 'questTypeSum', 'dispTypeSum'].forEach(key => {
                if (params.has(key)) nextParams.append(key, params.get(key));
            });
            window.location.href = `${baseFileName}-game${gameNumber}.html?${nextParams.toString()}`;
        });
    }

    // --- 【タイトルへ戻る（test.htmlへ遷移）】 ---
    const backTitleBtn = document.getElementById('backtotitle');
    if (backTitleBtn) {
        backTitleBtn.addEventListener('click', () => {
            window.location.href = `test.html`;
        });
    }
});

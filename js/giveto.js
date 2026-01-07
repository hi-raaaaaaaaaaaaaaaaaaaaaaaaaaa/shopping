document.addEventListener('DOMContentLoaded', () => {
    // 1. URLパラメータの取得
    const params = new URLSearchParams(window.location.search);
    const pic = params.get('pic') === 'true';
    const chara = params.get('chara') === 'true';
    const questSum = params.get('questSum') || '0';
    const questTypeSum = params.get('questTypeSum') || '0';
    const dispTypeSum = params.get('dispTypeSum') || '0';
    const course = params.get('course') || '未設定';
    const playTimeSec = parseInt(params.get('playTime')) || 0;
    const failCount = parseInt(params.get('failCount')) || 0;
    const mostMissed = params.get('mostMissed') || 'なし';
    const leastMissed = params.get('leastMissed') || 'なし';

    // 2. 問題の形式の判定
    let formatText = "";
    if (pic === chara) {
        formatText = "エラー：形式不明";
    } else {
        formatText = pic ? "写真形式" : "文字形式";
    }

    // 3. プレイ時間のフォーマット (H:MM:SS または MM:SS)
    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.floor(totalSeconds % 60);
        if (h > 0) {
            return `${h}時間${m}分${s}秒`;
        }
        return `${m}分${s}秒`;
    };

    const timeDisplay = formatTime(playTimeSec);

    // 4. 平均時間の計算 (playTime / (failCount + 1))
    const successCount = failCount + 1;
    const avgTotalSeconds = playTimeSec / successCount;
    const avgDisplay = formatTime(avgTotalSeconds);

    // 5. 画面への反映
    // 表の中の各セルを順番に取得
    const tableRows = document.querySelectorAll('.setting-disp tbody tr');
    if (tableRows.length >= 6) {
        tableRows[1].cells[1].textContent = formatText;        // 問題の形式
        tableRows[2].cells[1].textContent = `${questSum}点`;    // 合計点数
        tableRows[3].cells[1].textContent = `${questTypeSum}種類`; // 問題の種類
        tableRows[4].cells[1].textContent = `${dispTypeSum}種類`; // 選択肢の種類
        tableRows[5].cells[1].textContent = `${course}コース`;   // 難易度
    }

    // クリア時間の表示
    const timeNumEl = document.getElementById('time_num');
    if (timeNumEl) timeNumEl.textContent = timeDisplay;

    // 詳細テキストの更新
    const detailEl = document.getElementById('detail');
    if (detailEl) {
        detailEl.innerHTML = `${successCount}回目でお買い物成功 <br>━▶︎1回のお買い物に平均 ${avgDisplay}<br><br>` +
                           `間違えやすい商品：${mostMissed}<br>` +
                           `間違えにくい商品：${leastMissed}`;
    }

    //ロックボタンの挙動
    const unlockBtn = document.getElementById('unlock');
    let pressTimer;
    const longPressDuration = 1000; // 2秒

    // ロック状態を切り替える関数
    function toggleLock() {
        document.body.classList.toggle('unlocked');
        
        // ボタンのテキスト
        if (document.body.classList.contains('unlocked')) {
            unlockBtn.textContent = "ロックする (２秒押し)";
        } else {
            unlockBtn.textContent = "ロック解除 (２秒押し)";
        }
    }

    // 長押し開始の処理
    const startPress = (e) => {
        // 右クリックメニューなどを防止
        if (e.type === 'touchstart') e.preventDefault();
        
        unlockBtn.style.backgroundColor = "#ffcccc"; // 押してる感の演出
        pressTimer = setTimeout(() => {
            toggleLock();
            unlockBtn.style.backgroundColor = ""; // 元に戻す
        }, longPressDuration);
    };

    // 長押し中断の処理
    const cancelPress = () => {
        clearTimeout(pressTimer);
        unlockBtn.style.backgroundColor = "";
    };

    // マウス・タッチ両方のイベントを登録
    unlockBtn.addEventListener('mousedown', startPress);
    unlockBtn.addEventListener('touchstart', startPress);
    
    unlockBtn.addEventListener('mouseup', cancelPress);
    unlockBtn.addEventListener('mouseleave', cancelPress);
    unlockBtn.addEventListener('touchend', cancelPress);
    unlockBtn.addEventListener('touchcancel', cancelPress);

    // 「今回の設定でもう一度スタート」ボタンの処理
    const playAgainBtn = document.getElementById('playagain');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            // 1. コース名からベースファイル名を決定
            let baseFileName = "";
            const course = params.get('course');
            if (course === 'やさい') {
                baseFileName = "vegetable";
            } else {
                // 他のコース（くだもの等）があればここに追加
                baseFileName = "vegetable"; 
            }

            // 2. dispTypeSumの値によってgame番号(2 or 4)を決定
            const dispTypeSum = params.get('dispTypeSum');
            let gameNumber = 4;
            switch(dispTypeSum) {
                case '1':
                case '2':
                    gameNumber = 2;
                    break;
                case '3':
                case '4':
                    gameNumber = 4;
                    break;
                default:
                    gameNumber = 4;
            }

            // 3. 引き継ぐパラメータを抽出
            const nextParams = new URLSearchParams();
            const keysToCopy = ['pic', 'chara', 'questSum', 'questTypeSum', 'dispTypeSum'];
            keysToCopy.forEach(key => {
                if (params.has(key)) {
                    nextParams.append(key, params.get(key));
                }
            });

            // 4. URLを組み立ててジャンプ
            // 例: vegetable-game4.html?pic=true&...
            const nextUrl = `${baseFileName}-game${gameNumber}.html?${nextParams.toString()}`;
            window.location.href = nextUrl;
        });
    }

    const backTitleBtn = document.getElementById('backtotitle');
    if (backTitleBtn) {
        backTitleBtn.addEventListener('click', () => {
            window.location.href = `test.html`
        });
    }
});
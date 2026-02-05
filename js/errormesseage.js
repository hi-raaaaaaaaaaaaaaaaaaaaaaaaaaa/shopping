let tapCount = 0;
let hideTimeout = null;
let opacityInterval = null;

function showErrorDisplay(messeage) {
    const displayEl = document.getElementById('errorDisp');
    if (!displayEl) return;

    // 前回のタイマー類をクリア
    clearTimeout(hideTimeout);
    clearInterval(opacityInterval);

    // 表示開始
    displayEl.style.transition = 'none'; // 即座に不透明にするため一旦リセット
    displayEl.style.opacity = 1;
    tapCount = 0; // カウントリセット

    if (displayEl) {
        displayEl.innerText = `${messeage}`;
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
        }, 200);
    }, 100);
}
document.addEventListener('DOMContentLoaded', () => {
    const titleScreen = document.getElementById('title-screen');
    const gameBackground = document.getElementById('game-background');
    const pressStart = document.getElementById('press-start');
    const gameSettings = document.getElementById('game-settings');

    // 画面がタップされたときの処理
    titleScreen.addEventListener('click', () => {
        // 背景を上方向にスライドさせるクラスを追加
        gameBackground.classList.add('slide-up');
        pressStart.style.display = 'none'; // Press Start テキストを非表示にする

        // アニメーションが完了した後にゲーム設定を表示
        gameBackground.addEventListener('transitionend', () => {
            titleScreen.style.display = 'none'; // タイトル画面全体を非表示にする
            gameSettings.style.display = 'flex'; // ゲーム設定を表示する
        }, { once: true }); // イベントリスナーを一度だけ実行
    });
});
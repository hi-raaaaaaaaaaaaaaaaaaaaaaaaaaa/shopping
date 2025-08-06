document.addEventListener('DOMContentLoaded', () => {
    const titleScreen = document.getElementById('title-screen');
    const gameBackground = document.getElementById('game-background');
    const pressStart = document.getElementById('press-start');
    const gameSettings = document.getElementById('game-settings');

    const downbuttonOpt = document.getElementById('down-options');
    const upbuttonOpt = document.getElementById('up-options');
    const textOpt = document.getElementById('textbox-options');

    const downbuttonType = document.getElementById('down-type');
    const upbuttonType = document.getElementById('up-type');
    const textType = document.getElementById('textbox-type');

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

    //ボタンが押されたらカウント減(個数)
    downbuttonOpt.addEventListener('click', (event) => {
        //1以下にはならないようにする
        if(textOpt.value > 1) {
            textOpt.value--;
        }
        if(textType.value > textOpt.value) {
            textType.value--;
        }
    });

    //ボタンが押されたらカウント増
    upbuttonOpt.addEventListener('click', (event) => {
        if(textOpt.value < 8) {
            textOpt.value++;
        }
    })

    //ボタンが押されたらカウント減(種類)
    downbuttonType.addEventListener('click', (event) => {
        //1以下にはならないようにする
        if(textType.value > 1) {
            textType.value--;
        }
    });

    //ボタンが押されたらカウント増
    upbuttonType.addEventListener('click', (event) => {
        //選択肢の数以下にはならないようにする
        console.warn(textOpt.value, textType.value);
        if(textType.value < textOpt.value && textType.value < 8) {
            textType.value++;
        }
    })

});

function getformat() {
    const format_num = document.getElementById("format").value;
    console.log(format_num);
}



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

    const downbuttonTypeDisp = document.getElementById('down-type-disp');
    const upbuttonTypeDisp = document.getElementById('up-type-disp');
    const textTypeDisp = document.getElementById('textbox-type-disp');

    const startButton = document.getElementById('start');

    // 画面がタップされたときの処理
    /*titleScreen.addEventListener('click', () => {
        // 背景を上方向にスライドさせるクラスを追加
        gameBackground.classList.add('slide-up');
        pressStart.style.display = 'none'; // Press Start テキストを非表示にする

        // アニメーションが完了した後にゲーム設定を表示
        gameBackground.addEventListener('transitionend', () => {
            titleScreen.style.display = 'none'; // タイトル画面全体を非表示にする
            gameSettings.style.display = 'flex'; // ゲーム設定を表示する
        }, { once: true }); // イベントリスナーを一度だけ実行
    });*/

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
        if(textType.value < textOpt.value && textType.value < 4) {
            textType.value++;
        }

        if(textTypeDisp.value < textType.value) {
            textTypeDisp.value++;
        }
    })

    //ボタンが押されたらカウント減(種類)
    downbuttonTypeDisp.addEventListener('click', (event) => {
        //textType以下にはならないようにする
        if(textTypeDisp.value > textType.value && textTypeDisp.value > 1) {
            textTypeDisp.value--;
        }
    });

    //ボタンが押されたらカウント増
    upbuttonTypeDisp.addEventListener('click', (event) => {
        //8以上にはならないようにする
        if(textTypeDisp.value < 8) {
            textTypeDisp.value++;
        }
    })

    startButton.addEventListener('click', (event) => {
        const ilustJudgeElm = document.getElementById('ilust');
        const charaJudgeElm = document.getElementById('chara');
        const optJudgeElm = document.getElementById('textbox-options');
        const typeJudgeElm = document.getElementById('textbox-type');
        const typedispJudgeElm = document.getElementById('textbox-type-disp');
        const difficultJudgeEasy = document.getElementById('diffi-easy');
        const difficultJudgeNormal = document.getElementById('diffi-normal');
        const difficultJudgeHard = document.getElementById('diffi-hard');
        const difficultJudgeOni = document.getElementById('diffi-oni');

        let settingValueAll = [0, 0, 0, 0, 0];
        console.warn(ilustJudgeElm.checked, charaJudgeElm.checked, optJudgeElm.value, typeJudgeElm.value, typedispJudgeElm.value,
                        difficultJudgeEasy.checked, difficultJudgeNormal.checked, difficultJudgeHard.checked, difficultJudgeOni.checked);
    })

});




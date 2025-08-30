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

    // 新しいカルーセルUIの要素を取得
    const downbuttonDiff = document.getElementById('down-diff');
    const upbuttonDiff = document.getElementById('up-diff');
    const courseNameElm = document.getElementById('course-name');
    const difficultyNameElm = document.getElementById('difficulty-name');
    const difficultyDescElm = document.getElementById('difficulty-desc');
    const carouselContainerElm = document.getElementById('difficult-carousel');
    const ribbonElm = document.querySelector('.ribbon'); // リボンの要素を取得

    // 難易度、コース名、説明、背景画像パス、リボン色クラスをまとめた配列
    const difficulties = [
        { difficulty: 'かんたん', course: '1. 野菜コース', desc: '色、形、名前から判別できます', bg: 'vegetable-back.png', colorClass: 'ribbon-vegetable' },
        { difficulty: 'ふつう', course: '2. お菓子コース', desc: '色、似た形、名前から判別できます', bg: 'sweets-back.png', colorClass: 'ribbon-sweets' },
        { difficulty: 'むずかしい', course: '3. 飲み物コース', desc: '色、名前から判別できます', bg: 'drink-back.png', colorClass: 'ribbon-drink' },
        { difficulty: 'おに', course: '4. お肉コース', desc: '名前から判別できます', bg: 'meat-back.png', colorClass: 'ribbon-meat' }
    ];
    let currentDiffIndex = 0;

    // UIを更新する関数
    const updateUI = (index) => {
        const difficulty = difficulties[index];
        // 難易度とコース名の表示を入れ替え
        courseNameElm.textContent = difficulty.course;
        difficultyNameElm.textContent = `難易度: ${difficulty.difficulty}`;
        difficultyDescElm.textContent = difficulty.desc;
        // 背景画像のパスを動的に設定
        carouselContainerElm.style.backgroundImage = `url('image/${difficulty.bg}')`;

        // リボンのクラスを切り替えて色を変更
        ribbonElm.className = `ribbon ${difficulty.colorClass}`;
    };

    // 初期表示
    updateUI(currentDiffIndex);

    // ボタンが押されたらカウント減(個数)
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

    // 難易度を減らすボタンの処理 (左矢印)
    downbuttonDiff.addEventListener('click', (event) => {
        currentDiffIndex = (currentDiffIndex - 1 + difficulties.length) % difficulties.length;
        updateUI(currentDiffIndex);
    });

    // 難易度を増やすボタンの処理 (右矢印)
    upbuttonDiff.addEventListener('click', (event) => {
        currentDiffIndex = (currentDiffIndex + 1) % difficulties.length;
        updateUI(currentDiffIndex);
    });

    startButton.addEventListener('click', (event) => {
        const ilustJudgeElm = document.getElementById('ilust');
        const charaJudgeElm = document.getElementById('chara');
        const optJudgeElm = document.getElementById('textbox-options');
        const typeJudgeElm = document.getElementById('textbox-type');
        const typedispJudgeElm = document.getElementById('textbox-type-disp');
        // 難易度の値を取得
        const difficultJudge = difficulties[currentDiffIndex].difficulty;

        console.warn(ilustJudgeElm.checked, charaJudgeElm.checked, optJudgeElm.value, typeJudgeElm.value, typedispJudgeElm.value,
                        difficultJudge);
    })

});
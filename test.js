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
    const carouselItemElm = document.querySelector('.carousel-item');
    const courseNameElm = document.getElementById('course-name');
    const difficultyNameElm = document.getElementById('difficulty-name');
    const difficultyDescElm = document.getElementById('difficulty-desc');
    const carouselContainerElm = document.getElementById('difficult-carousel');
    const ribbonElm = document.querySelector('.ribbon'); // リボンの要素を取得
    const carouselBgElm = document.querySelector('.carousel-bg-container');

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

        // 新しい画像に切り替える前に、0.5秒の遅延を設定
        setTimeout(() => {
            // フェードアウトを開始
            carouselBgElm.classList.add('fade-out');

            // フェードアウトが完了するのを待ってから（0.5秒後）、画像を更新してフェードイン
            setTimeout(() => {
                // 背景画像のパスを動的に設定
                carouselBgElm.style.backgroundImage = `url('image/${difficulty.bg}')`;
                // フェードアウトクラスを削除してフェードイン
                carouselBgElm.classList.remove('fade-out');
            }, 300); // CSSのtransition時間と合わせる
        }, 300); // 0.5秒の待機時間

        // 難易度とコース名、説明文の表示を更新
        courseNameElm.textContent = difficulty.course;
        difficultyNameElm.textContent = `難易度: ${difficulty.difficulty}`;
        difficultyDescElm.textContent = difficulty.desc;

        // リボンのクラスを切り替えて色を変更
        ribbonElm.className = `ribbon ${difficulty.colorClass}`;
    };

    // アニメーションを適用する関数
    const animateCarousel = () => {
        carouselItemElm.classList.remove('slide-right');
        // 短い遅延を設けてクラスの再適用を有効にする
        void carouselItemElm.offsetWidth;
        carouselItemElm.classList.add('slide-right');
    };

    // 初期表示
    updateUI(currentDiffIndex);

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
        animateCarousel();
    });

    // 難易度を増やすボタンの処理 (右矢印)
    upbuttonDiff.addEventListener('click', (event) => {
        currentDiffIndex = (currentDiffIndex + 1) % difficulties.length;
        updateUI(currentDiffIndex);
        animateCarousel();
    });

    // タッチ操作を追加
    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainerElm.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
    });

    carouselContainerElm.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].clientX;
        handleSwipe();
    });

    const handleSwipe = () => {
        const swipeDistance = touchStartX - touchEndX;
        const minSwipeDistance = 50; // スワイプと認識する最小距離

        if (swipeDistance > minSwipeDistance) {
            // 左スワイプ
            currentDiffIndex = (currentDiffIndex + 1) % difficulties.length;
            updateUI(currentDiffIndex);
            animateCarousel();
        } else if (swipeDistance < -minSwipeDistance) {
            // 右スワイプ
            currentDiffIndex = (currentDiffIndex - 1 + difficulties.length) % difficulties.length;
            updateUI(currentDiffIndex);
            animateCarousel();
        } else {
            return; // スワイプと認識しない場合は何もしない
        }
    };

    startButton.addEventListener('click', (event) => {
        const pictoJudgeElm = document.getElementById('picto');
        const charaJudgeElm = document.getElementById('chara');
        const optJudgeElm = document.getElementById('textbox-options');
        const typeJudgeElm = document.getElementById('textbox-type');
        const typedispJudgeElm = document.getElementById('textbox-type-disp');
        // 難易度の値を取得
        const courseJudge = difficulties[currentDiffIndex].course;

        console.warn(pictoJudgeElm.checked, charaJudgeElm.checked, optJudgeElm.value, typeJudgeElm.value, typedispJudgeElm.value,
                        courseJudge);
    })
});

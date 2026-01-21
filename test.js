document.addEventListener('DOMContentLoaded', () => {
    const titleScreen = document.getElementById('title-screen');
    const gameBackground = document.getElementById('game-background');
    const pressStart = document.getElementById('press-start');
    const pressStartText = document.getElementById('start-text');
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
    
    // 問題形式のラジオボタンを取得
    const pictoRadio = document.getElementById('picto');
    const charaRadio = document.getElementById('chara');

    // 難易度、コース名、説明、背景画像パス、リボン色クラスをまとめた配列
    //例：{ difficulty: '難易度名', course: 'コース名', desc: '説明文', bg: '背景画像', colorClass: 'cssで宣言したribbonクラス' },
    const difficulties = [
        { difficulty: 'かんたん', course: '1. 野菜コース', desc: '色、形、名前から判別できます', bg: 'vegetable-back.png', colorClass: 'ribbon-vegetable' },
      //  { difficulty: 'ふつう', course: '2. お菓子コース', desc: '色、似た形、名前から判別できます', bg: 'sweets-back.png', colorClass: 'ribbon-sweets' },
        { difficulty: 'むずかしい', course: '3. 飲み物コース', desc: '色、名前から判別できます', bg: 'drink-back.png', colorClass: 'ribbon-drink' },
       // { difficulty: 'おに', course: '4. お肉コース', desc: '名前から判別できます', bg: 'meat-back.png', colorClass: 'ribbon-meat' }
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

    // 吹き出しのテキストを更新する関数
    const updateBubble = () => {
        // 1. 問題の形式
        const formatValue = pictoRadio.checked ? '画像' : '文字';

        // 4. 選択肢の種類
        const optionsValue = document.getElementById('textbox-options').value;

        // 3. 問題の種類
        const typesValue = document.getElementById('textbox-type').value;

        // 2. 問題の合計点数
        const totalPointsValue = document.getElementById('textbox-type-disp').value;

        // 吹き出しの要素
        const bubbleText = document.querySelector('.bubble-r');

        // 吹き出しのテキストを更新
        bubbleText.innerHTML = `${formatValue}形式で<br>${optionsValue}種類陳列されている中から<br>${typesValue}種類選び、合計点数${totalPointsValue}点<br>の買い物を始めます`;
    
        updatePreview();
    };

    // 初期表示
    updateUI(currentDiffIndex);
    updateBubble(); // 吹き出しの初期値を設定

    // 画面がタップされたときの処理
    titleScreen.addEventListener('click', () => {
        // 背景を上方向にスライドさせるクラスを追加
        gameBackground.classList.add('slide-up');
        pressStart.style.display = 'none'; // Press Start 背景を非表示にする
        pressStartText.style.display = 'none'; // Press Start テキストを非表示にする

        // アニメーションが完了した後にゲーム設定を表示
        gameBackground.addEventListener('transitionend', () => {
            titleScreen.style.display = 'none'; // タイトル画面全体を非表示にする
            gameSettings.style.display = 'flex'; // ゲーム設定を表示する
        }, { once: true }); // イベントリスナーを一度だけ実行
    });

    // 各ボタンにイベントリスナーを追加して、クリック時に吹き出しを更新
    downbuttonOpt.addEventListener('click', () => {
        if(textOpt.value > 1) {
            textOpt.value--;
        }
        if(textType.value > textOpt.value) {
            textType.value--;
        }
        updateBubble();
    });

    upbuttonOpt.addEventListener('click', () => {
        if(textOpt.value < 8) {
            textOpt.value++;
        }
        updateBubble();
    });

    downbuttonType.addEventListener('click', () => {
        if(textType.value > 1) {
            textType.value--;
        }
        updateBubble();
    });

    upbuttonType.addEventListener('click', () => {
        if(textType.value < textOpt.value && textType.value < 4) {
            textType.value++;
        }
        if(textTypeDisp.value < textType.value) {
            textTypeDisp.value++;
        }
        updateBubble();
    });

    downbuttonTypeDisp.addEventListener('click', () => {
        if(textTypeDisp.value > textType.value && textTypeDisp.value > 1) {
            textTypeDisp.value--;
        }
        updateBubble();
    });

    upbuttonTypeDisp.addEventListener('click', () => {
        if(textTypeDisp.value < 4) {
            textTypeDisp.value++;
        }
        updateBubble();
    });

    // 問題形式のラジオボタンにもイベントリスナーを追加して、変更時に吹き出しを更新
    pictoRadio.addEventListener('change', updateBubble);
    charaRadio.addEventListener('change', updateBubble);

    // 難易度を減らすボタンの処理 (左矢印)
    downbuttonDiff.addEventListener('click', () => {
        currentDiffIndex = (currentDiffIndex - 1 + difficulties.length) % difficulties.length;
        updateUI(currentDiffIndex);
        animateCarousel();
    });

    // 難易度を増やすボタンの処理 (右矢印)
    upbuttonDiff.addEventListener('click', () => {
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

    //「スタート」ボタンの処理
    startButton.addEventListener('click', () => {
        const pictoJudgeElm = document.getElementById('picto');
        const charaJudgeElm = document.getElementById('chara');
        const optJudgeElm = document.getElementById('textbox-options'); //問題の合計点数
        const typeJudgeElm = document.getElementById('textbox-type'); //問題の種類
        const dispJudgeElm = document.getElementById('textbox-type-disp'); //選択肢の種類
        // 難易度の値を取得
        const courseJudge = difficulties[currentDiffIndex].colorClass;
        //difficulties.courseからribbon-(先頭から7文字)を除いた文字列を取得
        const course = courseJudge.substring(7);

        //①typeDispJudgeElmの値を②dispJudgeElmから計算
        //② が 1 -→ ① は 1 (game1.htmlになる)、② が 2 -→ ① は 2 (game2.htmlになる)、② が 3 or 4 -→ ① は 4　(game4.htmlになる)
        let typeDispJudgeElm = 4 //初期値は4（game4.html）

        switch(dispJudgeElm.value) {
            case '1': typeDispJudgeElm = 4; //本来は２　一時的変更
            break;
            case '2': typeDispJudgeElm = 4;//本来は２　一時的変更
            break;
            case '3': typeDispJudgeElm = 4;
            break;
            case '4': typeDispJudgeElm = 4;
            break;
            default: typeDispJudgeElm = 4;
        }

        console.warn(pictoJudgeElm.checked, charaJudgeElm.checked, optJudgeElm.value, typeJudgeElm.value, dispJudgeElm.value,
                        course, typeDispJudgeElm);
        //転移([コース名]-game[ベース陳列棚の種類].html?pic=[1.写真true/false]&chara=[1.文字true/false]&questSum=[問題の合計点数]&questTypeSum=[問題の種類]&dispTypeSum=[選択肢の種類])
        //例:   sweet  -game   1 or 2 or 4   .html?pic=         true     &chara=        false    &questSum=       1      &questTypeSum=     1

        window.location.href = course + "-game" + typeDispJudgeElm + ".html?pic=" + pictoJudgeElm.checked + "&chara=" + charaJudgeElm.checked
                                + "&questSum=" + optJudgeElm.value + "&questTypeSum=" + typeJudgeElm.value + "&dispTypeSum=" + dispJudgeElm.value;

    })

    function updatePreview() {
        const questionArea = document.querySelector('.question');
        const gameArea = document.querySelector('.game');

        // 現在の設定値を取得
        const isPicto = document.getElementById('picto').checked;
        const questSum = parseInt(document.getElementById('textbox-options').value);
        const questTypeSum = parseInt(document.getElementById('textbox-type').value);
        const dispTypeSum = parseInt(document.getElementById('textbox-type-disp').value);

        // --- 1. 問題エリア（お買い物メモ）の更新 ---
        questionArea.innerHTML = '<h4 class="kaimono-memo">ーかってくるものー</h4>';
        const vegeNames = ["・トマト　　 ", "・じゃがいも ", "・ピーマン　 ", "・さつまいも "];
        const vegeIcons = ["🍅", "🥔", "🫑", "🍠"];

        let remainingSum = questSum;
        let counts = Array(questTypeSum).fill(0);
        for (let i = 0; i < questTypeSum; i++) {
            let val = Math.ceil(remainingSum / (questTypeSum - i));
            counts[i] = val;
            remainingSum -= val;
        }

        for (let i = 0; i < questTypeSum; i++) {
            const row = document.createElement('div');
            row.className = 'preview-memo-row';
            row.innerHTML = isPicto 
                ? `<span>${vegeIcons[i % 4]}</span> が ${counts[i]}` 
                : `${vegeNames[i % 4]}${toFullWidth(counts[i])}こ`;
            questionArea.appendChild(row);
        }

        // --- 2. ゲームエリア（陳列棚と野菜）の更新 ---
        gameArea.innerHTML = ''; 
        const vegeFiles = ["tomato.png", "potato.png", "greenpepper.png", "yam.png"];
        
        // 共通スタイルのリセット
        gameArea.style.position = "absolute";

        if (dispTypeSum <= 2) {
            // 【1〜2種類：広いバスケット】
            gameArea.style.backgroundImage = 'url("./image/game4_fruit_basket.png")';
            // 指定された数値を適用
            gameArea.style.left = "-25%";
            gameArea.style.width = "125%";
            gameArea.style.height = "74%";
            gameArea.style.top = "35%";
            
            const folderPath = "./image/vegetable-2_OVERRAY/";
            for (let i = 0; i < dispTypeSum; i++) {
                const img = document.createElement('img');
                img.src = folderPath + vegeFiles[i];
                img.className = `prev-vege-img v2-pos-${i}`;
                gameArea.appendChild(img);
            }
        } else {
            // 【3〜4種類：4分割の棚】
            gameArea.style.backgroundImage = 'url("./image/game4_2_fruit_basket.png")';
            // 指定された数値を適用
            gameArea.style.left = "-25%";
            gameArea.style.width = "125%";
            gameArea.style.height = "60%";
            gameArea.style.top = "42%";

            const folderPath = "./image/vegetable-4_OVERRAY/";
            for (let i = 0; i < dispTypeSum; i++) {
                const img = document.createElement('img');
                img.src = folderPath + vegeFiles[i];
                img.className = `prev-vege-img v4-pos-${i}`;
                gameArea.appendChild(img);
            }
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

});

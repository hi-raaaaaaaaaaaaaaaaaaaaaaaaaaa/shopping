function click_carrot() {
    var sW = window.innerWidth;
    var sH = window.innerHeight;
    let start = Date.now(); // 開始時間を覚える
    
    const fruit = document.getElementById('carrot_1').getBoundingClientRect();
    const fruitLeft = fruit.left + window.pageXOffset;
    const fruitTop = fruit.top + window.pageYOffset;
    console.warn(fruitLeft,fruitTop);

    let timer = setInterval(function() {
        // 開始からの経過時間は？
        let timePassed = Date.now() - start;

        if ((parseInt(carrot_1.style.left) > sW - 250) && (parseInt(carrot_1.style.left) > sH - 250)) {
            clearInterval(timer); // アニメーションが終了
            return;
        }

        // timePassed 時点のアニメーションを描画
        drawLeft(timePassed);

    }, 20);

    // timePassed は 0 から 2000 まで進む
    // なので、left は 0px から 400px になります
    function drawLeft(timePassed) {
        carrot_1.style.left = (timePassed / 2.5) + fruitLeft + 'px';
        carrot_1.style.top = (timePassed / 5) + fruitTop + 'px';
    }
}


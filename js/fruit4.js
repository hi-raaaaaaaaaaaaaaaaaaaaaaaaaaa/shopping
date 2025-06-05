const container = document.getElementById('container');
const fruits = [
    { element: document.getElementById('carrot'), startX: 0, startY: 0 },
    { element: document.getElementById('orange'), startX: 0, startY: 0 },
    { element: document.getElementById('lemon'), startX: 0, startY: 0 },
    { element: document.getElementById('apple'), startX: 0, startY: 0 },
    ];


const box = document.getElementById('box');
const apple_list = document.getElementById("apple_list");
const orange_list = document.getElementById("orange_list");
const lemon_list = document.getElementById("lemon_list");
const carrot_list = document.getElementById("carrot_list");


var sW = window.innerWidth;
var sH = window.innerHeight;

var apple_cnt = 0, orange_cnt = 0, lemon_cnt = 0, carrot_cnt = 0;

//box(買い物かご)の位置指定
const boxMargin = 20;
const boxRect = {
    left: sW * 0.75,
    top: sH * 0.55,
};

box.style.left = `${boxRect.left}px`;
box.style.top = `${boxRect.top}px`;

//動くフルーツたちの位置指定
fruits[0].startX = sW * 0.1;
fruits[0].startY = sH * 0.6;
fruits[1].startX = sW * 0.4;
fruits[1].startY = sH * 0.6;
fruits[2].startX = sW * 0.1;
fruits[2].startY = sH * 0.3;
fruits[3].startX = sW * 0.4;
fruits[3].startY = sH * 0.3;

//  fruit[2]---fruit[3]
//     |          |
//  fruit[0]---fruit[1]

//移動開始
fruits.forEach(fruitInfo => {
    const fruitElement = fruitInfo.element;
    fruitElement.style.left = `${fruitInfo.startX}px`;
    fruitElement.style.top = `${fruitInfo.startY}px`;
    let animationInterval = null;
    let isMoving = false;

    fruitElement.addEventListener('click', () => {
        if (isMoving) return;
        isMoving = true;

        if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
        }

        const targetX = boxRect.left + box.offsetWidth / 2 - fruitElement.offsetWidth / 2;
        const targetY = boxRect.top + box.offsetHeight / 2 - fruitElement.offsetHeight / 2;
        const startX = parseFloat(fruitElement.style.left);
        const startY = parseFloat(fruitElement.style.top);
        const duration = 600; //アニメーションに要する秒数
        let startTime;

        function animateToBox(currentTime) {
            if (!startTime) {
                startTime = currentTime;
            }
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            const newX = startX + (targetX - startX) * progress;
            const newY = startY + (targetY - startY) * progress;

            fruitElement.style.left = `${newX}px`;
            fruitElement.style.top = `${newY}px`;

            // ボックスに入ったかどうかの判定
            const fruitRect = fruitElement.getBoundingClientRect();
            if (
                fruitRect.left + 10 >= boxRect.left &&
                fruitRect.top + 10 >= boxRect.top
            ) {
                isMoving = false;
                // ボックスに入ったら元の位置に瞬時に戻す
                fruitElement.style.left = `${fruitInfo.startX}px`;
                fruitElement.style.top = `${fruitInfo.startY}px`;

		if(fruitElement.id == 'apple') apple_cnt++;
		if(fruitElement.id == 'orange') orange_cnt++;
		if(fruitElement.id == 'lemon') lemon_cnt++;
		if(fruitElement.id == 'carrot') carrot_cnt++;
		console.warn(apple_cnt, orange_cnt, lemon_cnt, carrot_cnt);

		if(apple_cnt == 0) apple_list.innerHTML = "";
		if(orange_cnt == 0) orange_list.innerHTML = "";
		if(lemon_cnt == 0) lemon_list.innerHTML = "";
		if(carrot_cnt == 0) carrot_list.innerHTML = "";

		if(apple_cnt != 0) apple_list.innerHTML = `りんご　${apple_cnt}こ`;
		if(orange_cnt != 0) orange_list.innerHTML = `みかん　${orange_cnt}こ`;
		if(lemon_cnt != 0) lemon_list.innerHTML = `レモン　${lemon_cnt}こ`;
		if(carrot_cnt != 0) carrot_list.innerHTML = `にんじん　${carrot_cnt}こ`;
		
                return;
            }

            if (progress < 1) {
                requestAnimationFrame(animateToBox);
            } else {
                isMoving = false; // アニメーションが完了してもボックスに入らなかった場合は移動フラグをリセット
                animationInterval = null;
            }
        }

        requestAnimationFrame(animateToBox);
    });
});

const container = document.getElementById('container');
const fruits = [
    { element: document.getElementById('yam'), startX: 0, startY: 0 },
    { element: document.getElementById('potato'), startX: 0, startY: 0 },
    { element: document.getElementById('greenpepper'), startX: 0, startY: 0 },
    ];


const box = document.getElementById('box');
const yam_list = document.getElementById("list-1");
const potato_list = document.getElementById("list-2");
const greenpepper_list = document.getElementById("list-3");


var sW = window.innerWidth;
var sH = window.innerHeight;

var yam_cnt = 0, potato_cnt = 0, greenpepper_cnt = 0,

//box(買い物かご)の位置指定
const boxMargin = 20;
const boxRect = {
    left: sW * 0.75,
    top: sH * 0.55,
};

box.style.left = `${boxRect.left}px`;
box.style.top = `${boxRect.top}px`;

//動くフルーツたちの位置指定
fruits[0].startX = sW * 0.05;
fruits[0].startY = sH * 0.5;
fruits[1].startX = sW * 0.45;
fruits[1].startY = sH * 0.5;
fruits[2].startX = sW * 0.25;
fruits[2].startY = sH * 0.3;

//            ---fruit[3]
//  fruit[0]         |
//       ---fruit[1]

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

		if(fruitElement.id == 'yam') yam_cnt++;
		if(fruitElement.id == 'potato') potato_cnt++;
		if(fruitElement.id == 'greenpepper') greenpepper_cnt++;
		console.warn(yam_cnt, potato_cnt, greenpepper_cnt);

		if(yam_cnt == 0) yam_list.innerHTML = "";
		if(potato_cnt == 0) potato_list.innerHTML = "";
		if(greenpepper_cnt == 0) greenpepper_list.innerHTML = "";

		if(yam_cnt != 0) yam_list.innerHTML = `さつまいも　${yam_cnt}こ`;
		if(potato_cnt != 0) potato_list.innerHTML = `じゃがいも　${potato_cnt}こ`;
		if(greenpepper_cnt != 0) greenpepper_list.innerHTML = `ピーマン　${greenpepper_cnt}こ`;

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


function DecYam() {
		yam_cnt--;
		if(yam_cnt == 0) yam_list.innerHTML = "";
		if(yam_cnt != 0) yam_list.innerHTML = `さつまいも　${yam_cnt}こ`;
}

function DecPotato() {
		potato_cnt--;
		if(potato_cnt == 0) potato_list.innerHTML = "";
		if(potato_cnt != 0) potato_list.innerHTML = `じゃがいも　${potato_cnt}こ`;
}

function DecGreenpepper() {
		greenpepper_cnt--;
		if(greenpepper_cnt == 0) greenpepper_list.innerHTML = "";
		if(greenpepper_cnt != 0) greenpepper_list.innerHTML = `ピーマン　${greenpepper_cnt}こ`;
}

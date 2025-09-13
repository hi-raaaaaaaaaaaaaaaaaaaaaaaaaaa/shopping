document.addEventListener('DOMContentLoaded', () => {
    const confettiContainer = document.querySelector('.confetti-container');
    const crackers = document.querySelectorAll('.cracker');

    const colors = ['rgba(171, 87, 255, 1)', 'rgba(43, 161, 153, 1)', 'rgba(0, 119, 255, 1)', 'rgba(208, 255, 0, 1)', 'rgba(255, 115, 0, 1)', 'rgba(232, 92, 232, 1)'];
    const crackerLeftPosition = { x: 10, y: 80 };
    const crackerRightPosition = { x: 90, y: 80 };

    const shapes = ['square', 'circle', 'triangle', 'star', 'heart'];

    // 紙吹雪を生成する関数
    function createConfetti(positionX, positionY, direction) {
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');

            const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
            confetti.classList.add(`shape-${randomShape}`);

            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 12 + 6;

            confetti.style.setProperty('--confetti-color', color);
            confetti.style.setProperty('--confetti-size', `${size}px`);

            const startX = positionX + (Math.random() - 0.5) * 2;
            const startY = positionY + (Math.random() - 0.5) * 2;

            const duration = Math.random() * 1.5 + 1.5;
            const delay = Math.random() * 0.8;

            confetti.style.backgroundColor = color;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;

            confetti.style.left = `${startX}vw`;
            confetti.style.top = `${startY}vh`;
            confetti.style.setProperty('--initial-rotation', `${Math.random() * 360}deg`);

            let targetX, targetY;
            const initialAscentHeight = Math.random() * 40 + 30;
            const horizontalSpread = Math.random() * 18 + 8;

            if (direction === 'left') {
                targetX = horizontalSpread;
                targetY = -initialAscentHeight;
            } else {
                targetX = -horizontalSpread;
                targetY = -initialAscentHeight;
            }

            confetti.style.setProperty('--target-x-offset', `${targetX}vw`);
            confetti.style.setProperty('--target-y-offset', `${targetY}vh`);

            confetti.style.animation = `diagonal-fall ${duration}s cubic-bezier(0.01, 1, 0.6, 1) ${delay}s forwards`;

            confettiContainer.appendChild(confetti);

            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    }

    // クラッカーのアニメーションと紙吹雪のループを制御する関数
    function animateLoop() {
        crackers.forEach(cracker => {
            cracker.style.animation = 'none'; // アニメーションをリセット
            cracker.offsetHeight; // 強制的に再描画
            cracker.style.animation = 'cracker-pop 0.6s ease-out forwards';
        });

        setTimeout(() => {
            createConfetti(crackerLeftPosition.x, crackerLeftPosition.y, 'left');
            createConfetti(crackerRightPosition.x, crackerRightPosition.y, 'right');
        }, 350); // 400ミリ秒 = 0.4秒
    }

    // 初回実行
    animateLoop();

    // 2秒待ってからアニメーションを再度開始（ループ）
    setInterval(animateLoop, 5000); // 2000ミリ秒 = 2秒
});
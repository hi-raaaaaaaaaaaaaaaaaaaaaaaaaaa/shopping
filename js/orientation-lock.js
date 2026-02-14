(function() {
    document.addEventListener('DOMContentLoaded', () => {
        // 警告用HTMLを生成
        const overlay = document.createElement('div');
        overlay.id = 'orientation-overlay';
        overlay.innerHTML = `
            <div class="warning-text">画面を横にしてご利用ください。</div>
            <button class="ignore-button" id="ignore-orientation">無視して遊ぶ</button>
        `;
        document.body.appendChild(overlay);

        const ignoreBtn = document.getElementById('ignore-orientation');
        let isIgnored = false;

        function checkOrientation() {
            if (isIgnored) return;

            // 縦横判定: 高さ > 幅 なら縦画面
            if (window.innerHeight > window.innerWidth) {
                overlay.style.display = 'flex';
                // 既存のCSSでoverflow: hiddenがあるため、念のため固定
                document.body.style.overflow = 'hidden'; 
            } else {
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        }

        ignoreBtn.addEventListener('click', () => {
            isIgnored = true;
            overlay.style.display = 'none';
            document.body.style.overflow = ''; // スクロール制限解除
        });

        // 監視
        window.addEventListener('resize', checkOrientation);
        // 初期実行
        checkOrientation();
    });
})();
(function(){

    //要素の取得
    var elements = document.getElementsByClassName("drag-and-drop");

    //要素内のクリックされた位置を取得するグローバル（のような）変数
    var x;
    var y;

    //マウスが要素内で押されたとき、又はタッチされたとき発火
    for(var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("mousedown", mdown, false);
        elements[i].addEventListener("touchstart", mdown, false);
    }

	//スクロールしそうになったら発火
	function noscroll(e){
		e.preventDefault();
	}

    //マウスが押された際の関数
    function mdown(e) {


        //クラス名に .drag を追加
        this.classList.add("drag");

        //タッチデイベントとマウスのイベントの差異を吸収
        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //要素内の相対座標を取得
        x = event.pageX - this.offsetLeft;
        y = event.pageY - this.offsetTop;

        //ムーブイベントにコールバック
        document.body.addEventListener("mousemove", mmove, false);
        document.body.addEventListener("touchmove", mmove, false);
    }

    //マウスカーソルが動いたときに発火
    function mmove(e) {

		var sW,sH,s;
		sW = window.innerWidth;
		sH = window.innerHeight;
		const text = document.getElementById('hunatex');


        //ドラッグしている要素を取得
        var drag = document.getElementsByClassName("drag")[0];

        //同様にマウスとタッチの差異を吸収
        if(e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //マウスが動いた場所に要素を動かす
        drag.style.top = event.pageY - y + "px";
        drag.style.left = event.pageX - x + "px";

		//商品がかごに入ったら商品を消す(drag.style.topは商品)
		if((parseInt(drag.style.top) > sH - 250) && (parseInt(drag.style.left) > sW - 250)){
			drag.style.opacity = "0.5";
			const text = document.getElementById('hunatex');
			text.innerHTML = 'おはようございます☺';

		}
		if((parseInt(drag.style.top) < sH - 250) && (parseInt(drag.style.left) < sW - 250)){
			drag.style.opacity = "1";
			text.innerHTML = 'こんにちは👍';
		}

        //マウスボタンが離されたとき、またはカーソルが外れたとき発火
        drag.addEventListener("mouseup", mup, false);
        document.body.addEventListener("mouseleave", mup, false);
        drag.addEventListener("touchend", mup, false);
        document.body.addEventListener("touchleave", mup, false);

		//ページのスクロールを許可しない
		document.addEventListener('touchmove', noscroll, {passive: false});
		document.addEventListener('wheel', noscroll, {passive: false});

    }

    //マウスボタンが上がったら発火
    function mup(e) {
        var drag = document.getElementsByClassName("drag")[0];

        //ムーブベントハンドラの消去
        document.body.removeEventListener("mousemove", mmove, false);
        drag.removeEventListener("mouseup", mup, false);
        document.body.removeEventListener("touchmove", mmove, false);
        drag.removeEventListener("touchend", mup, false);

        //クラス名 .drag も消す
        drag.classList.remove("drag");

	const elm1 = document.getElementById('canvas1');
	const elm2 = document.getElementById('canvas2');
	const elm3 = document.getElementById('qu1');
	const elm4 = document.getElementById('qu2');
	const elm5 = document.getElementById('qu3');
	const elm6 = document.getElementById('qu4');
	const elm7 = document.getElementById('qu5');


    }

})()

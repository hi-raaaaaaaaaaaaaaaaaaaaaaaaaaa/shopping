(function(){

    //�v�f�̎擾
    var elements = document.getElementsByClassName("drag-and-drop");

    //�v�f���̃N���b�N���ꂽ�ʒu���擾����O���[�o���i�̂悤�ȁj�ϐ�
    var x;
    var y;

    //�}�E�X���v�f���ŉ����ꂽ�Ƃ��A���̓^�b�`���ꂽ�Ƃ�����
    for(var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("mousedown", mdown, false);
        elements[i].addEventListener("touchstart", mdown, false);
    }

	//�X�N���[���������ɂȂ����甭��
	function noscroll(e){
		e.preventDefault();
	}

    //�}�E�X�������ꂽ�ۂ̊֐�
    function mdown(e) {


        //�N���X���� .drag ��ǉ�
        this.classList.add("drag");

        //�^�b�`�f�C�x���g�ƃ}�E�X�̃C�x���g�̍��ق��z��
        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //�v�f���̑��΍��W���擾
        x = event.pageX - this.offsetLeft;
        y = event.pageY - this.offsetTop;

        //���[�u�C�x���g�ɃR�[���o�b�N
        document.body.addEventListener("mousemove", mmove, false);
        document.body.addEventListener("touchmove", mmove, false);
    }

    //�}�E�X�J�[�\�����������Ƃ��ɔ���
    function mmove(e) {

		var sW,sH,s;
		sW = window.innerWidth;
		sH = window.innerHeight;

        //�h���b�O���Ă���v�f���擾
        var drag = document.getElementsByClassName("drag")[0];

        //���l�Ƀ}�E�X�ƃ^�b�`�̍��ق��z��
        if(e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //�}�E�X���������ꏊ�ɗv�f�𓮂���
        drag.style.top = event.pageY - y + "px";
        drag.style.left = event.pageX - x + "px";

		//���i�������ɓ������珤�i������(drag.style.top�͏��i)
		if((parseInt(drag.style.top) > sH - 250) && (parseInt(drag.style.left) > sW - 250)){
			drag.style.opacity = "0";
		}

        //�}�E�X�{�^���������ꂽ�Ƃ��A�܂��̓J�[�\�����O�ꂽ�Ƃ�����
        drag.addEventListener("mouseup", mup, false);
        document.body.addEventListener("mouseleave", mup, false);
        drag.addEventListener("touchend", mup, false);
        document.body.addEventListener("touchleave", mup, false);

		//�y�[�W�̃X�N���[���������Ȃ�
		document.addEventListener('touchmove', noscroll, {passive: false});
		document.addEventListener('wheel', noscroll, {passive: false});

    }

    //�}�E�X�{�^�����オ�����甭��
    function mup(e) {
        var drag = document.getElementsByClassName("drag")[0];

        //���[�u�x���g�n���h���̏���
        document.body.removeEventListener("mousemove", mmove, false);
        drag.removeEventListener("mouseup", mup, false);
        document.body.removeEventListener("touchmove", mmove, false);
        drag.removeEventListener("touchend", mup, false);

        //�N���X�� .drag ������
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

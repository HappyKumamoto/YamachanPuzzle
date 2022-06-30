 "use strict";
 
 const el = document.createElement("script"); //紙吹雪のkami.jsを持ってくる
 el.src = "kamiFu.js";
 
  window.onload = function () {
	let size, main_image, panels, cell_w, cell_h, canvas, context, image;

	// 設定
	size = 3;
	main_image = "imgs/sphinx.jpg";
	panels = [];
	cell_w = 320 / size;
	cell_h = 320 / size;

	// Canvasを取得
	canvas = document.getElementById("puzzle_canvas");
	// コンテキストを取得
	context = canvas.getContext("2d");

	function checkX(idx) {
	// その行に穴があれば，そのindexを返す．なければ-1を返す．
		let i = 0;
		for (i = 0; i < size; i += 1) {
			if (panels[Math.floor(idx / size) * size + (idx + i) % size] === size * size - 1) {
				return Math.floor(idx / size) * size + (idx + i) % size;
			}
		}
		return -1;
	}

	function checkY(idx) {
	// その列に穴があれば，そのindexを返す．なければ-1を返す．
		let i = 0;
		for (i = 0; i < size; i += 1) {
			if (panels[(idx + i * size) % (size * size)] === size * size - 1) {
				return (idx + i * size) % (size * size);
			}
		}
		return -1;
	}

	// パネル番号に応じて描画する
	function drawPanels() {
		let i, px, py, tx, ty;
		for (i = 0; i < size * size; i += 1) {
			px = (panels[i] % size) * cell_w;	// 画像image中の位置
			py = Math.floor(panels[i] / size) * cell_h;
			tx = (i % size) * cell_w;			// カンヴァスpuzzle_canvas上の位置
			ty = Math.floor(i / size) * cell_h;
			if (panels[i] === size * size - 1) {	// 穴の描画
				context.beginPath();
				context.fillStyle = "#cccccc";
				context.fillRect(tx, ty, cell_w, cell_h);
			} else {							// 画像の描画
				context.drawImage(image, px, py, cell_w, cell_h, tx, ty, cell_w, cell_h);
			}

			// 枠の描画
			context.beginPath();
			context.moveTo(tx + cell_w, ty);
			context.lineTo(tx, ty);
			context.lineTo(tx, ty + cell_h);
			context.strokeStyle = "#999999";
			context.stroke();
		}
	}

	function tapPanel(no) {
		let ana, anatmp;

		// 穴の上なら何もしない．
		if (panels[no] === size * size - 1) {
			return;
		}

		// タップした行に穴がある．
		ana = checkX(no);
		if (ana !== -1 && ana < no) {
			for (anatmp = ana; anatmp < no; anatmp += 1) {
				panels[anatmp] = panels[anatmp + 1];
			}
			panels[no] = size * size - 1;
		} else if (ana !== -1) {
			for (anatmp = ana; anatmp > no; anatmp -= 1) {
				panels[anatmp] = panels[anatmp - 1];
			}
			panels[no] = size * size - 1;
		}

		// タップした列に穴がある．
		ana = checkY(no);
		if (ana === -1) {
			return;
		}
		if (ana < no) {
			for (anatmp = ana; anatmp < no; anatmp += size) {
				panels[anatmp] = panels[anatmp + size];
			}
			panels[no] = size * size - 1;
		} else {
			for (anatmp = ana; anatmp > no; anatmp -= size) {
				panels[anatmp] = panels[anatmp - size];
			}
			panels[no] = size * size - 1;
		}

		// 描画
		drawPanels();
	}

	// パネルをシャッフル
	function shufflePanel() {
		let i, j, rnd;
		for (i = 0; i < size * size; i += 1) {
			panels[i] = i;
		}
		for (j = 0; j < 200; j += 1) {
			rnd = Math.floor(Math.random() * size * size);
			tapPanel(rnd);
		}
		document.getElementById("message").innerHTML = "<p ><\/p>";
	}

	// 画像の読み込み
	image = new Image();
	image.src = main_image;
	image.onload = function () {
		context.drawImage(image, 0, 0);
		setTimeout(shufflePanel, 5000);
	};

	// ゲームクリアした？
	function clear(p) {
		let i;
		for (i = 0; i < size * size; i += 1) {
			if (p[i] !== i) {
				return false;
			}
		}
		return true;
	}

	function tap(e) {
		let rect, no;

		// タップされたパネルを取得
		rect = e.target.getBoundingClientRect();
		no = Math.floor((e.clientY - rect.top) / cell_h) * size + Math.floor((e.clientX - rect.left) / cell_w);
		// パネルを移動
		tapPanel(no);
		// 完成か否かを判定して，完成ならメッセージを表示．
		if (clear(panels)) {
			document.getElementById("message").innerHTML = "<h1>＼＼ BAILA BAILA !! ／／</h1>";
			context.drawImage(image, 0, 0);
			document.body.appendChild(el);  //kami.js で紙吹雪を出す
		}
	}

	// ユーザのタッチイベントに反応する
	canvas.ontouchstart = function (e) {
		let t;
		if (e.touches.length > 0) {
			t = e.touches[0];
			tap(t);
		}
		e.preventDefault();
	};

	// PC用
	canvas.onmousedown = function (e) {
		tap(e);
	};

       };

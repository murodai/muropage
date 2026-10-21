(function() {
  function initMomiji() {
    // 既存のキャンバスがあれば削除（二重起動・競合を防止）
    const existingCanvas = document.getElementById('momiji-canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    // キャンバスを自動生成
    const canvas = document.createElement('canvas');
    canvas.id = 'momiji-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // ドット絵もみじのパターン
    const momijiPattern = [
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0],
      [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
    ];

    const colors = ['#C62828', '#D32F2F', '#E64A19', '#F57C00', '#FBC02D', '#8B0000'];

    // サイズ・速度・透明度の設定
    const LEAF_SCALE = 0.9; 
    const SPEED_SCALE = 1.0;
    const LEAF_OPACITY = 0.5;

    class Leaf {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : -50;
        this.size = (Math.random() * 1.5 + 1.0) * LEAF_SCALE; 
        this.speedY = Math.random() * 1.2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.05;
        this.sway = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
      }
      update(timeScale = 1) {
        this.y += this.speedY * SPEED_SCALE * timeScale;
        this.sway += this.swaySpeed * SPEED_SCALE * timeScale;
        this.x += (this.speedX + Math.sin(this.sway) * 0.5) * SPEED_SCALE * timeScale;
        this.angle += this.spin * SPEED_SCALE * timeScale;
        if (this.y > canvas.height + 100) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = LEAF_OPACITY; 
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        
        const cols = momijiPattern[0].length;
        const rows = momijiPattern.length;
        const offsetX = (cols * this.size) / 2;
        const offsetY = (rows * this.size) / 2;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (momijiPattern[r][c] === 1) {
              ctx.fillRect(c * this.size - offsetX, r * this.size - offsetY, this.size + 0.5, this.size + 0.5);
            }
          }
        }
        ctx.restore();
      }
    }

    const leaves = [];
    const leafCount = 45;

    for (let i = 0; i < leafCount; i++) {
      leaves.push(new Leaf());
    }

    let lastTime = 0;
    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      const timeScale = deltaTime / 16.666; 
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      leaves.forEach(leaf => {
        leaf.update(timeScale);
        leaf.draw();
      });
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMomiji);
  } else {
    initMomiji();
  }
})();
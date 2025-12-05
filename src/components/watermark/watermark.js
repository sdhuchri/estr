class Watermark {
    static defaultOptions = {
        targetSelector: "", // Selector elemen yang ingin diberi watermark
        imageUrl: "img/BCA_Syariah_2.png",
        text: "",
        opacity: 0.12,
        size: 380, // Ukuran gambar
        spacing: 280, // Jarak antar watermark
        rotate: -45, // Rotasi watermark
        zIndex: 9, // Pastikan tetap di bawah konten lain
        font: "bold 18px Arial",
        textColor: "rgba(0, 0, 0, 0.3)", // Warna teks transparan
    };

    constructor(options = {}) {
    this.options = { ...Watermark.defaultOptions, ...options };
    this.targets = document.querySelectorAll(this.options.targetSelector);

    if (!this.targets.length) {
        console.error("Watermark error: Target elements not found.");
        return;
    }

    this.instances = [];
    this.targets.forEach((target) => {
        this.instances.push(new WatermarkInstance(target, this.options));
    });
}
    static init(options = {}) {
        return new Watermark(options);
    }

}

class WatermarkInstance {
    constructor(target, options) {
        this.options = options;
        this.target = target;

        this.initCanvas();
        this.loadImage();
        this.observeResize();
    }

    initCanvas() {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvas.style.zIndex = this.options.zIndex;
        this.canvas.style.pointerEvents = "none";
        this.canvas.style.opacity = this.options.opacity;

        this.target.style.position = "relative";
        this.target.appendChild(this.canvas);

        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = this.target.clientWidth;
        this.canvas.height = this.target.clientHeight;

        if (this.img && this.img.complete) {
            this.drawWatermark();
        }
    }

    loadImage() {
        this.img = new Image();
        this.img.src = this.options.imageUrl;
        this.img.onload = () => this.drawWatermark();
    }

    drawWatermark() {
        if (!this.img || !this.img.complete) return;

        const { spacing, size, rotate, text, font, textColor } = this.options;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const aspectRatio = this.img.naturalWidth / this.img.naturalHeight;
        const imgWidth = size;
        const imgHeight = size / aspectRatio;

        for (let x = -spacing; x < this.canvas.width + spacing; x += spacing) {
            for (let y = -spacing; y < this.canvas.height + spacing; y += spacing) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate((rotate * Math.PI) / 180);

                ctx.drawImage(this.img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

                if (text) {
                    ctx.font = font;
                    ctx.fillStyle = textColor;
                    ctx.textAlign = "center";
                    ctx.fillText(text, 0, imgHeight / 2 + 20);
                }

                ctx.restore();
            }
        }
    }

    observeResize() {
        const resizeObserver = new ResizeObserver(() => this.resizeCanvas());
        resizeObserver.observe(this.target);
    }
}

export default Watermark;

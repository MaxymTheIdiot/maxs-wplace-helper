window.addEventListener("PixelHelperProcess", e => {
  const { imgData, pxSize } = e.detail;

  const img = new Image();
  img.onload = () => {
    const srcCanvas = document.createElement("canvas");
    const sctx = srcCanvas.getContext("2d", { willReadFrequently: true });
    srcCanvas.width = img.width;
    srcCanvas.height = img.height;
    sctx.drawImage(img, 0, 0);

    const finalCanvas = document.createElement("canvas");
    const fctx = finalCanvas.getContext("2d");
    finalCanvas.width = img.width * pxSize;
    finalCanvas.height = img.height * pxSize;

    const imageData = sctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const idx = (y * img.width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3] / 255;

        fctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        fctx.fillRect(x * pxSize, y * pxSize, pxSize, pxSize);
      }
    }

    fctx.strokeStyle = "rgba(0,0,0,0.3)";
    fctx.lineWidth = 1;
    for (let gx = 0; gx <= finalCanvas.width; gx += pxSize) {
      fctx.beginPath();
      fctx.moveTo(gx, 0);
      fctx.lineTo(gx, finalCanvas.height);
      fctx.stroke();
    }
    for (let gy = 0; gy <= finalCanvas.height; gy += pxSize) {
      fctx.beginPath();
      fctx.moveTo(0, gy);
      fctx.lineTo(finalCanvas.width, gy);
      fctx.stroke();
    }

    showPixelWindow(finalCanvas.toDataURL());
  };
  img.src = imgData;
});

function closePixelWindow() {
    let container = document.getElementById("pixelHelperWindow");
    if (container) container.remove();
}

function showPixelWindow(dataUrl) {
  closePixelWindow();

  const size = Math.floor(window.innerHeight * 0.75);

  container = document.createElement("div");
  container.id = "pixelHelperWindow";
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border: 2px solid #000;
    padding: 0;
    z-index: 9999;
    width: ${size}px;
    height: ${size}px;
    overflow: auto;
  `;

  const img = document.createElement("img");
  img.src = dataUrl;
  img.style.imageRendering = "pixelated";
  img.style.display = "block";
  img.style.maxWidth = "none";
  img.style.maxHeight = "none";

  container.appendChild(img);
  document.body.appendChild(container);
}


window.addEventListener("ClosePixelWindow", () => {
  closePixelWindow();  
});
document.getElementById("processBtn").addEventListener("click", async () => {
  const file = document.getElementById("fileInput").files[0];
  const pixelSize = parseInt(document.getElementById("pixelSize").value);
  
  if (!file) return alert("Select an image first.");
  
  const reader = new FileReader();
  reader.onload = async function(e) {
    const dataUrl = e.target.result;
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (imgData, pxSize) => {
        window.dispatchEvent(new CustomEvent("PixelHelperProcess", { detail: { imgData, pxSize } }));
      },
      args: [dataUrl, pixelSize]
    });
  };
  reader.readAsDataURL(file);
});

document.getElementById("closeWindow").addEventListener("click", async() => {
    window.dispatchEvent(new CustomEvent("ClosePixelWindow"));
});
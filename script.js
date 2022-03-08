const video = document.querySelector("video");
const textElem = document.querySelector("pre");

async function setup() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  video.srcObject = stream;

  video.addEventListener("playing", async () => {
    const worker = Tesseract.createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const canvas = document.createElement("canvas");
    canvas.width = video.width;
    canvas.height = video.height;

    document.addEventListener("keypress", async (e) => {
      if (e.code !== "Space") return;

      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      const {
        data: { text },
      } = await worker.recognize(canvas);

      speechSynthesis.speak(
        new SpeechSynthesisUtterance(text.replace(/\s/g, " "))
      );

      textElem.textContent = text;
    });
  });
}
setup();

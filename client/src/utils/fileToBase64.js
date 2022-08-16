export function imageToBase64(image) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  return canvas.toDataURL();
}

export function fileToBase64(file) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.addEventListener('load', function () {
      resolve(this.result);
    }, false);

    reader.addEventListener('error', reject);

    reader.readAsDataURL(file);
  });

}

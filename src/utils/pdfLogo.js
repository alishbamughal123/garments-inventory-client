import logoImg from "../assets/newlogo.png";

// Loads the Nordic Prowear logo (blue background, used as-is) for jsPDF.addImage.
// Resolves to null when the image cannot be loaded so PDFs still generate.
export const loadPdfLogo = () =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = logoImg;
  });

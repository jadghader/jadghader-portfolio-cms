// src/utils/downloadCV.ts
export const downloadCV = (fileId?: string) => {
  if (!fileId) {
    console.warn("No file ID provided. Cannot download CV.");
    alert("No file available for download.");
    return;
  }

  const cvLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

  // Create and click download link
  const link = document.createElement("a");
  link.href = cvLink;
  link.download = "Jad-Ghader-CV.pdf"; // always download as PDF
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

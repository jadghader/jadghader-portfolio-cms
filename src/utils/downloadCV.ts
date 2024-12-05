// src/utils/downloadCV.ts
export const downloadCV = (cvPath: string) => {
  const link = document.createElement("a");
  link.href = cvPath;
  link.download = "Jad-Ghader-CV.pdf";
  link.click();
};

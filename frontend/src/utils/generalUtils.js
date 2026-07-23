export const stripHtml = (html) => {
    if (typeof window !== "undefined") {
      const temp = document.createElement("div");
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || "";
    }
    return "";
  }
  
// Current UI language outside of React (exports, file generators). Norwegian is the default.
export const isNorwegian = () => {
  try {
    return (localStorage.getItem("app_language_v2") || "no") === "no";
  } catch {
    return true;
  }
};

// tr("English", "Norsk") -> the text for the active language
export const tr = (en, no) => (isNorwegian() ? no : en);

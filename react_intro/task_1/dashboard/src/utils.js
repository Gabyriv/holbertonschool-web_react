export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getFooter(isIndex) {
  return isIndex ? "Holberton School" : "Holberton School main dashboard";
}

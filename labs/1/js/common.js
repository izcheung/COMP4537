export class Navigation {
  constructor() {
    const backButton = document.querySelector("#back-button");
    if (backButton) {
      backButton.addEventListener("click", () => {
        window.history.back();
      });
    }
  }
}

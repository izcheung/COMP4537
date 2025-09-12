import { MESSAGES } from "../lang/messages/en/user.js";
export class Navigation {
  constructor() {
    const backButton = document.querySelector(".back-button");
    backButton.textContent = MESSAGES.backButtonText;
    if (backButton) {
      backButton.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }
  }
}

export class Note {
  constructor(id, content = "", onDelete = null) {
    this.id = id;
    this.content = content;
    this.onDelete = onDelete;
    this.wrapper = null;
    this.textarea = null;
    this.deleteButton = null;

    this.createElement();
  }

  createElement() {
    this.wrapper = document.createElement("div");
    this.textarea = document.createElement("textarea");
    this.textarea.id = this.id;
    this.textarea.value = this.content;

    if (this.onDelete) {
      this.deleteButton = document.createElement("button");
      this.deleteButton.classList.add("delete-button");
      this.deleteButton.textContent = MESSAGES.deleteButtonText;
      this.deleteButton.addEventListener("click", () => {
        this.onDelete(this);
      });
    }

    this.wrapper.appendChild(this.textarea);
    if (this.deleteButton) {
      this.wrapper.appendChild(this.deleteButton);
    }
  }

  addEventListener(event, callback) {
    if (this.textarea) {
      this.textarea.addEventListener(event, callback);
    }
  }

  getValue() {
    return this.textarea ? this.textarea.value : "";
  }

  setValue(value) {
    if (this.textarea) {
      this.textarea.value = value;
      this.content = value;
    }
  }

  getElement() {
    return this.wrapper;
  }

  remove() {
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.removeChild(this.wrapper);
    }
  }

  toJSON() {
    return {
      id: this.id,
      content: this.getValue(),
    };
  }
}

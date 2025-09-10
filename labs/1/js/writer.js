import { Navigation } from "./common.js";
import { MESSAGES } from "../lang/messages/en/user.js";

class WriteTextAreaManager {
  constructor() {
    this.container = document.querySelector("section");
    this.idCounter = 0;

    this.addButton = document.querySelector("#add-button");
    this.addButton.addEventListener("click", () => this.addElement());
    this.updateAddButtonState();
  }

  addElement() {
    const wrapper = document.createElement("div");
    const newTextInput = document.createElement("textarea");
    newTextInput.id = `textarea-${this.idCounter++}`;

    newTextInput.addEventListener("input", () => this.updateAddButtonState());

    const newDeleteButton = document.createElement("button");
    newDeleteButton.textContent = "Delete";
    newDeleteButton.addEventListener("click", () => {
      this.deleteElement(wrapper);
    });
    wrapper.appendChild(newTextInput);
    wrapper.appendChild(newDeleteButton);
    this.container.appendChild(wrapper);
    this.updateAddButtonState();
  }

  deleteElement(wrapper) {
    const notes = JSON.parse(localStorage.getItem("notes"));
    const textArea = wrapper.querySelector("textarea");

    const newNotes = notes.filter((note) => note.id !== textArea.id);

    const timeNow = new Date().toLocaleTimeString("en-US", {
      hour12: true,
    });
    this.addTimeStamp(timeNow);

    localStorage.setItem("notes", JSON.stringify(newNotes));

    wrapper.remove();
    this.updateAddButtonState();
  }

  addTimeStamp(time) {
    const timeStamp = document.querySelector("#timestamp");
    timeStamp.textContent = `${MESSAGES.writeTimeStamp} ${time}`;
  }

  updateAddButtonState() {
    const textAreas = this.container.querySelectorAll("textarea");
    if (textAreas.length === 0) {
      this.addButton.disabled = false;
      return;
    }
    const lastTextArea = textAreas[textAreas.length - 1];
    this.addButton.disabled = lastTextArea.value.trim() === "";
  }
}

class SaveLocalStorage {
  constructor(writerTextAreaManager) {
    this.intervalId = null;
    this.writerTextAreaManager = writerTextAreaManager;
  }

  start(interval = 2000) {
    this.intervalId = setInterval(() => this.saveAll(), interval);
  }

  saveAll() {
    const textAreas = document.querySelectorAll("textarea");
    const notes = Array.from(textAreas)
      .filter((textArea) => textArea)
      .map((textArea) => ({
        id: textArea.id,
        content: textArea.value,
      }));
    const timeNow = new Date().toLocaleTimeString("en-US", {
      hour12: true,
    });
    this.writerTextAreaManager.addTimeStamp(timeNow);
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  stop() {
    clearInterval(this.intervalId);
  }
}

class WriterApp {
  constructor() {
    const writerTextAreaManager = new WriteTextAreaManager();
    this.saveLocalStorage = new SaveLocalStorage(writerTextAreaManager);
    this.backButton = new Navigation();
  }

  run() {
    this.saveLocalStorage.start();
  }
}

new WriterApp().run();

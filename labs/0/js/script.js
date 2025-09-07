import { MESSAGES } from "../lang/messages/en/user.js";

class MemoryGame {
  constructor() {
    this.input = new Input();
    this.gameArea = new GameArea();
  }

  run() {
    this.input.submitButton.addEventListener("click", (e) => {
      this.gameArea.reset();
      const inputValue = this.input.getInputValue();
      if (this.input.validateInput(inputValue)) {
        this.start(Number(inputValue));
      }
    });
  }

  start(inputValue) {
    Button.availableColors = [...Button.allColors];
    this.currentClick = 0;
    this.gameArea.createButtons(inputValue, (clickedButton) =>
      this.checkClick(clickedButton)
    );
    this.gameArea.renderButtons();
    let count = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        this.gameArea.scrambleButtons();
        count += 1;
        if (count == inputValue) {
          clearInterval(interval);
          this.gameArea.buttons.forEach((btn) => btn.hideText());
          this.gameArea.buttons.forEach((btn) => btn.enable());
        }
      }, 2000);
    }, inputValue * 1000);
  }

  checkClick(clickedButton) {
    const expectedButton = this.gameArea.buttons[this.currentClick];

    if (clickedButton.order === expectedButton.order) {
      this.currentClick += 1;
      if (this.currentClick === this.gameArea.buttons.length) {
        this.win();
      }
    } else {
      this.gameOver();
    }
  }

  gameOver() {
    alert(MESSAGES.gameOver);
    for (let button of this.gameArea.buttons) {
      button.displayText();
    }
    return;
  }

  win() {
    alert(MESSAGES.gameWon);
  }
}

class GameArea {
  constructor() {
    this.buttons = [];
  }

  createButtons(inputValue, onClick) {
    for (let i = 0; i < inputValue; i++) {
      const button = new Button(i + 1, onClick);
      this.buttons.push(button);
    }
  }

  renderButtons() {
    const section = document.querySelector("section");
    for (let button of this.buttons) {
      section.appendChild(button.element);
    }
  }

  scrambleButtons() {
    for (let button of this.buttons) {
      let currentHeight = window.innerHeight;
      let currentWidth = window.innerWidth;
      button.moveLocation(currentHeight, currentWidth);
    }
  }

  hideButtonOrder() {
    for (let button of this.buttons) {
      button.text = "";
      button.clickable = true;
      button.updateTextAndClickable();
    }
  }

  reset() {
    this.buttons = [];
    const section = document.querySelector("section");
    section.innerHTML = "";
  }
}

class Input {
  constructor() {
    this.inputLabel = document.querySelector("#inputLabel");
    this.inputElement = document.querySelector("#numButtonsInput");
    this.submitButton = document.querySelector("#submitButton");
  }

  getInputValue() {
    return this.inputElement.value;
  }

  validateInput(value) {
    const inputValue = Number(value);
    if (isNaN(inputValue) || inputValue < 3 || inputValue > 7) {
      alert(MESSAGES.invalidInput);
      return false;
    }
    return true;
  }

  reset() {
    this.inputElement.value = "";
  }
}

class Button {
  static DEFAULT_BUTTON_WIDTH = "10em";
  static DEFAULT_BUTTON_HEIGHT = "5em";

  static allColors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "grey",
    "orange",
  ];

  static availableColors = [...Button.allColors];

  constructor(order, onClick) {
    this.order = order;
    this.text = order;
    this.color = this.assignColor();
    this.width = Button.DEFAULT_BUTTON_WIDTH;
    this.height = Button.DEFAULT_BUTTON_HEIGHT;
    this.disabled = true;
    this.element = this.createButton(onClick);
  }

  createButton(onClick) {
    const button = document.createElement("button");
    button.style.backgroundColor = this.color;
    button.style.width = this.width;
    button.style.height = this.height;
    button.textContent = this.text;
    button.disabled = this.disabled;

    button.addEventListener("click", () => {
      this.displayText();
      if (!this.disabled) {
        onClick(this);
      }
    });

    return button;
  }

  enable() {
    this.disabled = false;
    this.element.disabled = false;
  }

  hideText() {
    this.text = "";
    this.element.textContent = "";
  }

  displayText() {
    this.text = this.order;
    this.element.textContent = this.order;
  }

  assignColor() {
    if (Button.availableColors.length == 0) {
      Button.availableColors = [...Button.allColors];
    }
    const randomIndex = Math.floor(
      Math.random() * Button.availableColors.length
    );
    const selectedColorArray = Button.availableColors.splice(randomIndex, 1);
    const selectedColor = selectedColorArray[0];
    return selectedColor;
  }

  moveLocation(windowHeight, windowWidth) {
    this.element.style.position = "absolute";

    const EMTOPX = 16;
    const buttonWidthPx = parseFloat(this.width) * EMTOPX;
    const buttonHeightPx = parseFloat(this.height) * EMTOPX;

    const maxX = windowWidth - buttonWidthPx;
    const maxY = windowHeight - buttonHeightPx;

    const xPos = Math.random() * maxX;
    const yPos = Math.random() * maxY;
    this.element.style.left = `${xPos}px`;
    this.element.style.top = `${yPos}px`;
  }
}

new MemoryGame().run();

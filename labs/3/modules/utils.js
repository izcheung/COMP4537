const { greeting } = require("../lang/en/en");

class DateUtils {
  static getDate = (name) => {
    const now = new Date();
    const message = greeting.replace("%1", name);
    return `<span style="color: blue;">${message} ${now}</span>`;
  };
}

module.exports = DateUtils;

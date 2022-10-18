export class ButtonState {
  _button = null;

  constructor(button) {
    if (!button) throw new Error("Не передана кнопка!");

    this._button = button;
    this.renderButton = this.renderButton.bind(this);
  }

  _disable() {
    this._button.classList.add("disabled");
  }

  _enable() {
    this._button.classList.remove("disabled");
  }

  addClickHandler(handler) {
    this._button.addEventListener("click", handler);
  }

  renderButton({ ticketsAmount }) {
    if (ticketsAmount !== "" && Number(ticketsAmount) > 0) {
      this._enable();
    } else {
      this._disable();
    }
  }
}

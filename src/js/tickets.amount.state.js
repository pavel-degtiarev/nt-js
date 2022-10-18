import { Hideable } from "./hideable";

export class TicketsAmountState extends Hideable {
  _input = null;

  constructor(input) {
    if (!input) throw new Error("Не передано поле ввода количества билетов!");

    super(input.closest(".tickets-amount"));
    this._input = input;
    this.renderAmount = this.renderAmount.bind(this);
  }

  /**
   *
   * @param {{direction, timeTowards, timeBackwards, ticketsAmount}} state состояние формы
   *
   * Если заполнен один или оба select (в зависимости от маршрута),
   * показывает поле количества билетов. Иначе прячет его.
   *
   * Этот коллбэк передается в объект FormState и вызывается при любом изменении в форме.
   */
  renderAmount(state) {
    if (shouldRenderAmount(state)) {
      this.show();
    } else {
      this._input.value = "";
      this.hide();
    }
  }
}

function shouldRenderAmount({ direction, timeTowards, timeBackwards }) {
  switch (direction) {
    case "AtoB":
    case "BtoA":
      return timeTowards !== "";
    case "both":
      return timeTowards !== "" && timeBackwards !== "";
  }

  return false;
}

import { Hideable } from "./hideable";

export class InformerState extends Hideable {
  constructor(container) {
    super(container);
    this.renderInformer = this.renderInformer.bind(this);
    this.addInfo = this.addInfo.bind(this);
  }

  addInfo(text) {
    const newStr = document.createElement("p");
    newStr.classList.add("informer__data");
    newStr.innerText = text;
    this.container.append(newStr);
  }

  _clearInfo() {
    this.container.innerHTML = "";
  }

  _isEmpty() {
    return this.container.children.length === 0;
  }

  /**
   *
   * @param {{direction, timeTowards, timeBackwards, ticketsAmount}} state состояние формы
   *
   * Если заполнено количество билетов state.ticketsAmount, то показываем блок информации
   *
   * Этот коллбэк передается в объект FormState и вызывается при любом изменении в форме.
   */
  renderInformer({ ticketsAmount }) {
    if (ticketsAmount !== "" && Number(ticketsAmount) > 0) {
      !this._isEmpty() && this.show();
    } else {
      this._clearInfo();
      this.hide();
    }
  }
}

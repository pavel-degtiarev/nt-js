export class Hideable {
  _container = null;
  constructor(container) {
    if (!container) throw new Error("Не передан DOM-элемент!");
    this._container = container;
  }

  hide() {
    this._container.classList.add("hidden");
  }

  show() {
    this._container.classList.remove("hidden");
  }

  get container() {
    return this._container;
  }
}

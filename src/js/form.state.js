export class FormState {
  _form = null;
  _callbacks = [];

  constructor(form, formChangedCallbacks = []) {
    this._form = form;
    this._callbacks = formChangedCallbacks;

    // на событие формы change вешается обработчик,
    // который вызывает все функции из массива коллбэков,
    // передавая им текущий form.state
    this._form.addEventListener("change", () => {
      this._callbacks.forEach((cb) => cb(this.state));
    });
  }

  get state() {
    const elements = this._form.elements;
    return {
      direction: elements.direction.value,
      timeTowards: elements.timeTowards.value,
      timeBackwards: elements.timeBackwards.value,
      ticketsAmount: elements.ticketsAmount.value,
    };
  }
}

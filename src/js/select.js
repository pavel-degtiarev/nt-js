import { Hideable } from "./hideable";

export class Select extends Hideable {
  _select = null;

  constructor(select) {
    if (!select) throw new Error("Не передан селектор!");

    super(select.closest(".select-time__selector"));
    this._select = select;
    this._addDefaultOption();
  }

  _addOption(title, value, selected = false) {
    const newOption = document.createElement("option");
    newOption.value = value;
    newOption.innerHTML = title;
    selected && newOption.setAttribute("selected", true);

    this._select.append(newOption);
  }

  _addDefaultOption() {
    this._addOption("не выбрано", "", true);
  }

  _resetOptions() {
    this._select.innerHTML = "";
  }

  fillOptions(options) {
    this._resetOptions();
    this._addDefaultOption();

    options.forEach((option) => this._addOption(option, option));
  }
}

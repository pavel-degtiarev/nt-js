import { Hideable } from "./hideable";
import { schedule, travelTime } from "./data/schedule";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
dayjs.extend(customParseFormat);
dayjs.extend(duration);

export class TimeSelectState extends Hideable {
  _timeTowardsSelector = null;
  _timeBackwardsSelector = null;
  _currentDirection = "";
  _currentTorwardsTime = "";

  constructor(timeTowardsSelector, timeBackwardsSelector) {
    if (!timeTowardsSelector || !timeBackwardsSelector) throw new Error("Не переданы селекторы!");
    
    // сохраняем родительский <fieldset> как контейнер
    super(timeTowardsSelector.container.closest(".select-time"));

    this._timeTowardsSelector = timeTowardsSelector;
    this._timeBackwardsSelector = timeBackwardsSelector;

    this.renderSelectors = this.renderSelectors.bind(this);
    this.excludeInvalidBackwardsOptions = this.excludeInvalidBackwardsOptions.bind(this);
  }

  hide() {
    this._timeTowardsSelector.hide();
    this._timeBackwardsSelector.hide();
    super.hide();
  }

  show(showReturn = true) {
    super.show();
    this._timeTowardsSelector.show();
    // если передан параметр false, то не показываем второй <select> (отправление обратно)
    showReturn && this._timeBackwardsSelector.show();
  }

  /**
   *
   * @param {{direction, timeTowards, timeBackwards, ticketsAmount}} state состояние формы
   *
   * Заполняет options для одного или обоих select в зависимости от state.direction.
   * На вход получает текущее состояние формы state и берет только direction.
   *
   * Этот коллбэк передается в объект FormState и вызывается при любом изменении в форме.
   */
  renderSelectors({ direction }) {
    // если маршрут не изменился, изменять <select>ы не нужно, выходим
    if (direction === this._currentDirection) return;

    // если маршрут изменился, сбрасываем текщее время отправления в default
    this._currentTorwardsTime = "";
    this._currentDirection = direction;

    this.hide();

    switch (this._currentDirection) {
      case "AtoB":
        this.show(false);
        this._timeTowardsSelector.fillOptions(schedule.AtoB);
        break;

      case "BtoA":
        this.show(false);
        this._timeTowardsSelector.fillOptions(schedule.BtoA);
        break;

      case "both":
        this.show();
        this._timeTowardsSelector.fillOptions(schedule.AtoB);
        this._timeBackwardsSelector.fillOptions(schedule.BtoA);
        break;

      default:
        break;
    }
  }

  /**
   *
   * @param {{direction, timeTowards, timeBackwards, ticketsAmount}} state состояние формы
   *
   * Если выбран маршрут в обе стороны, этот метод устанавливает допустимые значения
   * для второго select (время обратно) в зависимости от выбранного времени в первом select.
   * На вход получает текущее состояние формы state и берет только direction и timeTowards.
   *
   * Этот коллбэк передается в объект FormState и вызывается при любом изменении в форме.
   */
  excludeInvalidBackwardsOptions({ direction, timeTowards }) {
    // если маршрут не в обе стороны, ничего делать не нужно. выходим
    // если время отправления в первом select не изменилось, ничего делать не нужно. выходим
    if (direction !== "both") return;
    if (timeTowards === this._currentTorwardsTime) return;

    this._currentTorwardsTime = timeTowards;

    // если в первом select значение не выбрано, во втором показываем полностью все значения.
    if (this._currentTorwardsTime === "") {
      this._timeBackwardsSelector.fillOptions(schedule.BtoA);
      return;
    }

    // выбираем только те отправления обратно из B, которые будут после прибытия туда
    // returnDepartureTime > departureTime + travelTime
    const departureTime = dayjs(timeTowards, "HH:mm");
    const arrivalTime = departureTime.add(dayjs.duration({ minutes: travelTime }));

    const validOptions = schedule.BtoA.filter((item) => {
      const returnDepartureTime = dayjs(item, "HH:mm");
      return returnDepartureTime.isAfter(arrivalTime);
    });

    this._timeBackwardsSelector.fillOptions(validOptions);
  }
}

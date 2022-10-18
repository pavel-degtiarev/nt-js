import { prices } from "./data/prices";
import { travelTime } from "./data/schedule";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
dayjs.extend(customParseFormat);
dayjs.extend(duration);

export class Calc {
  _informer = null;

  constructor(informer) {
    if (!informer) throw new Error("Не передан контейнер для информации!");

    this._informer = informer;
    this.calc = this.calc.bind(this);
  }

  calc(state) {
    const { direction, ticketsAmount, timeTowards, timeBackwards } = state;
    const totalPrice = prices[direction] * Number(ticketsAmount);

    let onRoadDuration, totalDuration, departureTime, arrivalTime;

    if (direction === "both") {
      onRoadDuration = dayjs.duration(travelTime * 2, "minutes");
      departureTime = dayjs(timeTowards, "HH:mm");
      arrivalTime = dayjs(timeBackwards, "HH:mm").add(dayjs.duration({ minutes: travelTime }));
      totalDuration = dayjs.duration(arrivalTime.diff(departureTime));
    } else {
      onRoadDuration = dayjs.duration(travelTime, "minutes");
      departureTime = dayjs(timeTowards, "HH:mm");
      arrivalTime = dayjs(timeTowards, "HH:mm").add(dayjs.duration({ minutes: travelTime }));
      totalDuration = dayjs.duration(travelTime, "minutes");
    }

    this._informer.addInfo(`Маршрут: ${formatDirection(direction)}.`);
    this._informer.addInfo(`Куплено билетов: ${ticketsAmount}. Общая стоимость: ${totalPrice} руб.`);
    this._informer.addInfo(`Общее время поездки: ${formatDuration(totalDuration)}, время в пути: ${formatDuration(onRoadDuration)}`);
    this._informer.addInfo(`Время отправления: ${formatTime(departureTime)}, время прибытия: ${formatTime(arrivalTime)}`);
    
    this._informer.renderInformer(state);
  }
}

function formatDuration(duration) {
  return duration.asHours() > 1 ? duration.format("H ч. mm мин.") : duration.format("mm мин.");
}

function formatTime(time) {
  return time.format("HH:mm");
}

function formatDirection(direction) {
  const directions = {
    AtoB: "из А в B",
    BtoA: "из B в A",
    both: "из А в B и обратно",
  };

  return directions[direction];
}

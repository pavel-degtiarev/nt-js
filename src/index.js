"use strict";

import "./index.scss";
import { FormState } from "./js/form.state";
import { ButtonState } from "./js/button.state";
import { InformerState } from "./js/informer.state";
import { TicketsAmountState } from "./js/tickets.amount.state";
import { TimeSelectState } from "./js/time.select.state";
import { Select } from "./js/select";
import { Calc } from "./js/calc";

const form = document.forms.tripForm;
const { ticketsAmount, timeTowards, timeBackwards } = { ...form.elements };

const timeSelectState = new TimeSelectState(new Select(timeTowards), new Select(timeBackwards));
const ticketsAmountState = new TicketsAmountState(ticketsAmount);
const informerState = new InformerState(document.querySelector(".informer"));
const buttonState = new ButtonState(document.querySelector(".button"));

const formState = new FormState(form, [
  timeSelectState.renderSelectors,
  timeSelectState.excludeInvalidBackwardsOptions,
  ticketsAmountState.renderAmount,
  buttonState.renderButton,
  informerState.renderInformer,
]);

const calc = new Calc(informerState);
buttonState.addClickHandler(() => calc.calc(formState.state));

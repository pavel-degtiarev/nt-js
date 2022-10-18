# JS

# Билеты на событие

## Проблема

Исходный список заказов хранится в одной большой сводной таблице. Такое хранение избыточно, опасно неконсистентностью, а расширение данных и добавление нового функционала затруднительны. Другими словами, такая схема нуждается в нормализации.

## Решение

Выделим три основных сущности:

- Заказ.
- Билет.
- Событие.

и установим взаимосвязи между ними (на схеме).

![Схема: /prod-part-1/drawSQL-export.png](/prod-part-1/drawSQL-export.png "Схема данных")

---

В таблице **ticket** добавляем поле **is_adult** *(boolean)*. Это позволит не хранить для каждого заказа **ticket_adult_quantity** и **ticket_kid_quantity**, а получать эти данные из запроса к БД. Просто считаем записи в таблице **ticket** для указанного **order_id** и флага **is_adult**.

Поля **ticket_adult_price** и **ticket_kid_price** перенесены в таблицу **event**. В билете они не хранятся, вместо этого они доступны по запросу. Также по запросу можно посчитать общую сумму заказа *equal_price* (которая теперь тоже не хранится).

> Тут есть нюанс. Цена на Событие может измениться, и тогда все билеты на это событие будут как-бы по новой цене. Возможно, стоит добавить таблицу типа **prices-history** и хранить историю изменения цен. А цену конкретного билета узнавать поиском по этой таблице на дату создания Заказа.

---

## Дополнительные типы билетов

Дополнительные типы - льготный и групповой. Но меется информация, что будут другие типы билетов. Поэтому лучше вынести дополнительные типы в отдельную таблицу **ticket-aux-type**, а в таблице **ticket** добавить поле **aux_type_id**, ссылающееся на дополнительный тип. В **ticket-aux-type** также нужно добавить поле **event_id**, поскольку для разных Событий один и тот же тип может иметь разную цену.

## Штрих-коды для билетов

Поскольку теперь каждый билет хранится в в отдельной записи в таблице **ticket**, хранить штрих-код можно просто в поле **barcode** в виде текста (например EAN-13). 

---
---

# Время из A в B

Готовый бандл в папке **prod-part-2**.
Исходники в папке **src**.

Чтобы собрать бандл заново, нужно сначала установить зависимости, затем запустить сборку:

    npm install
    npm run prod

---

### О решении

В соответствии с принципами SOLID код разделен на смысловые блоки, изолированные друг от друга.

На странице сверстана форма, поля ввода находятся в ней. Создаем объект **FormState**, которому передается DOM-элемент этой формы и массив коллбэков, вызывающихся при событии изменения формы.
В каждый коллбэк передается объект состояния полей формы.

    {direction, timeTowards, timeBackwards, ticketsAmount}
---

Создаются объекты, в которые передаем соответствующие DOM-элементы:

- **TimeSelectState** (состояние селектов времени отправления),
- **TicketsAmountState** (состояние поля ввода количества билетов),
- **InformerState** (состояние блока вывода результата),
- **ButtonState** (состояние кнопки)

От каждого объекта передаем отдельный метод в массив коллбэков **FormState**. Этот метод получает текущее состояние формы и управляет состоянием своего элемента.

> Например (для timeSelectState):  
Коллбэк **renderSelectors** смотрит на состояние радиокнопок выбора направления **direction**. Если выбрано направление "только в одну сторону", то он прячет селект выбора времени отправления обратно.  
Если выбрано направление "туда и обратно", то показывает второй селект. А коллбэк **excludeInvalidBackwardsOptions** тут же устанавливает во втором селекте только те варианты времени отправления обратно, которые будут после прибытия в "туда".  
  
> Еще например:  
**ButtonState** следит, чтобы все необходимые поля были заполнены и все опции выбраны. И только в этом случае разблокирует кнопку "Посчитать".

---

Также создаем объект **Calc**, и передаем ему объект **InformerState** как параметр.  
В **ButtonState** передаем отдельный метод из **Calc** в качестве обработчика события нажатия на кнопку. В этот метод передается текущее состояние формы.  
**Calc** считает результат и передает его в **InformerState**, который и выводит этот результат на экран.


import moment from "moment";

function groupedDays(messages: any) {
  return messages.reduce((acc: any, el: any, i: any) => {
    const messageDay: any = moment(
      el?.reg_date ? el?.reg_date : el?.regDate
    ).format("HH:mm DD-MM-YYYY");
    if (acc[messageDay.replace(messageDay.slice(2, 5), "")]) {
      return {
        ...acc,
        [messageDay.replace(messageDay.slice(2, 5), "")]: acc[
          messageDay.replace(messageDay.slice(2, 5), "")
        ].concat([el]),
      };
    }

    return { ...acc, [messageDay.replace(messageDay.slice(2, 5), "")]: [el] };
  }, {});
}

function generateItems(messages: any) {
  const days = groupedDays(messages);
  const sortedDays = Object.keys(days).sort((x: any, y: any) => {
    return moment(x.split(" ")[1]).unix() - moment(x.split(" ")[1]).unix();
  });

  const items = sortedDays.reduce((acc: any, date: any, idx: number) => {
    const sortedMessages = days[date].sort((x, y) => {
      return (
        moment(x?.reg_date ? x?.reg_date : x?.regDate).unix() -
        moment(y?.reg_date ? y?.reg_date : y?.regDate).unix()
      );
    });

    return acc.concat([
      {
        type: "day",
        date: date,
        id: Object.values(days)[idx],
      },
      ...sortedMessages,
    ]);
  }, []);

  return items;
}

export default generateItems;

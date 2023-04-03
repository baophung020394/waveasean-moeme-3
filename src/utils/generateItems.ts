import moment from "moment";

function groupedDays(messages: any) {
  console.log("messages group", messages);
  return messages.reduce((acc: any, el: any, i: any) => {
    const messageDay: any = moment(el?.reg_date ? el?.reg_date : el?.regDate)
      // .zone("+05:00")
      .format("HH:mm DD-MM-YYYY");
    console.log("messageDay group", messageDay);
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

  console.log("message group day", days);

  const sortedDays = Object.keys(days).sort((x: any, y: any) => {
    // console.log('x',x.split(" ")[1])
    // console.log("x", moment(x.split(" ")[1]).unix());
    // console.log("x", new Date(x.split(" ")[1]).valueOf());

    return moment(x.split(" ")[1]).unix() - moment(x.split(" ")[1]).unix();
  });

  console.log("message sortedDays", sortedDays);
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

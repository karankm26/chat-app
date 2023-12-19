import moment from "moment";

function formatDateTime({ inputDateTime }) {
  const inputMoment = moment(inputDateTime);
  const currentMoment = moment();
  const yesterdayMoment = moment().subtract(1, "day");

  if (inputMoment.isSame(currentMoment, "day")) {
    return "today";
  } else if (inputMoment.isSame(yesterdayMoment, "day")) {
    return "yesterday";
  } else {
    return moment(inputMoment).format("DD Mo YYYY");
  }
}
export { formatDateTime };

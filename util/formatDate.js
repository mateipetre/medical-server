const padZero = (num) => (num < 10 ? `0${num}` : num);

const formatDate = (date) => {
  if (!date) {
    return '';
  }

  const dateObject = typeof date === 'string' ? new Date(date) : date;

  if (Number.isNaN(dateObject.getTime())) {
    return '';
  }

  const month = padZero(dateObject.getMonth() + 1);
  const day = padZero(dateObject.getDate());
  const year = dateObject.getFullYear();

  return `${month}/${day}/${year}`;
};

module.exports = {
  formatDate
};
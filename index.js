const WINDOW_SIZE = 5;

const fetchData = async (id) => {
  const { evals } = await fetch(`https://api.shogidb2.com/eval/${id}/default.json`).then(res => res.json());
  const [desc, ...result] = evals;
  const moves = result.splice(0, result.length - 1);

  return {
    description: desc.descriptions[0],
    moves: moves.map((m) => m.move),
    result: result[0].descriptions[0],
  };
};

const fetchDatum = async (offset) => {
  const list = await fetch(`https://api.shogidb2.com/latest?limit=${WINDOW_SIZE}&offset=${offset}`).then(res => res.json());
  return Promise.all(
    list.map((item) => fetchData(item._id)),
  );
};

/**
 * @param {string} text e.g. ３四銀(45)
 */
const replaceNumber = (text) => {
  return text
    .replace('打', '打つ')
    .replace('1)', '一から)')
    .replace('2)', '二から)')
    .replace('3)', '三から)')
    .replace('4)', '四から)')
    .replace('5)', '五から)')
    .replace('6)', '六から)')
    .replace('7)', '七から)')
    .replace('8)', '八から)')
    .replace('9)', '九から)');
};

/**
 * @param {string} text e.g. ３四銀blahblah
 */
const insertSpace = (text) => {
  return text.substring(0, 2) + " " + text.substring(2, text.length);
};

const app = new Vue({
  el: '#app',
  data: {
    matches: [],
    offset: 0,
  },
  created() {
    this.fetchDatum();
  },
  methods: {
    async fetchDatum() {
      this.matches = await fetchDatum(this.offset);
    },
    async fetchMoreDatum() {
      this.offset += WINDOW_SIZE;
      await this.fetchDatum();
    },
    toRenderedText(move, idx) {
      return `${idx % 2 == 0 ? '先手' : '後手'} ${insertSpace(replaceNumber(move))}`
    },
  },
});

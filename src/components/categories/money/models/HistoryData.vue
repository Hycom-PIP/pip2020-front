<script>
import { fortuneService } from "../../../../App";
import { sendMessage } from "../../../common/messages";

export default {
  name: "HistoryData",
  props: ["stocks", "currency"],

  mounted() {
    if (this.stocks) {
      let chartData = fortuneService.toChartData(this.stocks);
      chartData.passedCurrency = this.currency;
      sendMessage(this.$parent, "bot", chartData, "historyChart");
    } else {
      sendMessage(this.$parent, "bot", this.$t("fortune.bot.noData"));
    }
  }
};
</script>

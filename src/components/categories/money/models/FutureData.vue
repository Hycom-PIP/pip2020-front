<template>
  <div id="future-data-component"></div>
</template>

<script>
import { fortuneService } from "../../../../App";
import { sendMessage } from "../../../common/messages";

export default {
  name: "FutureData",
  props: ["stocks", "currency"],
  components: {},
  mounted() {
    if (this.stocks) {
      let chartData = fortuneService.toChartData(this.stocks);
      chartData.passedCurrency = this.currency;
      sendMessage(this.$parent, "bot", chartData, "futureChart");
    } else {
      sendMessage(this.$parent, "bot", this.$t("fortune.bot.noData"));
    }
  }
};
</script>

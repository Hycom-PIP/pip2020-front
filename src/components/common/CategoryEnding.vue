<template>
  <div class="end-buttons">
    <transition name="button-picker-slide" @after-enter="disabled=false">
      <div>
        <b-button
          :disabled="disabled"
          v-bind:class="themeService.getActiveTheme().themeName"
          class="m-2"
          v-on:click="disableButtons(onYesClicked)"
        >{{$t('common.yes')}}</b-button>
        <b-button
          :disabled="disabled"
          v-bind:class="themeService.getActiveTheme().themeName"
          class="m-2"
          v-on:click="disableButtons(onNoClicked)"
        >{{$t('common.no')}}</b-button>
      </div>
    </transition>
  </div>
</template>

<script>
import { themeService } from "../../App";
import { sendMessage } from "./messages";

export default {
  data: function() {
    return {
      disabled: false,
      themeService
    };
  },
  methods: {
    onNoClicked() {
      let parent = this.$parent;
      sendMessage(parent, "user", parent.$t("common.no")).then(() =>
        sendMessage(parent, "bot", parent.$t("common.bot.no"))
      );
    },
    onYesClicked() {
      let parent = this.$parent;
      sendMessage(parent, "user", parent.$t("common.yes")).then(() =>
        sendMessage(parent, "bot", parent.$t("common.bot.yes1")).then(() =>
          sendMessage(parent, "bot", parent.$t("common.bot.yes2")).then(() =>
            sendMessage(parent, "bot", parent.$t("common.bot.yes3"))
          )
        )
      );
    },
    disableButtons(afterDisableFunction) {
      this.disabled = true;
      this.$nextTick(() => {
        afterDisableFunction();
        this.$root.$emit("hideEnding");
      });
    }
  }
};
</script>

<style scoped>
.end-buttons {
  text-align: right;
}
button {
  border-radius: 1rem;
}
</style>

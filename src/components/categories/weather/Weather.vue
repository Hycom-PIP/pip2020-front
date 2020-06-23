<template>
  <div>
    <div id="weather-component">
      <transition name="button-dropdown-slide">
        <CityDropdown
          v-on:cityDropdownOnClick="cityDropdownOnClick($event)"
          v-if="showCityDropdown"
        />
      </transition>
      <transition name="button-dropdown-slide">
        <TimeDropdown v-on:showWeatherMessage="showWeatherMessage($event)" v-if="showTimeDropdown" />
      </transition>
      <transition name="button-picker-slide" @after-enter="disabled=false">
        <div class="weather-buttons" v-if="endOrDetailsButtons">
          <b-button
            :disabled="disabled"
            id="endWeatherTalkButton"
            v-bind:class="themeService.getActiveTheme().themeName"
            class="m-2"
            v-on:click="disableButtons(endWeatherTalk)"
          >{{$t('weather.user.thank')}}</b-button>
          <b-button
            id="moreDetailsButton"
            :disabled="disabled"
            v-bind:class="themeService.getActiveTheme().themeName"
            class="m-2"
            v-on:click="disableButtons(showMoreDetailsMessage)"
          >{{$t('weather.user.moreDetails')}}</b-button>
        </div>
      </transition>
      <CategoryEnding v-if="showCategoryEnding"></CategoryEnding>
    </div>
  </div>
</template>
<script>
import { weatherService } from "../../../App";
import { themeService } from "../../../App";
import { sendMessage } from "../../common/messages";
import CityDropdown from "./models/CityDropdown";
import TimeDropdown from "./models/TimeDropdown";
import CategoryEnding from "../../common/CategoryEnding";

export default {
  name: "Weather",
  components: { TimeDropdown, CityDropdown, CategoryEnding },
  props: ["botIconSource"],
  data: function() {
    return {
      city: "",
      time: "",
      userTime: "",
      showCityDropdown: false,
      showTimeDropdown: false,
      endOrDetailsButtons: false,
      showCategoryEnding: false,
      weatherData: "",
      messages: {
        myPredictions: this.$t("weather.bot.myPredictions"),
        onDayMessage: this.$t("weather.bot.onDay"),
        chooseCity: this.$t("weather.user.chooseCity"),
        choiceTime: this.$t("weather.bot.choiceTime")
      },
      themeService,
      disabled: false
    };
  },
  created() {
    this.$root.$on("hideEnding", () => (this.showCategoryEnding = false));
    sendMessage(this, "user", this.$t("weather.user.choiceWeather")).then(() =>
      sendMessage(this, "bot", this.$t("weather.bot.introduction1")).then(() =>
        sendMessage(this, "bot", this.$t("weather.bot.introduction2")).then(
          () =>
            sendMessage(this, "bot", this.$t("weather.bot.introduction3")).then(
              () => {
                this.showCityDropdown = true;
              }
            )
        )
      )
    );
  },
  methods: {
    cityDropdownOnClick(value) {
      this.showCityDropdown = false;
      this.city = value;
      sendMessage(this, "user", value).then(() => {
        sendMessage(this, "bot", this.messages.choiceTime).then(() => {
          this.showTimeDropdown = true;
        });
      });
    },
    showWeatherMessage(data) {
      this.userTime = data[0];
      this.time = data[1];
      weatherService.getWeatherData(this.city, this.time).then(weatherData => {
        this.showTimeDropdown = false;
        weatherData.city = this.city;
        weatherData.time = this.time;
        this.weatherData = weatherData;
        sendMessage(this, "user", this.userTime).then(
          () => {
            sendMessage(
              this,
              "bot",
              this.messages.myPredictions +
                this.city +
                this.messages.onDayMessage +
                this.userTime +
                "...."
            ).then(() => {
              sendMessage(this, "bot", this.weatherData, "weatherMessage").then(
                () => {
                  this.endOrDetailsButtons = true;
                }
              );
            });
          }
        );
      });
    },
    endWeatherTalk() {
      this.endOrDetailsButtons = false;
      this.endTalk();
    },
    showMoreDetailsMessage() {
      this.endOrDetailsButtons = false;
      sendMessage(this, "user", this.$t("weather.user.moreDetailsChoice")).then(
        () => {
          sendMessage(
            this,
            "bot",
            this.weatherData,
            "weatherDetailsMessage"
          ).then(() => {
            this.endTalk();
          });
        }
      );
    },
    endTalk() {
      sendMessage(this, "user", this.$t("common.user.thanks")).then(() => {
        sendMessage(this, "bot", this.$t("weather.bot.couldHelp")).then(() => {
          sendMessage(this, "bot", this.$t("weather.bot.anythingToDo")).then(
            () => {
              this.showCategoryEnding = true;
            }
          );
        });
      });
    },
    disableButtons(afterDisableFunction) {
      this.disabled = true;
      this.$nextTick(() => {
        afterDisableFunction();
      });
    }
  }
};
</script>
<style scoped>
.weather-buttons {
  text-align: right;
}

button {
  border-radius: 1rem;
}
</style>

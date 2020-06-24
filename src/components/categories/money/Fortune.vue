<template>
  <div>
    <transition name="button-picker-slide" @after-enter="disabled=false">
      <div class="user-buttons" v-if="exchangeCurrencyButtons">
        <b-button
          :disabled="disabled"
          class="m-2"
          v-on:click="disableButtons(showExchange)"
          v-bind:class="themeService.getActiveTheme().themeName"
        >{{$t('fortune.buttons.exchange')}}</b-button>
        <b-button
          :disabled="disabled"
          class="m-2"
          v-on:click="disableButtons(showCurrency)"
          v-bind:class="themeService.getActiveTheme().themeName"
        >{{$t('fortune.buttons.currency')}}</b-button>
      </div>
    </transition>
    <transition name="button-dropdown-slide">
      <ExchangeDropdown v-if="showExchanges" />
    </transition>
    <transition name="button-dropdown-slide">
      <CurrencyDropdown v-if="showCurrencies" v-bind:currencies="currencies" />
    </transition>
    <transition name="button-dropdown-slide">
      <CurrencyDropdown v-if="showAnotherCurrencies" v-bind:currencies="currencies" />
    </transition>
    <transition name="button-dropdown-slide">
      <ChooseTime v-if="showTimeButtons" />
    </transition>
    <transition name="button-picker-slide" @after-enter="disabled=false">
      <div class="choice-date" v-if="choosePeriod">
        <b-button
          :disabled="disabled"
          class="m-2"
          v-on:click="disableButtons(showDayChoiceComponent)"
          v-bind:class="themeService.getActiveTheme().themeName"
        >{{$t('fortune.buttons.day')}}</b-button>
        <b-button
          :disabled="disabled"
          class="m-2"
          v-on:click="disableButtons(showPeriodChoiceComponent)"
          v-bind:class="themeService.getActiveTheme().themeName"
        >{{$t('fortune.buttons.period')}}</b-button>
      </div>
    </transition>
    <transition name="button-dropdown-slide">
      <DayChooseComponent v-if="showDayChooser" />
    </transition>
    <transition name="button-dropdown-slide">
      <PeriodChooseComponent v-if="showPeriodChooser" />
    </transition>
    <transition name="button-picker-slide">
      <div>
        <HistoryData :stocks="data" :currency="passedCurrency" v-if="showHistoryDataComponent" />
        <FutureData :stocks="data" :currency="passedCurrency" v-if="showFutureDataComponent" />
      </div>
    </transition>
    <CategoryEnding v-if="showCategoryEnding"></CategoryEnding>
  </div>
</template>
<script>
import ExchangeDropdown from "./models/ExchangeDropdown";
import CurrencyDropdown from "./models/CurrencyDropdown";
import ChooseTime from "./models/ChooseTime";
import DayChooseComponent from "./models/DayChooseComponent";
import PeriodChooseComponent from "./models/PeriodChooseComponent";
import HistoryData from "./models/HistoryData";
import FutureData from "./models/FutureData";
import { formatter, fortuneService, themeService } from "../../../App";
import { sendMessage } from "../../common/messages";
import CategoryEnding from "../../common/CategoryEnding";

export default {
  name: "Fortune",
  components: {
    FutureData,
    HistoryData,
    ChooseTime,
    CurrencyDropdown,
    ExchangeDropdown,
    DayChooseComponent,
    PeriodChooseComponent,
    CategoryEnding
  },
  props: ["botIconSource"],
  data: function() {
    return {
      exchangeCurrencyButtons: false,
      showExchanges: false,
      showCurrencies: false,
      showAnotherCurrencies: false,
      isCurrency: true,
      symbol: null,
      companyName: '',
      showTimeButtons: false,
      choosePeriod: false,
      showDayChooser: false,
      showPeriodChooser: false,
      showFutureDataComponent: false,
      showHistoryDataComponent: false,
      data: null,
      themeService,
      disabled: false,
      showCategoryEnding: false
    };
  },
  created() {
    sendMessage(this, "user", this.$t("fortune.user.entrance")).then(() => {
      sendMessage(this, "bot", this.$t("fortune.bot.entrance")).then(() => {
        this.exchangeCurrencyButtons = true;
      });
    });
    this.$root.$on("showCurrency", currency =>
      this.showAnotherCurrency(currency)
    );
    this.$root.$on("chooseExchange", exchange =>
      this.showExchangeAndButtons(exchange)
    );
    this.$root.$on("showFutureData", () => this.showFutureData());
    this.$root.$on("showHistoryData", () => this.showHistoryData());
    this.$root.$on("showDayHistory", data => this.showHistoryDataForDay(data));
    this.$root.$on("showPeriodHistory", data =>
      this.showHistoryDataForPeriod(data)
    );
    this.$root.$on("hideEnding", () => (this.showCategoryEnding = false));
    this.$root.$on("showEnding", () => this.endCategoryAfter(this.$nextTick()));
  },
  methods: {
    formatValue(value, unit) {
      return `${formatter.formatFloat(value)}${unit}`;
    },
    messageWithValue(baseMessage, value, unit) {
      return `${baseMessage} ${this.formatValue(value, unit)}`;
    },
    showExchange() {
      this.isCurrency = false;
      this.exchangeCurrencyButtons = false;
      sendMessage(this, "user", this.$t("fortune.user.exchange")).then(() => {
        sendMessage(this, "bot", this.$t("fortune.bot.exchange")).then(() => {
          this.showExchanges = true;
        });
      });
    },
    showCurrency() {
      this.isCurrency = true;
      this.exchangeCurrencyButtons = false;
      sendMessage(this, "user", this.$t("fortune.user.currency")).then(() => {
        sendMessage(this, "bot", this.$t("fortune.bot.currency")).then(() => {
          this.showCurrencies = true;
        });
      });
      fortuneService
        .getAllCurrencies()
        .then(result => (this.currencies = result));
    },
    showAnotherCurrency(currency) {
      if (this.symbol === null) {
        this.symbol = currency;
        this.showCurrencies = false;
        this.currencies = this.currencies.filter(e => e !== currency);
        sendMessage(this, "user", currency).then(() => {
          sendMessage(this, "bot", `${this.$t("fortune.bot.anotherCurrency")} ${this.symbol}`).then(
            () => {
              this.showAnotherCurrencies = true;
            }
          );
        });
      } else {
        this.showAnotherCurrencies = false;
        this.symbol = `${this.symbol}${currency}=X`;
        sendMessage(this, "user", currency).then(() => {
          fortuneService.getActualDataForSymbol(this.symbol).then(response => {
            if (response.errors) {
              this.endCategoryAfter(
                sendMessage(
                  this,
                  "bot",
                  `${this.$t("fortune.bot.nonExistingData")}`
                )
              );
            } else {
              const baseMessage = this.isCurrency
                ? this.$t("fortune.bot.valueCurrencyToday")
                : this.$t("fortune.bot.valueStockToday");
              const unit = this.isCurrency ? "" : this.$t("fortune.bot.usd");
              sendMessage(
                this,
                "bot",
                this.messageWithValue(baseMessage, response.value, unit)
              ).then(() => {
                sendMessage(
                  this,
                  "bot",
                  this.$t("fortune.bot.chooseTime")
                ).then(() => {
                  sendMessage(this, "bot", this.$t('fortune.bot.investments')).then(() => {
                    this.showTimeButtons = true;
                  });
                });
              });
            }
          });
        });
      }
    },
    showExchangeAndButtons(exchange) {
      this.showExchanges = false;
      this.companyName = exchange.name;
      this.symbol = exchange.symbol;
      sendMessage(this, "user", exchange.name).then(() => {
        fortuneService.getActualDataForSymbol(this.symbol).then(response => {
          if (response.errors) {
            this.endCategoryAfter(
              sendMessage(
                this,
                "bot",
                `${this.$t("fortune.bot.nonExistingData")}`
              )
            );
          } else {
            const baseMessage = this.isCurrency
              ? this.$t("fortune.bot.valueCurrencyToday")
              : this.$t("fortune.bot.valueStockToday");
            const unit = this.isCurrency ? "" : this.$t("fortune.bot.usd");
            sendMessage(
              this,
              "bot",
              this.messageWithValue(baseMessage, response.value, unit)
            ).then(() => {
              sendMessage(this, "bot", this.$t("fortune.bot.chooseTime"))
                .then(() => {sendMessage(this, "bot", this.$t('fortune.bot.investments'))
                  .then(() => {
                    this.showTimeButtons = true;
                  });
                });
            });
          }
        });
      });
    },
    showHistoryData() {
      this.showTimeButtons = false;
      sendMessage(this, "user", this.$t("fortune.user.chosenHistory")).then(
        () => {
          sendMessage(this, "bot", this.$t("fortune.bot.historyChoice")).then(
            () => {
              this.choosePeriod = true;
            }
          );
        }
      );
    },
    showDayChoiceComponent() {
      this.choosePeriod = false;
      sendMessage(this, "user", `${this.$t("fortune.user.chosenDay")}`).then(
        () => {
          sendMessage(this, "bot", this.$t("fortune.bot.dayChoice")).then(
            () => {
              this.showDayChooser = true;
            }
          );
        }
      );
    },
    showPeriodChoiceComponent() {
      this.choosePeriod = false;
      sendMessage(this, "user", `${this.$t("fortune.user.chosenPeriod")}`).then(
        () => {
          sendMessage(this, "bot", this.$t("fortune.bot.periodChoice")).then(
            () => {
              this.showPeriodChooser = true;
            }
          );
        }
      );
    },
    showFutureData() {
      const futureMessage = this.isCurrency
        ? this.$t("fortune.bot.currencyFutureData")
        : `${this.$t("fortune.bot.futureData")} ${this.companyName}:`;
      this.showTimeButtons = false;
      sendMessage(this, "user", `${this.$t("fortune.user.chosenFuture")}`).then(
        () => {
          sendMessage(this, "bot", futureMessage).then(() => {
            fortuneService
              .getFutureDataForSymbol(this.symbol)
              .then(response => {
                if (response.errors) {
                  this.endCategoryAfter(
                    sendMessage(
                      this,
                      "bot",
                      `${this.$t("fortune.bot.nonExistingData")}`
                    )
                  );
                } else {
                  this.data = response;
                  this.passedCurrency = this.isCurrency ? "" : "USD";
                  this.showFutureDataComponent = true;
                }
              });
          });
        }
      );
    },
    showHistoryDataForDay(data) {
      this.showDayChooser = false;
      sendMessage(this, "user", data[0]).then(() => {
        fortuneService
          .getHistoryDataForSymbol(this.symbol, data[1])
          .then(response => {
            if (response.errors) {
              this.endCategoryAfter(
                sendMessage(
                  this,
                  "bot",
                  `${this.$t("fortune.bot.nonExistingData")}`
                )
              );
            } else {
              const baseMessage = this.isCurrency
                ? this.$t("fortune.bot.valueCurrencyInDay")
                : this.$t("fortune.bot.valueStockInDay");
              const unit = this.isCurrency ? "" : this.$t("fortune.bot.usd");
              this.endCategoryAfter(
                sendMessage(
                  this,
                  "bot",
                  this.messageWithValue(
                    `${baseMessage} ${data[0]} ${this.$t("fortune.bot.value")}`,
                    response.value,
                    unit
                  )
                )
              );
            }
          });
      });
    },
    showHistoryDataForPeriod(data) {
      this.showPeriodChooser = false;
      sendMessage(
        this,
        "user",
        `${this.$t("fortune.user.myChoice")} ${new Date(
          data[0]
        ).toLocaleDateString()} ${this.$t("fortune.user.to")} ${new Date(
          data[1]
        ).toLocaleDateString()}`
      ).then(() => {
        sendMessage(
          this,
          "bot",
          `${this.$t("fortune.bot.historyData")} ${new Date(
            data[0]
          ).toLocaleDateString()} ${this.$t("fortune.user.to")} ${new Date(
            data[1]
          ).toLocaleDateString()}`
        ).then(() => {
          fortuneService
            .getHistoryDataForSymbolForPeriod(
              this.symbol,
              formatter.formatDate(data[0]),
              formatter.formatDate(data[1])
            )
            .then(response => {
              if (response.errors) {
                this.endCategoryAfter(
                  sendMessage(
                    this,
                    "bot",
                    `${this.$t("fortune.bot.nonExistingData")}`
                  )
                );
              } else {
                this.data = response;
                this.passedCurrency = this.isCurrency ? "" : "USD";
                this.showHistoryDataComponent = true;
              }
            });
        });
      });
    },
    disableButtons(afterDisableFunction) {
      this.disabled = true;
      this.$nextTick(() => {
        afterDisableFunction();
      });
    },
    endCategoryAfter(promise) {
      promise.then(() =>
        sendMessage(this, "bot", this.$t("fortune.bot.ending")).then(() => {
          this.showCategoryEnding = true;
        })
      );
    }
  }
};
</script>
<style scoped>
.user-buttons,
.choice-date {
  text-align: right;
}

/deep/ button {
  border-radius: 1rem;
}
</style>

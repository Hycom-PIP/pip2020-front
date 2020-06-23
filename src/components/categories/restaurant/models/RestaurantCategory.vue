<template>
  <div>
    <transition name="button-dropdown-slide">
      <CategoryDropdown
        class="right-align"
        v-if="showCategoryDropdown"
        :city-id="city.id"
        @categoryDropdownOnClick="categoryDropdownOnClick"
      />
    </transition>
    <transition name="button-picker-slide" @after-enter="disabled=false">
      <div class="right-align" v-if="moreDetails">
        <b-button
          class="m-2"
          v-on:click="disableButtons(showAnotherRestaurantMessage)"
          v-bind:class="themeService.getActiveTheme().themeName"
          :disabled="disabled"
        >{{$t('food.user.choiceAnotherRestaurant')}}</b-button>
        <b-button
          class="m-2"
          v-on:click="disableButtons(showNewCategoryMessage)"
          v-bind:class="themeService.getActiveTheme().themeName"
          :disabled="disabled"
        >{{$t('food.user.choiceNewCategory')}}</b-button>
        <b-button
          class="m-2"
          v-on:click="disableButtons(showRatingMessage)"
          v-bind:class="themeService.getActiveTheme().themeName"
          :disabled="disabled"
        >{{$t('food.user.rateRestaurationChoice')}}</b-button>
      </div>
    </transition>
    <transition name="button-picker-slide">
      <RatingRestaurant
        v-if="rate"
        :restaurant-id="restaurantData.id"
        @onRatedRestaurant="this.sendRatedMessage"
      />
    </transition>
  </div>
</template>
<script>
import { restaurantService, themeService } from "../../../../App";
import CategoryDropdown from "./CategoryDropdown";
import RatingRestaurant from "./RatingRestaurant";

export default {
  name: "Restaurant",
  components: {
    CategoryDropdown,
    RatingRestaurant
  },
  props: ["city", "number"],
  data: function() {
    return {
      showCategoryDropdown: false,
      category: "",
      menu: false,
      restaurantData: {},
      menuData: "",
      moreDetails: false,
      rate: false,
      themeService,
      disabled: false
    };
  },
  mounted() {
    this.showCategoryDropdown = true;
  },
  methods: {
    sendNestedMessage(author, text, style) {
      return new Promise(resolve =>
        this.$root.$emit("addNestedMessage", author, text, style, resolve)
      );
    },
    categoryDropdownOnClick(value) {
      this.category = value;
      this.showCategoryDropdown = false;
      restaurantService
        .getRestaurantOfCityAndCategory(this.city.id, this.category)
        .then(restaurantData => {
          if (restaurantData.errors)
            this.$root.$emit(
              "showDanger",
              this.$t("food.errors.errorGetRestaurantData") +
                restaurantData.errors[0]
            );
          else {
            this.restaurantData = restaurantData;
            this.sendNestedMessage(
              "user",
              this.$t("food.user.categoryChoice", { category: this.category })
            ).then(() => {
              this.sendNestedMessage(
                "bot",
                this.$t("food.bot.foodPredictions", {
                  city: this.city.city,
                  category: this.category
                })
              ).then(() => {
                this.sendNestedMessage(
                  "bot",
                  this.restaurantData,
                  "restaurantMessage"
                ).then(() => {
                  this.moreDetails = true;
                });
              });
            });
          }
        });
    },
    showNewCategoryMessage() {
      this.moreDetails = false;
      this.sendNestedMessage(
        "user",
        this.$t("food.user.chosenNewCategory")
      ).then(() => {
        this.sendNestedMessage("bot", this.$t("food.bot.foodNewCategory")).then(
          () => {
            this.$root.$emit("addNewCategoryMessage");
          }
        );
      });
    },
    showAnotherRestaurantMessage() {
      this.moreDetails = false;
      restaurantService
        .getRestaurantOfCityAndCategory(this.city.id, this.category)
        .then(restaurantData => {
          if (restaurantData.errors)
            this.$root.$emit(
              "showDanger",
              this.$t("food.errors.errorGetRestaurantData") +
                restaurantData.errors[0]
            );
          else {
            this.restaurantData = restaurantData;
            this.sendNestedMessage(
              "user",
              this.$t("food.user.chooseOtherRestaurant", {
                category: this.category
              })
            ).then(() => {
              this.sendNestedMessage(
                "bot",
                this.restaurantData,
                "restaurantMessage"
              ).then(() => {
                this.moreDetails = true;
              });
            });
          }
        });
    },
    showRatingMessage() {
      this.moreDetails = false;
      this.sendNestedMessage(
        "user",
        this.$t("food.user.rateRestauration")
      ).then(() => {
        this.sendNestedMessage("bot", this.$t("food.bot.addRate1")).then(() => {
          this.sendNestedMessage("bot", this.$t("food.bot.addRate2")).then(
            () => {
              this.rate = true;
            }
          );
        });
      });
    },
    sendRatedMessage(rating) {
      this.rate = false;
      this.sendNestedMessage(
        "user",
        `${rating} ${this.$t("food.user.maxRate")}`
      ).then(() => {
        this.sendNestedMessage("bot", this.$t("food.bot.ratedRestaurant")).then(
          () => {
            this.sendNestedMessage(
              "bot",
              this.$t("weather.bot.anythingToDo")
            ).then(() => {
              this.$root.$emit("exitCategory");
            });
          }
        );
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
.right-align {
  text-align: right;
}
</style>

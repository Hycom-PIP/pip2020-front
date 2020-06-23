<template>
  <div>
    <div id="restaurant-component">
      <transition name="button-dropdown-slide">
        <CityDropdown
          v-on:cityDropdownOnClick="cityDropdownOnClick($event)"
          v-if="showCityDropdown"
        />
      </transition>
      <div v-for="(item, index) in choosenCategories" v-bind:key="index">
        <RestaurantCategory :number="index" :city="city" />
      </div>
    </div>
    <CategoryEnding v-if="showEndButtons"></CategoryEnding>
  </div>
</template>
<script>
import CityDropdown from "./models/CityDropdown";
import RestaurantCategory from "./models/RestaurantCategory";
import CategoryEnding from "../../common/CategoryEnding";
import { sendMessage } from "../../common/messages";

export default {
  name: "Restaurants",
  components: { RestaurantCategory, CityDropdown, CategoryEnding },

  props: [],
  data: function() {
    return {
      city: {},
      showCityDropdown: false,
      botRestaurantMessage: false,
      disabled: false,
      showEndButtons: false,
      choosenCategories: []
    };
  },
  created() {
    sendMessage(this, "user", this.$t("food.user.choiceRestaurant")).then(
      () => {
        sendMessage(this, "bot", this.$t("food.bot.introduction1")).then(() => {
          sendMessage(this, "bot", this.$t("food.bot.introduction2")).then(
            () => {
              this.showCityDropdown = true;
            }
          );
        });
      }
    );
    this.$root.$on("hideEnding", () => (this.showEndButtons = false));
  },
  mounted() {
    this.$root.$on("addNewCategoryMessage", () => {
      this.choosenCategories.push(true);
    });
    this.$root.$on("addNestedMessage", (author, text, style, resolve) => {
      return sendMessage(this, author, text, style).then(() => {
        resolve();
      });
    });
    this.$root.$on("exitCategory", () => {
      this.showEndButtons = true;
    });
  },
  methods: {
    cityDropdownOnClick(value) {
      this.showCityDropdown = false;
      this.city = value;
      sendMessage(this, "user", this.city.city).then(() => {
        sendMessage(
          this,
          "bot",
          this.$t("food.bot.foodCategory1", { city: this.city.city })
        ).then(() => {
          sendMessage(this, "bot", this.$t("food.bot.foodCategory2")).then(
            () => {
              this.choosenCategories.push(true);
            }
          );
        });
      });
    }
  }
};
</script>
<style scoped>
/deep/ button {
  border-radius: 1rem;
}
</style>

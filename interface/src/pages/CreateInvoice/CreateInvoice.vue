<template>
  <div class="flex justify-center">
    <div class="w-full px-1">
      <div class="whitespace-pre">
        <p>new invoice</p>
      </div>
      <div id="service">
        <div :class="accordian" @click="showServices = !showServices">
          <p class="flex-grow">
            ADD SERVICES
          </p>
          <right-arrow v-if="!showServices" />
          <down-arrow v-else />
        </div>
        <div v-if="showServices" :class="form">
          <services-form />
        </div>
      </div>
      <div id="customer">
        <div :class="accordian" @click="showCustomer = !showCustomer">
          <p class="flex-grow">
            ADD CUSTOMER
          </p>
          <right-arrow v-if="!showCustomer" />
          <down-arrow v-else />
        </div>
        <div v-if="showCustomer" :class="form">
          <customer-form />
        </div>
      </div>
      <div id="deadline">
        <div :class="accordian" @click="showDeadline = !showDeadline">
          <p class="flex-grow">
            ADD DUE DATE
          </p>
          <right-arrow v-if="!showDeadline" />
          <down-arrow v-else />
        </div>
        <div v-if="showDeadline" :class="form">
          <deadline-form />
        </div>
      </div>
      <button class="w-1/2 border border-black">Submit Invoice</button>
    </div>
  </div>
</template>

<script>
import ServicesForm from "./components/ServicesForm";
import Checkbox from "../../components/elements/Checkbox.vue";
import CustomerForm from "./components/CustomerForm.vue";
import DeadlineForm from "./components/DeadlineForm.vue";
import RightArrow from "./components/RightArrow";
import DownArrow from "./components/DownArrow";

export default {
  name: "CreateInvoice",
  components: {
    "services-form": ServicesForm,
    "customer-form": CustomerForm,
    "deadline-form": DeadlineForm,
    "right-arrow": RightArrow,
    "down-arrow": DownArrow,
  },
  data() {
    return {
      // classes and ui
      accordian: "w-2/3 flex flex-row h-6 px-2 shadow cursor-pointer",
      form: "px-2 border border-gray-300",
      showServices: false,
      showCustomer: false,
      showDeadline: false,
      // data and forms
      clientName: null,
      tokenAmount: null,
      term: null,
      recurring: false,
      queryString: null,
    };
  },
  computed: {
    activeContract() {
      return this.$store.state.activeContract;
    },
    contractValues() {
      return this.$store.state.contractValues;
    },
    invoiceLink() {
      // const url = "localhost:8080/";
      const url = "https://trustless-freelancer.web.app/";
      const path = "invoice";
      return url + path + this.queryString;
    },
  },
  methods: {
    submitInvoice() {
      const queryString = `?contract=${this.activeContract}&client=${encodeURI(
        this.clientName
      )}&value=${this.tokenAmount}&term=${this.term}&recurring=${
        this.recurring
      }`;

      this.queryString = queryString;
    },
  },
};
</script>

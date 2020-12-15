<template>
  <div class="flex justify-center">
    <div class="w-2/3">
      <div>
        <h2>Create an invoice</h2>
        <h3 class="font-bold">{{ contractValues.name }}</h3>
        <h3>at</h3>
        <h3 class="font-bold">{{ activeContract }}</h3>
      </div>
      <div>
        <input
          v-model="clientName"
          placeholder="Client's name"
          class="border border-black"
        />
      </div>
      <div>
        <input
          v-model="tokenAmount"
          placeholder="amount of token"
          class="border border-black"
        />
      </div>
      <div>
        <input v-model="term" placeholder="number of days" />
      </div>
      <div>
        <input type="checkbox" id="recurring" v-model="recurring" />
        <label for="recurring">Recurring </label>
      </div>
      <div>
        <button class="btn" @click="submitInvoice">submit</button>
      </div>
      <div>
        <h2>link:</h2>
        <a :href="invoiceLink">{{ invoiceLink }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from "../components/elements/Checkbox.vue";

export default {
  name: "CreateInvoice",
  data() {
    return {
      clientName: "Paul goodman",
      tokenAmount: 1000,
      term: 30,
      recurring: true,
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
      const url = "localhost:8080/";
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

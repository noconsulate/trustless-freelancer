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
          <h1>Add Services Section</h1>
          <input
            class="accordianFormInput"
            type="text"
            placeholder="Line Item"
            v-model="lineItem"
          />
          <input
            class="accordianFormInput"
            type="text"
            placeholder="Cost Per Uinit"
            v-model="costPerUnit"
          />
          <input
            class="accordianFormInput"
            type="text"
            placeholder="Total Units"
            v-model="totalUnits"
          />
          <input
            class="accordianFormInput"
            type="text"
            placeholder="Additional Taxes or Fees"
            v-model="additional"
          />
          <input
            class="accordianFormInput"
            type="text"
            placeholder="Total Cost"
            v-model="total"
          />
          <button class="accordianFormButton">CONFIRM LINE ITEM</button>
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
          <h1>Add Customer Section</h1>
          <select v-model="selected" class="accordianFormInput">
            <option disabled value="">Existing customer?</option>
            <option
              v-for="client in clients"
              :value="client"
              :key="client.name"
            >
              {{ client.name }}
            </option>
          </select>
          <input
            class="accordianFormInput"
            type="text"
            placeholder="Customer Name"
            v-model="name"
          />
          <input
            class="accordianFormInput"
            type="text"
            placeholder="Customer Email"
            v-model="email"
          />
          <input
            class="accordianFormInput"
            type="text"
            placeholder="Company"
            v-model="company"
          />
          <textarea
            class="accordianFormInput"
            placeholder="Notes"
            v-model="customerNotes"
          />
          <input
            class="accordianFormInput"
            type="text"
            placeholder="Contract Amount (in USD) wtf is this??"
            v-model="contractAmount"
          />
          <button class="accordianFormButton">ADD CUSTOMER</button>
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
          <h1>Add Due Date Section</h1>
          <datepicker
            v-model="deadline"
            placeholder="Services Completion Date"
          ></datepicker>
          <textarea
            class="accordianFormInput"
            type="text"
            placeholder="Scheduling Notes"
            v-model="deadlineNotes"
          />
          <input type="checkbox" id="recurring" v-model="checked" />
          <label for="recurring">Is this a recurring invoice?</label>
          <button class="accordianFormButton">Confirm Date</button>
        </div>
      </div>
      <button class="w-1/2 border border-black">Submit Invoice</button>
    </div>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";

import { auth, database } from "../../services/firebase";

import Checkbox from "../../components/elements/Checkbox.vue";
import RightArrow from "./components/RightArrow";
import DownArrow from "./components/DownArrow";

export default {
  name: "CreateInvoice",
  components: {
    "right-arrow": RightArrow,
    "down-arrow": DownArrow,
    datepicker: Datepicker,
  },
  data() {
    return {
      // data
      dummyCustomers: ["sam", "frank", "bob"],
      currentUser: null,
      clients: [],
      // classes and ui
      accordian: "w-2/3 flex flex-row h-6 px-2 shadow cursor-pointer",
      form: "px-2 border border-gray-300",
      showServices: false,
      showCustomer: false,
      showDeadline: false,
      // forms
      lineItem: null,
      costPerUnit: null,
      totalUnits: null,
      additional: null,
      total: null,
      selected: "",
      name: "",
      email: "",
      company: "",
      customerNotes: "",
      contractAmount: "",
      deadline: null,
      deadlineNotes: "",
      checked: false,
    };
  },
  computed: {
    activeContract() {
      return this.$store.state.activeContract;
    },
    selectedAddress() {
      return this.$store.state.account;
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
  async created() {
    const user = await auth().currentUser;
    const uid = user.uid;
    console.log("uid == selectedAddress", uid == this.selectedAddress);

    const ref = database().ref(
      "users/" + this.selectedAddress + "/contracts/" + this.activeContract
    );
    ref.on("value", (snap) => {
      let clients = [];
      for (let key in snap.val()) {
        let client = {
          address: key,
          name: data[key].name,
          email: data[key].email,
          phone: data[key].phone,
          company: data[key].company,
          notes: data[key].notes,
        };
        clients.push(client);
      }
      this.clients = clients;
    });
  },
};
</script>

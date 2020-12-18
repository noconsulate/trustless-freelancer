<template>
  <div>
    <h1>Add Customer Section</h1>
    <select v-model="selected" class="accordianFormInput">
      <option disabled value="">Existing customer?</option>
      <option
        v-for="customer in dummyCustomers"
        :value="customer"
        :key="customer"
      >
        {{ customer }}
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
    <textarea class="accordianFormInput" placeholder="Notes" v-model="notes" />
    <input
      class="accordianFormInput"
      type="text"
      placeholder="Contract Amount (in USD) wtf is this??"
      v-model="contractAmount"
    />
    <button class="accordianFormButton">ADD CUSTOMER</button>
  </div>
</template>

<script>
export default {
  name: "customer-form",
  data() {
    return {
      dummyCustomers: ["sam", "frank", "bob"],

      selected: "",
      name: "",
      email: "",
      company: "",
      notes: "",
      contractAmount: "",
    };
  },
};
</script>

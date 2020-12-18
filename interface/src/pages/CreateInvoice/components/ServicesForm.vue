<template>
  <div>
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
</template>

<script>
export default {
  name: "services_form",
  data() {
    return {
      lineItem: null,
      costPerUnit: null,
      totalUnits: null,
      additional: null,
      total: null,
    };
  },
};
</script>

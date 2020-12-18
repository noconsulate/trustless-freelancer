<template>
  <div>
    <h1>Add Due Date Section</h1>
    <datepicker
      v-model="deadline"
      placeholder="Services Completion Date"
    ></datepicker>
    <input
      class="accordianFormInput"
      type="text"
      placeholder="Scheduling Notes"
      v-model="notes"
    />
    <input type="checkbox" id="recurring" v-model="checked" />
    <label for="recurring">Is this a recurring invoice?</label>
    <button class="accordianFormButton">Confirm Date</button>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
export default {
  name: "deadline",
  components: {
    datepicker: Datepicker,
  },
  data() {
    return {
      deadline: null,
      notes: "",
      checked: false,
    };
  },
};
</script>

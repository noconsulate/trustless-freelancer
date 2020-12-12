<template>
  <div class="flex justify-center">
    <div class="w-2/3">
      <h2>Create an invoice</h2>
      <input
        v-model="clientName"
        placeholder="Client's name"
        class="border border-black"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateInvoice",
  data() {
    return {
      clientName: null,
    };
  },
};
</script>

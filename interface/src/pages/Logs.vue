<template>
  <div class="divide-y divide-gray-400">
    <div></div>

    <div>
      <table :class="tableClass">
        <thead>
          <tr>
            <th class="flex justify-start pt-2 ">deposits</th>
          </tr>
          <tr>
            <th class="w-5/6">client</th>
            <th class="w-1/12 px-2">ether</th>
            <th class="w-1/12 px-2">block</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(deposit, i) in deposits" :key="i">
            <td class=" w-5/6">{{ deposit.client }}</td>
            <td class=" w-1/12 px-2">{{ deposit.value }}</td>
            <td class=" w-1/12 px-2">{{ deposit.block }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <table :class="tableClass">
        <thead>
          <tr>
            <th class="flex justify-start pt-2">refunds</th>
          </tr>
          <tr>
            <th class=" w-5/6">client</th>
            <th class="w-1/12 px-2">ether</th>
            <th class="w-1/12 px-2">block</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(refund, i) in refunds" :key="i">
            <td class=" w-5/6">{{ refund.client }}</td>
            <td class="w-1/12 px-2">{{ refund.value }}</td>
            <td class="w-1/12 px-2">{{ refund.block }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <table :class="tableClass">
        <thead>
          <tr>
            <th class="flex justify-start pt-2">dispersals</th>
          </tr>
          <tr>
            <th class=" w-5/6">client</th>
            <th class="w-1/12 px-2">ether</th>
            <th class="w-1/12 px-2">block</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dispersal, i) in dispersals" :key="i">
            <td class=" w-5/6">{{ dispersal.client }}</td>
            <td class="w-1/12 px-2">{{ dispersal.value }}</td>
            <td class="w-1/12 px-2">{{ dispersal.block }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getLogs } from "../services/logs";

export default {
  name: "LogsView",
  data() {
    return {
      deposits: [],
      refunds: [],
      dispersals: [],
      tableClass: "table-fixed mb-4",
    };
  },
  created: async function() {
    const logs = await getLogs(this.$store.state.activeContract);

    this.deposits = logs.depositsReadable;
    this.refunds = logs.refundsReadable;
    this.dispersals = logs.disperseReadable;
  },
};
</script>

<template>
  <div class="divide-y divide-gray-400">
    <div></div>

    <div>
      <table :class="tableClass">
        <thead>
          <tr>
            <th>deposits</th>
          </tr>
          <tr>
            <th :class="headerClientClass">client</th>
            <th :class="headerValueClass">ether</th>
            <th :class="headerBlockClass">block</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(deposit, i) in deposits" :key="i">
            <td>{{ deposit.client }}</td>
            <td>{{ deposit.value }}</td>
            <td>{{ deposit.block }}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th>refunds</th>
          </tr>
          <tr>
            <th :class="headerClientClass">client</th>
            <th :class="headerValueClass">ether</th>
            <th :class="headerBlockClass">block</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(refund, i) in refunds" :key="i">
            <td>{{ refund.client }}</td>
            <td>{{ refund.value }}</td>
            <td>{{ refund.block }}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th>dispersals</th>
          </tr>
          <tr>
            <th :class="headerClientClass">client</th>
            <th :class="headerValueClass">ether</th>
            <th :class="headerBlockClass">block</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dispersal, i) in dispersals" :key="i">
            <td>{{ dispersal.client }}</td>
            <td>{{ dispersal.value }}</td>
            <td>{{ dispersal.block }}</td>
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
      tableClass: "mb-8 table-auto border-collapse border-2 border-gray-200",
      headerClientClass: "border border-2 border-red-700",
      headerValueClass: "border border-2 border-blue-500",
      headerBlockClass: "border border-2 border-pink-800",
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

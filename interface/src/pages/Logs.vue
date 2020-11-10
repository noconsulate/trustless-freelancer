<template>
  <div class="divide-y divide-gray-400">
    <div></div>

    <div>
      <table :class="tableClass">
        <thead>
          <tr>
            <div class="py-2 flex items-center justify-center">
              deposits
            </div>
          </tr>
          <tr>
            <th :class="headerClientClass">client</th>
            <th :class="headerValueClass">ether</th>
            <th :class="headerBlockClass">block</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(deposit, i) in deposits" :key="i">
            <td :class="colClientClass">{{ deposit.client }}</td>
            <td :class="colValueClass">{{ deposit.value }}</td>
            <td :class="colBlockClass">{{ deposit.block }}</td>
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
            <td :class="colClientClass">{{ refund.client }}</td>
            <td :class="colValueClass">{{ refund.value }}</td>
            <td :class="colBlockClass">{{ refund.block }}</td>
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
            <td :class="colClientClass">{{ dispersal.client }}</td>
            <td :class="colValueClass">{{ dispersal.value }}</td>
            <td :class="colBlockClass">{{ dispersal.block }}</td>
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
      tableClass: "mb-8 table-fixed border-collapse border-2 border-gray-200",
      headerClientClass: "w-1/2 px-2 py-1 border border-2 border-red-700",
      headerValueClass: "w-1/4 px-2 py-1 border border-2 border-blue-500",
      headerBlockClass: "w-1/4 px-2 py-1 border border-2 border-pink-800",
      colClientClass: "w-1/2 px-2",
      colValueClass: "w-1/4 px-2",
      colBlockClass: "w-1/4 px-2",
      descriptionClass: "w-1/4 py-5 bg-red-400",
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

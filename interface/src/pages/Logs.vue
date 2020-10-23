<template>
  <div>
    <h2>here are your logs, sir</h2>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>deposits</th>
          </tr>
        <tr>
          <th>client</th>
          <th>ether</th>
          <th>block</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(deposit, i) in deposits" :key="i">
            <td>{{ deposit.client }}</td>
            <td>{{ deposit.value }}</td>
            <td>{{ deposit.block }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>refunds</th>
          </tr>
        <tr>
          <th>client</th>
          <th>ether</th>
          <th>block</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(refund, i) in refunds" :key="i">
            <td>{{ refund.client }}</td>
            <td>{{ refund.value }}</td>
            <td>{{ refund.block }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getLogs } from "../services/logs";

export default {
  data() {
    return {
      deposits: [],
      refunds: [],
    };
  },
  created: async function() {
    const logs = await getLogs();

    this.deposits = logs.depositsReadable;
    this.refunds = logs.refundsReadable;
  },
};
</script>

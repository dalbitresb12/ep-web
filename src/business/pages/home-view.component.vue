<script setup>
import { onMounted, ref } from "vue";
import { ChallengesService } from "../services/challenges.service";
import Card from "primevue/card";

const service = new ChallengesService();

const counts = ref({
  individual: 0,
  team: 0,
});

const handleFetch = async () => {
  counts.value.individual = await service.countByChallenge("individual");
  counts.value.team = await service.countByChallenge("team");
};

onMounted(handleFetch);
</script>

<template>
  <div class="flex justify-center">
    <Card class="w-full sm:w-96">
      <template #title>
        <h2>Challenges</h2>
      </template>
      <template #content>
        <div class="flex flex-col space-y-4">
          <div class="flex flex-col space-y-1">
            <span class="text-4xl">
              {{ counts.individual }}
            </span>
            <span>Individual Challenges</span>
          </div>
          <div class="flex flex-col space-y-1">
            <span class="text-4xl">
              {{ counts.team }}
            </span>
            <span>Team Challenges</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

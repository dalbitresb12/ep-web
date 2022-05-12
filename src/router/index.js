import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/business/pages/home-view.component.vue";
import ChallengesView from "@/business/pages/challenges-view.component.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/business/challenges",
      name: "Challenges",
      component: ChallengesView,
    },
  ],
});

export default router;

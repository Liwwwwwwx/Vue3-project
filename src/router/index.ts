import { createRouter, createWebHistory } from "vue-router";

var routes = [
  /* --------------------------------------- */
  {
    path: "/",
    component: () => import("../views/load.vue"),
  },
  {
    path: "/home",
    component: () => import("../views/home.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;

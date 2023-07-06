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
    children: [
      {
        path: "/localuser",
        component: () => import("../views/users/local_user.vue"),
      },
      {
        path: "/remoteuser",
        component: () => import("../views/users/remote_user.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;

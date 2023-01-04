export const showToastAndRedirect = (toast, router) => {
  toast("No player Found. Redirecting to Homepage", {
    theme: "dark",
  });
  toast.onChange((v) => (v.status === "removed" ? router.push("/") : null));
};

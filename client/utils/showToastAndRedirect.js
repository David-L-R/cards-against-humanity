export const showToastAndRedirect = (toast, router, err) => {
  toast(err ? err : "No player Found. Redirecting to Homepage", {
    theme: "dark",
    pauseOnHover: false,
  });
  toast.onChange((v) => (v.status === "removed" ? router.push("/") : null));
};

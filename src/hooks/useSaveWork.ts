function useSaveWork() {
  const saveWork = () => {
    const { title, props } = page.value;
    const payload = {
      title,
      content: {
        components: components.value,
        props,
      },
    };
    store.dispatch("saveWork", {
      data: payload,
      urlParams: { id: currentWorkId },
    });
  };
  onUnmounted(() => {
    clearInterval(timer);
  });
}
export default useSaveWork;

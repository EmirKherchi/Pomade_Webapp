export const getSize = function(momentum) {
  const { container, content } = momentum;
  console.log(container, content);
  return {
    container: {
      width: container.clientWidth,
      height: container.clientHeight,
    },
    content: {
      width: content.offsetWidth - content.clientWidth + content.scrollWidth,
      height: content.offsetHeight - content.clientHeight + content.scrollHeight,
    }
  };
}
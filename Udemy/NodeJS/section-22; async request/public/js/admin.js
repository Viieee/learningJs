const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("input[name=productId]").value;
  const csrf = btn.parentNode.querySelector("input[name=_csrf]").value;

  const selectedNode = btn.closest("article");

  // sending http request
  fetch(`/admin/product/${prodId}`, {
    // configuring the fetch request
    method: "DELETE",
    headers: {
      // csurf not just look into request body but also into query parameters and headers
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      console.log(result);
      //   btn.parentNode.parentNode.remove(); => this will work fine in modern browsers
      selectedNode.parentNode.removeChild(selectedNode);
    })
    .catch((err) => {
      console.log(err);
    });
};

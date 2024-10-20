(function () {
  let api;
  // eslint-disable-next-line no-undef
  htmx.defineExtension("chunked-transfer", {
    init: function (apiRef) {
      api = apiRef;
    },
    onEvent: function (name, evt) {
      const elt = evt.target;
      if (name === "htmx:beforeRequest") {
        const xhr = evt.detail.xhr;
        xhr.onprogress = function () {
          const is_chunked =
            xhr.getResponseHeader("Transfer-Encoding") === "chunked";
          if (!is_chunked) return;
          let response = xhr.response;
          api.withExtensions(elt, function (extension) {
            if (!extension.transformResponse) return;
            response = extension.transformResponse(response, xhr, elt);
          });
          var swapSpec = api.getSwapSpecification(elt);
          var target = api.getTarget(elt);
          var settleInfo = api.makeSettleInfo(elt);
          api.swap(target, response, {swapStyle: swapSpec.swapStyle});
          api.settleImmediately(settleInfo.tasks);
        };
      }
    },
  });
})();

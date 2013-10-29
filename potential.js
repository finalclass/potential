(function(exports) {

  function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function dashCaseToCamelCase(string) {
    return ucfirst(string.replace(/-([a-z])/g, function(g) {
      return g[1].toUpperCase()
    }));
  }

  function getAllAttributes($element) {
    var attrs = {};

    $element.each(function() {
      $.each(this.attributes, function() {
        if (this.specified) {
          attrs[this.name] = this.value;
        }
      });
    });

    return attrs;
  }

  function parseNode($node) {
    var nodeNameSplit = $node[0].nodeName.split(':');
    var nodeNamespace = dashCaseToCamelCase(nodeNameSplit[0].toLowerCase());
    var componentName = dashCaseToCamelCase(nodeNameSplit[1].toLowerCase());

    var node = new exports[nodeNamespace][componentName](getAllAttributes($node));

    $node.children().each(function () {
      node.add(parseNode($(this)));
    });

    return node;
  }


  $(function onDocumentReady() {
    $('script[type="text/potential"]').each(function forEachComponentDefinition() {
      var $xml = $($(this).text());
      var stage = new Kinetic.Stage({
        container: 'container',
        width: 800,
        height: 600
      });

      stage.add(parseNode($xml));
    });
  });

}(this));
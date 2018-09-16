(function() {
  var wikipediaViewer = {

    init: function() {
      this.cacheDom();
      this.bindEvents();
    },

    cacheDom: function() {
      this.$input = $("#header input");
      this.$random = $("#random");
      this.$list = $(".list");
    },

    bindEvents: function() {
      this.$input.bind("keydown", this.autoSearch.bind(this));
      this.$random.on("click", this.random.bind(this));
    },

    autoSearch: function(event) {
      var text = this.$input.val() + String.fromCharCode(event.keyCode).toLowerCase();
      this.searchRequest("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + text + "&format=json", this.searchRender);
    },

    searchRequest: function(url, callback) {
      var req = $.ajax({
        dataType: "jsonp",
        crossDomain: true,
        url: url
      });
      req.done(function(data) {
        callback.call(this, data);
      }.bind(this));
    },

    searchRender: function(data) {
      var searchArray = data.query.search;
      this.$list.text("");
      searchArray.map(function(searchItem) {
        var toAppend = "<div class='element'><a target='_blank' href='https://www.wikipedia.org/wiki/" + searchItem.title + "' >" +
          "<h3>" + searchItem.title + "</h3>" +
          "<p>" + searchItem.snippet + "</p>" +
          "</a></div>"
        this.$list.append(toAppend);
      }.bind(this));
    },

    random: function() {
      this.searchRequest("https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json", this.randomRender);
    },
    
    randomRender: function(data) {
      var objTitle;
      for (var obj in data.query.pages) {
        objTitle = obj;
      }
      var randObj = data.query.pages[objTitle];
      randObj.extract = randObj.extract.replace(/<|>/g, "");
      $(".list").text("");
      var toAppend = "<div class='element'><a target='_blank' href='https://www.wikipedia.org/wiki/" + randObj.title + "' >" +
        "<h3>" + randObj.title + "</h3>" +
        "<p>" + randObj.extract + "</p>" +
        "</a></div>"
      $(".list").append(toAppend);
    }
    
  };
  wikipediaViewer.init();
})();
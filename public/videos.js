(function(){

  var youtubeUrl = 'https://gdata.youtube.com/feeds/api/users/UCHxNwi3l5CGZo1kG47k7i2Q/uploads?alt=json-in-script&format=5';

  function embeddedPlayerUrl(id) {
    return 'http://www.youtube.com/v/'+id+'?version=3&enablejsapi=1';
  }

  function VideoModel(config) {
    var self = this;
    self.id = ko.observable(config.id);
    self.title = ko.observable(config.title);
    self.date = config.date;
    self.thumbnail = config.thumbnail;
    self.embedUrl = ko.computed(function() {
      return embeddedPlayerUrl(self.id());
    });
  }

  function VideosModel() {
    var self = this;
    self.videos = ko.observableArray();
    self.currentVideo = ko.observable();
    self.load = function() {
      feeds.readYoutube(youtubeUrl, function(feed) {
         // TODO - should we bump into a model?
         self.videos($.map(feed, function(i) { return new VideoModel(i); }));
         if(self.videos().length > 1) {
           self.currentVideo(self.videos()[0]);
         }
      });
    };
    self.setActiveCarousel = function(dom, data) {
      $($('#videoCarousel .item')[0]).addClass('active');
      $('#videoCarousel').carousel();
    };
    // Load by default.
    self.load();
  }
  window.videos = new VideosModel();

  ko.applyBindings(window.videos);
})();

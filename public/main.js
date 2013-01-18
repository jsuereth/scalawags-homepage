(function(){

    var articleTpl = $("#templates article"),
        list = $("#list");


    // Helper to display months
    var monthNames = [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];
    
    // Reads a libsyn audio feed and returns parsed info.
    // args:  url -  The url to read
    //        handler -  A function accepting the parsed JSON of the RSS feed.
    function readLibsynFeed(url, handler) {
      $.get(url, function(data) {                           
        var xmlResults = $.makeArray($(data).find('item'));
        var results = $.map(xmlResults, function(item, idx) {  
            var $item = $(item); 
            var date = new Date($item.find('pubDate').text());
            var month = monthNames[date.getMonth()];
            var result = {
              id: idx,
              title: $item.find('title').text(),
              link:  $item.find('link').text(),
              text: $item.find('description').text(),
              date: month,
              audio: $item.find('enclosure').attr('url'),
            }; 
            return result;
        });  
        handler(results);
      });  
    }


    function bindAudio(el){
        var audio  = $('audio', el)[0],
            button = $('.play', el),
            progress = $('.progress', el),
            loaded = $('.loaded', el),
            played = $('.played', el),
            time = $('.time', el),
            total;

        button.click(function() {
            if (audio.paused) {
                audio.play();
                button.toggleClass("pause", true)
            } else {
                audio.pause();
                button.toggleClass("pause", false)
            }
        });

        progress.click(function(e) {
            console.dir(audio)
            if (audio.duration != 0) {
                left = e.offsetX - 15;
                percent = left / (progress.width() - 30 );
                audio.currentTime = percent * audio.duration;
                console.log(left, audio.currentTime, percent, audio.duration, percent * audio.duration)
            }
        });


        audio.addEventListener('ended', function(evt) {
            audio.pause();
            button.removeClass("pause");
            played.css('width', '0%');
        });

        audio.addEventListener('timeupdate', function(e) {
            fraction = this.currentTime / this.duration;
            percent = fraction * 100;
            if (percent) played.css('width', percent + '%');
            var min = Math.round( this.currentTime / 60 ),
                sec = Math.round( this.currentTime % 60 )
                if (sec < 10) sec = "0"+sec
            time.html( min + ":" + sec + " / " + total)
        });

        audio.addEventListener('loadedmetadata', function(e){
            var min = Math.round( this.duration / 60 ),
                sec = Math.round( this.duration % 60 )
                if (sec < 10) sec = "0"+sec
            total = min + ":" + sec;
        });

    }

    function bindPopup(el, o){
        $(".popup", el).click(function(e){
            e.preventDefault();
            var popup = window.open(null, 'popupScalawags', 'height=240, width=580, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no');
            var content = el.clone();
            content.find("section").remove()
            popup.document.write('<!DOCTYPE html><html><head><link rel="stylesheet" href="/main.css"><title>'+o.title+'</title></head><body><article class="popup">'+content.html()+'</article></body></html>');
            return false;
        })
    }

    function bindReadmore(el, o) {
      var section = $("section", el)
      section.click(function(e) {
        e.preventDefault();
        if(section.hasClass('expand')) {
          section.removeClass('expand');
        } else {
          section.addClass('expand');
        }
        return false;
      });
    }

    function template(o){
        var el = articleTpl.clone();

        el.attr("id", o.id);
        $("h1 a",el).html(o.title).attr("href", "#" + o.id );
        //$(".feat",el).html(o.feat);
        $("time",el).html(o.date);
        $("audio",el).attr("src", o.audio);
        $(".download, .popup",el).attr("href", o.audio);
        $("section",el).html(o.text);

        bindAudio(el);
        bindPopup(el, o);
        bindReadmore(el, o);

        return el;
    }

    readLibsynFeed("/feeds/audio", function(data) {
      // TODO - Paginate..., for now we just show 10, since the auto-downloading of mp3s can suck up network...
      $.each(data.slice(0,5), function(i,o) {
        template(o).appendTo(list);
      });
    });
}());


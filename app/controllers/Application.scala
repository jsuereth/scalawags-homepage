package controllers

import play.api.mvc.{Action, Controller}
import play.api.libs.ws.WS
import concurrent.ExecutionContext.Implicits.global
object Feeds extends Controller {

  // TODO - Video feed.

  def audio = Action {
    // TODO - libsyn feed configurable!
    Async {
      WS.url("http://thescalawags.libsyn.com/rss").get().map { response =>
        Ok(response.xml)
      }
    }
  }
}

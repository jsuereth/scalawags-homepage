import sbt._
import Keys._

import com.typesafe.startscript.StartScriptPlugin

object ScalawagsBuild extends Build {

  val root = (
    play.Project("scalawags-website", path = file(".")) 
    settings(scalaBinaryVersion := "2.10")
    settings(StartScriptPlugin.startScriptForClassesSettings: _*)
  )

}

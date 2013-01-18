import sbt._
import Keys._

object ScalawagsBuild extends Build {

  val root = (
    play.Project("scalawags-website", path = file(".")) 
    settings(scalaBinaryVersion := "2.10")
  )

}

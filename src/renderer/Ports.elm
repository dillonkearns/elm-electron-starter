port module Ports exposing (..)

import Json.Encode as Encode


port sendIpc : ( String, Encode.Value ) -> Cmd msg

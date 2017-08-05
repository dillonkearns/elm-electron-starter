module IpcSerializer exposing (serialize)

import Ipc exposing (Msg(..))
import Json.Encode as Encode


serialize : Msg -> ( String, Encode.Value )
serialize msg =
    case msg of
        Quit ->
            ( "Quit", Encode.null )

        GreetingDialog ->
            ( "GreetingDialog", Encode.null )
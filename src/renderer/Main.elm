module Main exposing (..)

import Html exposing (Html, button, div, h1, input, p, text)
import Html.Attributes exposing (placeholder, value)
import Html.Events exposing (onClick, onInput)
import Ipc
import IpcSerializer
import Ports


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


type alias Model =
    { counter : Int
    , name : String
    }


init : ( Model, Cmd Msg )
init =
    ( { counter = 0, name = "" }, Cmd.none )


type Msg
    = Increment
    | Decrement
    | SendIpc Ipc.Msg
    | NameChanged String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Increment ->
            ( { model | counter = model.counter + 1 }, Cmd.none )

        Decrement ->
            ( { model | counter = model.counter - 1 }, Cmd.none )

        SendIpc ipcMsg ->
            ( model, sendIpcCmd ipcMsg )

        NameChanged newName ->
            ( { model | name = newName }, Cmd.none )


sendIpcCmd : Ipc.Msg -> Cmd Msg
sendIpcCmd ipcMsg =
    ipcMsg
        |> IpcSerializer.serialize
        |> Ports.sendIpc


view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "Welcome!" ]
        , p [] [ text "Change this file and save to see hot module replacement! Notice the application state is retained." ]
        , button [ onClick Decrement ] [ text "-" ]
        , button [ onClick Increment ] [ text "+" ]
        , div [] [ text (toString model) ]
        , input [ placeholder "Your name", value model.name, onInput NameChanged ] []
        , button [ onClick (SendIpc Ipc.GreetingDialog) ] [ text "Greeting Dialog" ]
        , button [ onClick (SendIpc Ipc.Quit) ] [ text "Quit" ]
        ]

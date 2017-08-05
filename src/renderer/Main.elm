module Main exposing (..)

import Html exposing (Html, button, div, h1, p, text)
import Html.Events exposing (onClick)


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
    Int


init : ( Model, Cmd Msg )
init =
    ( 0, Cmd.none )


type Msg
    = Increment
    | Decrement


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Increment ->
            ( model + 1, Cmd.none )

        Decrement ->
            ( model - 1, Cmd.none )


view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "Welcome!" ]
        , p [] [ text "Change this file and save to see hot module replacement! Notice the application state is retained." ]
        , button [ onClick Decrement ] [ text "-" ]
        , div [] [ text (toString model) ]
        , button [ onClick Increment ] [ text "+" ]
        ]

<?php
namespace App\ApiModule\Presenters;

use App\Presenters\BasePresenter;
use Nette\Application\Responses\JsonResponse;

/**
 * Created by IntelliJ IDEA.
 * User: Pavel
 * Date: 1.1.2017
 * Time: 15:59
 */
class MessagesPresenter extends BasePresenter
{

    public function actionReadAll(array $query)
    {
        $roomId = $query['roomId'] ?? null;
        $sentSince = $query['sentSince'] ?? null;
        $limit = $query['limit'] ?? null;

        //TODO číst quer parametry

        $messageList1 = [
            [
                "id" => 123123,
                "name" => "Cpt. James T. Kirk",
                "message" => "Captain's Log, Stardate 2713.5. In the distant reaches of our galaxy...",
                "sentOn" => "2032-07-14T19:43:37+0100"
            ],
            [
                "id" => 123124,
                "name" => "Cpt. Jean-Lic Picard",
                "message" => "Captain's Log, Stardate 1513.8. Star maps reveal no indication of habitable planets nearby...",
                "sentOn" => "2045-09-19T02:43:37+0500"
            ]
        ];

        $messageList2 = [
            [
                "id" => 123124,
                "name" => "CBBB",
                "message" => "lorem impus",
                "sentOn" => "2045-09-19T02:43:37+0500"
            ]
        ];

        $this->sendResponse(new JsonResponse($roomId == 1 ? $messageList1 : $messageList2));
    }

    public function create()
    {

    }

}
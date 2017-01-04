<?php
namespace App\ApiModule\Presenters;

use App\Forms\FormFactory;
use App\Presenters\BasePresenter;
use Nette\Application\Responses\JsonResponse;
use Nette\Application\UI\Form;
use Nette\Database\Context;
use Nette\Http\IResponse;
use Nette\Http\Response;
use Nette\Utils\DateTime;
use Nette\Utils\Validators;

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

        $roomId = (int)$query['roomId'] ?? null;
        $sentSince = $query['sentSince'] ?? null;
        $limit = $query['limit'] ?? null;

        $missingParams = [];

        if ($roomId <= 0) {
            $missingParams[] = "roomId";
        }

        if (empty($sentSince)) {
            $missingParams[] = "sentSince";
        }

        if ($limit != null && ((int)$limit) <= 0) {
            $missingParams[] = "limit";
        }

        if (!empty($missingParams)) {
            return $this->send400Error("Invalid or missing paramters '" . implode("','", $missingParams) . "'");
        }

        /* @var \Nette\Database\Context $database */

        $database = $this->context->getByType(Context::class);

        $table = $database->table('messages');
        $query = $table->setPrimarySequence('email')->where('room_id = ?', $roomId)->where("timestamp >= ?", new DateTime($sentSince));
        if ($limit != null) {
            $query->limit($limit);
        }

        $result = [];
        foreach ($query as $row) {
            $result[] = [
                'id' => $row['id'],
                'message' => $row['text'],
                'name' => $row['name'],
                'sentOn' =>  DateTime::createFromFormat("U", $row['timestamp'])->format(DATE_ISO8601),
            ];

        }

        //TODO číst quer parametry

        /*  $messageList1 = [
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
          ];*/

        $this->sendResponse(new JsonResponse($result));
    }

    public function actionCreate()
    {
        $request = $this->getHttpRequest();
        $name = $request->getPost('name', null);
        $message = $request->getPost('message', null);
        $roomId = (int)$request->getPost('roomId', null);

        $missingParams = [];
        if (empty($name)) {
            $missingParams[] = "name";
        }

        if (empty($message)) {
            $missingParams[] = "message";
        }

        if (empty($roomId)) {
            $missingParams[] = "roomId";
        }

        if (!empty($missingParams)) {
            return $this->send400Error("Parametrs '" . implode("','", $missingParams) . "' are requered.");
        }

        if ($roomId <= 0 || !is_int($roomId)) {
            return $this->send400Error("'roomId' must be numeric value");
        }


        //insert to db
        /* @var \Nette\Database\Context $database */

        $database = $this->context->getByType(Context::class);
        $table = $database->table('messages');
        $result = $table->insert([
            'room_id' => $roomId,
            'text' => $message,
            'name' => $name,
            'timestamp' => new DateTime(),
        ]);

        $response = $this->getHttpResponse();
        if ($result) {
            $response->setCode(IResponse::S201_CREATED);
            $response->setHeader("Location", $this->link("Messages:get", ['id' => $result->getPrimary(true)]));
        } else {
            $response->setCode(IResponse::S500_INTERNAL_SERVER_ERROR);
        }
        $this->terminate();
    }

    private function send400Error($msg)
    {
        $response = $this->getHttpResponse();
        $response->setCode(IResponse::S400_BAD_REQUEST);

        $this->sendResponse(new JsonResponse(["error" => $msg]));
    }

}
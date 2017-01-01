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
class RoomsPresenter extends BasePresenter
{

    public function actionReadAll()
    {
        $roomList = [
            ["id" => 1, "name" => "Enterprise-E"],
            ["id" => 2, "name" => "Enterprise-A"],
        ];

        $this->sendResponse(new JsonResponse($roomList));
    }

}
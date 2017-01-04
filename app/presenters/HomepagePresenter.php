<?php

namespace App\Presenters;

use Nette;
use App\Model;


class HomepagePresenter extends BasePresenter
{

    public function renderDefault()
    {
    /*    $database = $this->context->getByType(Nette\Database\Context::class);
        $sql = 'CREATE TABLE "messages" (
          "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
          "text" text NOT NULL,
          "timestamp" integer NOT NULL,
          "name" text NOT NULL,
          "room_id" integer NOT NULL
        );';
        $database->query($sql);*/
    }

}

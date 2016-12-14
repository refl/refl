<?php

namespace App\Resources;

use Refl\Resource;

class Post extends Resource {
    protected $fields = ['title', 'body'];

    public $thing = 'cat';
}
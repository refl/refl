<?php

use Refl\RestfulController;

class RestfulControllerTest extends TestCase
{
    protected $controller;

    public function setUp()
    {
        parent::setUp();
        $this->controller = new RestfulController(['resource' => Post::class]);
    }

    public function test_index()
    {
        // $this->visit('/posts')->see('Posts index');
    }
}
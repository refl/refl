<?php

use Illuminate\Database\Capsule\Manager as Capsule;

abstract class TestCase extends Illuminate\Foundation\Testing\TestCase
{
    protected $baseUrl = 'http://localhost';

    public function setUp()
    {
        parent::setUp();
        $this->setupDatabase();
        $this->migrateTables();
    }

    protected function setupDatabase()
    {
        $capsule = new Capsule;
        $capsule->addConnection([
            'driver'    => 'sqlite',
            'database'  => ':memory:',
        ]);

        $capsule->bootEloquent();
        $capsule->setAsGlobal();
    }

    protected function migrateTables()
    {
        // Posts
        Capsule::schema()->create('posts', function($table)
        {
            $table->increments('id');
            $table->string('title');
            $table->text('body');
            $table->timestamps();
        });
    }

    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';
        return $app;
    }
}
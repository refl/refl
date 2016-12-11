<?php

use Illuminate\Database\Capsule\Manager as Capsule;

abstract class TestCase extends PHPUnit_Framework_TestCase
{
    public function setUp()
    {
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
}

class Post extends Refl\Resource
{
    protected $fields = ['title', 'body'];
}

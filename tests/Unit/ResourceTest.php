<?php

class ResourceTest extends TestCase
{

    /**
     * This test makes sure the resource class is compatible with Eloquent
     * models.
     *
     * @test
     */
    function test_saves_and_retreives_records_from_the_database()
    {
        $post = Post::create(['title' => 'Post title', 'body' => 'Post body']);

        $storedPost = Post::where(['title' => 'Post title'])->first();

        $this->assertEquals($post->id, $storedPost->id);
    }
}
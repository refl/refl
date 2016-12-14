<?php

use App\Resources\Post;

class RestfulControllerTest extends TestCase
{
    private function makePost($title)
    {
        $post = Post::create(['title' => $title, 'body' => 'Here is the post body']);
    }

    public function test_index()
    {
        $this->makePost('The PHP language');
        $this->makePost('The Ruby language');

        $this->visit('/posts')
             ->see('The PHP language')
             ->see('The Ruby language');
    }
}
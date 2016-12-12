<?php

use Refl\Form;

class FormTest extends TestCase
{

    /**
     * @test
     */
    public function test_date_picker_field()
    {
        $this->assertEquals(
            Form::DatePicker, 
            Form::guessInputType('published_at')
        );

        $this->assertEquals(
            Form::DatePicker, 
            Form::guessInputType('release_date')
        );
    }

    /**
     * @test
     */
    public function test_html_editor_field()
    {
        $this->assertEquals(
            Form::HtmlEditor,
            Form::guessInputType('body_html')
        );
    }

    /**
     * @test
     */
    public function test_input_number_field()
    {
        $this->assertEquals(
            Form::InputNumber,
            Form::guessInputType('class_number')
        );

        $this->assertEquals(
            Form::InputNumber,
            Form::guessInputType('visit_count')
        );
    }
}
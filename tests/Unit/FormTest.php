<?php

use Refl\Form;

class FormTest extends TestCase
{

    /**
     * @test
     */
    function test_date_picker_field()
    {
        $this->assertEquals(
            Form::DatePicker, 
            Form::getInputType('published_at')
        );

        $this->assertEquals(
            Form::DatePicker, 
            Form::getInputType('release_date')
        );
    }

    /**
     * @test
     */
    function test_html_editor_field()
    {
        $this->assertEquals(
            Form::HtmlEditor,
            Form::getInputType('body_html')
        );
    }

    /**
     * @test
     */
    function test_input_number_field()
    {
        $this->assertEquals(
            Form::InputNumber,
            Form::getInputType('class_number')
        );

        $this->assertEquals(
            Form::InputNumber,
            Form::getInputType('visit_count')
        );
    }
}
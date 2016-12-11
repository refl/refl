<?php

namespace Refl;

class Form {

    const DatePicker  = 'date_picker';
    const HtmlEditor  = 'html_editor';
    const InputNumber = 'input_number';
    const InputText   = 'input_text';

    public static function getInputType($field) {
        if(ends_with($field, '_at') || ends_with($field, '_date')) {
            return Form::DatePicker;
        }

        if(ends_with($field, '_html')) {
            return Form::HtmlEditor;
        }

        if(ends_with($field, '_number') || ends_with($field, '_count')) {
            return Form::InputNumber;
        }

        return Form::InputText;
    }
}
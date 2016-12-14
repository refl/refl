<?php

namespace Refl;

class Form {

    const DatePicker  = 'date_picker';
    const HtmlEditor  = 'html_editor';
    const InputNumber = 'input_number';
    const InputText   = 'input_text';

    /**
     * Returns the form input type for the given field. The input type is
     * guessed from the name of the field. For example, the field "release_date",
     * is guessed to be of the type date picker.
     *
     * @param string $field Name of the field
     * @return string Name of the input type for the given field.
     */
    public static function guessInputType(string $field) {
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
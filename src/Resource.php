<?php

namespace Refl;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    public function __construct(array $attributes = [])
    {
        $this->generateFillableFromFields();
        
        parent::__construct($attributes);
    }

    public function generateFillableFromFields()
    {
        $this->fillable = $this->fields;
    }
}
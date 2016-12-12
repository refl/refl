<?php

namespace Refl;

use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    public function __construct(array $attributes = [])
    {
        $this->generateFillableFromFields();
        
        parent::__construct($attributes);
    }

    /**
     * Generates the '$fillable' property Laravel uses to filter mass assignment
     * attributes. The fillable attributes will be the same of the $fields
     * declared in the Resource.
     */
    public function generateFillableFromFields()
    {
        $this->fillable = $this->fields;
    }

    public static function routes()
    {
        $className = Str::snake(Str::plural(get_called_class()));
        $resourceName = str_replace('\\', '', $className);
        $routes = [0,1,2,3,4,5,6];
        return $routes;
    }
}
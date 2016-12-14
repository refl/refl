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

    /**
     * Returns the URL name for this resource. The logic is pretty simple: it
     * snake_cases and plurilizes the class name. For example, for the resource
     * "Post", the url name would be "posts".
     *
     * @return string The name of the restful routes.
     */
    public function getRouteName()
    {
        return 'posts';
    }

    public function getIndexQuery()
    {
        return self::orderBy('created_at', 'DESC');
    }
}
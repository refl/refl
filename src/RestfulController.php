<?php

namespace Refl;

class RestfulController {

    protected $resource;

    public function __construct(array $opts = [])
    {
        $this->resourceClass = $opts['resource'];
    }

    public function bindRoutes()
    {
    }
}
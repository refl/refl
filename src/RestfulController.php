<?php

namespace Refl;

use Illuminate\Http\Request;

class RestfulController {

    /**
     * @var Resource
     */
    protected $resource;

    public function __construct(array $opts = [])
    {
        $this->resourceClass = $opts['resource'];
        $this->resource = new $this->resourceClass;
    }

    public function getRouteName()
    {
        return $this->resource->getRouteName();
    }

    public function index(Request $request)
    {
        $records = $this->resource->getIndexQuery()->paginate(20);
        return view('refl.resource.index')->with([
            'records' => $records
        ]);
    }
}
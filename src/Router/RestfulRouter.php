<?php

namespace Refl\Router;


use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Refl\RestfulController;

class RestfulRouter
{

    /**
     * Binds the seven restful routes for the given $controller.
     *
     * @param Router $router Laravel's router to bind into.
     * @param RestfulController $controller
     */
    public static function bindController(Router $router, RestfulController $controller)
    {
        $routeName = $controller->getRouteName();

        // Apparently there is no other way to bind routes with a class
        // instance. We should investigate further.
        $router->get($routeName, function(Request $request) use ($controller)
        {
            return $controller->index($request);
        });
    }
}
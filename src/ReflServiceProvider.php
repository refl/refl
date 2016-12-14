<?php

namespace Refl;

use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use Refl\Router\RestfulRouter;
use Symfony\Component\Finder\Finder;

class ReflServiceProvider extends ServiceProvider
{
    public function register()
    {
    }

    public function boot(Router $router)
    {
        $this->bindResourceRoutes($router);
    }

    private function bindResourceRoutes(Router $router)
    {
        foreach($this->findResourcesClasses() as $resourceClass) {
            $controller = new RestfulController([
                'resource' => $resourceClass
            ]);

            RestfulRouter::bindController($router, $controller);
        }
    }

    /**
     * Reads the 'Resources' dir (or whatever the user has configured it to be)
     * and iterates through each resource to find the class name.
     *
     * @return array Array of class names of the resources in the project.
     */
    private function findResourcesClasses()
    {
        $resourcesDir = base_path(config('refl.resources.directory'));

        $resources = Finder::create()->in($resourcesDir);

        $resourcesClasses = [];

        foreach($resources as $file) {
            $classPath = str_replace($resourcesDir, '', $file->getRealPath());
            $classPath = str_replace('.php', '', $classPath);
            $classPath = str_replace('/', '', $classPath);
            array_push($resourcesClasses, config('refl.resources.namespace') . '\\' . $classPath);
        }

        return $resourcesClasses;
    }
}
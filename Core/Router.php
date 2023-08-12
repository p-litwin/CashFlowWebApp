<?php

namespace Core;

/**
 * Summary of Router
 */
class Router
{

    /**
     * Associative array of routes (the routing table)
     * @var array
     */
    protected $routes = [];

    /**
     * Parameters from the matched route
     * @var array
     */
    protected $params = [];

    /**
     * Add a route to the routing table
     * @param string $route The route URL
     * @param array $params Parameters (controller, action, etc.)
     * 
     * @return void
     */
    public function add($route, $params = [])
    {

        $route = preg_replace('/\{([a-z]+):([^\}]+)\}/', '(?P<\1>\2)', $route);

        $route = preg_replace('/\//', '\\/', $route);

        $route = preg_replace('/\{([a-z]+)\}/', '(?P<\1>[a-z-]+)', $route);

        $route = '/^' . $route . '$/i';

        $this->routes[$route] = $params;

    }
    /**
     * Get all the routes from the routing table
     * @return array
     */
    public function getRoutes()
    {
        return $this->routes;
    }
    /**
     * Summary of matchUrl
     * @param mixed $url
     * @return bool
     */
    public function match($url)
    {

        //$reg_exp = "/^(?P<controller>[a-z-]+)\/(?P<action>[a-z-]+)$/";

        foreach ($this->routes as $route => $params) {

            if (preg_match($route, $url, $matches)) {

                foreach ($matches as $key => $match) {
                    if (is_string($key)) {
                        $params[$key] = $match;
                    }
                }

                $this->params = $params;
                return true;

            }
        }

        return false;
    }
    /**
     * Get the currently matched parameters
     * @return array
     */
    public function getParams()
    {
        return $this->params;
    }

    /**
     * Dispatch controller and action given in the Router
     * @param string $url route URL
     * @return void
     */
    public function dispatch($url)
    {
        $url = $this->removeQueryStringsFromUrl($url);

        if ($this->match($url)) {
            $controller = $this->params['controller'];
            $controller = $this->convertToStudlyCaps($controller);
            $controller = $this->getNamespace() . $controller;

            if (class_exists($controller)) {
                $controller_object = new $controller($this->params);

                $action = $this->params['action'];
                $action = $this->convertToCamelCase($action);

                if (preg_match('/action$/i', $action) == 0) {
                    $controller_object->$action();
                } else {
                    throw new \Exception("Method $action in controller $controller cannot be called directly
                    - remove the Action suffix to call this method.");
                }

            } else {
                throw new \Exception("Controller class $controller not found");
            }

        } else {
            
            throw new \Exception('No route found for URL', 404);
        
        }
    }



    /**
     * Convert the strings separated by hyphens to Studly Caps
     * @param string $stringWithHyphens String with words separated by "-"
     * @return string StudlyCaps string
     */
    protected function convertToStudlyCaps($stringWithHyphens)
    {
        $singleWords = explode("-", $stringWithHyphens);

        for ($i = 0; $i < sizeof($singleWords); $i++) {
            $singleWords[$i] = ucfirst($singleWords[$i]);
        }

        $studlyCapsString = implode("", $singleWords);

        return $studlyCapsString;
    }

    /**
     * Convert string to camelCase
     * @param string $stringWithHyphens String with words separated by "-"
     * @return string camelCase string
     */
    protected function convertToCamelCase($stringWithHyphens)
    {
        $studlyCapsString = $this->convertToStudlyCaps($stringWithHyphens);
        $camelCaseString  = lcfirst($studlyCapsString);

        return $camelCaseString;
    }

    /**
     * Remove query strings from the url
     * @param string $url URL with query string
     * @return string URL with removed query string
     */
    protected function removeQueryStringsFromUrl($url)
    {

        if ($url != '') {
            $parts = explode('&', $url, 2);

            if (strpos($parts[0], "=") === false) {
                $url = $parts[0];
            } else {
                $url = '';
            }
        }

        return $url;

    }

    /**
     * Get the namespace for the controller class. The namespace defined in the route parameters is added if present.
     * 
     * @return string The request URL
     */
    protected function getNamespace() {
        $namespace = 'App\Controllers\\';

        if (array_key_exists('namespace', $this->params)) {
            $namespace .= $this->params['namespace'] . '\\';
        }
        return $namespace;
    }

}

?>